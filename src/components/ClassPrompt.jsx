// import dbService from "../api/db.service"
// import { useNavigate, useParams } from "react-router-dom"
// import { useEffect, useState } from "react"
// import { useSelector } from "react-redux"
// import { Instructions } from "../pages/pages"
// import toast from "react-hot-toast"

// const ClassPrompt = () => {
//   const { data } = useSelector((state) => state.user)
//   const { sec } = useParams()
//   const navigate = useNavigate()
//   const [hasPrompted, setHasPrompted] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

//   console.log('ClassPrompt - sec:', sec, 'data:', data)

//   useEffect(() => {
//     // Only run prompt flow for sec == 0
//     if (String(sec) !== '0') return
//     // Check if user data exists and has required properties
//     if (!data || (!data.$id && !data.id && !data.userId)) {
//       console.error('User data not available in ClassPrompt:', data)
//       toast.error('User not authenticated properly')
//       navigate('/signin')
//       return
//     }

//     // Only prompt once
//     if (hasPrompted) return

//     setHasPrompted(true)
//     setIsProcessing(true)

//     // Use setTimeout to ensure state updates are processed
//     setTimeout(() => {
//       const standard = prompt(
//         "Enter your class (numeric value, eg. 10 for students of 10th standard)"
//       )

//       if (standard === null || standard === "") {
//         setIsProcessing(false)
//         navigate("/")
//         return
//       }

//       // For now, just store class in localStorage and continue to quiz
//       // Backend update can be implemented later when schema is ready
//       try {
//         localStorage.setItem('userClass', standard)
//         localStorage.setItem('userStandard', standard)
//         console.log('Class stored locally:', standard)
//         toast.success('Class information saved!')
//         navigate("/quiz/instr/1")
//       } catch (error) {
//         console.error('Error storing class locally:', error)
//         // Even if localStorage fails, continue to quiz
//         toast('Continuing to quiz...')
//         navigate("/quiz/instr/1")
//       } finally {
//         setIsProcessing(false)
//       }
//     }, 100)

//     // TODO: Uncomment this when backend schema is updated
//     /*
//     const userId = data.$id || data.id || data.userId
//     dbService
//       .update({
//         collectionId: "user",
//         id: userId,
//         data: {
//           class: parseInt(standard),
//           standard: parseInt(standard)
//         }
//       })
//       .then(() => {
//         console.log('Class/Standard updated successfully')
//         toast.success('Class information saved!')
//         navigate("/quiz/instr/1")
//       })
//       .catch((error) => {
//         console.error('Error updating class:', error)
//         toast('Could not save class info, but continuing to quiz')
//         navigate("/quiz/instr/1")
//       })
//     */
//   }, [data, navigate, hasPrompted, isProcessing, sec])

//   // Render based on section after hooks are registered
//   if (String(sec) !== '0') {
//     return <Instructions sec={sec} />
//   }

//   // For section 0, show a proper UI instead of error screen
//   if (isProcessing) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
//         <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//           <h2 className="text-2xl font-bold mb-4">Quiz Setup</h2>
//           <p className="text-gray-600 mb-4">Please wait while we collect your class information...</p>
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         </div>
//       </div>
//     )
//   }

//   // Idle UI while waiting to prompt
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
//       <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//         <h2 className="text-2xl font-bold mb-4">Quiz Setup</h2>
//         <p className="text-gray-600 mb-4">Preparing class prompt...</p>
//       </div>
//     </div>
//   )
// }

// export default ClassPrompt




// import dbService from "../api/db.service"
// import { useNavigate, useParams } from "react-router-dom"
// import { useEffect, useState } from "react"
// import { useSelector } from "react-redux"
// import { Instructions } from "../pages/pages"
// import toast from "react-hot-toast"

// const ClassPrompt = () => {
//   const { data } = useSelector((state) => state.user)
//   const { sec } = useParams()
//   const navigate = useNavigate()
//   const [hasPrompted, setHasPrompted] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)

//   console.log('ClassPrompt - sec:', sec, 'data:', data)

//   useEffect(() => {
//     // Only run prompt flow for sec == 0
//     if (String(sec) !== '0') return
//     // Check if user data exists and has required properties
//     if (!data || (!data.$id && !data.id && !data.userId)) {
//       console.error('User data not available in ClassPrompt:', data)
//       toast.error('User not authenticated properly')
//       navigate('/')
//       return
//     }

//     // Only prompt once
//     if (hasPrompted) return

