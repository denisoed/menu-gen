# Webhook Handler Edge Function

Шаблон функции для обработки входящих вебхуков в Supabase.

## Контракт

- **Метод:** `POST`
- **Заголовки:** `Content-Type: application/json`
- **Тело запроса:**
  ```json
  {
    "event": "invoice.created",
    "data": {
      "invoiceId": "inv_123",
      "amount": 4200
    },
    "deliveredAt": "2024-01-01T10:00:00Z"
  }
  ```

## Ответ

```json
{
  "received": true,
  "event": "invoice.created",
  "echo": {
    "invoiceId": "inv_123",
    "amount": 4200
  }
}
```

- Ошибки возвращаются с кодами `400`, `405` или `415` и сообщением `error`.

## Локальный запуск

```bash
supabase functions serve webhook-handler --env-file .env
```

Проверка через `curl`:

```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"event":"invoice.created","data":{"invoiceId":"inv_123"}}' \
  http://localhost:54321/functions/v1/webhook-handler
```

## Тесты

```bash
deno test
```
