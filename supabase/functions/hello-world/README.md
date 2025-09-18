# Hello World Edge Function

Демонстрационный обработчик Supabase Edge Functions, который отвечает JSON с приветствием.

## Локальный запуск

```bash
supabase functions serve hello-world --env-file .env
```

После запуска функция будет доступна по адресу `http://localhost:54321/functions/v1/hello-world`.

## Ответ

```json
{
  "message": "Hello from Supabase Edge Function!"
}
```

## Тесты

```bash
deno test
```
