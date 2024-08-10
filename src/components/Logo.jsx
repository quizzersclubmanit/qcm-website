import { qcmLogo, qcmLogoBlue } from "../assets/assets"
import { Link } from "react-router-dom"
import { forwardRef } from "react"

const Logo = forwardRef(({ blue = false, className = "" }, ref) => {
  return (
    <Link to="/" className="self-center">
      {blue ? (
        <img
          ref={ref}
          src={qcmLogoBlue}
          alt="QCM Logo"
          className={`${className}`}
        />
      ) : (
        <img
          ref={ref}
          src={qcmLogo}
          alt="QCM Logo"
          className={`${className}`}
        />
      )}
    </Link>
  )
})

export default Logo
