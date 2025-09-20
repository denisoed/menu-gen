<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <header class="border-b border-surface/60 bg-surface/80 backdrop-blur">
      <nav class="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80"
        >
          <span aria-hidden="true">⚡</span>
          <span>{{ t('app.title') }}</span>
        </RouterLink>
        <div class="flex flex-wrap items-center gap-4">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium text-muted transition hover:text-foreground"
            active-class="text-foreground"
          >
            {{ t(link.label) }}
          </RouterLink>
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>

    <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10">
      <RouterView />
    </main>

    <footer
      class="border-t border-surface/60 bg-surface/70 px-6 py-4 text-center text-sm text-muted"
    >
      {{ t('app.footer') }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

type NavLink = {
  to: string
  label: `navigation.${string}`
}

const { t } = useI18n()

const links = computed<NavLink[]>(() => [
  { to: '/', label: 'navigation.home' },
  { to: '/about', label: 'navigation.about' },
])
</script>
