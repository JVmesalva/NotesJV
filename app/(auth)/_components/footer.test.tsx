import React from "react"
import { render, screen } from "@testing-library/react"
import Footer from "@/app/(auth)/_components/footer"

it("render without error", () => {
  render(<Footer />)

  expect(screen.getByText(/site pessoal de notas online/i)).toBeInTheDocument()
})
