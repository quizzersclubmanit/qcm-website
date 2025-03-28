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
      <div
        className={`text-[5vmax] poppins-bold flex flex-col md:flex-row items-center justify-center  gap-2 ${outline && "text-outline"} ${className}`}
      >
        <h2>{label}</h2>

        {label == "Register" && (
          <p className="text-[22px] overflow-y-hidden text-blue-800  md:mt-10 md:self-auto">
            {" "}
            (Completely Free){" "}
          </p>
        )}
      </div>
    </div>
  )
}

export default SectionHead
