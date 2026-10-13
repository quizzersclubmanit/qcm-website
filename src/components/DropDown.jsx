

// import { forwardRef, useEffect, useState } from "react"
// import toast from "react-hot-toast"
// import { Button } from "./components"
// import { logout } from "../redux/user.slice"
// import { useDispatch } from "react-redux"
// import authService from "../api/auth.service"
// import { useNavigate } from "react-router-dom"
// import dbService from "../api/db.service"
// import env from "../../constants"
// import { csvObject } from "../utils/utils"


// const DropDown = forwardRef(({ user, email, visible = false }, ref) => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   console.log(email);
//   if (email === undefined) {
//     email = "";
//   }
//   const getRemainingTime = () => {
//     const now = new Date();
//     const endTime = new Date();

//     // Set the end time to 10:00 PM IST today
//     endTime.setHours(22, 0, 0, 0); // 22 is 10 PM in 24-hour format

//     const difference = endTime.getTime() - now.getTime();

//     // If the time has passed 10 PM, show a message
//     if (difference < 0) {
//       return "Play Quiz!";
//     }

//     // Calculate hours, minutes, and seconds from the difference
//     const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
//     const minutes = Math.floor((difference / 1000 / 60) % 60);
//     const seconds = Math.floor((difference / 1000) % 60);

//     // Format the time with leading zeros for a clean display
//     const formatTime = (time) => String(time).padStart(2, '0');

//     return `Play Quiz (${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)} remaining)`;
//   };

