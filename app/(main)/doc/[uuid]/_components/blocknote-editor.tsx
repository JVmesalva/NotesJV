"use client"

import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import "./blocknote-editor.css"

import { type Block } from "@blocknote/core"
import { pt } from "@blocknote/core/locales"
import {
  FormattingToolbar,
  FormattingToolbarController,
  blockTypeSelectItems,
  getFormattingToolbarItems,
  useBlockNoteEditor,
  useCreateBlockNote,
  useEditorState,
} from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { type Json } from "@/lib/supabase/database.types"
import { useDocStore } from "@/store/use-doc-store"
import { ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type LocalDraft = {
  savedAt: number
  version: number
  data: Block[]
}

type ScrollSnapshot = {
  scrollParent: HTMLElement | null
  parentTop: number
  parentLeft: number
  windowX: number
  windowY: number
}

const draftKey = (uuid: string) => `jv-notes:blocknote-draft:${uuid}`

const readDraft = (uuid: string): LocalDraft | null => {
  if (typeof window === "undefined") return null

  try {
    const value = window.localStorage.getItem(draftKey(uuid))
    return value ? (JSON.parse(value) as LocalDraft) : null
  } catch {
    return null
  }
}

const writeDraft = (uuid: string, draft: LocalDraft) => {
  try {
    window.localStorage.setItem(draftKey(uuid), JSON.stringify(draft))
  } catch {
    // The Supabase save still runs if localStorage is unavailable.
  }
}

const clearDraft = (uuid: string) => {
  try {
    window.localStorage.removeItem(draftKey(uuid))
  } catch {
    // Ignore browser storage errors.
  }
}

const findScrollableParent = (element: HTMLElement | null) => {
  let current = element?.parentElement ?? null

  while (current) {
    const styles = window.getComputedStyle(current)
    const canScrollY = /auto|scroll|overlay/.test(styles.overflowY)

    if (canScrollY && current.scrollHeight > current.clientHeight) return current
    current = current.parentElement
  }

  return null
}

const captureScroll = (element: HTMLElement | null): ScrollSnapshot => {
  const scrollParent = findScrollableParent(element)

  return {
    scrollParent,
    parentTop: scrollParent?.scrollTop ?? 0,
    parentLeft: scrollParent?.scrollLeft ?? 0,
    windowX: window.scrollX,
    windowY: window.scrollY,
  }
}

const restoreScroll = (snapshot: ScrollSnapshot) => {
  snapshot.scrollParent?.scrollTo(snapshot.parentLeft, snapshot.parentTop)
  window.scrollTo(snapshot.windowX, snapshot.windowY)
}

const StableBlockTypeSelect = () => {
  const editor = useBlockNoteEditor()
  const lastTextSelectionRef = useRef<Block[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const selectionState = useEditorState({
    editor,
    selector: ({ editor }) => {
      const selection = editor.getSelection()

      return {
        hasTextSelection: Boolean(selection),
        blocks: selection?.blocks || [editor.getTextCursorPosition().block],
      }
    },
  })

  if (selectionState.hasTextSelection) {
    lastTextSelectionRef.current = selectionState.blocks as Block[]
  }

  const selectedBlocks =
    selectionState.hasTextSelection || lastTextSelectionRef.current.length === 0
      ? (selectionState.blocks as Block[])
      : lastTextSelectionRef.current
  const firstSelectedBlock = selectedBlocks[0]

  if (!firstSelectedBlock || !editor.isEditable) return null

  const items = blockTypeSelectItems(editor.dictionary)
  const firstBlockProps = firstSelectedBlock.props as Record<string, unknown>
  const selectedItem = items.find((item) => {
    if (item.type !== firstSelectedBlock.type) return false

    return Object.entries(item.props || {}).every(
      ([propName, propValue]) => firstBlockProps[propName] === propValue,
    )
  })

  if (!selectedItem) return null

  const applyBlockType = (item: (typeof items)[number]) => {
    const scrollSnapshot = captureScroll(editor.portalElement)
    const blocksToUpdate = [...selectedBlocks]

    editor.transact(() => {
      for (const block of blocksToUpdate) {
        editor.updateBlock(
          block,
          {
            type: item.type,
            props: item.props,
          } as Parameters<typeof editor.updateBlock>[1],
        )
      }
    })

    setIsOpen(false)

    // The page scrolls inside <main>, not on window. Restore both the actual
    // scroll container and window after BlockNote re-renders the changed block.
    restoreScroll(scrollSnapshot)
    requestAnimationFrame(() => {
      restoreScroll(scrollSnapshot)
      requestAnimationFrame(() => restoreScroll(scrollSnapshot))
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex h-7 min-w-[92px] items-center justify-between gap-1 rounded-[5px] px-2 text-[13px] hover:bg-accent hover:text-accent-foreground"
        onPointerDown={(event) => {
          // Do not move pointer focus out of the editor. Keeping the editor
          // selection alive makes block type conversion reliable.
          event.preventDefault()
          event.stopPropagation()
          setIsOpen((open) => !open)
        }}
      >
        <span>{selectedItem.name}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-[90] mt-1 min-w-[190px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const isSelected = item === selectedItem

            return (
              <button
                key={`${item.type}-${JSON.stringify(item.props || {})}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                className="flex h-8 w-full items-center gap-2 rounded px-2 text-left text-[13px] hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  applyBlockType(item)
                }}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const StableFormattingToolbar = () => (
  <FormattingToolbar>
    <StableBlockTypeSelect />
    {getFormattingToolbarItems().slice(1)}
  </FormattingToolbar>
)

export default function BlockNoteEditor() {
  const params = useParams()
  const uuid = params.uuid as string
  const { resolvedTheme } = useTheme()
  const draftVersionRef = useRef(0)
  const recoveredForUuidRef = useRef<string | null>(null)

  const { delayedCallback, flush } = useDebounceCallback(800)
  const { doc, isLocked, setUndoRedoInstance, updateDocAsync } = useDocStore()

  const serverBlocks = useMemo(() => {
    if (!Array.isArray(doc?.blocknote_content) || doc.blocknote_content.length === 0) return undefined
    return doc.blocknote_content as unknown as Block[]
  }, [doc?.blocknote_content])

  const recoveredDraft = useMemo(() => {
    if (!doc) return null

    const draft = readDraft(uuid)
    if (!draft) return null

    const serverUpdatedAt = Date.parse(doc.updated_at)
    if (!Number.isFinite(serverUpdatedAt) || draft.savedAt > serverUpdatedAt) return draft

    clearDraft(uuid)
    return null
  }, [doc, uuid])

  const initialBlocks = recoveredDraft?.data ?? serverBlocks

  const editor = useCreateBlockNote(
    {
      initialContent: initialBlocks,
      dictionary: pt,
    },
    [uuid],
  )

  const persistBlocks = useCallback(
    async (blocks: Block[], version: number) => {
      const saved = await updateDocAsync(uuid, {
        blocknote_content: blocks as unknown as Json,
      })

      if (saved && draftVersionRef.current === version) clearDraft(uuid)
    },
    [updateDocAsync, uuid],
  )

  const updateHandler = useCallback(
    (blocks: Block[]) => {
      const version = draftVersionRef.current + 1
      draftVersionRef.current = version

      writeDraft(uuid, {
        savedAt: Date.now(),
        version,
        data: blocks,
      })

      delayedCallback(() => {
        void persistBlocks(blocks, version)
      })
    },
    [delayedCallback, persistBlocks, uuid],
  )

  useEffect(() => {
    const undoRedoAdapter = {
      undo: () => editor.undo(),
      redo: () => editor.redo(),
      canUndo: () => true,
      canRedo: () => true,
    }

    setUndoRedoInstance(undoRedoAdapter)
    return () => setUndoRedoInstance(null)
  }, [editor, setUndoRedoInstance])

  useEffect(() => {
    if (!recoveredDraft || recoveredForUuidRef.current === uuid) return

    recoveredForUuidRef.current = uuid
    draftVersionRef.current = recoveredDraft.version
    delayedCallback(() => {
      void persistBlocks(recoveredDraft.data, recoveredDraft.version)
    })
  }, [delayedCallback, persistBlocks, recoveredDraft, uuid])

  useEffect(() => {
    const flushPendingSave = () => flush()
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushPendingSave()
    }

    window.addEventListener("pagehide", flushPendingSave)
    window.addEventListener("beforeunload", flushPendingSave)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      flushPendingSave()
      window.removeEventListener("pagehide", flushPendingSave)
      window.removeEventListener("beforeunload", flushPendingSave)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [flush])

  return (
    <div className="relative mx-auto max-w-3xl px-4 pb-24 md:px-0">
      <BlockNoteView
        className="jv-blocknote"
        editor={editor}
        editable={!isLocked}
        formattingToolbar={false}
        onChange={() => updateHandler(editor.document)}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      >
        <FormattingToolbarController formattingToolbar={StableFormattingToolbar} />
      </BlockNoteView>
    </div>
  )
}
