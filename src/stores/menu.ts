import { defineStore } from 'pinia'

import {
  listAvailableMenus,
  loadMenuDefinition,
  resolveCategoryOptions,
  resolvePopularDishes,
} from '@/data/menus'
import type { CategoryOption, HighlightedDish, MenuCategory, MenuDefinition } from '@/types/menu'
import { trackEvent } from '@/utils/analytics'

type MenuStatus = 'idle' | 'loading' | 'ready' | 'error'

type MenuError = 'not-found' | 'load-failed' | null

export interface MenuFiltersState {
  query: string
  categories: string[]
}

export interface MenuStoreState {
  menu: MenuDefinition | null
  status: MenuStatus
  error: MenuError
  filters: MenuFiltersState
  availableMenus: { id: string; name: string }[]
}

function collectMenuWarnings(menu: MenuDefinition): string[] {
  const warnings: string[] = []

  menu.categories.forEach((category) => {
    category.dishes.forEach((dish) => {
      if (!dish.name.trim()) {
        warnings.push(
          `Dish with id "${dish.id}" in category "${category.id}" is missing a display name and will be hidden from the grid.`
        )
      }
    })
  })

  return warnings
}

function filterDishByQuery(
  query: string,
  dish: HighlightedDish | MenuDefinition['categories'][number]['dishes'][number]
): boolean {
  if (!query) {
    return true
  }

  const normalized = query.toLowerCase()
  const haystack = [dish.name, dish.description, dish.tags.join(' ')].join(' ').toLowerCase()

  return haystack.includes(normalized)
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuStoreState => ({
    menu: null,
    status: 'idle',
    error: null,
    filters: {
      query: '',
      categories: [],
    },
    availableMenus: listAvailableMenus(),
  }),
  getters: {
    hasMenu: (state): boolean => Boolean(state.menu),
    categoryOptions(state): CategoryOption[] {
      return resolveCategoryOptions(state.menu)
    },
    popularDishes(state): HighlightedDish[] {
      return resolvePopularDishes(state.menu)
    },
    isFiltering(state): boolean {
      return Boolean(state.filters.query.trim().length || state.filters.categories.length)
    },
    filteredCategories(state): MenuCategory[] {
      if (!state.menu) {
        return []
      }

      const activeCategories = new Set(state.filters.categories)
      const hasCategoryFilter = activeCategories.size > 0
      const query = state.filters.query.trim().toLowerCase()

      return state.menu.categories
        .map<MenuCategory | null>((category) => {
          const sanitizedDishes = category.dishes.filter((dish) => dish.name.trim().length > 0)

          if (!query && !hasCategoryFilter) {
            return { ...category, dishes: sanitizedDishes }
          }

          if (hasCategoryFilter && !activeCategories.has(category.id)) {
            return null
          }

          const filtered = sanitizedDishes.filter((dish) => filterDishByQuery(query, dish))

          if (filtered.length === 0) {
            return null
          }

          return { ...category, dishes: filtered }
        })
        .filter((category): category is MenuCategory => category !== null)
    },
    filteredDishCount(): number {
      return this.filteredCategories.reduce((total, category) => total + category.dishes.length, 0)
    },
    hasResults(): boolean {
      return this.filteredDishCount > 0
    },
  },
  actions: {
    async loadMenu(uuid: string) {
      if (!uuid) {
        this.menu = null
        this.status = 'error'
        this.error = 'not-found'
        trackEvent('menu.load_failed', { menuId: uuid })
        return
      }

      this.status = 'loading'
      this.error = null

      try {
        const menu = await loadMenuDefinition(uuid)

        if (!menu) {
          this.menu = null
          this.status = 'error'
          this.error = 'not-found'
          trackEvent('menu.load_failed', { menuId: uuid })
          return
        }

        this.menu = menu
        this.status = 'ready'
        this.filters = { query: '', categories: [] }

        const warnings = collectMenuWarnings(menu)
        warnings.forEach((warning) => console.warn(`[menu] ${warning}`))

        const totalDishes = menu.categories.reduce(
          (sum, category) => sum + category.dishes.length,
          0
        )
        trackEvent('menu.view', {
          menuId: menu.id,
          categories: menu.categories.length,
          dishes: totalDishes,
        })
      } catch (error) {
        console.error('[menu] Failed to load menu', error)
        this.menu = null
        this.status = 'error'
        this.error = 'load-failed'
        trackEvent('menu.load_failed', { menuId: uuid })
      }
    },
    setSearchQuery(query: string) {
      this.filters.query = query
      trackEvent('menu.filter', {
        type: 'search',
        query: query.trim(),
        categories: [...this.filters.categories],
      })
    },
    toggleCategory(categoryId: string) {
      if (this.filters.categories.includes(categoryId)) {
        this.filters.categories = this.filters.categories.filter((id) => id !== categoryId)
      } else {
        this.filters.categories = [...this.filters.categories, categoryId]
      }

      trackEvent('menu.filter', {
        type: 'category',
        query: this.filters.query.trim(),
        categories: [...this.filters.categories],
      })
    },
    clearFilters() {
      this.filters = { query: '', categories: [] }
      trackEvent('menu.filter', { type: 'reset' })
    },
  },
})

export type MenuStore = ReturnType<typeof useMenuStore>
