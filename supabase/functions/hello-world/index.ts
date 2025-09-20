import { serve } from '@std/http/server.ts'

export interface HelloWorldResponse {
  readonly message: string
}

export const handler = async (_req: Request): Promise<Response> => {
  void _req
  const payload: HelloWorldResponse = {
    message: 'Hello from Supabase Edge Function!',
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

serve(handler)
