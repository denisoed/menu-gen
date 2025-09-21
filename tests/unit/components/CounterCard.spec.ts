import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import CounterCard from '@/components/CounterCard.vue'
import en from '@/locales/en.json'

describe('CounterCard', () => {
  const mountComponent = () => {
    const pinia = createPinia()
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: { en },
    })

    return mount(CounterCard, {
      global: {
        plugins: [pinia, i18n],
      },
    })
  }

  it('renders translated labels and initial counter state', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('Reactive counter')
    expect(wrapper.text()).toContain('Current value')
    expect(wrapper.text()).toContain('Doubled')

    const values = wrapper.findAll('dd')
    expect(values[0]?.text()).toBe('0')
    expect(values[1]?.text()).toBe('0')
  })

  it('increments and resets the counter via store actions', async () => {
    const wrapper = mountComponent()

    const [incrementButton, resetButton] = wrapper.findAll('button')
    await incrementButton?.trigger('click')

    let values = wrapper.findAll('dd')
    expect(values[0]?.text()).toBe('1')
    expect(values[1]?.text()).toBe('2')

    await resetButton?.trigger('click')
    values = wrapper.findAll('dd')
    expect(values[0]?.text()).toBe('0')
    expect(values[1]?.text()).toBe('0')
  })
})
