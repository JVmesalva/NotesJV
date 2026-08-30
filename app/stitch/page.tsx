import Image from "next/image"

// Visual-only public preview used by Google Stitch. No user data is loaded here.
export default function StitchPreviewPage() {
  return (
    <div className="min-h-screen bg-[#d5c6b9] text-[#33261f]">
      <header className="flex h-[86px] items-center justify-between bg-[#eadfd6] px-4 sm:px-6">
        <Image
          src="/assets/JV notes logo.svg"
          alt="JV Notes"
          width={150}
          height={42}
          priority
          className="h-auto w-[120px] object-contain sm:w-[140px]"
        />

        <div className="flex items-center gap-2 text-[13px] text-[#59483e]">
          <span className="inline-block h-4 w-4 rounded-full border border-[#9c8c80]" />
          <span>Conta</span>
        </div>
      </header>

      <div className="flex h-[42px] items-end gap-1 bg-[#eadfd6] px-2">
        <div className="flex h-[34px] min-w-[142px] items-center gap-2 rounded-t-[10px] border border-b-0 border-[#cfbfb2] bg-[#dfd1c6] px-3 text-[12px]">
          <span className="text-[#b77b45]">☆</span>
          <span>ANOTAÇÕES</span>
          <span className="ml-auto text-[#7d6d61]">×</span>
        </div>
        <span className="mb-2 px-3 text-xl font-light text-[#6e5d52]">+</span>
      </div>

      <nav className="flex h-[38px] items-center gap-8 border-b border-[#cfbfb2] bg-[#dfd1c6] px-6 text-[11px] sm:px-8">
        <span className="font-medium text-[#33261f]">PRINCIPAL</span>
        <span className="text-[#77685e]">AJUSTES DO JV NOTES</span>
      </nav>

      <main className="px-4 py-2 sm:px-8 md:px-16 lg:px-[16.5vw]">
        <section className="relative mx-auto min-h-[72vh] w-full rounded-[14px] bg-[#fbf7f2] px-6 py-7 shadow-[0_0_0_1px_rgba(85,60,45,0.03)] sm:px-8">
          <button
            type="button"
            aria-label="Copiar"
            className="absolute right-5 top-1 flex h-7 w-7 cursor-default items-center justify-center rounded-md bg-[#817a74] text-[15px] text-white"
          >
            ▣
          </button>

          <pre className="whitespace-pre-wrap font-mono text-[11px] leading-[1.75] text-[#3d3028] sm:text-[12px]">
{`LEITOS OBSTETRÍCIA (16 LEITOS)
OBST 1A - PACIENTE EXEMPLO - EQUIPE A (INTERNO)
OBST 2A - PACIENTE EXEMPLO - EQUIPE B (INTERNO)
OBST 2B - PACIENTE EXEMPLO - EQUIPE A (INTERNO)
OBST 3A - PACIENTE EXEMPLO - EQUIPE B (INTERNO)

LEITOS ALCON (17 LEITOS)
ALCON 09 - PACIENTE EXEMPLO - EQUIPE A (INTERNO)
ALCON 15 - PACIENTE EXEMPLO - EQUIPE B (INTERNO)`}
          </pre>
        </section>
      </main>
    </div>
  )
}
