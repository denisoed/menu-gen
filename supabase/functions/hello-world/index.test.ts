import { assertEquals } from "@std/testing/asserts.ts";
import { handler } from "./index.ts";

Deno.test("hello-world responds with a greeting", async () => {
  const request = new Request("http://localhost/hello-world");
  const response = await handler(request);

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("content-type"),
    "application/json; charset=utf-8",
  );

  const body = await response.json() as { message: string };
  assertEquals(body, { message: "Hello from Supabase Edge Function!" });
});
