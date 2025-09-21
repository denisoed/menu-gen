<template>
  <section class="space-y-4 rounded-3xl border border-surface/60 bg-surface/70 p-6 shadow-sm">
    <header class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-foreground">
          {{ t('menu.popular.title') }}
        </h2>
        <p class="text-sm text-muted">{{ t('menu.popular.subtitle') }}</p>
      </div>
      <p v-if="dishes.length" class="text-sm text-muted">
        {{ t('menu.popular.count', { count: dishes.length }) }}
      </p>
    </header>

    <Carousel
      v-if="dishes.length"
      :items-to-show="1.1"
      :wrap-around="dishes.length > 2"
      :breakpoints="carouselBreakpoints"
      :mouse-drag="true"
      :pause-autoplay-on-hover="true"
      :transition="700"
      class="-mx-2 md:mx-0"
    >
      <Slide v-for="dish in dishes" :key="dish.id" class="px-2 md:px-3">
        <DishCard :dish="dish" :menu-id="menuId" layout="compact" />
      </Slide>
      <template #addons>
        <Navigation class="carousel-nav" />
      </template>
    </Carousel>
    <p v-else class="text-sm text-muted">
      {{ t('menu.popular.empty') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import { useI18n } from 'vue-i18n'

import DishCard from './DishCard.vue'
import type { HighlightedDish } from '@/types/menu'

import 'vue3-carousel/dist/carousel.css'

const props = defineProps<{
  dishes: HighlightedDish[]
  menuId: string
}>()

const { t } = useI18n()

const dishes = computed(() => props.dishes)
const menuId = computed(() => props.menuId)

const carouselBreakpoints = {
  768: {
    itemsToShow: 2,
  },
  1280: {
    itemsToShow: 3,
  },
}
</script>

<style scoped>
.carousel-nav :deep(button) {
  border-radius: 9999px;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid rgb(var(--color-muted) / 0.4);
  background-color: rgb(var(--color-surface) / 0.9);
  color: rgb(var(--color-text) / 0.9);
  box-shadow: 0 12px 32px -12px rgb(var(--color-text) / 0.25);
  backdrop-filter: blur(8px);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.carousel-nav :deep(button:hover) {
  background-color: rgb(var(--color-bg) / 0.95);
  color: rgb(var(--color-text) / 1);
  box-shadow: 0 18px 40px -18px rgb(var(--color-text) / 0.3);
  transform: translateY(-1px);
}

.carousel-nav :deep(button:focus-visible) {
  outline: none;
  box-shadow: 0 0 0 3px rgb(var(--color-primary) / 0.35);
}
</style>
