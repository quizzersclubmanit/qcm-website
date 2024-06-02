import { Outlet } from "react-router-dom"
import {Container, Header, Footer} from "./components/components"

const Layout = () => {
  return (
    <Container>
      <Header/>
      <Outlet/>
      <Footer/>
    </Container>
  )
}

export default Layout