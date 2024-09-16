import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useState, useEffect } from "react";
import { PopupModal } from "./components/components.js"
const Layout = () => {
  const [showModal, setShowModal] = useState(false);

  document.addEventListener("copy", (e) => {
    e.preventDefault()
  })

  document.addEventListener("cut", (e) => {
    e.preventDefault()
  })
  // Trigger the modal after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 5000); // 5 seconds

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Outlet />
      {showModal && (
        <PopupModal setShowModal={setShowModal}>
        
        </PopupModal>
      )}
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  )
}

export default Layout
