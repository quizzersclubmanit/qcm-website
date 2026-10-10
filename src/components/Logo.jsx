import { qcmLogoSm } from "../assets/assets"
import { Link } from "react-router-dom"
import { forwardRef } from "react"

const Logo = forwardRef(({ className = "" }, ref) => {
  return (
    <Link to="/" className="self-center">
      <img ref={ref} src={qcmLogoSm} alt="QCM Logo" width="48" height="48" className={`${className}`} />
    </Link>
  )
})

export default Logo