//   const [dynamicLabel, setDynamicLabel] = useState(getRemainingTime());
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setDynamicLabel(getRemainingTime());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const buttons = [
//     {
//       label: "Play Quiz!",
//       f: () => {
//         if(user == "admin") {
//           navigate("/quiz/instr/0")
//           return;
//         }
//         const now = new Date();
//         console.log("hours",now.getHours());
//         if(now.getHours()<22) {
//           toast.error("The  test quiz can only be played after 10:00 PM IST.");
//           return;
//         }
//         navigate("/quiz/instr/0")
//       },
//       visible: email.endsWith("@qcmisbest.com") || (user=="admin")
//     },
//     {
//       label: "Logout",
//       f: async () => {
//         const proceedToLogout = window.confirm("Are you sure you want to logout?")
//         if (!proceedToLogout) return

//         try {
//           // Show loading state
//           const toastId = toast.loading('Logging out...')

//           // Attempt server logout
//           await authService.logout()

//           // Clear local state
//           dispatch(logout())

//           // Update toast to success
//           toast.success('Successfully logged out', { id: toastId })

//           // Redirect to home after a short delay for better UX
//           setTimeout(() => {
//             // Use replace: true to prevent going back to protected pages
//             window.location.href = '/'
//           }, 1000)

//         } catch (error) {
//           console.error('Logout error:', error)
//           // Even if server logout fails, clear local state
//           dispatch(logout())
//           toast.error('Logged out locally, but server logout failed', {
//             duration: 5000,
//             position: 'top-center'
//           })
//           // Still redirect to home
//           window.location.href = '/'
//         }
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
//       className={`poppins-regular md:w-[13vw] sm:w-[35vw] w-[45vw] fixed min-h-[10vh] bottom-[0%] lg:top-[15%] right-[24%] lg:right-[12%] text-black bg-transparent flex flex-col items-center gap-2 ${!visible && "opacity-0 pointer-events-none"}`}
//       style={{
//         transform: "translateY(-25%)"
//       }}
//     >
//       {buttons.map((btn, index) => (
//         <Button
//           key={index}
//           label={btn.label}
//           onClick={btn.f}
//           className={`${!btn.visible && "hidden"} text-lg w-full py-2 px-4 rounded-3xl lg:backdrop-blur-md lg:text-white bg-white lg:bg-transparent hover:bg-[#ffffff8e] border border-white outline-none`}
//         />
//       ))}
//     </div>
//   )
// })

// export default DropDown

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


import { useLayoutEffect, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"
import { FaUsers, FaDownload, FaSignOutAlt } from "react-icons/fa"
import { Button } from "./components"
import { logout } from "../redux/user.slice"
import { useDispatch } from "react-redux"
import authService from "../api/auth.service"
import { useNavigate } from "react-router-dom"
import qbitService from "../api/qbit.service"
// QUIZ-PAUSED: import dbService from "../api/db.service"
// QUIZ-PAUSED: import env from "../../constants"
// QUIZ-PAUSED: import { csvObject } from "../utils/utils"


// Desktop account menu (the mobile nav uses MobileDrawer instead).
// Rendered via portal + fixed positioning measured from the trigger button,
// so it always floats above page content instead of getting buried under it.
// eslint-disable-next-line react/prop-types
const DropDown = ({ user, visible = false, onClose = () => {}, anchorRef }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [pos, setPos] = useState({ top: 0, right: 0 })
  // Time restriction removed - users can play quiz anytime

  const buttons = [
    // QUIZ-PAUSED: quiz play hidden while focusing on team registrations
    // {
    //   label: "Play Quiz!",
    //   f: () => {
    //     navigate("/quiz/instr/0")
    //   },
    //   visible: false
    // },
    {
      label: "Logout",
      Icon: FaSignOutAlt,
      separate: true,
      danger: true,
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
    // QUIZ-PAUSED: quiz admin items hidden while focusing on team registrations
    // {
    //   label: "Add Quiz",
    //   f: () => {
    //     navigate("/admin/add")
    //   },
    //   visible: user == "admin"
    // },
    // {
    //   label: "Manage Quiz",
    //   f: () => {
    //     navigate("/admin/manage")
    //   },
    //   visible: user == "admin"
    // },
    {
      label: "Manage",
      Icon: FaUsers,
      f: () => {
        navigate("/admin/teams")
      },
      visible: user == "admin"
    },
    // QUIZ-PAUSED: quiz results hidden while focusing on team registrations
    // {
    //   label: "Show Leaderboard",
    //   f: () => {
    //     navigate("/admin/results")
    //   },
    //   visible: user == "admin"
    // },
    {
      label: "Download Teams (.xlsx)",
      Icon: FaDownload,
      f: () => {
        qbitService
          .exportTeams({})
          .catch((error) => {
            console.error(error)
            toast.error(error.message)
          })
      },
      visible: user == "admin"
    },
    // QUIZ-PAUSED: quiz results export hidden while focusing on team registrations
    // {
    //   label: "Download Results Sheet",
    //   f: () => {
    //     dbService
    //       .select({
    //         collectionId: env.leaderboardId
    //       })
    //       .then((data) => {
    //         const csvData = csvObject.toCSV(data)
    //         csvObject.downloadCSV(csvData, "results.csv")
    //       })
    //       .catch((error) => console.error(error))
    //   },
    //   visible: user == "admin"
    // }
  ]

  // Pin the panel under the trigger button; recompute every time it opens
  // (covers scroll/resize between openings).
  useLayoutEffect(() => {
    if (!visible || !anchorRef?.current) return
    const r = anchorRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) })
  }, [visible, anchorRef])

  // Light-dismiss via Escape (outside clicks are caught by the layer below).
  useEffect(() => {
    if (!visible) return
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [visible, onClose])

  const handleSelect = (f) => () => {
    try {
      f()
    } finally {
      onClose()
    }
  }

  return createPortal(
    <div className="poppins-regular">
      {/* Transparent click-catcher: closes on outside click without dimming */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] ${!visible && "pointer-events-none"}`}
      />
      <div
        role="menu"
        style={{ top: pos.top, right: pos.right }}
        className={`fixed z-[70] w-64 max-w-[85vw] rounded-xl border border-slate-200/80 bg-white text-slate-800 shadow-2xl p-1.5 flex flex-col transition-all duration-150 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        {buttons.map((btn, index) => {
          if (!btn.visible) return null
          const Icon = btn.Icon
          return (
            <div key={index}>
              {btn.separate && (
                <div className="my-1 border-t border-slate-200/80" />
              )}
              <Button
                role="menuitem"
                onClick={handleSelect(btn.f)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors outline-none ${
                  btn.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {Icon && <Icon className="text-base opacity-60 shrink-0" />}
                {btn.label}
              </Button>
            </div>
          )
        })}
      </div>
    </div>,
    document.querySelector("#modal")
  )
}

export default DropDown



