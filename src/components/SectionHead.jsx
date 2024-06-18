import { Logo, Container } from "./components"

const SectionHead = ({
  label = "QCM",
  className = "",
  outline = false,
  logo = false
}) => {
  return (
    <Container className={`flex items-center gap-2 ${className}`}>
      {logo && <Logo className="w-[9vmax] sm:w-[5vmax]" />}
      <h3
        className={`sm:text-[5vmax] text-[6vmax] ${outline && "text-outline"}`}
      >
        {label}
      </h3>
    </Container>
  )
}

export default SectionHead
