import "./pages.css"
import { Header, Footer, Hero, About, Events, Container, SectionHead} from "../components/components"

const Home = () => {
  return (
    <main>
      <Header/>
      <Hero/>
      <About/>
      <Events/>
      <div id="gallery"></div>
      <Footer/>
    </main>
  )
}

export default Home