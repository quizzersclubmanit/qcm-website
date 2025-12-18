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
    { href: instagram, icon: FaInstagram },
    { href: youtube, icon: FaYoutube },
    { href: linkedin, icon: FaLinkedin },
    { href: facebook, icon: FaFacebook }
  ]

  const year = new Date().getFullYear()

  return (
    <Container className="flex items-center justify-between w-full bg-white/10 px-4 py-2 rounded-xl border border-gray-700">
      <span className="text-sm">
        {year} — {organization}
      </span>

      <div className="flex items-center gap-3">
        {social.map((item, index) => (
          <a key={index} href={item.href} target="_blank">
            <item.icon className="text-xl hover:text-yellow-400 transition" />
          </a>
        ))}
      </div>
    </Container>
  )
}

export default Social
