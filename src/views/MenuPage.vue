<template>
  <section class="space-y-10 pb-16">
    <div v-if="status === 'loading'" class="space-y-6">
      <div class="h-12 w-2/3 animate-pulse rounded-full bg-surface/80" />
      <div class="h-64 animate-pulse rounded-3xl bg-surface/80" />
      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="index in 6" :key="index" class="h-56 animate-pulse rounded-3xl bg-surface/80" />
      </div>
    </div>

    <template v-else-if="menu">
      <MenuHeader :menu="menu" />
      <BannerCarousel :images="menu.bannerImages" />
      <FiltersPanel />
      <PopularCarousel v-if="popularDishes.length" :dishes="popularDishes" :menu-id="menu.id" />

      <DishGrid v-if="hasResults" :categories="filteredCategories" :menu-id="menu.id" />
      <EmptyState
        v-else
        icon="🔍"
        :title="t('menu.state.emptyTitle')"
        :description="t('menu.state.emptyDescription')"
        :action-label="t('menu.state.resetFilters')"
        @action="onResetFilters"
      />
    </template>

    <EmptyState
      v-else
      icon="🍽"
      :title="errorTitle"
      :description="errorDescription"
      :action-label="fallbackActionLabel"
      @action="navigateToFallback"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import BannerCarousel from '@/components/menu/BannerCarousel.vue'
import DishGrid from '@/components/menu/DishGrid.vue'
import EmptyState from '@/components/menu/EmptyState.vue'
import FiltersPanel from '@/components/menu/FiltersPanel.vue'
import MenuHeader from '@/components/menu/MenuHeader.vue'
import PopularCarousel from '@/components/menu/PopularCarousel.vue'
import { useMenuStore } from '@/stores/menu'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const status = computed(() => menuStore.status)
const menu = computed(() => menuStore.menu)
const popularDishes = computed(() => menuStore.popularDishes)
const filteredCategories = computed(() => menuStore.filteredCategories)
const hasResults = computed(() => menuStore.hasResults)
const availableMenus = computed(() => menuStore.availableMenus)
const error = computed(() => menuStore.error)

const errorTitle = computed(() =>
  error.value === 'not-found' ? t('menu.state.notFoundTitle') : t('menu.state.loadFailedTitle')
)
const errorDescription = computed(() =>
  error.value === 'not-found'
    ? t('menu.state.notFoundDescription')
    : t('menu.state.loadFailedDescription')
)
const fallbackActionLabel = computed(() =>
  availableMenus.value.length ? t('menu.state.goToSample') : t('menu.state.goHome')
)

watch(
  () => route.params.uuid as string,
  (uuid) => {
    menuStore.loadMenu(uuid)
  },
  { immediate: true }
)

function onResetFilters() {
  menuStore.clearFilters()
}

function navigateToFallback() {
  if (availableMenus.value.length) {
    router.push({ name: 'menu', params: { uuid: availableMenus.value[0].id } })
  } else {
    router.push({ name: 'home' })
  }
}
</script>
