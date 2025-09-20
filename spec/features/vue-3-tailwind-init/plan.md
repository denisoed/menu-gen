<!-- SAVE_AS: spec/features/vue-3-tailwind-init/plan.md -->
# План реализации

**План:** нужно добавить полную настройку Vue 3 проекта с Tailwind CSS, Pinia, TypeScript и Prettier.

## Источники данных / схемы
- Настроить `package.json` с зависимостями: `vue`, `@vitejs/plugin-vue`, `vue-tsc`, `typescript`, `pinia`, `vue-router` (если потребуется пример), `tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/forms`, `@tailwindcss/typography`, `eslint`, `@vue/eslint-config-typescript`, `@vue/eslint-config-prettier`, `prettier`, `lint-staged`, `husky`.
- Сгенерировать базовую структуру Vite с шаблоном `vue-ts`. Подключить Tailwind согласно официальной инструкции: `tailwind.config.cjs`, `postcss.config.cjs`, `src/assets/main.css` с директивами `@tailwind base; components; utilities`.
- Определить в `tailwind.config.cjs` набор цветовых токенов, брейкпоинтов и подключить плагины. Убедиться, что purge охватывает `src/**/*.{vue,ts}`.
- Добавить конфигурации инструментов: `.eslintrc.cjs`, `tsconfig.json` (включая `compilerOptions` для строгой типизации), `tsconfig.node.json` для Vite, `.prettierrc` или `prettier.config.cjs`, `.npmrc` (фиксируем менеджер пакетов) и `.nvmrc`/`package.json#engines` для Node LTS.

## Контракты и интерфейсы
- Определить стандартные npm-скрипты: `dev`, `build`, `preview`, `test:type` (при необходимости `vue-tsc --noEmit`), `lint`, `format`, `prepare` для Husky. Документировать их в README.
- Настроить ESLint + Prettier интеграцию: расширения `plugin:vue/vue3-recommended`, `@vue/eslint-config-typescript/recommended`. Описать формат сообщений об ошибках и правила автопочинки.
- Подготовить шаблон README с инструкциями по установке Node LTS, запуску команд и решению распространённых проблем (конфликт портов, переустановка зависимостей).
- Описать подключение Pinia как централизованного сторедж-слоя: инициализация стора в `src/main.ts`, пример создания `src/stores/counter.ts`, соглашения по модулям.
- Если используется Vue Router, задокументировать базовые маршруты и соглашения по добавлению страниц.

## Архитектура / Компоненты
- Создать файловую структуру `src/` с разделением на `components`, `views`, `stores`, `styles`, `router` (опционально), `types`. Обеспечить импорт глобальных стилей и Tailwind.
- В `src/main.ts` подключить `createApp`, зарегистрировать Pinia, опциональный Router, и импортировать `main.css`.
- Добавить пример страницы (`App.vue` + компонент из `components/`), демонстрирующий Tailwind-утилиты и состояние из Pinia.
- Настроить Vite конфигурацию (`vite.config.ts`) с поддержкой алиасов (`@` → `src`), плагина Vue и соответствующих типов.
- Добавить Husky hook `pre-commit` с запуском `lint-staged` (ESLint + Prettier) и `vue-tsc` при необходимости. Описать процесс в планах.
- Включить настройку автоматических импортов типов (например, `env.d.ts`) и поддержку `.vue` файлов TypeScript.

## Риски
- Несовместимость версий пакетов (Vue 3, Vite, Tailwind). План: фиксировать версии и протестировать `npm run build` + `npm run dev`.
- Конфликты ESLint и Prettier правил. План: использовать официальные конфигурации `@vue/eslint-config-prettier` и проверить автопочинку.
- Tailwind может увеличить размер бандла, если purge настроен неверно. План: проверить сборку и наличие tree-shaking.
- Pinia требует строгой типизации стора; при ошибочных типах сборка падает. План: добавить пример стора с типами и запустить `vue-tsc`.
- Husky/lint-staged могут не запускаться в CI. План: продублировать проверки через отдельный CI-скрипт (lint + build).

## Допущения
- Node.js версии ≥18 доступен локально и на CI; менеджер пакетов — npm.
- Проект не требует подключения к внешнему API на этапе шаблона, поэтому сторы Pinia демонстрируют локальное состояние.
- Команда согласна на структуру директорий и использование Vue Router по умолчанию (при необходимости его можно удалить).
- CI уже настроен для запуска npm-скриптов и установки зависимостей.
- Требования по i18n ограничиваются готовностью подключить Vue I18n позднее; сейчас достаточно подготовить структуру.
