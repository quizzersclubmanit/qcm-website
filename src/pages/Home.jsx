import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Map,
  FAQs
} from "../components/components"

const Home = () => {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Events />
      <Sponsors />
      <FAQs />
      <Map />
      <Footer />
    </main>
  )
}

export default Home
