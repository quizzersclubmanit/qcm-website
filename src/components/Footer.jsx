import { Container, Social, Contact, Map } from "./components"

const Footer = () => {
  return (
    <>
      <Map />
      <Container
        id="contacts"
        element="footer"
        className="poppins-regular sm:px-[3.5vmax] px-[2vmax] sm:pb-[3.5vmax] pb-[2vmax] sm:min-h-screen flex flex-col gap-5 items-center justify-between bg-black text-white"
      >
        <Contact />
        <Social />
      </Container>
    </>
  )
}

export default Footer
