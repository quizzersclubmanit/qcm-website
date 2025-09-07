import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useState, useEffect } from "react"
import { PopupModal, ScrollToTop } from "./components/components.js"
import { Analytics } from "@vercel/analytics/react"

const Layout = () => {
  const [showModal, setShowModal] = useState(false)

  document.addEventListener("copy", (e) => {
    e.preventDefault()
  })

  document.addEventListener("cut", (e) => {
    e.preventDefault()
  })
  // Trigger the modal after 1 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 1000) // 1 seconds

    // Cleanup timer on unmount
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <ScrollToTop />
      <Outlet />
{/*       {showModal && <PopupModal setShowModal={setShowModal}></PopupModal>} */}
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Analytics />
    </>
  )
}

export default Layout
