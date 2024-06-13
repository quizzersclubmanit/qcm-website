import { Logo, Container } from "./components"

const SectionHead = ({ label = "QCM", className = "", outline = true }) => {
  return (
    <Container className={`flex gap-1 items-center ${className}`}>
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
