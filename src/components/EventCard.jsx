import { Button, Container } from "./components"
import { useNavigate } from "react-router-dom"

const EventCard = ({ dets = {} }) => {
  const navigate = useNavigate()

  return (
    <Container className="poppins-bold flex justify-center">
      <div
        className="flex flex-col items-start p-8 gap-2 w-[90vw] md:w-[40vw] xl:w-[28vw] bg-white"
        style={{
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px"
        }}
      >
        <div className="flex justify-center w-full">
          <img src={dets.cover} alt="Event" className="aspect-square" />
        </div>
        <h4 className="sm:text-xl uppercase w-full">{dets.title}</h4>
        <p className="w-full sm:text-base text-sm continue-text">{dets.desc}</p>
        <Button
          label="Read More"
          className="text-yellow-400 hover:text-[#FCA311] p-2 rounded bg-[#14213D] sm:text-lg text-sm"
          onClick={() => {
            navigate(`events/${dets.id}`)
          }}
        />
      </div>
    </Container>
  )
}

export default EventCard
