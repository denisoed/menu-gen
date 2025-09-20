# Box Supabase

Набор заготовок для старта разработки Supabase и фронтенд-проектов: структура каталогов, шаблонные edge-функции, локальные команды и готовое окружение Vue 3 + Tailwind.

## Состав репозитория

- **supabase/** — базовая структура проекта Supabase (миграции, edge-функции, конфигурация CLI).
- **frontend (корень репозитория)** — шаблон Vite + Vue 3 + TypeScript + Tailwind CSS с настроенными токенами, i18n, Pinia и переключением тем.

## Требования

### Backend-инструменты

- [Deno](https://deno.land/#installation) версии `1.x`
- [Supabase CLI](https://supabase.com/docs/guides/cli) версии `1.x`
- Docker Desktop / Colima для запуска локального стека Supabase

### Фронтенд-инструменты

- Node.js LTS ≥ 18.18.0 (рекомендуемая версия фиксируется в `.nvmrc` — `20.11.1`)
- npm (устанавливается вместе с Node.js)

Проверьте версии:

```bash
deno --version
supabase --version
node --version
npm --version
```

## Настройка фронтенд-окружения

1. Переключитесь на LTS-версию Node:
   ```bash
   nvm use
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите дев-сервер с hot reload:
   ```bash
   npm run dev
   ```
   По умолчанию проект доступен на [http://localhost:5173](http://localhost:5173). Tailwind и глобальные стили подключены автоматически.

### npm-скрипты

| Скрипт | Назначение |
| ------ | ---------- |
| `npm run dev` | Запуск Vite dev-сервера с hot module replacement. |
| `npm run build` | Продакшен-сборка проекта. Минифицирует бандлы и использует purge Tailwind. |
| `npm run preview` | Локальный предпросмотр собранной версии (`vite preview`). |
| `npm run lint` | ESLint для `.vue`/`.ts` файлов (ошибки блокируют коммит и CI). |
| `npm run format` | Автоформатирование с Prettier. |
| `npm run test:type` | Проверка типов (`vue-tsc --noEmit`). |
| `npm run prepare` | Установка git-хуков Husky. Запускается автоматически при `npm install`. |

### Качество и pre-commit

- Husky конфигурирует `pre-commit`, который запускает `lint-staged` (Prettier + ESLint) и типизацию перед коммитом.
- При необходимости повторно активируйте хуки командой `npm run prepare`.
- В CI достаточно запускать `npm run lint`, `npm run test:type` и `npm run build` — эти же команды указаны в чеклисте PR.

### Темы и дизайн-токены

- Глобальные токены описаны в `src/styles/tokens.scss`. Файл генерирует CSS custom properties для светлой и тёмной тем через SCSS-mixin `emit-tokens`.
- Tailwind получает значения из CSS-переменных (`background`, `surface`, `foreground`, `muted`, `primary`, `ring`) и расширяет тему в `tailwind.config.cjs`.
- Пользовательский composable `useColorScheme` (`src/composables/useColorScheme.ts`) управляет классом `dark` на `<html>`, синхронизируется с `prefers-color-scheme` и сохраняет выбор в `localStorage`. При отсутствии доступа к `localStorage` выбор откатывается к системной теме.
- Компонент `ThemeToggle.vue` демонстрирует работу со светлой/тёмной/системной темой и готов для повторного использования.

**Рекомендации по расширению токенов:**

1. Добавьте новые переменные в карты `$light-tokens`/`$dark-tokens` в `src/styles/tokens.scss`.
2. Используйте `@layer utilities` или `theme.extend` в Tailwind для привязки новых переменных к классам.
3. Документируйте изменения токенов и обновите примеры компонентов.

### Локализация

- Строки хранятся в `src/locales/<locale>.json`. Шаблон содержит `en` и `ru`.
- Конфигурация `src/plugins/i18n.ts` подключает Vue I18n, настраивает fallback (`en`) и сохраняет выбранную локаль в `localStorage`.
- Отсутствующие ключи логируются в консоль (один раз на ключ) — проверяйте вывод в dev-tools.
- `LocaleSwitcher.vue` иллюстрирует переключение локали. Чтобы добавить новый язык:
  1. Создайте `src/locales/<код>.json`.
  2. Добавьте код языка в `SUPPORTED_LOCALES` в `src/plugins/i18n.ts`.
  3. Обновите README и UI-компоненты, если требуется ручной список локалей.

### Архитектура фронтенда

- Входная точка `src/main.ts` подключает Pinia, Vue Router, i18n и глобальные стили (`src/assets/main.scss`).
- Маршруты описаны в `src/router/index.ts` и содержат пример `HomeView`/`AboutView`.
- Состояние Pinia (`src/stores/counter.ts`) демонстрируется в компоненте `CounterCard.vue`.
- Для новых компонентов используйте структуру директорий `src/components`, `src/views`, `src/styles`, `src/composables`, `src/plugins`.

### Типовые проблемы

| Проблема | Решение |
| -------- | ------- |
| Конфликт порта `5173` при запуске dev-сервера | Запустите `npm run dev -- --port 5174` или укажите нужный порт в `.env`. |
| Ошибки `npm install` после обновления зависимостей | Удалите `node_modules` и `package-lock.json`, повторно выполните `npm install`. |
| Хуки Husky не срабатывают | Запустите `npm run prepare` и убедитесь, что выполняете команды из git-репозитория. |
| Некорректная тема после очистки storage | Вызовите `localStorage.removeItem('color-scheme-preference')` или воспользуйтесь кнопкой "System" в `ThemeToggle`. |

### Наблюдаемость

На этапе шаблона метрики и логирование для фронтенда не подключены. Добавьте инструменты мониторинга после интеграции с backend/API и зафиксируйте выбранные решения в документации.

## Настройка Supabase окружения

1. Скопируйте файл переменных окружения и заполните значения:
   ```bash
   cp .env.example .env
   ```
   - `SUPABASE_ACCESS_TOKEN` и `SUPABASE_PROJECT_REF` используются для деплоя.
   - `SUPABASE_DB_PASSWORD` потребуется при подключении к локальной базе.
2. Запустите локальный стек Supabase:
   ```bash
   supabase start
   ```
   Команда поднимет контейнеры (Postgres, Studio, Edge Functions). Если порты заняты, скорректируйте значения в `supabase/config.toml`.
3. Для остановки окружения выполните `supabase stop`.

## Локальная разработка Supabase

Основные команды собраны в `Makefile`:

```bash
make fmt           # форматирование кода
make fmt-check     # проверка форматирования
make lint          # запуск линтеров
make test          # юнит-тесты
make ci            # fmt-check + lint + test
make serve-hello-world  # локальный запуск edge-функции hello-world
make serve-webhook      # локальный запуск webhook-handler
make deploy        # деплой двух функций в Supabase (требуются секреты)
```

Edge-функции можно тестировать через Supabase CLI:

```bash
supabase functions serve hello-world --env-file .env
supabase functions serve webhook-handler --env-file .env
```

## CI/CD

Workflow `.github/workflows/deploy-supabase-functions.yml` запускается при push в `main` и выполняет:

1. Проверку наличия секретов `SUPABASE_ACCESS_TOKEN` и `SUPABASE_PROJECT_REF`.
2. Установку Deno и Supabase CLI, кеширование зависимостей Deno.
3. `deno fmt --check`, `deno lint`, `deno test` для всех функций.
4. Деплой функций `hello-world` и `webhook-handler` в указанный проект.

## Чеклист Pull Request

Перед созданием PR убедитесь, что:

- [ ] Выполнены `npm run lint`, `npm run test:type`, `npm run build` (фронтенд).
- [ ] Выполнены `make fmt-check`, `make lint`, `make test` (Supabase).
- [ ] Обновлены README/документация при добавлении новых функций, миграций или UI-компонентов.
- [ ] Добавлены/обновлены автоматические тесты.
- [ ] В описании PR указаны ссылки на результаты CI и, при необходимости, ссылка на Supabase Dashboard.
- [ ] Секреты и приватные токены не попали в diff.

## Полезные ссылки

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://deno.land/manual)
- [Vue 3 Docs](https://vuejs.org/guide/introduction.html)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [Vue I18n](https://vue-i18n.intlify.dev/)
