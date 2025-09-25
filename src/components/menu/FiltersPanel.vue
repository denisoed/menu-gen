<template>
  <section class="rounded-3xl border border-surface/60 bg-surface/70 p-6 shadow-sm">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <label
        class="flex w-full items-center gap-3 rounded-full border border-surface/60 bg-surface/80 px-4 py-2 shadow-sm focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30"
      >
        <span class="shrink-0 text-sm font-medium text-muted">
          {{ t('menu.filters.searchLabel') }}
        </span>
        <input
          v-model="searchQuery"
          type="search"
          class="w-full rounded-full border-none bg-background/95 px-4 py-2 text-base text-foreground outline-none placeholder:text-muted focus:ring-0"
          :placeholder="t('menu.filters.searchPlaceholder')"
          data-testid="menu-search-input"
        />
      </label>
      <div class="flex flex-col gap-2 text-sm text-muted md:items-end">
        <p>
          {{ t('menu.filters.results', { count: filteredDishCount }) }}
        </p>
        <button
          v-if="isFiltering"
          type="button"
          class="inline-flex items-center gap-1 text-primary hover:text-primary/80"
          data-testid="clear-filters"
          @click="onResetFilters"
        >
          <span aria-hidden="true">↺</span>
          {{ t('menu.filters.reset') }}
        </button>
      </div>
    </div>

    <details class="mt-6 md:hidden" :open="filtersOpen" @toggle="onToggleFilters">
      <summary class="cursor-pointer select-none text-sm font-semibold text-foreground">
        {{ t('menu.filters.categoriesTitle') }}
      </summary>
      <CategoryList class="mt-4" :categories="categoryOptions" :selected="selectedCategories" />
    </details>

    <div class="mt-6 hidden md:block">
      <CategoryList :categories="categoryOptions" :selected="selectedCategories" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import CategoryList from './partials/CategoryList.vue'
import { useMenuStore } from '@/stores/menu'

const { t } = useI18n()

const menuStore = useMenuStore()

const searchQuery = computed({
  get: () => menuStore.filters.query,
  set: (value: string) => menuStore.setSearchQuery(value),
})

const filteredDishCount = computed(() => menuStore.filteredDishCount)
const isFiltering = computed(() => menuStore.isFiltering)
const categoryOptions = computed(() => menuStore.categoryOptions)
const selectedCategories = computed(() => new Set(menuStore.filters.categories))

const filtersOpen = ref(false)

function onToggleFilters(event: Event) {
  filtersOpen.value = (event.target as HTMLDetailsElement).open
}

function onResetFilters() {
  menuStore.clearFilters()
}
</script>
