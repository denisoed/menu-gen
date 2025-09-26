<template>
  <section class="space-y-6">
    <header class="space-y-2 md:flex md:items-end md:justify-between md:gap-6">
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold text-foreground">
          {{ t('menu.popular.title') }}
        </h2>
        <p class="text-sm text-muted">{{ t('menu.popular.subtitle') }}</p>
      </div>
      <p v-if="dishes.length" class="text-sm text-muted md:text-right">
        {{ t('menu.popular.count', { count: dishes.length }) }}
      </p>
    </header>

    <div v-if="dishes.length" ref="carouselContainer" class="carousel-touch-guard">
      <Carousel
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
    </div>
    <p v-else class="text-sm text-muted">
      {{ t('menu.popular.empty') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import { useI18n } from 'vue-i18n'

import DishCard from './DishCard.vue'
import type { HighlightedDish } from '@/types/menu'
import { useSwipeScrollLock } from '@/composables/useSwipeScrollLock'

import 'vue3-carousel/dist/carousel.css'

const props = defineProps<{
  dishes: HighlightedDish[]
  menuId: string
}>()

const { t } = useI18n()

const dishes = computed(() => props.dishes)
const menuId = computed(() => props.menuId)
const carouselContainer = ref<HTMLElement | null>(null)

useSwipeScrollLock(carouselContainer)

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
.carousel-touch-guard {
  touch-action: pan-y pinch-zoom;
  overscroll-behavior: contain;
  user-select: none;
}

.carousel-nav :deep(button) {
  border-radius: 9999px;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  background-color: transparent;
  color: rgb(var(--color-text) / 0.75);
  box-shadow: none;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.carousel-nav :deep(button:hover) {
  color: rgb(var(--color-text) / 1);
  transform: translateY(-1px);
}

.carousel-nav :deep(button:focus-visible) {
  outline: 2px solid rgb(var(--color-primary) / 0.6);
  outline-offset: 3px;
}
</style>
