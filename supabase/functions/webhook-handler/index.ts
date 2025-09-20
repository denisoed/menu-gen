import { serve } from '@std/http/server.ts'

export interface WebhookPayload {
  readonly event: string
  readonly data: Record<string, unknown>
  readonly deliveredAt?: string
}

export interface WebhookResponse {
  readonly received: true
  readonly event: string
  readonly echo?: Record<string, unknown>
}

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}

export const handler = async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        ...jsonHeaders,
        allow: 'POST',
      },
    })
  }

  const contentType = req.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Unsupported Media Type' }), {
      status: 415,
      headers: jsonHeaders,
    })
  }

  let payload: WebhookPayload
  try {
    payload = (await req.json()) as WebhookPayload
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  if (!payload.event || typeof payload.event !== 'string') {
    return new Response(JSON.stringify({ error: "Missing required field 'event'" }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  const responseBody: WebhookResponse = {
    received: true,
    event: payload.event,
    echo: payload.data,
  }

  return new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: jsonHeaders,
  })
}

serve(handler)
