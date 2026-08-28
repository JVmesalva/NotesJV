import Image from "next/image"
import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <main className="w-full max-w-[420px] rounded-[18px] border border-border bg-background p-6 shadow-sm sm:p-7">
          <div className="mb-7 flex items-center">
            <Image
              src="/assets/JV notes logo.svg"
              alt="JV Notes"
              width={160}
              height={42}
              priority
              className="h-auto w-[150px] object-contain"
            />
          </div>

          {children}
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-3 left-4 right-4 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        Site pessoal de notas online · Uso educacional
      </div>
    </div>
  )
}
