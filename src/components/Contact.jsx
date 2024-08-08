// import { FaLocationDot } from "react-icons/fa6"
// import { MdWifiCalling3 } from "react-icons/md"
// import { IoMdMail } from "react-icons/io"
// import { contacts, email, address } from "../assets/qcmData.json"
// import { Container } from "./components"

// const Contact = () => {
//   return (
//     <Container className="flex flex-col sm:flex-row w-full gap-5 justify-center sm:my-[20vh] my-[10vh] py-5">
//       <div className="left flex flex-col gap-5 w-full justify-center sm:pl-[8vmax] pl-2">
//         <h3 className="century-gothic font-bold text-[3vmax] text-yellow-400">
//           Contact Us
//         </h3>
//         <div className="flex gap-4">
//           <MdWifiCalling3 className="text-2xl" />
//           <div className="flex flex-col text-[2.5vmax] sm:text-[1.5vmax]">
//             {contacts.map((contact, index) => (
//               <div className="flex" key={index}>
//                 <span>{contact.name} -&nbsp;</span>
//                 <span
//                   onClick={() => {
//                     navigator.clipboard.writeText(contact.no)
//                   }}
//                   className="cursor-copy"
//                 >
//                   {contact.no}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="flex gap-5 items-center">
//           <IoMdMail className="text-2xl" />
//           <a
//             href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`}
//             target="_blank"
//             className="text-[2.5vmax] sm:text-[1.5vmax]"
//           >
//             {email}
//           </a>
//         </div>
//       </div>
//       <div className="right flex flex-col w-full gap-5 sm:border-l sm:pl-[8vmax] pl-2 border-gray-300 justify-center">
//         <h3 className="century-gothic font-bold text-[3vmax] text-yellow-400">
//           Locate Us
//         </h3>
//         <div className="flex gap-4 text-[2.5vmax] sm:text-[1.5vmax]">
//           <FaLocationDot className="text-2xl" />
//           <div className="text-[2.5vmax] sm:text-[1.5vmax]">
//             <p>{address.org}</p>
//             <p>{address.college}</p>
//             <p>
//               {address.city}, PIN: {address.pin}
//             </p>
//           </div>
//         </div>
//       </div>
//     </Container>
//   )
// }

// export default Contact



import React from "react";
import { FaLinkedin, FaInstagram, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";




const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground p-6 footer-background text-white" style={{ fontSize: "15.5px" , 
    // background: url("/src/assets/footer bg.png")
     }}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <div className="flex items-center mb-4 md:mb-0 -mt-28" style={{ marginLeft: "-150px" }}>
          <img
            src="https://qcm-website.vercel.app/assets/qcm-logo-D4P8_9fw.png"
            alt="Quizzers Club Logo"
            className="h-16 w-16 mr-2"
          />
          <div className="flex flex-col border-l-[3.5px] border-white pl-1 leading-none" style={{ height: "65px" }}>
            <div className="text-xl font-bold" style={{ fontSize: "17px" }}>
              QUIZZERS'
            </div>
            <div className="text-xl font-bold" style={{ fontSize: "17px", marginTop: "-11px" }}>
              CLUB
            </div>
            <div className="text-xl font-bold" style={{ fontSize: "10px", marginTop: "-3.75px" }}>
              NIT BHOPAL
            </div>
          </div>
        </div>
        <div
          className="flex flex-col md:flex-row mt-12 md:mt-0"
          style={{ marginLeft: "126px", marginRight: "-50px", paddingLeft: "130px", gap: "3rem" , maxWidth:"100%",   boxSizing: "border-box",}}
        >
          <div className="mr-10">
            <h3 className="font-semibold text-[#fe9c02]">OUR EVENTS</h3>
            <ul className="list-none">
              <li>E-Summit</li>
              <li>Eureka!</li>
              <li>Eureka! Junior</li>
              <li>Illuminate</li>
              <li>NEC</li>
              <li>Campus Executive</li>
              <li>FinCoF</li>
              <li>EnB</li>
              <li>EnSpace</li>
            </ul>
          </div>
          <div className="mr-10">
            <h3 className="font-semibold text-[#fe9c02]">USEFUL LINKS</h3>
            <ul className="list-none">
              <li>Home</li>
              <li>About Us</li>
              <li>E-Cell Blog</li>
              <li>Gallery</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="-mr-9" style={{ marginRight: "3rem" }}>
            <h3 className="font-semibold text-[#fe9c02]">CONTACT US</h3>
            <p>Students Activity Center, IIT Area, IIT, Mumbai, Maharashtra 400076</p>
            <p>
              <a href="mailto:support@ecell.in" className="text-primary text-white" style={{ color: "white" }}>
                support@ecell.in
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start mt-6">
        <p className="-mt-36" style={{ marginLeft: "-130px" }}>
          Get connected with us on social networks:
        </p>
        <div className="flex justify-start space-x-4" style={{ marginTop: "10px", marginLeft: "-38px" }}>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin style={{ width: "1.7rem"  ,color: "#fe9c02"}} />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram style={{ width: "1.85rem" ,color: "#fe9c02" }} />
          </a>
          <a href="#" aria-label="YouTube">
            <FaYoutube style={{ width: "1.7rem"  ,color: "#fe9c02"}} />
          </a>
          <a href="#" aria-label="Twitter">
            <FaTwitter style={{ width: "1.7rem"  ,color: "#fe9c02"}} />
          </a>
          <a href="#" aria-label="Facebook">
            <FaFacebook style={{ width: "1.7rem"  ,color: "#fe9c02"}} />
          </a>
        </div>
      </div>
      <div className="text-center mt-4 text-muted-foreground" style={{ marginTop: "55px" }}>
        <p className="text-[#fe9c02]">© 2024 Copyright: Quizzers' Club NIT Bhopal</p>
      </div>
    </footer>
  );
};

export default Footer;
