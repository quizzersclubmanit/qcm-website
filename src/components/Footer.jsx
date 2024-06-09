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
  org
} from "../assets/qcmData.json"
import { navigateTo } from "../utils/utils"

const Footer = () => {
  return (
    <footer className="londrina-solid-regular tracking-wider flex py-10 flex-col gap-5 items-center bg-black text-white">
      <Logo className="w-[7vmax] sm:w-[5vmax]" />
      <h2 className="font-bold text-2xl">{org}</h2>
      <div className="flex gap-20 my-2" style={{ fontSize: "2.5vmax" }}>
        <FaLinkedin
          className="text-[6vmax] sm:text-[3.5vmax] cursor-pointer"
          onClick={() => {
            navigateTo(linkedin)
          }}
        />
        <FaFacebook
          className="text-[6vmax] sm:text-[3.5vmax] cursor-pointer"
          onClick={() => {
            navigateTo(facebook)
          }}
        />
        <FaSquareInstagram
          className="text-[6vmax] sm:text-[3.5vmax] cursor-pointer"
          onClick={() => {
            navigateTo(instagram)
          }}
        />
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
            <p>{email}</p>
          </div>
        </div>
        <div className="right flex flex-col sm:w-1/2 px-[15vw] gap-5 sm:border-l border-gray-300">
          <h3 className="font-bold text-2xl">Locate us</h3>
          <div className="flex gap-4">
            <FaLocationDot className="text-2xl" />
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
