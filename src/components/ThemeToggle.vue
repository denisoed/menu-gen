<template>
  <div class="flex flex-col items-start gap-1">
    <span class="text-xs font-semibold uppercase tracking-wide text-muted">
      {{ t('themePanel.title') }}
    </span>
    <span class="text-xs text-muted">{{ t('themePanel.helper') }}</span>
    <div class="flex items-center gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="flex items-center gap-2 rounded-lg border border-surface/70 px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :class="[
          colorScheme === option.value
            ? 'bg-primary text-primary-contrast shadow-soft'
            : 'bg-surface text-foreground hover:bg-surface/80',
        ]"
        @click="handleClick(option.value)"
      >
        <component :is="option.icon" class="h-4 w-4" aria-hidden="true" />
        <span>{{ t(option.labelKey) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FunctionalComponent } from 'vue'
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'

import { useColorScheme } from '@/composables/useColorScheme'

type ToggleOption = {
  value: 'light' | 'dark' | 'system'
  labelKey: `themeToggle.${string}`
  icon: IconComponent
}

const { t } = useI18n()
const { colorScheme, setScheme } = useColorScheme()

type IconComponent = FunctionalComponent<Record<string, unknown>>

const SunIcon: IconComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': '1.5',
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
      }),
    ]
  )

const MoonIcon: IconComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': '1.5',
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
      }),
    ]
  )

const MonitorIcon: IconComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'stroke-width': '1.5',
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4 13h8',
      }),
    ]
  )

const options = computed<ToggleOption[]>(() => [
  {
    value: 'light',
    labelKey: 'themeToggle.light',
    icon: SunIcon,
  },
  {
    value: 'dark',
    labelKey: 'themeToggle.dark',
    icon: MoonIcon,
  },
  {
    value: 'system',
    labelKey: 'themeToggle.system',
    icon: MonitorIcon,
  },
])

function handleClick(value: ToggleOption['value']) {
  setScheme(value)
}
</script>
