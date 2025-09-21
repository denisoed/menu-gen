import { createPinia, setActivePinia } from 'pinia'

import { useMenuStore } from '@/stores/menu'

describe('menu store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads menu and exposes derived data', async () => {
    const store = useMenuStore()

    await store.loadMenu('brunch-bistro')

    expect(store.status).toBe('ready')
    expect(store.menu?.id).toBe('brunch-bistro')
    expect(store.categoryOptions.length).toBeGreaterThan(0)
    expect(store.popularDishes.length).toBeGreaterThan(0)

    const sweetCategory = store.filteredCategories.find(
      (category) => category.id === 'sweet-starts'
    )
    expect(sweetCategory?.dishes.length).toBe(2)
  })

  it('filters dishes by search query', async () => {
    const store = useMenuStore()
    await store.loadMenu('brunch-bistro')

    store.setSearchQuery('quinoa')

    const categories = store.filteredCategories
    expect(categories).toHaveLength(1)
    expect(categories[0].dishes).toHaveLength(1)
    expect(categories[0].dishes[0].name.toLowerCase()).toContain('quinoa')
  })

  it('filters dishes by category toggle', async () => {
    const store = useMenuStore()
    await store.loadMenu('brunch-bistro')

    store.toggleCategory('coffee-bar')

    const categories = store.filteredCategories
    expect(categories).toHaveLength(1)
    expect(categories[0].id).toBe('coffee-bar')

    store.toggleCategory('coffee-bar')
    expect(store.filteredCategories.length).toBeGreaterThan(1)
  })
})
