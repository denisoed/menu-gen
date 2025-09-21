import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import FiltersPanel from '@/components/menu/FiltersPanel.vue'
import DishGrid from '@/components/menu/DishGrid.vue'
import i18n from '@/plugins/i18n'
import { createMemoryRouter } from '@/router'
import MenuPage from '@/views/MenuPage.vue'

describe('MenuPage view', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  async function mountWithRoute(path: string) {
    const router = createMemoryRouter()
    router.push(path)
    await router.isReady()

    return mount(MenuPage, {
      global: {
        plugins: [pinia, router, i18n],
      },
    })
  }

  it('renders menu components for a valid menu', async () => {
    const wrapper = await mountWithRoute('/brunch-bistro')

    await flushPromises()

    expect(wrapper.findComponent(FiltersPanel).exists()).toBe(true)
    expect(wrapper.findComponent(DishGrid).exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="dish-card"]').length).toBeGreaterThan(0)
  })

  it('shows empty state for missing menu', async () => {
    const wrapper = await mountWithRoute('/missing-menu')

    await flushPromises()

    expect(wrapper.text()).toContain(i18n.global.t('menu.state.notFoundTitle'))
  })
})
