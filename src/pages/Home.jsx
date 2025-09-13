import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Map,
  GreetingPoster
} from "../components/components"

const Home = () => {
  return (
    <main>
      <Header />
      <GreetingPoster />
      <Hero />
      <About />
      <Events />
      <Sponsors />
      <Map />
      <Footer />
    </main>
  )
}

export default Home
