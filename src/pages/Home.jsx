import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Gallery
} from "../components/components"

const Home = () => {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Events />
      <Gallery />
      <Sponsors />
      <Footer />
    </main>
  )
}

export default Home
