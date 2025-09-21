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
        <Navigation />
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
