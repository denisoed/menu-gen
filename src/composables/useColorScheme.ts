import { computed, ref, watch } from 'vue'

type ColorSchemePreference = 'light' | 'dark' | 'system'
type ResolvedColorScheme = 'light' | 'dark'

const COLOR_SCHEME_KEY = 'color-scheme-preference'

const colorScheme = ref<ColorSchemePreference>('system')
const systemPrefersDark = ref(false)
let initialized = false
let cleanupMedia: (() => void) | undefined
let stopStorageWatcher: (() => void) | undefined

const resolvedScheme = computed<ResolvedColorScheme>(() => {
  if (colorScheme.value === 'system') {
    return systemPrefersDark.value ? 'dark' : 'light'
  }

  return colorScheme.value
})

const isDark = computed(() => resolvedScheme.value === 'dark')

function readStoredScheme(): ColorSchemePreference | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedValue = window.localStorage.getItem(
      COLOR_SCHEME_KEY
    ) as ColorSchemePreference | null

    if (!storedValue) {
      return null
    }

    if (storedValue === 'light' || storedValue === 'dark' || storedValue === 'system') {
      return storedValue
    }
  } catch (error) {
    console.warn('[theme] Failed to read color scheme from storage:', error)
  }

  return null
}

function persistScheme(preference: ColorSchemePreference) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(COLOR_SCHEME_KEY, preference)
  } catch (error) {
    console.warn('[theme] Failed to persist color scheme:', error)
  }
}

function removePersistedScheme() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(COLOR_SCHEME_KEY)
  } catch (error) {
    console.warn('[theme] Failed to clear color scheme from storage:', error)
  }
}

function syncHtmlClass(value: ResolvedColorScheme) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.classList.toggle('dark', value === 'dark')
}

function setupMediaListener() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    systemPrefersDark.value = false
    return
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const updatePreference = (event: MediaQueryListEvent | MediaQueryList) => {
    systemPrefersDark.value = event.matches
  }

  updatePreference(media)

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', updatePreference)
    cleanupMedia = () => media.removeEventListener('change', updatePreference)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legacyMedia = media as any
    legacyMedia.addListener(updatePreference)
    cleanupMedia = () => legacyMedia.removeListener(updatePreference)
  }
}

function initializeColorScheme() {
  if (initialized) {
    return
  }

  initialized = true

  const storedPreference = readStoredScheme()
  if (storedPreference) {
    colorScheme.value = storedPreference
  }

  setupMediaListener()

  watch(
    resolvedScheme,
    (value) => {
      syncHtmlClass(value)
    },
    { immediate: true }
  )

  stopStorageWatcher = watch(
    colorScheme,
    (value) => {
      if (value === 'system') {
        removePersistedScheme()
      } else {
        persistScheme(value)
      }
    },
    { immediate: true }
  )
}

function setScheme(preference: ColorSchemePreference) {
  initializeColorScheme()
  colorScheme.value = preference
}

function toggleScheme() {
  initializeColorScheme()
  const next = resolvedScheme.value === 'dark' ? 'light' : 'dark'
  setScheme(next)
}

function resetColorScheme() {
  cleanupMedia?.()
  stopStorageWatcher?.()
  initialized = false
}

export function useColorScheme() {
  initializeColorScheme()

  return {
    colorScheme,
    resolvedScheme,
    isDark,
    setScheme,
    toggleScheme,
  }
}

export { initializeColorScheme, resetColorScheme }
export type { ColorSchemePreference, ResolvedColorScheme }
