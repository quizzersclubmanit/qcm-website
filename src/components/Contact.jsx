import { FaLocationDot } from "react-icons/fa6"
import { MdWifiCalling3 } from "react-icons/md"
import { IoMdMail } from "react-icons/io"
import { contacts, email, address } from "../assets/qcmData.json"
import { Container } from "./components"

const Contact = () => {
  return (
    <Container className="flex flex-col sm:flex-row w-full gap-5 justify-center sm:my-[20vh] my-[10vh] py-5">
      <div className="left flex flex-col gap-5 w-full justify-center sm:pl-[8vmax] pl-2">
        <h3 className="century-gothic font-bold text-[3vmax] text-yellow-400">
          Contact Us
        </h3>
        <div className="flex gap-4">
          <MdWifiCalling3 className="text-2xl" />
          <div className="flex flex-col text-[2.5vmax] sm:text-[1.5vmax]">
            {contacts.map((contact, index) => (
              <div className="flex" key={index}>
                <span>{contact.name} -&nbsp;</span>
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(contact.no)
                  }}
                  className="cursor-copy"
                >
                  {contact.no}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <IoMdMail className="text-2xl" />
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`}
            target="_blank"
            className="text-[2.5vmax] sm:text-[1.5vmax]"
          >
            {email}
          </a>
        </div>
      </div>
      <div className="right flex flex-col w-full gap-5 sm:border-l sm:pl-[8vmax] pl-2 border-gray-300 justify-center">
        <h3 className="century-gothic font-bold text-[3vmax] text-yellow-400">
          Locate Us
        </h3>
        <div className="flex gap-4 text-[2.5vmax] sm:text-[1.5vmax]">
          <FaLocationDot className="text-2xl" />
          <div className="text-[2.5vmax] sm:text-[1.5vmax]">
            <p>{address.org}</p>
            <p>{address.college}</p>
            <p>
              {address.city}, PIN: {address.pin}
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Contact
