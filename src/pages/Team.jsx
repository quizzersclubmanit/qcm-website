import { useState } from "react"
import { Container, SectionHead, Footer } from "../components/components"
import { team } from "../assets/qcmData.json"

const Team = () => {
  const [selectedYear, setSelectedYear] = useState("4th")

  const activeBtnStyles = {
    backgroundColor: "#2b7966",
    color: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  }

  return (
    <div
      style={{
        backgroundColor: "#0f3a2e",
        backgroundImage: "linear-gradient(180deg, #0f3a2e 0%, #2b7966 100%)",
      }}
    >
      <Container
        id="team-gallery"
        className="flex flex-col gap-5 items-center min-h-screen pb-8 px-2"
      >
        <SectionHead label="Team" className="text-white" logo />

        <div className="flex gap-4 mt-4 bg-white/20 p-2 rounded-full">
          <button
            className="px-6 py-2 rounded-full transition-all duration-300"
            style={selectedYear === "4th" ? activeBtnStyles : {}}
            onClick={() => setSelectedYear("4th")}
          >
            4th year
          </button>
          <button
            className="px-6 py-2 rounded-full transition-all duration-300"
            style={selectedYear === "3rd" ? activeBtnStyles : {}}
            onClick={() => setSelectedYear("3rd")}
          >
            3rd year
          </button>
        </div>

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mt-4 md:px-8 px-4">
          {team
            .filter((member) => member.year === selectedYear)
            .map((obj, index) => (
              <div
                key={index}
                className="flex flex-col bg-white/10 backdrop-blur-lg shadow-lg justify-start transition-all p-3 rounded-xl cursor-default text-white"
              >
                <img
                  src={obj.fileId || "/placeholder-avatar.png"}
                  alt="Member"
                  className="aspect-square h-40 object-contain rounded-lg mx-auto"
                  onError={(e) => {
                    e.target.src = "/placeholder-avatar.png"
                  }}
                />
                <div className="flex flex-col gap-1 items-center mt-3">
                  <a
                    className="uppercase text-md font-bold text-white hover:text-[#fe9c02] transition-colors"
                    href={obj.linkedIn}
                    target={obj.linkedIn ? "_blank" : "_parent"}
                  >
                    {obj.name}
                  </a>
                  <p className="text-[#fe9c02] text-xs">{obj.post}</p>
                  <p className="text-gray-300 text-xs">{obj.domain || ""}</p>
                </div>
              </div>
            ))}
        </div>
      </Container>
      <Footer />
    </div>
  )
}

export default Team
