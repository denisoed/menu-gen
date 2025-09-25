import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

import BannerCarousel from '@/components/menu/BannerCarousel.vue'
import PopularCarousel from '@/components/menu/PopularCarousel.vue'
import en from '@/locales/en.json'

class MockPointerEvent extends Event {
  pointerId: number
  pointerType: string
  clientX: number
  clientY: number
  isPrimary: boolean

  constructor(type: string, init?: PointerEventInit) {
    super(type, { bubbles: true, cancelable: true })
    this.pointerId = init?.pointerId ?? 1
    this.pointerType = init?.pointerType ?? 'touch'
    this.clientX = init?.clientX ?? 0
    this.clientY = init?.clientY ?? 0
    this.isPrimary = init?.isPrimary ?? true
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
})

const mountCarousel = (component: unknown, props: Record<string, unknown>) =>
  mount(component, {
    props,
    global: {
      plugins: [i18n],
    },
  })

describe('carousel scroll lock', () => {
  const nativePointerEvent = window.PointerEvent

  beforeAll(() => {
    window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent
  })

  afterAll(() => {
    window.PointerEvent = nativePointerEvent
  })

  it('prevents vertical scroll during horizontal pointer gestures', async () => {
    const wrapper = mountCarousel(BannerCarousel, {
      images: ['a.jpg', 'b.jpg', 'c.jpg'],
    })

    await wrapper.vm.$nextTick()

    const container = wrapper.get('section')
    const downEvent = new window.PointerEvent('pointerdown', {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 10,
      clientY: 10,
    })
    container.element.dispatchEvent(downEvent)

    const moveEvent = new window.PointerEvent('pointermove', {
      pointerId: 1,
      pointerType: 'touch',
      clientX: 70,
      clientY: 18,
    })
    const preventDefault = jest.fn()
    const stopPropagation = jest.fn()
    Object.defineProperty(moveEvent, 'preventDefault', {
      value: preventDefault,
      configurable: true,
    })
    Object.defineProperty(moveEvent, 'stopPropagation', {
      value: stopPropagation,
      configurable: true,
    })

    container.element.dispatchEvent(moveEvent)

    expect(preventDefault).toHaveBeenCalled()
    expect(stopPropagation).toHaveBeenCalled()
  })

  it('does not block scroll when vertical movement dominates', async () => {
    const wrapper = mountCarousel(BannerCarousel, {
      images: ['a.jpg', 'b.jpg', 'c.jpg'],
    })

    await wrapper.vm.$nextTick()

    const container = wrapper.get('section')
    const downEvent = new window.PointerEvent('pointerdown', {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 10,
      clientY: 10,
    })
    container.element.dispatchEvent(downEvent)

    const moveEvent = new window.PointerEvent('pointermove', {
      pointerId: 2,
      pointerType: 'touch',
      clientX: 22,
      clientY: 90,
    })
    const preventDefault = jest.fn()
    Object.defineProperty(moveEvent, 'preventDefault', {
      value: preventDefault,
      configurable: true,
    })

    container.element.dispatchEvent(moveEvent)

    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('keeps scroll behaviour unchanged when carousel has a single slide', async () => {
    const wrapper = mountCarousel(PopularCarousel, {
      dishes: [
        {
          id: 'dish-1',
          name: 'Example',
          description: 'Only dish',
          price: 12,
          currency: 'USD',
          image: 'dish.jpg',
          popular: false,
          tags: [],
          orderUrl: null,
          allergens: [],
          spicyLevel: null,
          categoryId: 'cat-1',
          categoryName: 'Chef Specials',
        },
      ],
      menuId: 'menu-1',
    })

    await wrapper.vm.$nextTick()

    const container = wrapper.get('section')
    const downEvent = new window.PointerEvent('pointerdown', {
      pointerId: 3,
      pointerType: 'touch',
      clientX: 5,
      clientY: 5,
    })
    container.element.dispatchEvent(downEvent)

    const moveEvent = new window.PointerEvent('pointermove', {
      pointerId: 3,
      pointerType: 'touch',
      clientX: 80,
      clientY: 8,
    })
    const preventDefault = jest.fn()
    Object.defineProperty(moveEvent, 'preventDefault', {
      value: preventDefault,
      configurable: true,
    })

    container.element.dispatchEvent(moveEvent)

    expect(preventDefault).not.toHaveBeenCalled()
  })
})
