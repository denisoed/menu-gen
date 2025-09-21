import { createMemoryRouter, routes } from '@/router'

describe('router configuration', () => {
  it('contains dynamic menu route', () => {
    const route = routes.find((record) => record.name === 'menu')
    expect(route).toBeDefined()
    expect(route?.path).toBe('/:uuid')
  })

  it('navigates to menu path with uuid', async () => {
    const router = createMemoryRouter()
    await router.push('/brunch-bistro')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('menu')
    expect(router.currentRoute.value.params.uuid).toBe('brunch-bistro')
  })

  it('keeps params for unknown menu', async () => {
    const router = createMemoryRouter()
    await router.push('/unknown-menu')
    await router.isReady()

    expect(router.currentRoute.value.name).toBe('menu')
    expect(router.currentRoute.value.params.uuid).toBe('unknown-menu')
  })
})
