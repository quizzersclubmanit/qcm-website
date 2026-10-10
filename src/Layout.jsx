import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { HelmetProvider } from "react-helmet-async"
import { Analytics } from "@vercel/analytics/react"

const Layout = () => {
  return (
    <HelmetProvider>
      <Outlet />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Analytics />
    </HelmetProvider>
  )
}

export default Layout
