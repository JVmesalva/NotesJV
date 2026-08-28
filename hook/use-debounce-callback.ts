import { useCallback, useRef } from "react"

export default function useDebounceCallback(delay = 300) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef<(() => void) | null>(null)

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    callbackRef.current = null
  }, [])

  const flush = useCallback(() => {
    if (!callbackRef.current) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    const callback = callbackRef.current
    timeoutRef.current = null
    callbackRef.current = null
    callback()
  }, [])

  const delayedCallback = useCallback(
    (callback: () => void) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      callbackRef.current = callback
      timeoutRef.current = setTimeout(() => {
        const pendingCallback = callbackRef.current
        timeoutRef.current = null
        callbackRef.current = null
        pendingCallback?.()
      }, delay)
    },
    [delay],
  )

  return { delayedCallback, flush, cancel }
}
