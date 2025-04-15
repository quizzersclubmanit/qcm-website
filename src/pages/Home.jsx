import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Map,
  FacultyMessage
} from "../components/components"

const Home = () => {
  return (
    <main>
      <Header />
      <Hero />
      <About />
      <Events />
      <Sponsors />
      <FacultyMessage/>
      <Map />
      <Footer />
    </main>
  )
}

export default Home
