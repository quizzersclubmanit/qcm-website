import "./pages.css"
import { Header, Footer } from "../components/components"
import { bulb } from "../assets/assets"

const Home = () => {
  return (
    <main>
      <Header/>

      <div id="home-hero" className="h-screen flex flex-col sm:flex-row items-center justify-evenly londrina-solid-regular">
        <div className="left sm:w-2/3 flex flex-col items-center justify-center text-white gap-3">
          <h1 className="sm:text-[9vmax] text-[7vmax]" style={{WebkitTextStrokeWidth: "3px", WebkitTextStrokeColor: "#00aded"}}>Quizzers' Club</h1>
          <h4 className="text-[5vmax]" style={{WebkitTextStrokeWidth: "2px", WebkitTextStrokeColor: "black"}}>NIT Bhopal</h4>
          <p className="sm:text-[1.8vmax] text-[2.5vmax]">
            Central India's <span className="text-yellow-400 sm:text-[3vmax] text-[3.5vmax]" style={{WebkitTextStrokeWidth: "1px", WebkitTextStrokeColor: "black"}}>Largest Quizzing Club</span>
          </p>
        </div>
        <div className="right sm:w-1/3 flex justify-center sm:items-center self-end">
          <img src={bulb} alt="Bulb" />
        </div>
      </div>

      <div id="home-about"></div>
      <div id="home-events"></div>
      <div id="home-gallery"></div>
      <Footer/>
    </main>
  )
}

export default Home