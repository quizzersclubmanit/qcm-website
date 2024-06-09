import { bulb } from "../assets/assets"
import { org } from "../assets/qcmData.json"
import { Container } from "./components"

const Hero = () => {
  return (
    <div id="hero" className="londrina-solid-regular">
      <Container className="sm:h-screen h-[75vh] flex flex-col sm:flex-row items-center justify-evenly">
        <div className="left w-full h-full my-[10vh] sm:my-0 sm:w-2/3 flex flex-col items-center justify-center text-white gap-3">
          <h1
            className="sm:text-[9vmax] text-[8vmax]"
            style={{
              WebkitTextStrokeWidth: "3px",
              WebkitTextStrokeColor: "#00aded"
            }}
          >
            {org}
          </h1>
          <h4
            className="text-[5vmax]"
            style={{
              WebkitTextStrokeWidth: "2px",
              WebkitTextStrokeColor: "black"
            }}
          >
            NIT Bhopal
          </h4>
          <p
            className="text-[2.5vmax]"
            style={{
              WebkitTextStrokeWidth: "1px",
              WebkitTextStrokeColor: "black"
            }}
          >
            Central India's{" "}
            <span className="text-yellow-400 text-[3vmax]">
              Largest Quizzing Club
            </span>
          </p>
        </div>
        <div className="right sm:w-1/3 w-full flex justify-center sm:items-center self-end">
          <img src={bulb} alt="Bulb" />
        </div>
      </Container>
    </div>
  )
}

export default Hero
