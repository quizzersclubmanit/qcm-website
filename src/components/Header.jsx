import { useNavigate } from "react-router-dom"
import {Container, Nav, Modal, Logo} from "./components"
import { RxHamburgerMenu } from "react-icons/rx"
import { useState } from "react"

const Header = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  return (
    <Container className="fixed z-10">
      <div className="flex py-1 justify-around items-center alatsi-regular text-white transparent-black rounded-lg">
        <Logo/>
        <Nav hidden={true}/>
        <RxHamburgerMenu className="block sm:hidden text-2xl" onClick={()=>{
          setShowModal(true)
        }} />
        {
          showModal&&
          <Modal setShowModal={setShowModal}>
            <Nav/>
          </Modal>
        }
      </div>
    </Container>
  )
}

export default Header