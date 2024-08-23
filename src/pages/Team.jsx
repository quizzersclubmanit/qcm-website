import { useState } from "react"
import {
  Container,
  Button,
  SectionHead,
  Footer
} from "../components/components"
import { team } from "../assets/qcmData.json"
import storeService from "../api/store.service"
import env from "../../constants"

const Team = () => {
  const [year, setYear] = useState(4)
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

  return (
    <>
      <Container
        id="team-gallery"
        className="bg-[#fdfef9] flex flex-col gap-5 items-center min-h-screen pb-8 px-2"
      >
        <SectionHead label="Team" className="text-black" logo />
        <div className="flex sm:justify-around justify-between sm:w-[50%] w-full items-center">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              label={btn.label}
              className={`border-2 border-black bg-opacity-15 h-fit sm:text-lg text-sm py-1 sm:px-5 px-1 rounded-3xl transition-all cursor-pointer hover:text-[#fe9c02] ${(year - index) % 2 == 0 ? "text-[#fe9c02]" : "text-black"}`}
              onClick={btn.f}
            />
          ))}
        </div>
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-4 md:px-[15vw] px-[10vw]">
          {team[`${year}`].map((obj, index) => (
            <div
              key={index}
              className="flex flex-col bg-white shadow justify-between transition-all p-4 rounded cursor-default min-h-[45vh] md:text-sm text-xs font-bold"
            >
              <img
                src={storeService.fetchFilePreview({
                  fileId: obj.fileId,
                  bucketId: year == 3 ? env.preFinalYearId : env.finalYearId
                })}
                alt="Member"
                className="aspect-square h-3/4 object-contain"
              />
              <div className="flex flex-col gap-1 items-center">
                <a
                  className="uppercase text-blue-800"
                  href={obj.linkedIn}
                  target={obj.linkedIn ? "_blank" : "_parent"}
                >
                  {obj.name}
                </a>
                <p className="text-[#fe9c02]">{obj.post}</p>
                <p className="text-[#fe9c02]">{obj.domain || ""}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  )
}

export default Team
