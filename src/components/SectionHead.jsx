import { Logo, Container } from "./components"

const SectionHead = ({ label = "QCM", className = "", outline = false }) => {
  return (
    <Container className={`flex items-center gap-2 ${className}`}>
      <Logo className="w-[9vmax] sm:w-[5vmax]" />
      <h1
        className={`sm:text-[5vmax] text-[6vmax] ${outline && "text-outline"}`}
      >
        {label}
      </h1>
    </Container>
  )
}

export default SectionHead
