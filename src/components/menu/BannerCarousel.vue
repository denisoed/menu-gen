<template>
  <section class="w-full">
    <div v-if="images.length" ref="carouselContainer" class="carousel-touch-guard">
      <Carousel
        :items-to-show="1"
        :wrap-around="images.length > 1"
        :autoplay="7000"
        :pause-autoplay-on-hover="true"
        class="group"
      >
        <Slide v-for="image in images" :key="image">
          <figure class="relative h-64 w-full overflow-hidden bg-muted md:h-80">
            <img
              :src="image"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              :alt="t('menu.banner.alt')"
            />
          </figure>
        </Slide>
        <template #addons>
          <Navigation class="carousel-nav" />
        </template>
      </Carousel>
    </div>
    <div v-else class="flex h-48 w-full items-center justify-center bg-muted/20 text-muted md:h-64">
      {{ t('menu.banner.placeholder') }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import { useI18n } from 'vue-i18n'

import 'vue3-carousel/dist/carousel.css'
import { useSwipeScrollLock } from '@/composables/useSwipeScrollLock'

const props = defineProps<{
  images: string[]
}>()

const { t } = useI18n()

const images = computed(() => props.images ?? [])
const carouselContainer = ref<HTMLElement | null>(null)

useSwipeScrollLock(carouselContainer)
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
