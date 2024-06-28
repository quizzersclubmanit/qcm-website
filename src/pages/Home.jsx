import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Container
} from "../components/components"

const Home = () => {
  return (
    <main className="alatsi-regular">
      <Header />
      <Hero />
      {/* <Container className="h-screen bg-white"></Container> */}
      <About />
      {/* <Container className="h-screen bg-white"></Container> */}
      <Events />
      {/* <Container className="h-screen bg-white"></Container> */}
      <Sponsors />
      {/* <Container className="h-screen bg-white"></Container> */}
      <Footer />
    </main>
  )
}

export default Home
