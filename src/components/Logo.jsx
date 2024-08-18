import { qcmLogo, qcmLogoBlue } from "../assets/assets"
import { Link } from "react-router-dom"
import { forwardRef } from "react"

const Logo = forwardRef(({ blue = false, className = "" }, ref) => {
  return (
    <Link to="/" className="self-center">
      <img
        ref={ref}
        src={blue ? qcmLogoBlue : qcmLogo}
        alt="QCM Logo"
        className={`${className}`}
      />
    </Link>
  )
})

export default Logo
