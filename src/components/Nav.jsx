import { Link, useLocation } from "react-router-dom"
import { forwardRef } from "react"

const Nav = forwardRef(({ className = "", offModal = () => {} }, ref) => {
  const location = useLocation()

  const tabs = [
    { name: "Home", to: "/#hero", hash: "#hero" },
    { name: "About", to: "/#about", hash: "#about" },
    { name: "Events", to: "/#events", hash: "#events" },
    { name: "Team", to: "/team" },
    { name: "FAQs", to: "/faqs" },
    { name: "Sponsors", to: "/#sponsors", hash: "#sponsors" },
    { name: "Contact Us", to: "/#contacts", hash: "#contacts" }
  ]

  const handleTabClick = (e, to) => {
    offModal()
    if (to.startsWith("/#")) {
      const hash = to.replace("/", "")
      if (location.pathname === "/") {
        e.preventDefault()
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <nav ref={ref} className={`poppins-regular flex items-center ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.hash
          ? location.pathname === "/" && location.hash === tab.hash
          : location.pathname === tab.to

        return (
          <Link
            key={tab.name}
            to={tab.to}
            onClick={(e) => handleTabClick(e, tab.to)}
            className={`text-sm tracking-wide transition-colors duration-200 relative py-1 ${
              isActive
                ? "text-[#fe9c02] font-semibold"
                : "text-white/85 hover:text-[#fe9c02] font-medium"
            }`}
          >
            {tab.name}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#fe9c02] rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
})

Nav.displayName = "Nav"

export default Nav
