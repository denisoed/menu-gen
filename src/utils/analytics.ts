export type AnalyticsEventName =
  | 'menu.view'
  | 'menu.load_failed'
  | 'menu.filter'
  | 'menu.dish.view'
  | 'menu.dish.order'

export type AnalyticsPayload = Record<string, unknown>

export function trackEvent(event: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, payload)
  }
}
