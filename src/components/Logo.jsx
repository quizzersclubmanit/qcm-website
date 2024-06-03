import {qcmLogo} from "../assets/assets"
import { Link } from "react-router-dom"

const Logo = ({className=""}) => {
  return (
    <Link to="/">
      <img src={qcmLogo} alt="QCM Logo" className={`w-[5vmax] sm:w-[4vmax] ${className}`} />
    </Link>
  )
}

export default Logo