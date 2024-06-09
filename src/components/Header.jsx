import { Container, Nav, Modal, Logo } from "./components"
import { RxHamburgerMenu } from "react-icons/rx"
import { useState } from "react"

const Header = () => {
  const [showTabModal, setShowTabModal] = useState(false)

  return (
    <Container className="fixed z-10">
      <div className="flex py-1 justify-around items-center alatsi-regular text-white transparent-black rounded-lg">
        <Logo className="w-[7vmax] sm:w-[5vmax]" />
        <Nav hidden={true} />
        <RxHamburgerMenu
          className="block sm:hidden text-2xl"
          onClick={() => {
            setShowTabModal(true)
          }}
        />
        {showTabModal && (
          <Modal setShowModal={setShowTabModal}>
            <Nav />
          </Modal>
        )}
      </div>
    </Container>
  )
}

export default Header
