import { Button } from "@/components/ui/button"
import { HomeIcon, PlusCircleIcon, SearchIcon, Trash2Icon } from "lucide-react"
import NewDocDialog from "./dialog/new-doc-dialog"
import SearchDialog from "./dialog/search-dialog"
import TrashDialog from "./dialog/trash-dialog"
import { useRouter } from "next/navigation"
import { useLayoutStore } from "@/store/use-layout-store"

export default function SidebarMenu() {
  const { triggerMinimize } = useLayoutStore()
  const router = useRouter()

  const navigateHandler = (path: "doc") => {
    triggerMinimize(path)
    router.push(`/${path}`)
  }

  return (
    <div className="flex flex-col pb-3">
      <SearchDialog>
        <Button
          onClick={e => {
            e.stopPropagation()
          }}
          variant="ghost"
          className="h-8 justify-start px-3 font-normal text-primary/70 hover:bg-primary/5"
        >
          <SearchIcon className="mr-3 h-4 w-4" />
          Pesquisar
        </Button>
      </SearchDialog>

      <TrashDialog>
        <Button
          variant="ghost"
          className="h-8 justify-start px-3 font-normal text-primary/70 hover:bg-primary/5"
        >
          <Trash2Icon className="mr-3 h-4 w-4" />
          Lixeira
        </Button>
      </TrashDialog>

      <Button
        variant="ghost"
        className="h-8 justify-start px-3 font-normal text-primary/70 hover:bg-primary/5"
        onClick={() => navigateHandler("doc")}
      >
        <HomeIcon className="mr-3 h-4 w-4" />
        Início
      </Button>

      <NewDocDialog>
        <Button
          variant="ghost"
          className="h-8 justify-start px-3 font-normal text-primary/70 hover:bg-primary/5"
        >
          <PlusCircleIcon className="mr-3 h-4 w-4" />
          Nova página
        </Button>
      </NewDocDialog>
    </div>
  )
}
