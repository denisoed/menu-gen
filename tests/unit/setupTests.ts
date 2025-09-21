/**
 * Global Jest setup executed before each test suite.
 * Extend this file with additional mocks or plugins when needed.
 */

jest.mock('vue3-carousel', () => {
  const stub = {
    template: '<div><slot /></div>',
  }

  return {
    Carousel: { name: 'Carousel', ...stub },
    Slide: { name: 'Slide', ...stub },
    Navigation: { name: 'Navigation', ...stub },
  }
})

window.open = jest.fn()
