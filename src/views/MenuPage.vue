<template>
  <div class="flex flex-col">
    <div v-if="status === 'loading'" class="flex flex-col">
      <div class="h-64 w-full animate-pulse bg-surface/80 md:h-80" />
      <div class="mx-auto w-full max-w-6xl space-y-10 px-6 pb-16 pt-10">
        <div class="space-y-4">
          <div class="h-4 w-20 animate-pulse rounded-full bg-surface/80" />
          <div class="h-12 w-2/3 animate-pulse rounded-full bg-surface/80" />
          <div class="h-5 w-1/2 animate-pulse rounded-full bg-surface/80" />
        </div>
        <div class="h-12 w-full animate-pulse rounded-full bg-surface/80" />
        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="index in 6"
            :key="index"
            class="h-56 animate-pulse rounded-3xl bg-surface/80"
          />
        </div>
      </div>
    </div>

    <template v-else-if="menu">
      <BannerCarousel :images="menu.bannerImages" />
      <div class="mx-auto w-full max-w-6xl space-y-10 px-6 pb-16 pt-10">
        <MenuHeader :menu="menu" />
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
      </div>
    </template>

    <div v-else class="mx-auto w-full max-w-6xl px-6 py-16">
      <EmptyState
        icon="🍽"
        :title="errorTitle"
        :description="errorDescription"
        :action-label="fallbackActionLabel"
        @action="navigateToFallback"
      />
    </div>

    <FloatingCartButton v-if="status === 'ready'" :count="cartCount" @click="onCartClick" />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import FloatingCartButton from '@/components/cart/FloatingCartButton.vue'
import BannerCarousel from '@/components/menu/BannerCarousel.vue'
import DishGrid from '@/components/menu/DishGrid.vue'
import EmptyState from '@/components/menu/EmptyState.vue'
import FiltersPanel from '@/components/menu/FiltersPanel.vue'
import MenuHeader from '@/components/menu/MenuHeader.vue'
import PopularCarousel from '@/components/menu/PopularCarousel.vue'
import { useMenuStore } from '@/stores/menu'
import { useCartStore } from '@/stores/cart'
import { trackEvent } from '@/utils/analytics'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const cartStore = useCartStore()

const status = computed(() => menuStore.status)
const menu = computed(() => menuStore.menu)
const popularDishes = computed(() => menuStore.popularDishes)
const filteredCategories = computed(() => menuStore.filteredCategories)
const hasResults = computed(() => menuStore.hasResults)
const availableMenus = computed(() => menuStore.availableMenus)
const error = computed(() => menuStore.error)
const cartCount = computed(() => cartStore.totalItems)

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

function onCartClick() {
  trackEvent('cart.button.click', {
    menuId: menu.value?.id ?? null,
    items: cartCount.value,
  })
}
</script>