//     setHasPrompted(true)
//     setIsProcessing(true)

//     // Use setTimeout to ensure state updates are processed
//     setTimeout(async () => {
//       const standard = prompt(
//         "Enter your class (numeric value, eg. 10 for students of 10th standard)"
//       )

//       if (standard === null || standard === "") {
//         setIsProcessing(false)
//         navigate("/")
//         return
//       }

//       // Update user class in database
//       const userId = data.$id || data.id || data.userId
//       const classValue = parseInt(standard)

//       if (isNaN(classValue) || classValue < 1 || classValue > 12) {
//         toast.error('Please enter a valid class (1-12)')
//         setIsProcessing(false)
//         return
//       }

//       try {
//         console.log('Updating user class in database:', { userId, class: classValue })
//         console.log('User data available:', data)

//         // Based on backend analysis, prioritize the correct endpoint
//           const endpoints = [
//           { url: `/api/user/profile`, method: 'PATCH' }, // This should work now!
//           { url: `/api/user/profile`, method: 'PUT' },
//           { url: `/api/auth/profile`, method: 'PATCH' }, // Added for compatibility
//           { url: `/api/user/${userId}`, method: 'PATCH' },
//           { url: `/api/user/${userId}`, method: 'PUT' }
//         ]


//         let success = false
//         let lastError = null

//         for (const endpoint of endpoints) {
//           try {
//             console.log(`Trying ${endpoint.method} ${endpoint.url}`)

//             const response = await fetch(`https://qcm-backend-ln5c.onrender.com${endpoint.url}`, {
//               method: endpoint.method,
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
//               },
//               body: JSON.stringify({
//                 class: classValue
//               })
//             })

//             console.log(`${endpoint.method} ${endpoint.url} response status:`, response.status)

//             if (response.ok) {
//               const result = await response.json()
//               console.log(`Update successful with ${endpoint.method} ${endpoint.url}:`, result)
//               success = true
//               break
//             } else if (response.status !== 404) {
//               // If it's not 404, it means the endpoint exists but there's another error
//               const errorData = await response.text()
//               console.error(`${endpoint.method} ${endpoint.url} failed:`, errorData)
//               lastError = new Error(`Update failed: ${response.status} - ${errorData}`)
//             }
//           } catch (error) {
//             console.log(`${endpoint.method} ${endpoint.url} failed:`, error.message)
//             lastError = error
//           }
//         }

//         if (!success) {
//           throw lastError || new Error('All user update endpoints failed')
//         }

//         // Also store in localStorage as backup
//         localStorage.setItem('userClass', standard)
//         localStorage.setItem('userStandard', standard)

//         console.log('Class updated successfully in database and localStorage')
//         toast.success('Class information saved!')
//         navigate("/quiz/instr/1")

//       } catch (error) {
//         console.error('Error updating class in database:', error)
//         console.error('Error details:', {
//           message: error.message,
//           status: error.status,
//           data: error.data
//         })

//         // Store locally as fallback and continue
//         try {
//           localStorage.setItem('userClass', standard)
//           localStorage.setItem('userStandard', standard)
//           console.log('Class stored locally as fallback')
//         } catch (localError) {
//           console.error('Error storing class locally:', localError)
//         }

//         // Show error but continue to quiz
//         toast.error('Could not save class to database, but continuing to quiz')
//         navigate("/quiz/instr/1")

//       } finally {
//         setIsProcessing(false)
//       }
//     }, 100)

//   }, [data, navigate, hasPrompted, isProcessing, sec])

//   // Render based on section after hooks are registered
//   if (String(sec) !== '0') {
//     return <Instructions sec={sec} />
//   }

//   // For section 0, show a proper UI instead of error screen
//   if (isProcessing) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
//         <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//           <h2 className="text-2xl font-bold mb-4">Quiz Setup</h2>
//           <p className="text-gray-600 mb-4">Please wait while we collect your class information...</p>
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         </div>
//       </div>
//     )
//   }

//   // Idle UI while waiting to prompt
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
//       <div className="bg-white p-8 rounded-lg shadow-lg text-center">
//         <h2 className="text-2xl font-bold mb-4">Quiz Setup</h2>
//         <p className="text-gray-600 mb-4">Preparing class prompt...</p>
//       </div>
//     </div>
//   )
// }

// export default ClassPrompt

import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Instructions } from "../pages/pages"
import toast from "react-hot-toast"

