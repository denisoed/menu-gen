<!-- SAVE_AS: spec/features/supabase-setup/plan.md -->

# План реализации

**Фича:** Создай файлы и папки, добавь стартовые файлы, используй typescript. Используй GitHub actions для деплоя в supabase. Добавь мини документацию для не очевидных вещей, если они есть я если нет, то не создавай.

## Источники данных / схемы
- Подготовить структуру каталога `supabase/` с подпапками `functions/`, `config/`, `migrations/` и зафиксировать в репозитории пустые заглушки (`.keep`), чтобы Git отслеживал директории.
- Создать `supabase/config.toml` с базовой конфигурацией проекта (путь к миграциям, порт локального сервера) и синхронизировать его с требованиями Supabase CLI.
- Добавить `.env.example` в корень Supabase с переменными `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`; прописать комментарии с назначением и указанием, что реальные значения берутся из секретов.
- Предусмотреть `supabase/migrations/.keep` и зафиксировать место для будущих SQL миграций, описав в README порядок их добавления.

## Контракты и интерфейсы
- Определить формат edge-функций: Deno + TypeScript модуль `index.ts`, экспортирующий обработчик `serve(async (req) => Response)`; описать требования к структуре входного запроса/ответа в локальной документации функции.
- Для стартовой функции `hello-world` описать контракт HTTP: метод `GET`, ответ `200 OK` с JSON `{ message: string }`; предусмотреть проверку заголовков `Content-Type: application/json`.
- Для webhook-шаблона зафиксировать ожидание входящих `POST` запросов с `application/json`, в README функции документировать обязательные поля payload.
- В `README.md` верхнего уровня Supabase зафиксировать команды CLI для локального запуска (`supabase start`, `supabase functions serve <name>`) и деплоя отдельных функций, чтобы разработчики понимали взаимодействие с Supabase API.

## Архитектура / Компоненты
- Создать базовую структуру edge-функций: `supabase/functions/hello-world/index.ts`, `supabase/functions/hello-world/README.md`, `supabase/functions/hello-world/deno.json` (общий конфиг с импортами, lint/format настройками) и аналогичные шаблоны для `webhook-handler`.
- Добавить общий `supabase/functions/deno.json` c shared настройками TypeScript (strict, jsx=react-jsx?) и зависимостями (например, `std@0.224.0`), а в функциях ссылаться на него через `deno.jsonc` extends.
- Настроить корневой `README.md` или `docs/supabase.md` с кратким гайдом: prerequisites (Node, Supabase CLI), шаги установки, локальный запуск функций, структура каталогов.
- Разработать GitHub Actions workflow `.github/workflows/deploy-supabase-functions.yml`: шаги checkout, установка Deno, установка Supabase CLI (через `npm install -g supabase` или скрипт), кэширование Deno, логин `supabase login --token`, деплой `supabase functions deploy --project-ref $SUPABASE_PROJECT_REF --env-file supabase/.env.deploy` (если требуется), условие `if: github.ref == 'refs/heads/main'`.
- Добавить шаги проверки качества: `deno fmt --check`, `deno lint`, `deno test` по всем функциям до деплоя; предусмотреть остановку при ошибке.
- Создать вспомогательный скрипт `package.json` или `Makefile` с командами `supabase:serve`, `supabase:deploy` для локальной проверки пайплайна; задокументировать.
- Зафиксировать, что чувствительные значения для деплоя берутся из секретов `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` и передаются в workflow как env.

## Риски
- Несоответствие версий Supabase CLI между локальной машиной и CI может приводить к различным результатам; предусмотреть фиксированную версию CLI и регулярное обновление.
- Отсутствие секретов в GitHub может сорвать деплой; добавить проверку на их наличие и документацию для настройки.
- Edge-функции могут иметь внешние зависимости, которые не кэшируются; необходимо использовать lock-файлы или зафиксированные версии модулей в `deno.json`.
- Возможные ограничения Supabase по времени деплоя; следует разбивать деплой на отдельные функции или использовать флаг `--import-map` при росте количества зависимостей.

## Допущения
- Supabase проект и необходимые секреты уже созданы и будут добавлены в GitHub Secrets до первого запуска workflow.
- Команда использует Deno 1.40+ и TypeScript 5.x; альтернативные рантаймы не планируются.
- Стартовых функций достаточно двух шаблонов (ping и webhook); дальнейшие функции будут копировать структуру.
- CI/CD запускается только в GitHub Actions, self-hosted runners не требуются.
