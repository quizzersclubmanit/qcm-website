import { Link } from "react-router-dom"
import { manit, manitWebp, manitFallback, qcmLogoSm } from "../assets/assets"
import {
  contacts,
  email,
  address,
  organization,
  instagram,
  youtube,
  linkedin,
  facebook
} from "../assets/qcmData.json"
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaArrowUp } from "react-icons/fa"
import toast from "react-hot-toast"

const Footer = () => {
  const year = new Date().getFullYear()

  const copyPhone = (num) => {
    try {
      navigator.clipboard.writeText(num)
      toast.success(`Copied ${num} to clipboard!`)
    } catch {
      // Ignore
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const socialLinks = [
    { icon: FaInstagram, href: instagram, label: "Instagram" },
    { icon: FaLinkedin, href: linkedin, label: "LinkedIn" },
    { icon: FaYoutube, href: youtube, label: "YouTube" },
    { icon: FaFacebook, href: facebook, label: "Facebook" },
  ]

  return (
    <footer id="contacts" className="relative w-full text-white overflow-hidden border-t border-white/10">
      {/* Background Campus Photo with Deep Translucent Scrim */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <picture>
          <source srcSet={manit} type="image/avif" />
          <source srcSet={manitWebp} type="image/webp" />
          <img
            src={manitFallback}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center filter blur-[1px] scale-105"
          />
        </picture>
        <div className="absolute inset-0 bg-[#07141d]/90 backdrop-blur-md" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-10 flex flex-col gap-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Club Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 text-left">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img
                src={qcmLogoSm}
                alt="QCM Logo"
                width="40"
                height="40"
                className="w-10 h-10 object-contain drop-shadow transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-extrabold text-white text-base tracking-tight group-hover:text-[#fe9c02] transition-colors">
                  Quizzers&apos; Club
                </span>
                <span className="text-[10px] font-bold text-[#fe9c02] tracking-widest uppercase">
                  MANIT Bhopal
                </span>
              </div>
            </Link>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              The official quizzing society of Maulana Azad National Institute of
              Technology Bhopal. Fostering intellectual curiosity, hosting national
              arenas, and celebrating the pursuit of knowledge.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Quizzers Club on ${label}`}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#fe9c02] text-slate-200 hover:text-[#0c1e28] flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fe9c02]">
              Explore
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li>
                <Link to="/#hero" className="hover:text-white hover:underline transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-white hover:underline transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/#events" className="hover:text-white hover:underline transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white hover:underline transition-colors">Meet the Team</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white hover:underline transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/#sponsors" className="hover:text-white hover:underline transition-colors">Our Sponsors</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Events (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fe9c02]">
              Events
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li>
                <Link to="/signup" className="text-amber-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe9c02]" />
                  <span>Q-BIT &apos;26 Registration</span>
                </Link>
              </li>
              <li>
                <Link to="/events/iqc" className="hover:text-white hover:underline transition-colors">Inter-City Quiz (IQC)</Link>
              </li>
              <li>
                <Link to="/events/anveshan" className="hover:text-white hover:underline transition-colors">Anveshan Treasure Hunt</Link>
              </li>
              <li>
                <Link to="/events/manthan" className="hover:text-white hover:underline transition-colors">Manthan Open Quiz</Link>
              </li>
              <li>
                <a
                  href="/SampleQestionsIQC.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Sample Questions (PDF) &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Campus Venue (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fe9c02]">
              Venue &amp; Coordinators
            </p>
            
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <FaMapMarkerAlt className="text-[#fe9c02] mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-white">{address.college}</p>
                <p>{address.locality}, {address.city} - {address.pin}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <FaEnvelope className="text-[#fe9c02] shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white hover:underline transition-colors">
                {email}
              </a>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Student Leads
              </p>
              {contacts.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-medium text-white">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => copyPhone(c.no)}
                    className="inline-flex items-center gap-1 text-[#fe9c02] hover:text-amber-300 font-mono text-[11px] transition-colors"
                    title="Click to copy phone number"
                  >
                    <FaPhoneAlt className="text-[9px]" />
                    <span>{c.no}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {year} {organization} NIT Bhopal. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all text-xs font-medium"
          >
            <span>Back to top</span>
            <FaArrowUp className="text-[10px]" />
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
