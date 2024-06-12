import { bulb } from "../assets/assets"
import { organization } from "../assets/qcmData.json"
import { Container } from "./components"

const Hero = () => {
  return (
    <div id="hero" className="londrina-solid-regular">
      <Container className="h-screen flex flex-col sm:flex-row items-center justify-evenly">
        <div className="left w-full h-full my-[10vh] sm:my-0 sm:w-2/3 flex flex-col justify-center items-center text-white gap-5">
          <h1
            className="sm:text-[9vmax] text-[8vmax]"
            style={{
              WebkitTextStrokeWidth: "3px",
              WebkitTextStrokeColor: "#00aded"
            }}
          >
            {organization}
          </h1>
          <h4 className="text-[5vmax] text-outline">NIT Bhopal</h4>
          <p className="text-[2.5vmax] text-outline-thin">
            Central India's{" "}
            <span className="text-yellow-400 text-[3vmax]">
              Largest Quizzing Club
            </span>
          </p>
        </div>
        <div className="right sm:w-1/3 h-full w-full flex justify-center sm:items-center self-end">
          <img src={bulb} alt="Bulb" />
        </div>
      </Container>
    </div>
  )
}

export default Hero
