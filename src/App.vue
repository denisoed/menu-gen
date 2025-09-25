<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import MenuLayout from '@/layouts/MenuLayout.vue'

const layouts = {
  default: DefaultLayout,
  menu: MenuLayout,
} as const

type LayoutName = keyof typeof layouts

const route = useRoute()

const layoutComponent = computed(() => {
  const layoutName = route.meta.layout as LayoutName | undefined
  return layouts[layoutName ?? 'default']
})
</script>
