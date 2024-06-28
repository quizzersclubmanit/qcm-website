import { Logo, Container } from "./components"

const SectionHead = ({
  label = "QCM",
  className = "",
  outline = false,
  logo = false
}) => {
  return (
    <Container
      className={`londrina-solid-regular flex items-center gap-2 ${className}`}
    >
      {logo && <Logo className="w-[9vmax] md:w-[5vmax] sm:w-[7vmax]" />}
      <h3
        className={`sm:text-[5vmax] text-[6vmax] ${outline && "text-outline"}`}
      >
        {label}
      </h3>
    </Container>
  )
}

export default SectionHead
