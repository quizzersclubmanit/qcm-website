import { Container, Social, Contact, Map } from "./components"

const Footer = () => {
  return (
    <Container
      id="contacts"
      element="footer"
      className="poppins-regular sm:px-[3.5vmax] px-[2vmax] sm:pb-[3.5vmax] pb-[2vmax] sm:min-h-screen min-h-[75vh] flex flex-col gap-5 items-center sm:justify-between justify-center bg-black text-white"
    >
      <Map />
      <Contact />
      <Social />
    </Container>
  )
}

export default Footer
