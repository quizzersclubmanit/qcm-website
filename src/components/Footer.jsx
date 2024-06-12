import { Logo } from "./components"
import { FaFacebook, FaLinkedin } from "react-icons/fa"
import { FaSquareInstagram, FaLocationDot } from "react-icons/fa6"
import { MdWifiCalling3 } from "react-icons/md"
import { IoMdMail } from "react-icons/io"
import {
  contacts,
  email,
  address,
  facebook,
  instagram,
  linkedin,
  organization
} from "../assets/qcmData.json"

const Footer = () => {
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

  return (
    <footer className="londrina-solid-regular tracking-wider flex py-10 flex-col gap-5 items-center bg-black text-white">
      <Logo className="w-[7vmax] sm:w-[5vmax]" />
      <h2 className="font-bold text-2xl">{organization}</h2>
      <div className="flex gap-20 my-2" style={{ fontSize: "2.5vmax" }}>
        {social.map((item, index) => (
          <a key={index} href={item.href} target="_blank">
            <item.image className="text-[6vmax] sm:text-[3vmax] cursor-pointer" />
          </a>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row w-full gap-5">
        <div className="left flex flex-col px-[15vw] gap-5 sm:w-1/2">
          <h3 className="font-bold text-2xl">Contact us</h3>
          <div className="flex gap-4">
            <MdWifiCalling3 className="text-2xl" />
            <div className="flex flex-col">
              {contacts.map((contact, index) => (
                <p key={index}>
                  {contact.name} - {contact.no}
                </p>
              ))}
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <IoMdMail />
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`}
              target="_blank"
            >
              {email}
            </a>
          </div>
        </div>
        <div className="right flex flex-col sm:w-1/2 px-[15vw] gap-5 sm:border-l border-gray-300">
          <h3 className="font-bold text-2xl">Locate us</h3>
          <div className="flex gap-4">
            <a href={address.gmap} target="_blank">
              <FaLocationDot className="text-2xl" />
            </a>
            <div>
              <p>{address.org}</p>
              <p>{address.college}</p>
              <p>
                {address.city}, PIN: {address.pin}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
