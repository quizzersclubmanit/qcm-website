import {Logo} from "./components"

const SectionHead = ({label="", className=""}) => {
  return (
    <div className="flex gap-1 w-[72%] items-center">
        <Logo className="w-[6vmax] sm:w-[5vmax]"/>
        <h1 style={{fontSize: "5vmax"}} className={`${className}`}>{label}</h1>
    </div>
  )
}

export default SectionHead