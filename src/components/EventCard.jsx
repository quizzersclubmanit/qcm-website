import { Button, Container } from "./components"
import { useNavigate } from "react-router-dom"

const EventCard = ({ dets = {} }) => {
  const navigate = useNavigate()

  return (
    <Container className="poppins-bold flex justify-center">
      <div
        className="flex flex-col items-start p-8 gap-2 w-[80vw] md:w-[40vw] xl:w-[25vw] bg-white"
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
        <h4 className="text-xl uppercase overflow-x-hidden whitespace-nowrap overflow-ellipsis w-full">
          {dets.title}
        </h4>
        <p className="w-full continue-text">{dets.desc}</p>
        <Button
          label="Read More"
          className="text-yellow-400 hover:text-[#FCA311] p-2 rounded bg-[#14213D] text-lg"
          onClick={() => {
            navigate(`events/${dets.id}`)
          }}
        />
      </div>
    </Container>
  )
}

export default EventCard
