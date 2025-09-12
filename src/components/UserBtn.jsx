import { forwardRef, useEffect } from "react"
import { IoIosArrowDropdownCircle } from "react-icons/io"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const UserBtn = forwardRef(({ name, showDropDown, setShowDropDown }, ref) => {
  const { contextSafe } = useGSAP()

  const animateDropDown = contextSafe((cond) => {
    if (cond) {
      gsap.to(ref.current, {
        opacity: 1,
        transform: "translateY(0)",
        ease: "back.out"
      })
    } else {
      gsap.to(ref.current, {
        opacity: 0,
        transform: "translateY(-25%)",
        duration: 0.3,
        ease: "power1.out"
      })
    }
  })

  useEffect(() => {
    return () => {
      animateDropDown(false)
    }
  }, [])

  return (
    <div className="poppins-regular py-3 px-4 flex items-center justify-center  text-sm lg:text-white border-black rounded-3xl border-2 lg:border-white overflow-y-hidden hover:bg-blue-50 hover:text-black">
      <span className="uppercase text-black">{name}</span>
      <IoIosArrowDropdownCircle
        className="text-xl cursor-pointer"
        onClick={() => {
          setShowDropDown((prev) => !prev)
          animateDropDown(!showDropDown)
        }}
      />
    </div>
  )
})

export default UserBtn
