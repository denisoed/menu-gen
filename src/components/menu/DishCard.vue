<template>
  <article
    :class="[
      'flex h-full flex-col gap-4 rounded-3xl border border-surface/70 bg-surface/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
      layout === 'compact' ? 'md:flex-row md:items-center md:gap-6' : 'md:p-6',
    ]"
    data-testid="dish-card"
  >
    <div
      v-if="dish.image"
      class="overflow-hidden rounded-2xl border border-surface/60 bg-muted md:w-48"
    >
      <img
        :src="dish.image"
        :alt="dish.name"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="flex flex-1 flex-col gap-3">
      <header class="space-y-1">
        <p
          v-if="dishTags.length"
          class="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-primary"
        >
          <span v-for="tag in dishTags" :key="tag" class="rounded-full bg-primary/10 px-2 py-1">{{
            tag
          }}</span>
        </p>
        <h3 class="text-xl font-semibold text-foreground">
          {{ dish.name }}
        </h3>
        <p v-if="dish.description" class="text-sm text-muted">
          {{ dish.description }}
        </p>
      </header>
      <div class="mt-auto flex flex-wrap items-center justify-between gap-3">
        <p v-if="priceLabel" class="text-lg font-semibold text-primary">
          {{ priceLabel }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/90 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary"
          @click="handleOrder"
        >
          <span aria-hidden="true">🍽</span>
          {{ t('menu.dish.order') }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import type { MenuDish } from '@/types/menu'
import { trackEvent } from '@/utils/analytics'

const props = withDefaults(
  defineProps<{
    dish: MenuDish
    menuId: string
    layout?: 'grid' | 'compact'
  }>(),
  {
    layout: 'grid',
  }
)

const { t } = useI18n()

const dishTags = computed(() => props.dish.tags)

const priceLabel = computed(() => {
  if (props.dish.price === null) {
    return ''
  }

  if (props.dish.currency && props.dish.currency.length <= 3) {
    return `${props.dish.price} ${props.dish.currency}`.trim()
  }

  return props.dish.currency ? `${props.dish.currency} ${props.dish.price}` : `${props.dish.price}`
})

onMounted(() => {
  trackEvent('menu.dish.view', { menuId: props.menuId, dishId: props.dish.id })
})

function handleOrder() {
  trackEvent('menu.dish.order', { menuId: props.menuId, dishId: props.dish.id })
  if (props.dish.orderUrl) {
    window.open(props.dish.orderUrl, '_blank', 'noopener')
  }
}
</script>
