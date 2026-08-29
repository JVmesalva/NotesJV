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
  type ComponentProps,
  useBlockNoteEditor,
  useComponentsContext,
  useCreateBlockNote,
  useEditorState,
} from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { type Json } from "@/lib/supabase/database.types"
import { useDocStore } from "@/store/use-doc-store"
import { useTheme } from "next-themes"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef } from "react"

type LocalDraft = {
  savedAt: number
  version: number
  data: Block[]
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

const StableBlockTypeSelect = () => {
  const Components = useComponentsContext()!
  const editor = useBlockNoteEditor()
  const lastTextSelectionRef = useRef<Block[]>([])

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

  // Opening the shadcn select can temporarily move focus away from the editor.
  // Keep the blocks that were selected before that focus change so the type
  // conversion still applies to the intended range.
  const selectedBlocks =
    selectionState.hasTextSelection || lastTextSelectionRef.current.length === 0
      ? (selectionState.blocks as Block[])
      : lastTextSelectionRef.current
  const firstSelectedBlock = selectedBlocks[0]

  if (!firstSelectedBlock || !editor.isEditable) return null

  const selectItems: ComponentProps["FormattingToolbar"]["Select"]["items"] =
    blockTypeSelectItems(editor.dictionary).map((item) => {
      const Icon = item.icon
      const firstBlockProps = firstSelectedBlock.props as Record<string, unknown>
      const typesMatch = item.type === firstSelectedBlock.type
      const propsMatch = Object.entries(item.props || {}).every(
        ([propName, propValue]) => firstBlockProps[propName] === propValue,
      )

      return {
        text: item.name,
        icon: <Icon size={16} />,
        isSelected: typesMatch && propsMatch,
        onClick: () => {
          const scrollX = window.scrollX
          const scrollY = window.scrollY
          const blocksToUpdate = [...selectedBlocks]

          // Do not call editor.focus() here. BlockNote's default selector does,
          // which can collapse a multi-block selection and scroll it into view.
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

          // Some browsers restore focus after the select closes. Preserve the
          // viewport across that asynchronous focus handoff as well.
          requestAnimationFrame(() => {
            window.scrollTo(scrollX, scrollY)
            requestAnimationFrame(() => window.scrollTo(scrollX, scrollY))
          })
        },
      }
    })

  if (!selectItems.some((item) => item.isSelected)) return null

  return <Components.FormattingToolbar.Select className="bn-select" items={selectItems} />
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
