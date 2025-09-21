import brunchBistro from './brunch-bistro.json'
import twilightTapas from './twilight-tapas.json'

import type {
  CategoryOption,
  HighlightedDish,
  MenuCategory,
  MenuCategoryFixture,
  MenuDefinition,
  MenuDish,
  MenuDishFixture,
  MenuFixture,
} from '@/types/menu'

const RAW_FIXTURES: Record<string, MenuFixture> = {
  'brunch-bistro': brunchBistro,
  'twilight-tapas': twilightTapas,
}

const FALLBACK_CURRENCY = '₽'

function ensureString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function ensureNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function ensureStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function normalizeDish(
  dish: MenuDishFixture,
  category: { id: string; name: string },
  menuCurrency: string | null
): MenuDish & { categoryId: string; categoryName: string } {
  return {
    id: dish.id,
    name: ensureString(dish.name).trim(),
    description: ensureString(dish.description).trim(),
    price: ensureNumber(dish.price),
    currency: ensureString(dish.currency).trim() || menuCurrency,
    image: ensureString(dish.image).trim() || null,
    popular: Boolean(dish.popular),
    tags: ensureStringArray(dish.tags),
    orderUrl: ensureString(dish.orderUrl).trim() || null,
    allergens: ensureStringArray(dish.allergens),
    spicyLevel: ensureNumber(dish.spicyLevel),
    categoryId: category.id,
    categoryName: category.name,
  }
}

function normalizeCategory(
  category: MenuCategoryFixture,
  menuCurrency: string | null
): MenuCategory & { dishes: (MenuDish & { categoryId: string; categoryName: string })[] } {
  const id = category.id
  const name = ensureString(category.name).trim() || 'Category'

  const dishes = Array.isArray(category.dishes)
    ? category.dishes
        .filter(
          (dish): dish is MenuDishFixture =>
            typeof dish === 'object' && dish !== null && typeof dish.id === 'string'
        )
        .map((dish) => normalizeDish(dish, { id, name }, menuCurrency))
    : []

  return {
    id,
    name,
    description: ensureString(category.description).trim(),
    dishes,
  }
}

export function normalizeMenuFixture(uuid: string, fixture: MenuFixture): MenuDefinition {
  const currency = ensureString(fixture.currency).trim() || FALLBACK_CURRENCY

  const categories = Array.isArray(fixture.categories)
    ? fixture.categories
        .filter(
          (category): category is MenuCategoryFixture =>
            typeof category === 'object' && category !== null && typeof category.id === 'string'
        )
        .map((category) => normalizeCategory(category, currency))
    : []

  return {
    id: fixture.id || uuid,
    name: ensureString(fixture.name).trim() || 'Menu',
    description: ensureString(fixture.description).trim(),
    location: ensureString(fixture.location).trim() || null,
    cuisines: ensureStringArray(fixture.cuisines),
    bannerImages: ensureStringArray(fixture.bannerImages),
    categories,
    contact: typeof fixture.contact === 'object' && fixture.contact !== null ? fixture.contact : {},
    hours: ensureString(fixture.hours).trim() || null,
    currency,
  }
}

export async function loadMenuDefinition(uuid: string): Promise<MenuDefinition | null> {
  const fixture = RAW_FIXTURES[uuid]
  if (!fixture) {
    return null
  }

  return normalizeMenuFixture(uuid, fixture)
}

export function listAvailableMenus(): { id: string; name: string }[] {
  return Object.entries(RAW_FIXTURES).map(([id, fixture]) => ({
    id,
    name: ensureString(fixture.name).trim() || id,
  }))
}

export function resolveCategoryOptions(menu: MenuDefinition | null): CategoryOption[] {
  if (!menu) {
    return []
  }

  return menu.categories.map((category) => ({
    id: category.id,
    name: category.name,
    dishCount: category.dishes.filter((dish) => dish.name.length > 0).length,
  }))
}

export function resolvePopularDishes(menu: MenuDefinition | null): HighlightedDish[] {
  if (!menu) {
    return []
  }

  return menu.categories
    .flatMap((category) =>
      category.dishes
        .filter((dish) => dish.popular)
        .map((dish) => ({ ...dish, categoryId: category.id, categoryName: category.name }))
    )
    .filter((dish) => dish.name.length > 0)
}
