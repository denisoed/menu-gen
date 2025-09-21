<template>
  <section class="overflow-hidden rounded-3xl border border-surface/60 bg-surface/70 shadow-sm">
    <Carousel
      v-if="images.length"
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
        <Navigation />
      </template>
    </Carousel>
    <div v-else class="flex h-48 items-center justify-center bg-muted/20 text-muted md:h-64">
      {{ t('menu.banner.placeholder') }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import { useI18n } from 'vue-i18n'

import 'vue3-carousel/dist/carousel.css'

const props = defineProps<{
  images: string[]
}>()

const { t } = useI18n()

const images = computed(() => props.images ?? [])
</script>
