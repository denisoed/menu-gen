<template>
  <section class="space-y-10">
    <div
      v-for="category in categories"
      :key="category.id"
      class="space-y-6"
      :data-testid="`category-block-${category.id}`"
    >
      <header class="space-y-2">
        <h2 class="text-2xl font-semibold text-foreground">{{ category.name }}</h2>
        <p v-if="category.description" class="text-sm text-muted">{{ category.description }}</p>
      </header>
      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <DishCard v-for="dish in category.dishes" :key="dish.id" :dish="dish" :menu-id="menuId" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import DishCard from './DishCard.vue'
import type { MenuCategory } from '@/types/menu'

const props = defineProps<{
  categories: MenuCategory[]
  menuId: string
}>()

const categories = computed(() => props.categories)
const menuId = computed(() => props.menuId)
</script>
