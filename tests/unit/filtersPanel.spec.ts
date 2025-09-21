import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import FiltersPanel from '@/components/menu/FiltersPanel.vue'
import i18n from '@/plugins/i18n'
import { useMenuStore } from '@/stores/menu'

describe('FiltersPanel', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    const store = useMenuStore()
    await store.loadMenu('brunch-bistro')
  })

  it('updates store on search input and category toggle', async () => {
    const wrapper = mount(FiltersPanel, {
      global: {
        plugins: [pinia, i18n],
      },
    })

    const store = useMenuStore()

    const input = wrapper.get('[data-testid="menu-search-input"]')
    await input.setValue('coffee')

    expect(store.filters.query).toBe('coffee')

    const categoryButton = wrapper.get('[data-testid="category-coffee-bar"]')
    await categoryButton.trigger('click')

    expect(store.filters.categories).toContain('coffee-bar')

    await wrapper.vm.$nextTick()

    const resetButton = wrapper.get('[data-testid="clear-filters"]')
    await resetButton.trigger('click')

    expect(store.filters.query).toBe('')
    expect(store.filters.categories).toHaveLength(0)
  })
})
