import { onBeforeUnmount, onMounted, type Ref } from 'vue'

type Direction = 'horizontal' | 'vertical' | null

interface SwipeScrollLockOptions {
  /**
   * Minimal delta in pixels required before the gesture direction is locked.
   * Values between 6-12px work well for mobile devices where slight jitter is common.
   */
  threshold?: number
}

interface GestureState {
  active: boolean
  lockedDirection: Direction
  startX: number
  startY: number
}

const DEFAULT_THRESHOLD = 8

const createInitialState = (): GestureState => ({
  active: false,
  lockedDirection: null,
  startX: 0,
  startY: 0,
})

/**
 * Locks vertical scrolling when a horizontal swipe is detected on touch devices.
 *
 * The composable observes pointer/touch events on the provided element and
 * prevents the default browser behaviour once the gesture is determined to be
 * horizontal. Vertical gestures (or diagonal ones with a stronger vertical
 * component) remain untouched, allowing the surrounding page to scroll.
 */
export const useSwipeScrollLock = (
  target: Ref<HTMLElement | null>,
  options: SwipeScrollLockOptions = {}
) => {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD

  let pointerListenersAttached = false
  let touchListenersAttached = false
  let state: GestureState = createInitialState()

  const resetState = () => {
    state = createInitialState()
  }

  const handleHorizontalIntent = (dx: number, dy: number) => {
    if (state.lockedDirection || (!dx && !dy)) {
      return
    }

    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      return
    }

    state.lockedDirection = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch' || !event.isPrimary) {
      return
    }

    state.active = true
    state.startX = event.clientX
    state.startY = event.clientY
    state.lockedDirection = null
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!state.active || event.pointerType !== 'touch' || !event.isPrimary) {
      return
    }

    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY

    handleHorizontalIntent(dx, dy)

    if (state.lockedDirection === 'horizontal') {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const onPointerUp = () => {
    resetState()
  }

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      resetState()
      return
    }

    const touch = event.touches[0]
    state.active = true
    state.startX = touch.clientX
    state.startY = touch.clientY
    state.lockedDirection = null
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!state.active || event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]
    const dx = touch.clientX - state.startX
    const dy = touch.clientY - state.startY

    handleHorizontalIntent(dx, dy)

    if (state.lockedDirection === 'horizontal') {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  const onTouchEnd = () => {
    resetState()
  }

  const addPointerListeners = (element: HTMLElement) => {
    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove, { passive: false })
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointercancel', onPointerUp)
    pointerListenersAttached = true
  }

  const removePointerListeners = (element: HTMLElement) => {
    element.removeEventListener('pointerdown', onPointerDown)
    element.removeEventListener('pointermove', onPointerMove)
    element.removeEventListener('pointerup', onPointerUp)
    element.removeEventListener('pointercancel', onPointerUp)
    pointerListenersAttached = false
  }

  const addTouchListeners = (element: HTMLElement) => {
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd)
    element.addEventListener('touchcancel', onTouchEnd)
    touchListenersAttached = true
  }

  const removeTouchListeners = (element: HTMLElement) => {
    element.removeEventListener('touchstart', onTouchStart)
    element.removeEventListener('touchmove', onTouchMove)
    element.removeEventListener('touchend', onTouchEnd)
    element.removeEventListener('touchcancel', onTouchEnd)
    touchListenersAttached = false
  }

  onMounted(() => {
    const element = target.value

    if (!element) {
      return
    }

    if (typeof window !== 'undefined' && typeof window.PointerEvent === 'function') {
      addPointerListeners(element)
    } else {
      addTouchListeners(element)
    }
  })

  onBeforeUnmount(() => {
    const element = target.value

    if (!element) {
      return
    }

    if (pointerListenersAttached) {
      removePointerListeners(element)
    }

    if (touchListenersAttached) {
      removeTouchListeners(element)
    }
  })
}

export default useSwipeScrollLock
