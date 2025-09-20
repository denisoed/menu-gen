<template>
  <section class="surface-card flex flex-col gap-4 p-6">
    <h1 class="text-2xl font-semibold text-foreground">{{ t('about.title') }}</h1>
    <p class="text-muted">{{ t('about.body') }}</p>
    <ul class="list-disc space-y-2 pl-6 text-sm text-muted">
      <li>
        <code class="rounded bg-surface px-1 py-0.5">src/styles/tokens.scss</code> —
        {{ t('home.cards.tokens.description') }}
      </li>
      <li>
        <code class="rounded bg-surface px-1 py-0.5">src/locales/</code> —
        {{ t('localeSwitcher.label') }}
      </li>
      <li>
        <code class="rounded bg-surface px-1 py-0.5">src/components/</code> —
        {{ t('home.cards.stack.description') }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