const ClassPrompt = () => {
  const { data } = useSelector((state) => state.user)
  const { sec } = useParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasAttemptedQuiz, setHasAttemptedQuiz] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // New state for loading status
  useEffect(() => {
    const checkQuizAttempt = async () => {
      setIsLoading(true);
      const userId = data?.$id || data?.id || data?.userId;

      if (!userId) {
        console.error("User ID is missing.");
        toast.error("User not authenticated properly");
        navigate("/");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://qcm-backend-ln5c.onrender.com/api/user/score?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.score !== null) {
            setHasAttemptedQuiz(true);
            toast.warn("You have already completed the quiz!");
          }
        } else {
          console.warn("Could not retrieve score, proceeding with caution.");
        }
      } catch (error) {
        console.error("Error checking quiz attempt:", error);
        // In case of error, assume user can proceed
      } finally {
        setIsLoading(false);
      }
    };

    if (String(sec) === "0") {
      checkQuizAttempt();
    }
    else {
      setIsLoading(false);
    }
  }, [data, navigate, sec]);

  // useEffect(() => {
  //   if (String(sec) !== "0") return
  //   if (!data || (!data.$id && !data.id && !data.userId)) {
  //     console.error("User data not available in ClassPrompt:", data)
  //     toast.error("User not authenticated properly")
  //     navigate("/")
  //     return
  //   }
  // }, [sec, data, navigate])

  const handleClassSelect = async (classValue) => {
    setIsProcessing(true)

    const userId = data.$id || data.id || data.userId

    try {
      const response = await fetch(
        `https://qcm-backend-ln5c.onrender.com/api/user/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("token")
              }`,
          },
          body: JSON.stringify({ class: classValue }),
        }
      )

      if (response.ok) {
        const result = await response.json()
        console.log("Class updated successfully:", result)
      } else {
        console.warn("DB update failed, fallback to local storage")
      }

      // Save locally as backup
      localStorage.setItem("userClass", classValue)
      localStorage.setItem("userStandard", classValue)

      toast.success("Class information saved!")
      navigate("/quiz/instr/1")
    } catch (error) {
      console.error("Error saving class:", error)
      localStorage.setItem("userClass", classValue)
      localStorage.setItem("userStandard", classValue)
      toast.error("Could not save to database, but continuing...")
      navigate("/quiz/instr/1")
    } finally {
      setIsProcessing(false)
    }
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="ml-3">Loading...</p>
      </div>
    );
  }

  if (hasAttemptedQuiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">
            You've already taken the quiz.
          </h2>
          <p className="mt-4 text-gray-700">
            You are not allowed to attempt it more than once.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // If not section 0, show instructions normally
  if (String(sec) !== "0") {
    return <Instructions sec={sec} />
  }
  // UI for IQC Intro + Class Selection
  return (
    <div
      className="flex justify-center items-center min-h-screen sm:px-2"
      style={{
        background: 'url("/image-quiz-bg.png") no-repeat center center/cover',
      }}
    >
      <div className="bg-white p-10 sm:rounded-lg shadow-lg sm:w-3/4 min-h-1/2 flex sm:flex-row flex-col gap-5 items-center">
        {/* Left Side: Instructions */}
        <div className="sm:w-1/2 flex flex-col sm:gap-5">
          <h1 className="text-xl font-semibold">
            Hey{" "}
            <span className="uppercase">
              {data?.name || data?.username || "Student"}
            </span>
            , Welcome
          </h1>
          <h2 className="text-2xl font-bold mt-2">IQC Round 1</h2>
          <ul className="text-gray-700 leading-relaxed mt-3 space-y-2">
            <li>
              <strong>Format:</strong> There are <span className="text-emerald-600 font-semibold">4 sections</span>.
            </li>
            <li>
              <strong>Progression:</strong> You must submit the current section
              to enter the next one.
            </li>
            <li className="text-red-600 font-semibold">
              ⚠ Warning: If you press <kbd>Esc</kbd> or try to exit full screen,
              you will be <u>disqualified immediately</u> without any warning.
            </li>
          </ul>
        </div>

        {/* Right Side: Class Selection */}
        <div className="sm:w-1/2 flex flex-col gap-5 items-center">
          <h2 className="text-xl font-semibold">Select Your Standard to </h2>
          <hr className="w-full" />
          {isProcessing ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 w-full">
              {[8, 9, 10, 11, 12].map((classValue) => (
                <button
                  key={classValue}
                  onClick={() => handleClassSelect(classValue)}
                  className="py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  {classValue}
                </button>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-600 mt-3">
            Please select your class to continue.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClassPrompt
