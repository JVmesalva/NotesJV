import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError } from "@/lib/toast"
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js"
import { create } from "zustand"

type Page = Database["public"]["Tables"]["pages"]["Row"]

export type EditorFormat = "standard" | "notion"

type Status = "start" | "success" | "failed" | null

type EditablePageFields = Pick<
  Page,
  | "blocknote_content"
  | "content"
  | "description"
  | "editor_format"
  | "emoji"
  | "image_url"
  | "title"
>

type DocState = {
  saveStatus: Status
  failedSaveData: Partial<EditablePageFields>
  loadingDoc: boolean
  doc: Page | null
  isLocked: boolean
  undoRedoInstance: any
}

type DocAction = {
  setSaveStatus(status: Status): void
  getDocAsync(uuid: string): Promise<{ uuid: string; parent_uuid: string | null } | void>
  updateDocAsync(uuid: string, doc: Partial<EditablePageFields>): Promise<boolean>
  setEditorFormat(format: EditorFormat): Promise<boolean>
  docRealtimeHandler(opt: {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`
    doc: Page
    old: { id?: number }
  }): void
  _updateDoc(doc: Page): void
  _deleteDoc(id?: number): void
  toggleLock: () => void
  setUndoRedoInstance: (undoRedoInstance: any) => void
}

const initialState: DocState = {
  saveStatus: null,
  loadingDoc: true,
  doc: null,
  failedSaveData: {},
  isLocked: false,
  undoRedoInstance: null,
}

export const useDocStore = create<DocState & DocAction>()((set, get) => ({
  ...initialState,
  setUndoRedoInstance(undoRedoInstance) {
    set({ undoRedoInstance })
  },
  async setEditorFormat(format) {
    const oldDoc = get().doc
    if (!oldDoc) return false
    if (oldDoc.editor_format === format) return true

    const saved = await get().updateDocAsync(oldDoc.uuid, { editor_format: format })
    if (saved) set({ undoRedoInstance: null })
    return saved
  },
  async toggleLock() {
    const oldDoc = get().doc
    if (!oldDoc) return

    try {
      const { error } = await client
        .from("pages")
        .update({
          is_locked: !oldDoc.is_locked,
        })
        .eq("uuid", oldDoc.uuid)

      if (error) throw new Error(error.message)
      set({
        doc: { ...oldDoc, is_locked: !oldDoc.is_locked },
        isLocked: !oldDoc.is_locked,
      })
    } catch (error) {
      toastError({
        title: "Lock failed",
        description:
          "Something went wrong. Please check your internet connection & try again.",
      })
    }
  },
  setSaveStatus(status) {
    set({ saveStatus: status })
  },
  docRealtimeHandler({ eventType, doc, old }) {
    if (eventType === "DELETE") return get()._deleteDoc(old.id)
    if (eventType === "UPDATE") return get()._updateDoc(doc)
  },
  _deleteDoc(id) {
    const oldDoc = get().doc
    if (oldDoc && id && oldDoc.id === id) {
      set({ ...initialState })
    }
  },
  _updateDoc(doc) {
    const oldDoc = get().doc
    if (!oldDoc || oldDoc.uuid !== doc.uuid) return

    console.log("saved to db =>", doc)
    set({ doc })
  },
  async getDocAsync(uuid) {
    set({ ...initialState })

    try {
      const { data, error } = await client
        .from("pages")
        .select("*")
        .eq("uuid", uuid)
        .single()

      if (error) throw new Error(error.message)

      set({ loadingDoc: false, doc: data, isLocked: !!data.is_locked })
      return { uuid: data.uuid, parent_uuid: data.parent_uuid }
    } catch (error) {
      toastError({
        description: "Something went wrong. Broken link or poor internet connection.",
      })
    }
  },

  async updateDocAsync(uuid, doc) {
    try {
      set({
        saveStatus: "start",
        doc: {
          ...get().doc,
          ...(doc as Page),
        },
      })

      const { error } = await client
        .from("pages")
        .update({
          ...get().failedSaveData,
          ...doc,
        })
        .eq("uuid", uuid)
        .select("*")
        .single()

      if (error) throw new Error(error.message)

      set({
        loadingDoc: false,
        saveStatus: "success",
        failedSaveData: {},
      })
      return true
    } catch (error) {
      set({
        saveStatus: "failed",
        failedSaveData: { ...get().failedSaveData, ...doc },
      })
      toastError({
        title: "Save failed",
        description:
          "Something went wrong. Please check your internet connection & try again.",
      })
      return false
    }
  },
}))
