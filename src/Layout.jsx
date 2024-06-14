import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Outlet } from "react-router-dom"
import { useRef } from "react"
import { Toaster } from "react-hot-toast"

const Layout = () => {
  const cursorRef = useRef(null)
  const { contextSafe } = useGSAP()

  const animateCursor = contextSafe((X, Y) => {
    gsap.to(cursorRef.current, {
      x: X,
      y: Y,
      duration: 1,
      ease: "back.out(1)"
    })
  })

  window.addEventListener("mousemove", (e) => {
    animateCursor(e.x, e.y)
  })

  return (
    <>
      <Outlet />
      <div
        ref={cursorRef}
        className="cursor-follower fixed top-0 left-0 w-16 h-16 bg-[#00ed8a94] hidden sm:block pointer-events-none blur-xl"
        style={{ borderRadius: "50%" }}
      ></div>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  )
}

export default Layout
