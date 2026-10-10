import { manit, manitWebp, manitFallback } from "../assets/assets"
import { Link } from "react-router-dom"
import { Container, Social, Contact } from "./components"

const Footer = () => {
  return (
    <Container
      id="contacts"
      element="footer"
      className="
    relative
    min-h-[40vh]
    w-full
    max-w-full
    flex flex-col
    justify-between
    text-sm
    text-white
    poppins-regular
      "
    >
      {/* Background (img stack: same visuals, modern formats + lazy) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <picture>
          <source srcSet={manit} type="image/avif" />
          <source srcSet={manitWebp} type="image/webp" />
          <img
            src={manitFallback}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col justify-between px-6 sm:px-12">

        {/* Content */}

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-between h-full px-6">
          <Contact />
          <nav aria-label="Sitemap" className="w-full flex flex-wrap gap-x-6 gap-y-2 py-4 text-sm text-gray-300">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <Link to="/team" className="hover:text-yellow-400 transition">Team</Link>
            <Link to="/faqs" className="hover:text-yellow-400 transition">FAQs</Link>
            <Link to="/signup" className="hover:text-yellow-400 transition">QBIT Registration</Link>
            <Link to="/events/iqc" className="hover:text-yellow-400 transition">IQC</Link>
            <Link to="/events/manthan" className="hover:text-yellow-400 transition">Manthan</Link>
            <Link to="/events/anveshan" className="hover:text-yellow-400 transition">Anveshan</Link>
          </nav>
          <Social />
        </div>

      </div>
    </Container>
  )
}

export default Footer
