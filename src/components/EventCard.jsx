import { Button } from "./components"
import { useNavigate } from "react-router-dom"

const EventCard = ({ dets = {} }) => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-start bg-white p-8 gap-2 rounded-lg w-[80vw] md:w-[40vw] xl:w-[25vw]">
        <div className="flex justify-center w-full h-[32vh]">
          <img src={dets.cover} alt="Event" />
        </div>
        <h4 className="text-xl uppercase overflow-x-hidden whitespace-nowrap overflow-ellipsis w-full">
          {dets.title}
        </h4>
        <p className="w-full continue-text">{dets.desc}</p>
        <Button
          label="Read More"
          className="theme-blue text-yellow-400 p-2 rounded hover:bg-blue-900 text-lg"
          style={{
            WebkitTextStrokeWidth: "0.5px",
            WebkitTextStrokeColor: "black"
          }}
          onClick={() => {
            navigate(`events/${dets.id}`)
          }}
        />
      </div>
    </div>
  )
}

export default EventCard
