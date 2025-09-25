import { MaybeRefOrGetter, onBeforeUnmount, ref, toValue, unref, watch } from 'vue'

export interface CarouselScrollLockOptions {
  /**
   * Enables or disables the scroll lock behaviour. Useful when the carousel is hidden
   * or rendered without interactive slides.
   */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * Minimum distance in pixels that must be travelled before the gesture direction is locked.
   */
  lockThreshold?: number
}

type Orientation = 'horizontal' | 'vertical' | null

type PointerState = {
  startX: number
  startY: number
  orientation: Orientation
  activeId: number | null
  tracking: boolean
}

const defaultState: PointerState = {
  startX: 0,
  startY: 0,
  orientation: null,
  activeId: null,
  tracking: false,
}

const supportsPointer = () => typeof window !== 'undefined' && 'PointerEvent' in window

const resolveEnabled = (value: MaybeRefOrGetter<boolean> | undefined) => toValue(value ?? true)

export function useCarouselScrollLock(options: CarouselScrollLockOptions = {}) {
  const containerRef = ref<HTMLElement | null>(null)

  const threshold = options.lockThreshold ?? 10
  let state: PointerState = { ...defaultState }
  let activeTouchId: number | null = null
  let teardown: (() => void) | undefined

  const resetState = () => {
    state = { ...defaultState }
    activeTouchId = null
  }

  const handleOrientation = (dx: number, dy: number) => {
    if (state.orientation || !state.tracking) return

    const distance = Math.abs(dx) + Math.abs(dy)
    if (distance < threshold) return

    state.orientation = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
  }

  const preventVerticalScroll = (event: Event) => {
    if (state.orientation !== 'horizontal') return

    if (typeof event.cancelable !== 'boolean' || event.cancelable) {
      event.preventDefault()
    }
    event.stopPropagation()
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!resolveEnabled(options.enabled)) return
    if (event.pointerType === 'mouse' || ('isPrimary' in event && event.isPrimary === false)) return

    state = {
      startX: event.clientX,
      startY: event.clientY,
      orientation: null,
      activeId: event.pointerId,
      tracking: true,
    }
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!state.tracking || state.activeId !== event.pointerId) return

    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY

    handleOrientation(dx, dy)
    preventVerticalScroll(event)
  }

  const onPointerUp = (event: PointerEvent) => {
    if (state.activeId !== event.pointerId) return

    resetState()
  }

  const getTouchById = (touches: TouchList, identifier: number | null) => {
    if (identifier === null) return null

    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches.item(i)
      if (touch && touch.identifier === identifier) {
        return touch
      }
    }

    return null
  }

  const onTouchStart = (event: TouchEvent) => {
    if (!resolveEnabled(options.enabled)) return
    if (event.touches.length !== 1) {
      resetState()
      return
    }

    const touch = event.touches[0]
    activeTouchId = touch.identifier
    state = {
      startX: touch.clientX,
      startY: touch.clientY,
      orientation: null,
      activeId: null,
      tracking: true,
    }
  }

  const onTouchMove = (event: TouchEvent) => {
    const touch = getTouchById(event.touches, activeTouchId)
    if (!touch || !state.tracking) return

    const dx = touch.clientX - state.startX
    const dy = touch.clientY - state.startY

    handleOrientation(dx, dy)
    preventVerticalScroll(event)
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (!state.tracking) return

    const touch = getTouchById(event.changedTouches, activeTouchId)
    if (touch) {
      resetState()
    }
  }

  const attachListeners = (element: HTMLElement | null) => {
    if (teardown) {
      teardown()
      teardown = undefined
    }

    if (!element || !resolveEnabled(options.enabled)) return

    if (supportsPointer()) {
      element.addEventListener('pointerdown', onPointerDown)
      element.addEventListener('pointermove', onPointerMove, { passive: false })
      element.addEventListener('pointerup', onPointerUp)
      element.addEventListener('pointercancel', onPointerUp)
      element.addEventListener('pointerleave', onPointerUp)

      teardown = () => {
        element.removeEventListener('pointerdown', onPointerDown)
        element.removeEventListener('pointermove', onPointerMove)
        element.removeEventListener('pointerup', onPointerUp)
        element.removeEventListener('pointercancel', onPointerUp)
        element.removeEventListener('pointerleave', onPointerUp)
      }
    } else {
      element.addEventListener('touchstart', onTouchStart)
      element.addEventListener('touchmove', onTouchMove, { passive: false })
      element.addEventListener('touchend', onTouchEnd)
      element.addEventListener('touchcancel', onTouchEnd)

      teardown = () => {
        element.removeEventListener('touchstart', onTouchStart)
        element.removeEventListener('touchmove', onTouchMove)
        element.removeEventListener('touchend', onTouchEnd)
        element.removeEventListener('touchcancel', onTouchEnd)
      }
    }
  }

  watch(
    () => [containerRef.value, resolveEnabled(options.enabled)],
    () => {
      attachListeners(unref(containerRef))
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (teardown) {
      teardown()
      teardown = undefined
    }
  })

  return {
    containerRef,
  }
}
