import { qcmLogo } from "../assets/assets"
import { Link } from "react-router-dom"

const Logo = ({ className = "" }) => {
  return (
    <Link to="/" className="self-center">
      <img src={qcmLogo} alt="QCM Logo" className={`${className}`} />
    </Link>
  )
}

export default Logo
