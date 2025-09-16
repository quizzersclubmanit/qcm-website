import { useNavigate, Link } from "react-router-dom"
import { Button, DropDown, UserBtn, Logo } from "./components"
import { useEffect, useState, forwardRef, useRef } from "react"
import { useSelector } from "react-redux"

const Nav = forwardRef(({ className, offModal = () => {} }, ref) => {
  const tabs = [
    {
      name: "Home",
      to: "#hero"
    },
    {
      name: "About",
      to: "#about"
    },
    {
      name: "Events",
      to: "#events"
    },
    {
      name: "Team",
      to: "team"
    },
    {
      name: "Sponsors",
      to: "#sponsors"
    },
    {
      name: "Contact Us",
      to: "#contacts"
    }
  ]
  const { data, loggedIn } = useSelector((state) => state.user)
  const name = data?.name?.split(" ")[0] || "User"
  const navigate = useNavigate()
  const logoRef = useRef(null)
  const [showDropDown, setShowDropDown] = useState(false)
  const dropDownRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  

  

  return (
    <>
      <nav
        ref={ref}
        className={`poppins-regular md:items-center md:justify-between justify-around flex md:flex-row flex-col items-center md:overflow-y-hidden sm:h-[50vh] gap-3 md:h-[15vh] lg:h-[15vh] w-full ${className}`}
      >
        <Logo
          ref={logoRef}
          className="hidden md:block md:w-[3vmax] w-[5vmax] cursor-default"
        />
        <div className="tabs-bar flex flex-col gap-[2vw] mt-0 pt-0 md:flex-row h-22 lg:h-20 items-center px-2 rounded-2xl">
          {tabs.map((tab, index) =>
            tab.to.startsWith("#") ? (
              <a
                key={index}
                href={tab.to}
                className="hover:text-yellow-400 transition-all text-base no-underline text-black 
                border-2 rounded-[25px] py-[2px] px-[10px] 
                md:hover:scale-125 md:text-white md:border-none md:rounded-none md:p-2"
                style={{ borderColor: "currentColor" }}
                onClick={offModal}
              >
                {tab.name}
              </a>
            ) : (
              <Link
                key={index}
                to={tab.to}
                className="hover:text-yellow-400 transition-all text-base no-underline text-black 
                border-2 rounded-[25px] py-[5px] px-[10px] 
                md:hover:scale-125 md:text-white md:border-none md:rounded-none md:p-2"
                style={{ borderColor: "currentColor" }}
                onClick={offModal}
              >
                {tab.name}
              </Link>
            )
          )}
        </div>
        {loggedIn ? (
          <div className="flex sm:flex-row flex-col">
            {/* <Button
              label="Play Quiz"
              onClick={() => navigate("/quiz/instr/0")}
              className="poppins-regular flex items-center md:gap-2 sm:bg-[#E5E5E5] rounded-lg md:p-2 justify-center gap-3 py-1 overflow-y-hidden sm:border-none border border-black p-2"
            /> */}
            {/* <Button
              label="IQC Preparation Booklet"
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1fDRrSJycHoWlM-ZH6m_JbdgeDR0aIswT/view?usp=sharing",
                  "_blank"
                )
              }
              className="poppins-regular flex items-center md:gap-2 sm:bg-[#E5E5E5] rounded-lg md:p-2 justify-center gap-3 py-1 overflow-y-hidden sm:border-none border border-black p-2"
            /> */}
            <UserBtn
              name={name}
              showDropDown={showDropDown}
              setShowDropDown={setShowDropDown}
              ref={dropDownRef}
            />
          </div>
        ) : (
          <div className="flex sm:flex-row flex-col gap-2">
{/*             <Button
              label="Login"
              className="poppins-regular py-4 lg:py-2 lg:h-10 flex items-center justify-center px-5 text-sm text-white rounded-3xl border-2 overflow-y-hidden bg-blue-600 border-blue-600 hover:bg-transparent hover:text-gray hover:border-white"
              onClick={() => {
                navigate("/signin")
              }}
            />
            <Button
              label="Sign Up"
              className="poppins-regular py-3 lg:h-10 flex items-center px-4 text-sm border-black lg:text-white rounded-3xl border-2 lg:border-white overflow-y-hidden hover:bg-blue-50 hover:text-black"
              onClick={() => {
                navigate("/signup")
              }} */}

             <Button
              label="Login"
              className="poppins-regular py-3 px-5 text-sm flex items-center justify-center text-white rounded-3xl border-2 overflow-y-hidden bg-blue-600 border-blue-600 hover:bg-transparent hover:text-gray hover:border-white"
              onClick={() => {
                navigate("/signin")
              }}
            />
            <Button
              label="Sign Up"
              className="poppins-regular py-3 px-4 flex items-center justify-center  text-sm md:text-white border-black rounded-3xl border-2 md:border-white overflow-y-hidden hover:bg-blue-50 hover:text-black"
              onClick={() => {
                navigate("/signup")
              }}
            />
          </div>
        )}
      </nav>
      <DropDown ref={dropDownRef} user={name} visible={showDropDown} />
    </>
  )
})

export default Nav
