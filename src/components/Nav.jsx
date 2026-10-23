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
    { name: "Contact", to: "/#contacts", hash: "#contacts" }
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
    <nav ref={ref} className={`poppins-medium flex items-center gap-1 lg:gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.hash
          ? location.pathname === "/" && (location.hash === tab.hash || (!location.hash && tab.hash === "#hero"))
          : location.pathname === tab.to

        return (
          <Link
            key={tab.name}
            to={tab.to}
            onClick={(e) => handleTabClick(e, tab.to)}
            className={`px-3 lg:px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] tracking-wide transition-all duration-200 ${
              isActive
                ? "bg-white/15 text-[#fe9c02] font-semibold border border-[#fe9c02]/30 shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/10 font-medium"
            }`}
          >
            {tab.name}
          </Link>
        )
      })}
    </nav>
  )
})

Nav.displayName = "Nav"

export default Nav
