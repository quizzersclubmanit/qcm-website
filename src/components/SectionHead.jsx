import { FaHome } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"

const SectionHead = ({
  label = "QCM",
  className = "",
  outline = false,
  logo = false,
  lightLogo = false
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-1 text-[3vmax]">
      {/* Visible breadcrumb: crawler + user link graph parity (matches JSON-LD) */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-normal opacity-80">
        <ol className="flex items-center gap-1">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">{label}</li>
        </ol>
      </nav>
      <div className="flex gap-5 items-center">
      {logo && (
        <FaHome
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
    </div>
  )
}

export default SectionHead
