import { useCallback, useEffect, useRef } from "react"
import { useMediaQuery } from "usehooks-ts"
import { useLayoutStore } from "../../../store/use-layout-store"

export const useLayoutWrapper = () => {
  const {
    minimize,
    setMinimize,
    maxSidebarWidth,
    minSidebarWidth,
    triggerMinimize,
    minimizeTriggered,
  } = useLayoutStore()

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<React.ElementRef<"aside">>(null)
  const topbarRef = useRef<React.ElementRef<"div">>(null)
  const mainRef = useRef<React.ElementRef<"main">>(null)

  const isMobile = useMediaQuery("(max-width: 468px)")

  const mouseMoveHandler = useCallback(
    (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        topbarRef.current &&
        mainRef.current &&
        isResizingRef.current
      ) {
        let newWidth = e.clientX

        if (newWidth <= minSidebarWidth) newWidth = minSidebarWidth
        if (newWidth >= maxSidebarWidth) newWidth = maxSidebarWidth

        sidebarRef.current.style.setProperty("width", `${newWidth}px`)
        topbarRef.current.style.left = `${newWidth}px`
        topbarRef.current.style.width = `calc(100vw - ${newWidth}px)`
        mainRef.current.style.width = `calc(100vw - ${newWidth}px)`
      }
    },
    [maxSidebarWidth, minSidebarWidth],
  )

  const mouseUpHandler = useCallback(() => {
    isResizingRef.current = false
    document.removeEventListener("mousemove", mouseMoveHandler)
  }, [mouseMoveHandler])

  const resizeHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      isResizingRef.current = true
      document.addEventListener("mousemove", mouseMoveHandler)
      document.addEventListener("mouseup", mouseUpHandler, { once: true })
    },
    [mouseMoveHandler, mouseUpHandler],
  )

  const removeAllStyle = useCallback(() => {
    if (sidebarRef.current && topbarRef.current && mainRef.current) {
      sidebarRef.current.style.width = ""
      topbarRef.current.style.left = ""
      topbarRef.current.style.width = ""
      mainRef.current.style.width = ""
    }
  }, [])

  const maximizeHandler = useCallback(() => {
    removeAllStyle()
    setMinimize(false)
  }, [removeAllStyle, setMinimize])

  const minimizeHandler = useCallback(() => {
    removeAllStyle()
    setMinimize(true)
  }, [removeAllStyle, setMinimize])

  useEffect(() => {
    if (isMobile && !minimize) minimizeHandler()
    if (!isMobile && minimize) maximizeHandler()
  }, [isMobile, maximizeHandler, minimize, minimizeHandler])

  useEffect(() => {
    if (isMobile && minimizeTriggered) {
      minimizeHandler()
      triggerMinimize()
    }
  }, [isMobile, minimizeHandler, minimizeTriggered, triggerMinimize])

  useEffect(
    () => () => {
      document.removeEventListener("mousemove", mouseMoveHandler)
      document.removeEventListener("mouseup", mouseUpHandler)
    },
    [mouseMoveHandler, mouseUpHandler],
  )

  return {
    sidebarRef,
    mainRef,
    topbarRef,
    minimize,
    isMobile,
    maximizeHandler,
    minimizeHandler,
    resizeHandler,
    isResizingRef,
  }
}
