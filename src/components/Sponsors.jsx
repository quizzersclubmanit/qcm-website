import { sponsors } from "../assets/qcmData.json"
import { Container, SectionHead } from "./components"

const Sponsors = () => {
  return (
    <Container
      id="sponsors"
      className="w-screen sm:p-[3.5vmax] p-[2vmax] sm:min-h-screen min-h-[70vh] flex flex-col gap-x-8"
    >
      <SectionHead label="Our Sponsors" className="mx-auto" />
      {sponsors.map((sponser, index) => (
        <>
          <p 
            key={index}
            className="text-3xl p-1 text-center font-semibold border-2 bg-[#00ABE4] text-[#fff]"
          >
            {sponser.category}
          </p>
          <div className="flex justify-evenly items-center flex-wrap">
            {sponser?.brands.map((sponsor, index) => (
              <a
                key={index}
                href={sponsor.website}
                target="_blank"
                className="h-[20vh] mx-4 sm:mx-0 flex justify-center items-center border-2 border-black p-1 my-8 shadow-[10px_10px_18px_-1px_rgba(88,163,232,1)] hover:scale-110 transition-all duration-300"
              >
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.brand} logo`}
                  className="max-h-full "
                />
              </a>
            ))}
          </div>
        </>
      ))}
    </Container>
  )
}

export default Sponsors
