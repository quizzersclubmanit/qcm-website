import {Button} from "./components"

const EventCard = ({dets={}}) => {
  return (
    <div className="flex justify-center">
    <div className="flex flex-col bg-white items-start p-8 gap-2 rounded-lg">
        <img src={dets.image} className="rounded-lg" alt="Event" />
        <h4 className="text-xl uppercase">{dets.title}</h4>
        <p>{dets.desc}</p>
        <Button label="Read More" className="theme-blue text-yellow-400 p-2 rounded hover:bg-blue-900 text-lg" style={{WebkitTextStrokeWidth: "0.5px", WebkitTextStrokeColor: "black"}} />
    </div>
    </div>
  )
}

export default EventCard