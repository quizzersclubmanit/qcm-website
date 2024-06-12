import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Outlet } from "react-router-dom"
import { useRef } from "react"

const Layout = () => {
  const cursorRef = useRef(null)
  const { contextSafe } = useGSAP()

  document.querySelector("body").addEventListener("mousemove", (e) => {
    contextSafe(() => {
      gsap.to(cursorRef.current, {
        x: e.x,
        y: e.y,
        duration: 1,
        ease: "back.out(3)"
      })()
    })()
  })

  return (
    <>
      <Outlet />
      <div
        ref={cursorRef}
        className="cursor-follower fixed top-0 left-0 w-8 h-8 bg-[#00ed8a94] hidden sm:block"
        style={{ borderRadius: "50%" }}
      ></div>
    </>
  )
}

export default Layout
