import { Logo } from "./components"

const SectionHead = ({ label = "", className = "" }) => {
  return (
    <div className="flex gap-1 w-[72%] items-center">
      <Logo className="w-[9vmax] sm:w-[5vmax]" />
      <h1 className={`sm:text-[5vmax] text-[7vmax] ${className}`}>{label}</h1>
    </div>
  )
}

export default SectionHead
