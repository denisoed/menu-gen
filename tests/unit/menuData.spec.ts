import {
  listAvailableMenus,
  loadMenuDefinition,
  normalizeMenuFixture,
  resolveCategoryOptions,
  resolvePopularDishes,
} from '@/data/menus'
import type { MenuFixture } from '@/types/menu'

describe('menu data utilities', () => {
  it('normalizes fixture and applies fallbacks', () => {
    const fixture: MenuFixture = {
      id: 'test-fixture',
      categories: [
        {
          id: 'category',
          dishes: [
            {
              id: 'dish-without-name',
              price: 490,
            },
          ],
        },
      ],
    }

    const menu = normalizeMenuFixture('test-fixture', fixture)

    expect(menu.name).toBe('Menu')
    expect(menu.currency).toBe('₽')
    expect(menu.categories).toHaveLength(1)
    expect(menu.categories[0].dishes[0].name).toBe('')
    expect(menu.bannerImages).toEqual([])
  })

  it('loads existing menu definition', async () => {
    const available = listAvailableMenus().map((menu) => menu.id)
    expect(available).toContain('brunch-bistro')

    const menu = await loadMenuDefinition('brunch-bistro')
    expect(menu).not.toBeNull()
    expect(menu?.categories.length).toBeGreaterThan(0)
  })

  it('returns null for missing menu id', async () => {
    await expect(loadMenuDefinition('unknown-menu')).resolves.toBeNull()
  })

  it('resolves derived helpers', async () => {
    const menu = await loadMenuDefinition('brunch-bistro')
    expect(menu).not.toBeNull()

    const categories = resolveCategoryOptions(menu)
    const sweetStarts = categories.find((category) => category.id === 'sweet-starts')
    expect(sweetStarts?.dishCount).toBe(2)

    const popular = resolvePopularDishes(menu)
    expect(popular.length).toBeGreaterThan(0)
    expect(popular.every((dish) => dish.popular)).toBe(true)
  })
})
