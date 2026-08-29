"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocStore } from "@/store/use-doc-store"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { useEffectOnce } from "usehooks-ts"
import Action from "./_components/action"
import Cover from "./_components/cover"
import Title from "./_components/title"
import Deleted from "./_components/deleted"
import Locked from "./_components/locked"

const Editor = dynamic(() => import("./_components/editor"), {
  ssr: false,
})

const BlockNoteEditor = dynamic(() => import("./_components/blocknote-editor"), {
  ssr: false,
})

export default function DocDetailPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const { doc, getDocAsync, loadingDoc } = useDocStore()

  useEffectOnce(() => {
    getDocAsync(uuid)
  })

  const editorFormat = doc?.editor_format === "notion" ? "notion" : "standard"

  return (
    <ScrollArea className="h-[calc(100vh-48px)]">
      <Locked />
      <Deleted />

      <Cover />
      <Action />
      <Title />
      {!loadingDoc && doc &&
        (editorFormat === "notion" ? <BlockNoteEditor /> : <Editor />)}
    </ScrollArea>
  )
}
