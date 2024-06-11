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
    <main>
      <Header />
      <Hero />
      <About />
      <Events />
      <div id="gallery" className="londrina-solid-regular"></div>
      <Sponsors />
      <Footer />
    </main>
  )
}

export default Home
