// import { forwardRef } from "react"
// import toast from "react-hot-toast"
// import { Button } from "./components"
// import { logout } from "../redux/user.slice"
// import { useDispatch } from "react-redux"
// import authService from "../api/auth.service"
// import { useNavigate } from "react-router-dom"
// import dbService from "../api/db.service"
// import env from "../../constants"
// import { csvObject } from "../utils/utils"

// const DropDown = forwardRef(({ user, visible = false }, ref) => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const buttons = [
//     {
//       label: "Logout",
//       f: () => {
//         const proceedToLogout = confirm("Proceed to Logout?")
//         if (!proceedToLogout) return
//         authService
//           .logout()
//           .then(() => {
//             dispatch(logout())
//             window.location.reload()
//           })
//           .catch((error) => {
//             toast.error(error.message)
//             console.error(error)
//           })
//       },
//       visible: true
//     },
//     {
//       label: "Add Quiz",
//       f: () => {
//         navigate("/admin/add")
//       },
//       visible: user == "admin"
//     },
//     {
//       label: "Manage Quiz",
//       f: () => {
//         navigate("/admin/manage")
//       },
//       visible: user == "admin"
//     },
//     {
//       label: "Show Leaderboard",
//       f: () => {
//         navigate("/admin/results")
//       },
//       visible: user == "admin"
//     },
//     {
//       label: "Download Registrations Sheet",
//       f: () => {
//         dbService
//           .select({
//             collectionId: env.userId
//           })
//           .then((data) => {
//             const csvData = csvObject.toCSV(data)
//             csvObject.downloadCSV(csvData, "registrations.csv")
//           })
//           .catch((error) => console.error(error))
//       },
//       visible: user == "admin"
//     },
//     {
//       label: "Download Results Sheet",
//       f: () => {
//         dbService
//           .select({
//             collectionId: env.leaderboardId
//           })
//           .then((data) => {
//             const csvData = csvObject.toCSV(data)
//             csvObject.downloadCSV(csvData, "results.csv")
//           })
//           .catch((error) => console.error(error))
//       },
//       visible: user == "admin"
//     }
//   ]

//   return (
//     <div
//       ref={ref}
//       className={`poppins-regular md:w-[13vw] sm:w-[35vw] w-[45vw] fixed min-h-[10vh] bottom-[0%] lg:top-[15%] right-[24%] lg:right-[12%]  text-black h-2 bg-transparent flex flex-col items-center justify-evenly ${!visible && "opacity-0 pointer-events-none"}`}
//       style={{
//         transform: "translateY(-25%)"
//       }}
//     >
//       {buttons.map((btn, index) => (
//         <Button
//           key={index}
//           label={btn.label}
//           onClick={btn.f}
//           className={`${!btn.visible && "hidden"} text-lg border lg:border-white border-black w-full py-2 rounded-3xl lg:backdrop-blur-md lg:text-white hover:bg-[#ffffff8e]`}
//         />
//       ))}
//     </div>
//   )
// })

// export default DropDown


import { forwardRef } from "react"
import toast from "react-hot-toast"
import { Button } from "./components"
import { logout } from "../redux/user.slice"
import { useDispatch } from "react-redux"
import authService from "../api/auth.service"
import { useNavigate } from "react-router-dom"
import dbService from "../api/db.service"
import env from "../../constants"
import { csvObject } from "../utils/utils"

const DropDown = forwardRef(({ user, visible = false }, ref) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const buttons = [
    {
      label: "Play Quiz",
      f: () => {
        navigate("/quiz/instr/0")
      },
      visible: true
    },
    {
      label: "Logout",
      f: async () => {
        const proceedToLogout = window.confirm("Are you sure you want to logout?")
        if (!proceedToLogout) return
        
        try {
          // Show loading state
          const toastId = toast.loading('Logging out...')
          
          // Attempt server logout
          await authService.logout()
          
          // Clear local state
          dispatch(logout())
          
          // Update toast to success
          toast.success('Successfully logged out', { id: toastId })
          
          // Redirect to home after a short delay for better UX
          setTimeout(() => {
            // Use replace: true to prevent going back to protected pages
            window.location.href = '/'
          }, 1000)
          
        } catch (error) {
          console.error('Logout error:', error)
          // Even if server logout fails, clear local state
          dispatch(logout())
          toast.error('Logged out locally, but server logout failed', { 
            duration: 5000,
            position: 'top-center'
          })
          // Still redirect to home
          window.location.href = '/'
        }
      },
      visible: true
    },
    {
      label: "Add Quiz",
      f: () => {
        navigate("/admin/add")
      },
      visible: user == "admin"
    },
    {
      label: "Manage Quiz",
      f: () => {
        navigate("/admin/manage")
      },
      visible: user == "admin"
    },
    {
      label: "Show Leaderboard",
      f: () => {
        navigate("/admin/results")
      },
      visible: user == "admin"
    },
    {
      label: "Download Registrations Sheet",
      f: () => {
        dbService
          .select({
            collectionId: env.userId
          })
          .then((data) => {
            const csvData = csvObject.toCSV(data)
            csvObject.downloadCSV(csvData, "registrations.csv")
          })
          .catch((error) => console.error(error))
      },
      visible: user == "admin"
    },
    {
      label: "Download Results Sheet",
      f: () => {
        dbService
          .select({
            collectionId: env.leaderboardId
          })
          .then((data) => {
            const csvData = csvObject.toCSV(data)
            csvObject.downloadCSV(csvData, "results.csv")
          })
          .catch((error) => console.error(error))
      },
      visible: user == "admin"
    }
  ]

  return (
    <div
      ref={ref}
      className={`poppins-regular md:w-[13vw] sm:w-[35vw] w-[45vw] fixed min-h-[10vh] bottom-[0%] lg:top-[15%] right-[24%] lg:right-[12%] text-black bg-transparent flex flex-col items-center gap-2 ${!visible && "opacity-0 pointer-events-none"}`}
      style={{
        transform: "translateY(-25%)"
      }}
    >
      {buttons.map((btn, index) => (
        <Button
          key={index}
          label={btn.label}
          onClick={btn.f}
          className={`${!btn.visible && "hidden"} text-lg w-full py-2 px-4 rounded-3xl lg:backdrop-blur-md lg:text-white bg-white lg:bg-transparent hover:bg-[#ffffff8e] border border-white outline-none`}
        />
      ))}
    </div>
  )
})

export default DropDown

