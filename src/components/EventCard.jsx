import {Button} from "./components"
import { navigateTo } from "../utils/utils"

const EventCard = ({dets={}}) => {
  return (
    <div className="flex justify-center">
    <div className="flex flex-col items-start bg-white p-8 gap-2 rounded-lg w-[80vw] md:w-[40vw] xl:w-[25vw]">
        <div className="flex justify-center w-full">
          <img src={dets.image} alt="Event" />
        </div>
        <h4 className="text-xl uppercase overflow-x-hidden whitespace-nowrap overflow-ellipsis w-full">{dets.title}</h4>
        <p className="overflow-x-hidden whitespace-nowrap overflow-ellipsis w-full">{dets.desc}</p>
        <Button label="Read More" onClick={()=>{
          navigateTo(dets.insta)
        }} className="theme-blue text-yellow-400 p-2 rounded hover:bg-blue-900 text-lg" style={{WebkitTextStrokeWidth: "0.5px", WebkitTextStrokeColor: "black"}} />
    </div>
    </div>
  )
}

export default EventCard