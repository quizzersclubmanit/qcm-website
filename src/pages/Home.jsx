import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Map,
  MyglammPoster
} from "../components/components"

const Home = () => {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <MyglammPoster/>
      <Events />
      <Sponsors />
      <Map />
      <Footer />
    </main>
  )
}

export default Home
