import { useState } from "react"
import {
  Container,
  Button,
  SectionHead,
  Footer
} from "../components/components"
import { team } from "../assets/qcmData.json"

const Team = () => {
  const buttons = [
    {
      label: "Pre Final Year",
      f: () => setYear(3)
    },
    {
      label: "Final Year",
      f: () => setYear(4)
    }
  ]

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [year, setYear] = useState(3)

  return (
    <>
      <Container
        id="team-gallery"
        className="text-white flex flex-col gap-5 items-center min-h-screen pb-8 px-2"
        style={{
          borderBottom: "1px solid white"
        }}
      >
        <SectionHead label="Team" />
        <div className="flex justify-around sm:w-[50%] w-full items-center overflow-y-hidden">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              label={btn.label}
              className={`border bg-white bg-opacity-15 h-fit sm:text-lg text-sm py-1 sm:px-5 px-1 rounded-3xl transition-all cursor-pointer hover:scale-105 ${index + 3 == year && "text-[#fe9c02]"}`}
              onClick={btn.f}
            />
          ))}
        </div>
        <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-10 mt-4">
          {team[`${year}`].map((obj, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 items-center justify-center transition-all p-2 rounded text-sm cursor-default h-[45vh] ${hoveredIndex == index && "hover:bg-gray-900"}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img src={obj.image} alt="Member" className="h-3/4 rounded" />
              <h3 className="font-bold uppercase">{obj.name}</h3>
              <p className="text-center text-yellow-400">{obj.post}</p>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  )
}

export default Team
