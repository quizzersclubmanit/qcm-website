import { Logo } from "./components"

const SectionHead = ({ label = "QCM", className = "", outline = true }) => {
  return (
    <div className={`flex gap-1 w-[72%] items-center ${className}`}>
      <Logo className="w-[9vmax] sm:w-[5vmax]" />
      <h1
        className={`sm:text-[5vmax] text-[7vmax] ${outline && "text-outline"}`}
      >
        {label}
      </h1>
    </div>
  )
}

export default SectionHead
