import { forwardRef } from "react"
import { arrowRight } from "../assets/assets"
import { organization } from "../assets/qcmData.json"

const Banner = forwardRef(({}, ref) => {
  const loopArr = new Array(16).fill(0)

  return (
    <div
      ref={ref}
      className="flex gap-4 overflow-x-hidden whitespace-nowrap bg-blue-950 py-6"
    >
      {loopArr.map((_, index) => (
        <div
          key={index}
          className="flex shrink-0 gap-3 px-4 overflow-y-hidden"
          style={{
            transform: "translateX(-100%)"
          }}
        >
          <span className="text-[5vmax]">{organization}</span>
          <img src={arrowRight} alt="Arrow" className="w-[5vmax]" />
        </div>
      ))}
    </div>
  )
})

export default Banner
