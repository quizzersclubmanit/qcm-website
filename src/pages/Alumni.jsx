import { useState } from "react"
import { Container, SectionHead, Footer, Header } from "../components/components"
import SEO from "../components/SEO.jsx"
import { alumni } from "../assets/qcmData.json"

const Alumni = () => {
  const [selectedYear, setSelectedYear] = useState("2026")

  const activeBtnStyles = {
    backgroundColor: "#2b7966",
    color: "white",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  }

  const alumniList = alumni || []
  const currentAlumni = alumniList.filter((member) => String(member.year) === String(selectedYear))

  return (
    <div
      id="main"
      style={{
        backgroundColor: "#0f3a2e",
        backgroundImage: "linear-gradient(180deg, #0f3a2e 0%, #2b7966 100%)",
      }}
    >
      <SEO
        title="Our Alumni | Quizzers' Club NIT Bhopal (QCM MANIT)"
        description="Meet the esteemed alumni of Quizzers' Club NIT Bhopal (QCM MANIT) — our seniors who built and led the quizzing culture."
        path="/alumni"
        crumbs={[{ name: "Alumni", item: "https://www.quizzersclub.com/alumni" }]}
      />
      <Container
        id="alumni-gallery"
        className="flex flex-col gap-5 items-center min-h-screen pb-8 px-2 pt-16 md:pt-[16vh]"
      >
        <Header />
        <h1 className="poppins-bold text-white text-[5vmax] md:text-[3vmax] text-center leading-tight">
          Our Alumni — Quizzers&apos; Club NIT Bhopal
        </h1>
        <div className="md:hidden">
          <SectionHead label="Alumni" className="text-white" logo />
        </div>

        <div className="flex gap-4 mt-4 bg-white/20 p-2 rounded-full">
          {["2026", "2025", "2024"].map((year) => (
            <button
              key={year}
              className="px-6 py-2 rounded-full transition-all duration-300 text-white"
              style={selectedYear === year ? activeBtnStyles : {}}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mt-4 md:px-8 px-4 w-full max-w-6xl">
          {currentAlumni.map((obj, index) => (
            <div
              key={index}
              className="flex flex-col bg-white/10 backdrop-blur-lg shadow-lg justify-start transition-all p-3 rounded-xl cursor-default text-white"
            >
              <img
                src={obj.fileId || "/placeholder-avatar.png"}
                alt={`${obj.name || "QCM alumnus"} — Quizzers' Club NIT Bhopal`}
                className="aspect-square h-40 object-cover rounded-lg mx-auto bg-white/5"
                width="160"
                height="160"
                loading={index < 4 ? "eager" : "lazy"}
                fetchPriority={index < 4 ? "high" : "auto"}
                decoding="async"
                onError={(e) => {
                  e.target.src = "/placeholder-avatar.png"
                }}
              />
              <div className="flex flex-col gap-1 items-center mt-3">
                {obj.linkedIn ? (
                  <a
                    className="uppercase text-md font-bold text-white hover:text-[#fe9c02] transition-colors text-center"
                    href={obj.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {obj.name}
                  </a>
                ) : (
                  <span className="uppercase text-md font-bold text-white text-center">
                    {obj.name}
                  </span>
                )}
              </div>
            </div>
          ))}

          {currentAlumni.length === 0 && (
            <div className="col-span-full py-16 text-center text-white/80">
              <p className="text-lg">No alumni records found for {selectedYear} yet.</p>
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </div>
  )
}

export default Alumni
