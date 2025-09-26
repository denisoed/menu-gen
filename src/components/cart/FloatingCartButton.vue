<template>
  <button
    type="button"
    class="fixed bottom-6 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-lg transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-8 sm:right-8"
    :aria-label="ariaLabel"
    @click="emit('click')"
  >
    <span class="sr-only" aria-live="polite">{{ countAnnouncement }}</span>
    <span aria-hidden="true" class="flex h-6 w-6 items-center justify-center">
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M2.25 3a.75.75 0 0 0 0 1.5h1.386a.75.75 0 0 1 .728.568l.401 1.605l1.34 6.035a2.251 2.251 0 0 0-.557 1.49c0 1.243 1.007 2.25 2.25 2.25h9a.75.75 0 0 0 0-1.5h-9a.75.75 0 0 1 0-1.5h9.648a2.25 2.25 0 0 0 2.205-1.803l1.17-5.85a.75.75 0 0 0-.736-.897H6.415l-.26-1.043A2.25 2.25 0 0 0 3.636 3H2.25ZM9 19.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3Zm7.5 1.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
    <span
      aria-hidden="true"
      class="absolute -top-1.5 -right-1.5 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-primary-contrast px-1.5 text-xs font-semibold text-primary shadow-md"
      :class="badgePadding"
    >
      {{ displayCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  count: number
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const { t, te, locale } = useI18n()

const displayCount = computed(() =>
  Math.max(0, Number.isFinite(props.count) ? Math.trunc(props.count) : 0)
)
const badgePadding = computed(() => (displayCount.value >= 10 ? 'px-2' : 'px-1.5'))
const pluralRules = computed(() => new Intl.PluralRules(locale.value))

function resolvePluralizedMessage(baseKey: string): string {
  const category = pluralRules.value.select(displayCount.value)
  const candidateKey = `${baseKey}.${category}`
  const fallbackKey = `${baseKey}.other`
  const keyToUse = te(candidateKey) ? candidateKey : fallbackKey

  return t(keyToUse, { count: displayCount.value })
}

const ariaLabel = computed(() => resolvePluralizedMessage('cart.button.ariaLabel'))
const countAnnouncement = computed(() => resolvePluralizedMessage('cart.button.announcement'))
</script>
