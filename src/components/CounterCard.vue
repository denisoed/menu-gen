<template>
  <section class="surface-card flex flex-col gap-6 p-6">
    <header class="flex flex-col gap-1">
      <h2 class="text-xl font-semibold text-foreground">{{ t('home.callout.title') }}</h2>
      <p class="text-sm text-muted">{{ t('home.callout.description') }}</p>
    </header>
    <dl class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt class="text-muted">{{ t('home.callout.value') }}</dt>
        <dd class="text-2xl font-semibold text-foreground">{{ count }}</dd>
      </div>
      <div>
        <dt class="text-muted">{{ t('home.callout.double') }}</dt>
        <dd class="text-2xl font-semibold text-foreground">{{ doubleCount }}</dd>
      </div>
    </dl>
    <div class="flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-contrast shadow-soft transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        @click="increment"
      >
        {{ t('home.callout.increment') }}
      </button>
      <button
        type="button"
        class="rounded-lg border border-surface/70 bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        @click="reset"
      >
        {{ t('home.callout.reset') }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useCounterStore } from '@/stores/counter'

const { t } = useI18n()
const counter = useCounterStore()
const { count, doubleCount } = storeToRefs(counter)
const { increment, reset } = counter
</script>
