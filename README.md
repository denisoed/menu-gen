# Box Supabase

Набор заготовок для старта разработки Supabase проекта: структура каталогов, шаблонные edge-функции, локальные команды и CI/CD пайплайн.

## Предварительные требования

- [Deno](https://deno.land/#installation) версии `1.x`
- [Supabase CLI](https://supabase.com/docs/guides/cli) версии `1.x`
- Docker Desktop / Colima для запуска локального стека Supabase

После установки проверьте версии:

```bash
deno --version
supabase --version
```

## Настройка окружения

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

## Структура проекта

```
supabase/
├── config.toml        # Базовая конфигурация локального проекта
├── config/            # Дополнительные TOML/override файлы
├── migrations/        # SQL миграции базы данных
└── functions/         # Edge-функции Deno
    ├── deno.json      # Общие настройки компилятора/линтера
    ├── import_map.json
    ├── hello-world/
    │   ├── index.ts
    │   ├── index.test.ts
    │   └── README.md
    └── webhook-handler/
        ├── index.ts
        ├── index.test.ts
        └── README.md
```

## Локальная разработка

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

Для ручного запуска используйте вкладку **Actions** → `Deploy Supabase Edge Functions` → `Run workflow`.

## Логирование и наблюдаемость

- Используйте `console.log`/`console.error` внутри edge-функций — Supabase собирает эти логи и отображает их в разделе **Logs** проекта.
- В описании инцидентов фиксируйте идентификатор функции и временную метку запроса (например, из заголовка `x-supabase-request-id`).
- Ответственные за мониторинг: команда платформы (пейджинг через on-call канал Slack). Любые критичные ошибки edge-функций необходимо эскалировать в течение 15 минут.

## Чеклист Pull Request

Перед созданием PR убедитесь, что:

- [ ] Выполнены `make fmt-check`, `make lint`, `make test`.
- [ ] Обновлены README/документация при добавлении новых функций или миграций.
- [ ] Добавлены/обновлены автоматические тесты.
- [ ] В описании PR указаны ссылки на результаты CI и, при необходимости, ссылка на Supabase Dashboard.
- [ ] Секреты и приватные токены не попали в diff.

## Полезные ссылки

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://deno.land/manual)
