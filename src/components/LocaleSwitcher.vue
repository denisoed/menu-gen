<template>
  <label class="flex flex-col gap-1 text-sm font-medium text-muted">
    <span class="text-xs font-semibold uppercase tracking-wide">{{
      t('localeSwitcher.label')
    }}</span>
    <select
      v-model="currentLocale"
      class="rounded-lg border border-surface/70 bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <option
        v-for="availableLocale in supportedLocales"
        :key="availableLocale"
        :value="availableLocale"
      >
        {{ t(`localeSwitcher.${availableLocale}`) }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { SUPPORTED_LOCALES } from '@/plugins/i18n'

type Locale = (typeof SUPPORTED_LOCALES)[number]

const { t, locale } = useI18n({ useScope: 'global' })

const supportedLocales = computed(() => SUPPORTED_LOCALES)

const currentLocale = computed({
  get: () => locale.value as Locale,
  set: (value: Locale) => {
    if (SUPPORTED_LOCALES.includes(value)) {
      locale.value = value
    }
  },
})
</script>
