import { useState } from "react"
import { Container, Logo, Button } from "../components/components"

const Team = () => {
  const team = Array(10).fill({
    year: 3, // other possible value is 4
    member: "LOREM IPSUM",
    role: "Post or Designation",
    picture:
      "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200&d=identicon&r=PG"
  })
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [year, setYear] = useState(3)

  return (
    <Container
      id="team-gallery"
      className="text-white flex flex-col items-center md:p-[3vmax] p-[2vmax] min-h-screen"
    >
      {/* <Logo className="w-[8vmax] md:w-[5vmax] sm:w-[7vmax] mb-9" /> */}
      <div className="flex justify-around w-full items-center glass-box">
        <Button
          label="Pre Final Year"
          className="border border-yellow-300 h-fit sm:text-xl p-2 rounded-xl hover:bg-gray-900 transition-all cursor-pointer"
          onClick={() => {
            setYear(3)
          }}
        />
        <h2 className="text-[3vmax] font-bold">Team</h2>
        <Button
          label="Final Year"
          className="border border-yellow-300 h-fit sm:text-xl p-2 rounded-xl hover:bg-gray-900 transition-all cursor-pointer"
          onClick={() => {
            setYear(4)
          }}
        />
      </div>
      <div className="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-1 gap-10 mt-10">
        {team
          .filter((obj) => obj.year == year)
          .map((obj, index) => (
            <div
              className={`flex flex-col items-center transition-all p-2 rounded ${hoveredIndex == index && "hover:bg-gray-900"}`}
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
              />
              <h3>{obj.member}</h3>
              <p>{obj.role}</p>
            </div>
          ))}
      </div>
    </Container>
  )
}

export default Team
