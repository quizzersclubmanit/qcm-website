import footerBg from "../assets/manit.jpg"
import { Container, Social, Contact } from "./components"

const Footer = () => {
  return (
    <Container
      id="contacts"
      element="footer"
      className="
    relative
    min-h-[40vh]
    w-full
    max-w-full
    flex flex-col
    justify-between
    text-sm
    text-white
    poppins-regular
      "
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${footerBg})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col justify-between px-6 sm:px-12">

        {/* Content */}

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-between h-full px-6">
          <Contact />
          <Social />
        </div>

      </div>
    </Container>
  )
}

export default Footer
