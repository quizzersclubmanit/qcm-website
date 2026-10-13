import { FaFacebook, FaLinkedin } from "react-icons/fa"
import { FaInstagram, FaYoutube } from "react-icons/fa6"
import {
  facebook,
  instagram,
  linkedin,
  youtube,
  organization
} from "../assets/qcmData.json"
import { Container } from "./components"

const Social = () => {
  const social = [
    { href: instagram, icon: FaInstagram, label: "Quizzers' Club on Instagram" },
    { href: youtube, icon: FaYoutube, label: "Quizzers' Club on YouTube" },
    { href: linkedin, icon: FaLinkedin, label: "Quizzers' Club on LinkedIn" },
    { href: facebook, icon: FaFacebook, label: "Quizzers' Club on Facebook" },
  ]

  const year = new Date().getFullYear()

  return (
    <Container className="flex items-center justify-between w-full bg-white/10 px-4 py-2 rounded-xl border border-gray-700">
      <span className="text-sm">
        {year} — {organization}
      </span>

      <div className="flex items-center gap-3">
        {social.map((item, index) => (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
          >
            <item.icon className="text-xl hover:text-yellow-400 transition" aria-hidden="true" />
          </a>
        ))}
      </div>
    </Container>
  )
}

export default Social
