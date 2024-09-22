import { LuHome } from "react-icons/lu"
import { useNavigate } from "react-router-dom"

const SectionHead = ({
  label = "QCM",
  className = "",
  outline = false,
  logo = false,
  lightLogo = false
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-5 items-center text-[3vmax]">
      {logo && (
        <LuHome
          className={`cursor-pointer ${lightLogo && "text-white"}`}
          onClick={() => {
            navigate("/")
          }}
        />
      )}
      <h2
        className={`text-[5vmax] poppins-bold flex flex-col md:flex-row items-center justify-start  gap-2 ${outline && "text-outline"} ${className}`}
      >
        <h2>{label}</h2>

        {label=="Register" && (
          <p className="text-xs  text-red-600 self-start  md:mt-10 md:self-auto"> (Completely Free) </p>
        )}

      </h2>
    </div>
  )
}

export default SectionHead
