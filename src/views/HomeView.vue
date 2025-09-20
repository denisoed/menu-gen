<template>
  <section class="flex flex-col gap-12">
    <header class="flex flex-col gap-4">
      <p class="text-sm font-semibold uppercase tracking-widest text-primary">
        {{ t('app.description') }}
      </p>
      <h1 class="text-4xl font-bold leading-tight text-foreground md:text-5xl">
        {{ t('home.hero.title') }}
      </h1>
      <p class="max-w-3xl text-lg text-muted">{{ t('home.hero.subtitle') }}</p>
    </header>

    <div class="grid gap-6 md:grid-cols-3">
      <article
        v-for="card in cards"
        :key="card.title"
        class="surface-card flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-xl"
      >
        <h2 class="text-lg font-semibold text-foreground">{{ t(card.title) }}</h2>
        <p class="text-sm text-muted">{{ t(card.description) }}</p>
      </article>
    </div>

    <CounterCard />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import CounterCard from '@/components/CounterCard.vue'

type CardContent = {
  title: `home.cards.${string}.title`
  description: `home.cards.${string}.description`
}

const { t } = useI18n()

const cards = computed<CardContent[]>(() => [
  {
    title: 'home.cards.tokens.title',
    description: 'home.cards.tokens.description',
  },
  {
    title: 'home.cards.theme.title',
    description: 'home.cards.theme.description',
  },
  {
    title: 'home.cards.stack.title',
    description: 'home.cards.stack.description',
  },
])
</script>
