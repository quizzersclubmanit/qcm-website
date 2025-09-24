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

import dbService from "../api/db.service"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Instructions } from "../pages/pages"
import toast from "react-hot-toast"

const ClassPrompt = () => {
  const { data } = useSelector((state) => state.user)
  const { sec } = useParams()
  const navigate = useNavigate()
  const [hasPrompted, setHasPrompted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  console.log('ClassPrompt - sec:', sec, 'data:', data)

  useEffect(() => {
    // Only run prompt flow for sec == 0
    if (String(sec) !== '0') return
    // Check if user data exists and has required properties
    if (!data || (!data.$id && !data.id && !data.userId)) {
      console.error('User data not available in ClassPrompt:', data)
      toast.error('User not authenticated properly')
      navigate('/signin')
      return
    }

    // Only prompt once
    if (hasPrompted) return
    
    setHasPrompted(true)
    setIsProcessing(true)

    // Use setTimeout to ensure state updates are processed
    setTimeout(async () => {
      const standard = prompt(
        "Enter your class (numeric value, eg. 10 for students of 10th standard)"
      )
      
      if (standard === null || standard === "") {
        setIsProcessing(false)
        navigate("/")
        return
      }

      // Update user class in database
      const userId = data.$id || data.id || data.userId
      const classValue = parseInt(standard)
      
      if (isNaN(classValue) || classValue < 1 || classValue > 12) {
        toast.error('Please enter a valid class (1-12)')
        setIsProcessing(false)
        return
      }

      try {
        console.log('Updating user class in database:', { userId, class: classValue })
        console.log('User data available:', data)
        
        // Based on backend analysis, try the most likely endpoints
        const endpoints = [
          { url: `/api/user/profile`, method: 'PUT' },
          { url: `/api/user/${userId}`, method: 'PUT' },
          { url: `/api/user/${userId}`, method: 'PATCH' },
          { url: `/api/auth/profile`, method: 'PATCH' }
        ]
        
        let success = false
        let lastError = null
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying ${endpoint.method} ${endpoint.url}`)
            
            const response = await fetch(`https://qcm-backend-ln5c.onrender.com${endpoint.url}`, {
              method: endpoint.method,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
              },
              body: JSON.stringify({ 
                class: classValue
              })
            })
            
            console.log(`${endpoint.method} ${endpoint.url} response status:`, response.status)
            
            if (response.ok) {
              const result = await response.json()
              console.log(`Update successful with ${endpoint.method} ${endpoint.url}:`, result)
              success = true
              break
            } else if (response.status !== 404) {
              // If it's not 404, it means the endpoint exists but there's another error
              const errorData = await response.text()
              console.error(`${endpoint.method} ${endpoint.url} failed:`, errorData)
              lastError = new Error(`Update failed: ${response.status} - ${errorData}`)
            }
          } catch (error) {
            console.log(`${endpoint.method} ${endpoint.url} failed:`, error.message)
            lastError = error
          }
        }
        
        if (!success) {
          throw lastError || new Error('All user update endpoints failed')
        }
        
        // Also store in localStorage as backup
        localStorage.setItem('userClass', standard)
        localStorage.setItem('userStandard', standard)
        
        console.log('Class updated successfully in database and localStorage')
        toast.success('Class information saved!')
        navigate("/quiz/instr/1")
        
      } catch (error) {
        console.error('Error updating class in database:', error)
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          data: error.data
        })
        
        // Store locally as fallback and continue
        try {
          localStorage.setItem('userClass', standard)
          localStorage.setItem('userStandard', standard)
          console.log('Class stored locally as fallback')
        } catch (localError) {
          console.error('Error storing class locally:', localError)
        }
        
        // Show error but continue to quiz
        toast.error('Could not save class to database, but continuing to quiz')
        navigate("/quiz/instr/1")
        
      } finally {
        setIsProcessing(false)
      }
    }, 100)

  }, [data, navigate, hasPrompted, isProcessing, sec])

  // Render based on section after hooks are registered
  if (String(sec) !== '0') {
    return <Instructions sec={sec} />
  }

  // For section 0, show a proper UI instead of error screen
  if (isProcessing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Setup</h2>
          <p className="text-gray-600 mb-4">Please wait while we collect your class information...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  // Idle UI while waiting to prompt
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Setup</h2>
        <p className="text-gray-600 mb-4">Preparing class prompt...</p>
      </div>
    </div>
  )
}

export default ClassPrompt
