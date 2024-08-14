import { useState } from "react"
import {
  Container,
  Button,
  SectionHead,
  Footer
} from "../components/components"

const Team = () => {
  const team = Array(10).fill({
    year: 3, // other possible value is 4
    member: "Name",
    role: "Post or Designation",
    picture:
      "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200&d=identicon&r=PG"
  })

  const buttons = [
    {
      label: "Final Year",
      f: () => setYear(4)
    },
    {
      label: "Pre Final Year",
      f: () => setYear(3)
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
        <div className="flex justify-around sm:w-[50%] w-full items-center">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              label={btn.label}
              className="border bg-white bg-opacity-15 h-fit sm:text-lg text-sm py-1 sm:px-5 px-1 rounded-3xl hover:text-[#fe9c02] transition-all cursor-pointer"
              onClick={btn.f}
            />
          ))}
        </div>
        <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-10 mt-4">
          {team
            .filter((obj) => obj.year == year)
            .map((obj, index) => (
              <div
                className={`flex flex-col gap-2 items-center transition-all p-2 rounded text-sm cursor-default ${hoveredIndex == index && "hover:bg-gray-900"}`}
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={obj.picture}
                  style={{
                    borderRadius: "50%"
                  }}
                  alt="Member"
                  className="w-4/5"
                />
                <h3>{obj.member}</h3>
                <p className="text-center">{obj.role}</p>
              </div>
            ))}
        </div>
      </Container>
      <Footer />
    </>
  )
}

export default Team
