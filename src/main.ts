import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n, { initializeI18nLocale } from './plugins/i18n'
import { initializeColorScheme } from './composables/useColorScheme'

import './assets/main.scss'

initializeColorScheme()
initializeI18nLocale()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
