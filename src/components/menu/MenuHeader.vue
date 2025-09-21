<template>
  <header
    class="rounded-3xl border border-surface/60 bg-surface/70 p-6 shadow-sm shadow-primary/5 backdrop-blur-sm"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div class="flex-1 space-y-3">
        <p class="text-sm font-medium uppercase tracking-wide text-primary/80">
          {{ t('menu.header.title') }}
        </p>
        <h1 class="text-3xl font-semibold text-foreground md:text-4xl">
          {{ menu.name }}
        </h1>
        <p v-if="menu.description" class="max-w-3xl text-base text-muted">
          {{ menu.description }}
        </p>
      </div>
      <dl class="grid w-full gap-3 text-sm text-muted md:w-auto">
        <div v-if="menu.location" class="flex items-center gap-2">
          <dt class="font-medium text-foreground">
            {{ t('menu.header.location') }}
          </dt>
          <dd>{{ menu.location }}</dd>
        </div>
        <div v-if="menu.cuisines.length" class="flex items-start gap-2">
          <dt class="font-medium text-foreground">
            {{ t('menu.header.cuisines') }}
          </dt>
          <dd class="flex flex-wrap gap-2">
            <span
              v-for="cuisine in menu.cuisines"
              :key="cuisine"
              class="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs uppercase tracking-wide text-primary"
            >
              {{ cuisine }}
            </span>
          </dd>
        </div>
        <div v-if="menu.hours" class="flex items-center gap-2">
          <dt class="font-medium text-foreground">
            {{ t('menu.header.hours') }}
          </dt>
          <dd>{{ menu.hours }}</dd>
        </div>
      </dl>
    </div>

    <div
      v-if="hasContactInfo"
      class="mt-6 grid gap-3 border-t border-surface/60 pt-6 text-sm text-muted md:grid-cols-3"
    >
      <div v-if="menu.contact.phone" class="flex items-center gap-2">
        <span class="font-medium text-foreground">
          {{ t('menu.header.phone') }}
        </span>
        <a :href="`tel:${menu.contact.phone}`" class="truncate text-primary hover:text-primary/80">
          {{ menu.contact.phone }}
        </a>
      </div>
      <div v-if="menu.contact.website" class="flex items-center gap-2">
        <span class="font-medium text-foreground">
          {{ t('menu.header.website') }}
        </span>
        <a
          :href="menu.contact.website"
          target="_blank"
          rel="noopener"
          class="truncate text-primary hover:text-primary/80"
        >
          {{ menu.contact.website.replace('https://', '') }}
        </a>
      </div>
      <div v-if="menu.contact.messenger" class="flex items-center gap-2">
        <span class="font-medium text-foreground">
          {{ t('menu.header.messenger') }}
        </span>
        <span class="truncate">{{ menu.contact.messenger }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { MenuDefinition } from '@/types/menu'

const props = defineProps<{ menu: MenuDefinition }>()

const { t } = useI18n()

const hasContactInfo = computed(() =>
  Boolean(props.menu.contact.phone || props.menu.contact.website || props.menu.contact.messenger)
)
</script>
