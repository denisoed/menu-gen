<template>
  <div
    class="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-surface/60 bg-surface/60 p-10 text-center"
  >
    <div class="text-4xl" aria-hidden="true">{{ icon }}</div>
    <div class="space-y-2">
      <h3 class="text-2xl font-semibold text-foreground">{{ title }}</h3>
      <p v-if="description" class="max-w-xl text-sm text-muted">{{ description }}</p>
    </div>
    <button
      v-if="actionLabel"
      type="button"
      class="inline-flex items-center gap-2 rounded-full border border-primary/80 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
      @click="$emit('action')"
    >
      <span aria-hidden="true">⟳</span>
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'

const props = defineProps<{
  title: string
  description?: string
  actionLabel?: string
  icon?: string
}>()

const { title, description, actionLabel } = toRefs(props)
const icon = computed(() => props.icon ?? '🍽')

defineEmits<{ (event: 'action'): void }>()
</script>
