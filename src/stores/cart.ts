import { defineStore } from 'pinia'

import { trackEvent } from '@/utils/analytics'

export interface CartState {
  totalItems: number
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    totalItems: 0,
  }),
  actions: {
    addItem(quantity = 1) {
      if (quantity <= 0) {
        return
      }

      this.totalItems += quantity
      trackEvent('cart.item.add', { quantity, total: this.totalItems })
    },
    reset() {
      this.totalItems = 0
    },
  },
})

export type CartStore = ReturnType<typeof useCartStore>
