import { assertEquals } from "@std/testing/asserts.ts";
import { handler } from "./index.ts";

Deno.test("webhook handler accepts POST JSON payload", async () => {
  const payload = {
    event: "invoice.created",
    data: { invoiceId: "inv_123" },
  };

  const request = new Request("http://localhost/webhook-handler", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const response = await handler(request);
  assertEquals(response.status, 200);
  const body = await response.json() as Record<string, unknown>;
  assertEquals(body.received, true);
  assertEquals(body.event, payload.event);
});

Deno.test("webhook handler rejects non-POST methods", async () => {
  const request = new Request("http://localhost/webhook-handler", {
    method: "GET",
  });

  const response = await handler(request);
  assertEquals(response.status, 405);
  assertEquals(response.headers.get("allow"), "POST");
});

Deno.test("webhook handler validates JSON payload", async () => {
  const request = new Request("http://localhost/webhook-handler", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "not-json",
  });

  const response = await handler(request);
  assertEquals(response.status, 400);
});
