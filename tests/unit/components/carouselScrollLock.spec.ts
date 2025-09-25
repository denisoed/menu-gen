import { mount } from '@vue/test-utils'

import BannerCarousel from '@/components/menu/BannerCarousel.vue'
import PopularCarousel from '@/components/menu/PopularCarousel.vue'
import i18n from '@/plugins/i18n'

class PointerEventPolyfill extends Event {
  clientX: number
  clientY: number
  pointerType: string
  isPrimary: boolean

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params)
    this.clientX = params.clientX ?? 0
    this.clientY = params.clientY ?? 0
    this.pointerType = params.pointerType ?? 'mouse'
    this.isPrimary = params.isPrimary ?? true
  }
}

class TouchEventPolyfill extends Event {
  touches: Array<{ clientX: number; clientY: number }>

  constructor(
    type: string,
    params: { touches?: Array<{ clientX: number; clientY: number }> } = {}
  ) {
    super(type, { bubbles: true, cancelable: true })
    this.touches = params.touches ?? []
  }
}

if (typeof window.PointerEvent === 'undefined') {
  window.PointerEvent = PointerEventPolyfill as unknown as typeof window.PointerEvent
}

if (typeof window.TouchEvent === 'undefined') {
  window.TouchEvent = TouchEventPolyfill as unknown as typeof window.TouchEvent
}

const dispatchPointerSwipe = ({
  element,
  move,
}: {
  element: HTMLElement
  move: { clientX: number; clientY: number }
}) => {
  element.dispatchEvent(
    new PointerEvent('pointerdown', {
      pointerType: 'touch',
      clientX: 0,
      clientY: 0,
      isPrimary: true,
      bubbles: true,
      cancelable: true,
    })
  )

  const moveEvent = new PointerEvent('pointermove', {
    pointerType: 'touch',
    clientX: move.clientX,
    clientY: move.clientY,
    isPrimary: true,
    bubbles: true,
    cancelable: true,
  })

  const preventSpy = jest.spyOn(moveEvent, 'preventDefault')
  const stopSpy = jest.spyOn(moveEvent, 'stopPropagation')

  element.dispatchEvent(moveEvent)
  element.dispatchEvent(
    new PointerEvent('pointerup', {
      pointerType: 'touch',
      clientX: move.clientX,
      clientY: move.clientY,
      isPrimary: true,
      bubbles: true,
      cancelable: true,
    })
  )

  return { preventSpy, stopSpy }
}

const dispatchTouchSwipe = ({
  element,
  move,
}: {
  element: HTMLElement
  move: { clientX: number; clientY: number }
}) => {
  const startEvent = new TouchEvent('touchstart', {
    touches: [{ clientX: 0, clientY: 0 }],
  }) as TouchEvent & { touches: Array<{ clientX: number; clientY: number }> }

  element.dispatchEvent(startEvent)

  const moveEvent = new TouchEvent('touchmove', {
    touches: [{ clientX: move.clientX, clientY: move.clientY }],
  }) as TouchEvent & { touches: Array<{ clientX: number; clientY: number }> }

  const preventSpy = jest.spyOn(moveEvent, 'preventDefault')
  const stopSpy = jest.spyOn(moveEvent, 'stopPropagation')

  element.dispatchEvent(moveEvent)
  element.dispatchEvent(new TouchEvent('touchcancel'))
  element.dispatchEvent(new TouchEvent('touchend'))

  return { preventSpy, stopSpy }
}

describe('carousel swipe scroll lock', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  const mountBanner = (props: Record<string, unknown>) =>
    mount(BannerCarousel, {
      props,
      global: { plugins: [i18n] },
    })

  const mountPopular = (props: Record<string, unknown>) =>
    mount(PopularCarousel, {
      props,
      global: { plugins: [i18n] },
    })

  it('prevents vertical scroll when horizontal swipe is detected in BannerCarousel', () => {
    const wrapper = mountBanner({
      images: ['a.jpg', 'b.jpg'],
    })

    const container = wrapper.find('.carousel-touch-guard')
    expect(container.exists()).toBe(true)

    const { preventSpy, stopSpy } = dispatchPointerSwipe({
      element: container.element as HTMLElement,
      move: { clientX: 80, clientY: 10 },
    })

    expect(preventSpy).toHaveBeenCalled()
    expect(stopSpy).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('allows vertical scroll when swipe is mostly vertical in BannerCarousel', () => {
    const wrapper = mountBanner({
      images: ['a.jpg'],
    })

    const container = wrapper.find('.carousel-touch-guard')
    const { preventSpy } = dispatchPointerSwipe({
      element: container.element as HTMLElement,
      move: { clientX: 10, clientY: 80 },
    })

    expect(preventSpy).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('locks scroll for PopularCarousel as well', () => {
    const wrapper = mountPopular({
      dishes: [
        {
          id: '1',
          name: 'Dish 1',
          description: 'desc',
          price: 100,
          currency: 'RUB',
          image: 'dish.jpg',
          popular: true,
          tags: [],
          orderUrl: null,
          allergens: [],
          spicyLevel: null,
          categoryId: 'highlighted',
          categoryName: 'Highlights',
        },
      ],
      menuId: 'menu-1',
    })

    const container = wrapper.find('.carousel-touch-guard')
    const { preventSpy } = dispatchPointerSwipe({
      element: container.element as HTMLElement,
      move: { clientX: 90, clientY: 8 },
    })

    expect(preventSpy).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('falls back to touch events when PointerEvent is unavailable', () => {
    const originalPointerEvent = window.PointerEvent
    ;(
      window as typeof window & { PointerEvent?: typeof Window.prototype.PointerEvent }
    ).PointerEvent = undefined

    const wrapper = mountBanner({
      images: ['fallback.jpg'],
    })

    const container = wrapper.find('.carousel-touch-guard')
    const { preventSpy, stopSpy } = dispatchTouchSwipe({
      element: container.element as HTMLElement,
      move: { clientX: 75, clientY: 5 },
    })

    expect(preventSpy).toHaveBeenCalled()
    expect(stopSpy).toHaveBeenCalled()

    wrapper.unmount()
    window.PointerEvent = originalPointerEvent
  })

  it('ignores zero-delta pointer movements', () => {
    const wrapper = mountBanner({
      images: ['single.jpg'],
    })

    const container = wrapper.find('.carousel-touch-guard')
    const { preventSpy, stopSpy } = dispatchPointerSwipe({
      element: container.element as HTMLElement,
      move: { clientX: 0, clientY: 0 },
    })

    expect(preventSpy).not.toHaveBeenCalled()
    expect(stopSpy).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('does not lock scroll before the gesture passes the threshold', () => {
    const wrapper = mountBanner({
      images: ['threshold.jpg'],
    })

    const container = wrapper.find('.carousel-touch-guard')
    const { preventSpy } = dispatchPointerSwipe({
      element: container.element as HTMLElement,
      move: { clientX: 5, clientY: 4 },
    })

    expect(preventSpy).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
