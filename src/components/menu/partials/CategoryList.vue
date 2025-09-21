<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition"
      :class="
        selected.has(category.id)
          ? 'border-primary bg-primary/15 text-primary shadow-sm'
          : 'border-surface/80 bg-background text-muted hover:border-primary/40 hover:text-foreground'
      "
      :data-testid="`category-${category.id}`"
      @click="onToggle(category.id)"
    >
      <span>{{ category.name }}</span>
      <span class="rounded-full bg-surface/80 px-2 py-0.5 text-xs text-muted">
        {{ category.dishCount }}
      </span>
    </button>
    <p v-if="!categories.length" class="text-sm text-muted">
      {{ t('menu.filters.emptyCategories') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { CategoryOption } from '@/types/menu'
import { useMenuStore } from '@/stores/menu'

const props = defineProps<{
  categories: CategoryOption[]
  selected: Set<string>
}>()

const categories = computed(() => props.categories)
const selected = computed(() => props.selected)

const { t } = useI18n()
const menuStore = useMenuStore()

function onToggle(categoryId: string) {
  menuStore.toggleCategory(categoryId)
}
</script>
