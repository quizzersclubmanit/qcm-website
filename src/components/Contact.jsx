import { FaLocationDot } from "react-icons/fa6"
import { MdWifiCalling3 } from "react-icons/md"
import { IoMdMail } from "react-icons/io"
import { contacts, email, address } from "../assets/qcmData.json"
import { Container } from "./components"

const Contact = () => {
  return (
    <Container className="flex flex-col sm:flex-row w-full gap-5 sm:h-1/2 h-2/3 justify-center sm:my-[20vh] my-[10vh]">
      <div className="left flex flex-col gap-5 w-full justify-center sm:pl-[8vmax] pl-10">
        <h3 className="londrina-solid-regular font-bold text-[3vmax] text-yellow-400">
          Contact us
        </h3>
        <div className="flex gap-4">
          <MdWifiCalling3 className="text-2xl" />
          <div className="flex flex-col">
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
          >
            {email}
          </a>
        </div>
      </div>
      <div className="right flex flex-col w-full gap-5 sm:border-l sm:pl-[8vmax] pl-10 border-gray-300 justify-center">
        <h3 className="londrina-solid-regular font-bold text-[3vmax] text-yellow-400">
          Locate us
        </h3>
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
    </Container>
  )
}

export default Contact
