import useDebounceCallback from "@/hook/use-debounce-callback"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"
import { EditorCore } from "@/components/editor/core/editor"
import EditorJS, { type OutputData } from "@editorjs/editorjs"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { Json } from "@/lib/supabase/database.types"
// @ts-ignore
import Undo from "editorjs-undo"

type LocalDraft = {
  savedAt: number
  version: number
  data: OutputData
}

const draftKey = (uuid: string) => `jv-notes:draft:${uuid}`

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
    // The database save still runs even if the browser storage quota is unavailable.
  }
}

const clearDraft = (uuid: string) => {
  try {
    window.localStorage.removeItem(draftKey(uuid))
  } catch {
    // Ignore browser storage errors.
  }
}

export default function Editor() {
  const params = useParams()
  const uuid = params.uuid as string
  const editorRef = useRef<EditorJS | null>(null)
  const draftVersionRef = useRef(0)
  const recoveredForUuidRef = useRef<string | null>(null)

  const { delayedCallback, flush } = useDebounceCallback(800)
  const { updateDocAsync, doc, loadingDoc, isLocked, setUndoRedoInstance } = useDocStore()

  const serverData = doc?.content ? (doc.content as unknown as OutputData) : undefined

  const recoveredDraft = useMemo(() => {
    if (loadingDoc || !doc) return null

    const draft = readDraft(uuid)
    if (!draft) return null

    const serverUpdatedAt = Date.parse(doc.updated_at)
    if (!Number.isFinite(serverUpdatedAt) || draft.savedAt > serverUpdatedAt) return draft

    clearDraft(uuid)
    return null
  }, [doc, loadingDoc, uuid])

  const init = recoveredDraft?.data ?? serverData

  const persistOutput = useCallback(
    async (output: OutputData, version: number) => {
      const saved = await updateDocAsync(uuid, { content: output as unknown as Json })
      if (saved && draftVersionRef.current === version) clearDraft(uuid)
    },
    [updateDocAsync, uuid],
  )

  const updateHandler = useCallback(
    (output?: OutputData) => {
      if (!output) return

      const version = draftVersionRef.current + 1
      draftVersionRef.current = version

      writeDraft(uuid, {
        savedAt: Date.now(),
        version,
        data: output,
      })

      delayedCallback(() => {
        void persistOutput(output, version)
      })
    },
    [delayedCallback, persistOutput, uuid],
  )

  const readyHandler = useCallback(
    (editor: EditorJS | null) => {
      if (!editor) return

      const config = { debounceTimer: 500 }
      const undo = new Undo({ editor, config })
      if (init) undo.initialize(init)

      editorRef.current = editor
      setUndoRedoInstance(undo)
    },
    [setUndoRedoInstance, init],
  )

  useEffect(() => {
    if (!recoveredDraft || recoveredForUuidRef.current === uuid) return

    recoveredForUuidRef.current = uuid
    draftVersionRef.current = Math.max(draftVersionRef.current, recoveredDraft.version)
    delayedCallback(() => {
      void persistOutput(recoveredDraft.data, recoveredDraft.version)
    })
  }, [delayedCallback, persistOutput, recoveredDraft, uuid])

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

  if (loadingDoc) return null

  return (
    <div className="relative mx-auto max-w-3xl px-4 md:px-0">
      <EditorCore
        onReadyHandler={readyHandler}
        onSaveHandler={updateHandler}
        data={init}
        placeholder="Pressione Tab ou clique em + para inserir um bloco..."
        readOnly={isLocked}
      />
    </div>
  )
}
