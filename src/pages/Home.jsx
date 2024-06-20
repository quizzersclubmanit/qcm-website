import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Gallery,
  Container
} from "../components/components"

const Home = () => {
  return (
    <main>
      <Header />
      <Hero />
      {/* <Container className="h-screen bg-white"></Container> */}
      <About />
      {/* <Container className="h-screen bg-white"></Container> */}
      <Events />
      {/* <Container className="h-screen bg-white"></Container> */}
      <Gallery />
      {/* <Container className="h-screen bg-white"></Container> */}
      <Sponsors />
      {/* <Container className="h-screen bg-white"></Container> */}
      <Footer />
    </main>
  )
}

export default Home
