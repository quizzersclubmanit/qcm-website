import { Container } from "./components"
import { about } from "../assets/qcmData.json"
import { manit, team } from "../assets/assets"

const About = () => {
  const data = [
    {
      content: about.manit,
      imgSrc: manit,
      reverse: false
    },
    {
      content: about.qcm,
      imgSrc: team,
      reverse: true
    }
  ]

  return (
    <Container
      id="about"
      className="md:w-11/12 mx-auto flex flex-col gap-3 my-8"
    >
      {data.map((obj, index) => (
        <div
          key={index}
          className={`p-4 text-justify md:text-base text-sm flex gap-3 items-center justify-between ${obj.reverse && "flex-row-reverse"}`}
        >
          <p
            className="md:w-1/2 leading-relaxed p-8 rounded-xl text-white transition-all duration-300"
            style={{
              backgroundColor: "#0f3a2e",
              backgroundImage:
                "linear-gradient(180deg, #0f3a2e 0%, #2b7966 100%)"
            }}
          >
            {obj.content}
          </p>
          <img
            src={obj.imgSrc}
            alt="about"
            className="object-contain rounded-xl hidden md:inline-block w-[40%]"
          />
        </div>
      ))}
    </Container>
  )
}

export default About
