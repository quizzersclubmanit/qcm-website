import { FaFacebook, FaLinkedin } from "react-icons/fa"
import { FaSquareInstagram, FaYoutube } from "react-icons/fa6"
import { facebook, instagram, linkedin, acronym } from "../assets/qcmData.json"
import { Container } from "./components"

const Social = () => {
  const social = [
    {
      href: linkedin,
      image: FaLinkedin
    },
    {
      href: facebook,
      image: FaFacebook
    },
    {
      href: instagram,
      image: FaSquareInstagram
    }
  ]
  const date = new Date()

  return (
    <Container className="flex justify-between w-full bg-[#e5e5e51d] px-4 rounded-2xl border border-gray-600">
      <p className="text-[2.5vmax] sm:text-[1.5vmax] flex items-center gap-2">
        <span className="sm:text-[3vmax] text-[3.5vmax]">&copy;</span>{" "}
        {date.getFullYear()}: {acronym}
      </p>
      <div className="flex items-center gap-3">
        {social.map((item, index) => (
          <a key={index} href={item.href} target="_blank">
            <item.image className="text-[3vmax] sm:text-[2vmax] cursor-pointer" />
          </a>
        ))}
      </div>
    </Container>
  )
}

export default Social
