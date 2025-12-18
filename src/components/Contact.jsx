import { FaLocationDot } from "react-icons/fa6"
import { FaLinkedin } from "react-icons/fa"
import { MdWifiCalling3 } from "react-icons/md"
import { IoMdMail } from "react-icons/io"
import { contacts, email, address } from "../assets/qcmData.json"
import { Container } from "./components"

const Contact = () => {
  return (
    <Container className="flex flex-col sm:flex-row w-full gap-6 py-4">
      
      <div className="flex flex-col gap-4 w-full sm:pl-12">
        <h3 className="font-bold text-xl sm:text-2xl text-yellow-400">
          Contact Us
        </h3>

        {contacts.map((contact, index) => (
          <div key={index} className="text-sm">
            <div className="flex items-center gap-2">
              <MdWifiCalling3 />
              <span className="text-base sm:text-md font-semibold">{contact.name}</span>
            </div>
            <span className="text-gray-400">{contact.position}</span>
            <div className="flex items-center gap-2">
              <span
                className="cursor-copy text-yellow-400"
                onClick={() => navigator.clipboard.writeText(contact.no)}
              >
                {contact.no}
              </span>
              <a href={contact.linkedin} target="_blank">
                <FaLinkedin className="text-base" />
              </a>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 text-sm">
          <IoMdMail />
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`}
            target="_blank"
            className="hover:underline"
          >
            {email}
          </a>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 w-full sm:border-l sm:pl-12 border-gray-700">
        <h3 className="font-bold text-xl sm:text-2xl text-yellow-400">
          Locate Us
        </h3>

        <div className="flex gap-3 text-sm">
          <FaLocationDot className="mt-1" />
          <div>
            <p>{address.college}</p>
            <p>{address.locality}</p>
            <p>{address.city}, PIN: {address.pin}</p>
          </div>
        </div>
      </div>

    </Container>
  )
}

export default Contact
