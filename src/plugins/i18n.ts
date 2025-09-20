import { computed, ref, watch } from 'vue'
import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

type LocaleCode = 'en' | 'ru'

export const SUPPORTED_LOCALES = ['en', 'ru'] as const satisfies readonly LocaleCode[]
export const DEFAULT_LOCALE: LocaleCode = 'en'
export const FALLBACK_LOCALE: LocaleCode = 'en'
const LOCALE_STORAGE_KEY = 'preferred-locale'

const missingMessages = ref<string[]>([])

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  globalInjection: true,
  messages: {
    en,
    ru,
  },
  missing: (locale, key) => {
    const message = `[i18n] Missing translation for "${key}" in locale "${locale}"`
    if (!missingMessages.value.includes(message)) {
      missingMessages.value.push(message)
      console.warn(message)
    }
  },
})

function readStoredLocale(): LocaleCode | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && SUPPORTED_LOCALES.includes(stored as LocaleCode)) {
      return stored as LocaleCode
    }
  } catch (error) {
    console.warn('[i18n] Failed to read locale from storage:', error)
  }

  return null
}

function detectBrowserLocale(): LocaleCode | null {
  if (typeof navigator === 'undefined') {
    return null
  }

  const browserLocale = navigator.language?.split('-')[0]
  if (browserLocale && SUPPORTED_LOCALES.includes(browserLocale as LocaleCode)) {
    return browserLocale as LocaleCode
  }

  return null
}

export function initializeI18nLocale() {
  if (typeof window === 'undefined') {
    return
  }

  const storedLocale = readStoredLocale()
  const browserLocale = detectBrowserLocale()
  const nextLocale = storedLocale ?? browserLocale ?? DEFAULT_LOCALE

  i18n.global.locale.value = nextLocale

  watch(
    () => i18n.global.locale.value,
    (value) => {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, value)
      } catch (error) {
        console.warn('[i18n] Failed to persist locale:', error)
      }
    }
  )
}

export function useMissingTranslations() {
  return computed(() => missingMessages.value)
}

export default i18n
export type { LocaleCode }
