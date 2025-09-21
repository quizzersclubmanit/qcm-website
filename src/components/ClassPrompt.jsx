import dbService from "../api/db.service"
import { Outlet, useNavigate, useParams } from "react-router-dom"
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

  // Handle different sections
  if (sec != 0) return <Instructions sec={sec} />
  
  // Show loading while processing to prevent multiple renders
  if (isProcessing) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-white text-xl">Processing class information...</div>
    </div>
  )

  useEffect(() => {
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
    setTimeout(() => {
      const standard = prompt(
        "Enter your class (numeric value, eg. 10 for students of 10th standard)"
      )
      
      if (standard === null || standard === "") {
        setIsProcessing(false)
        navigate("/")
        return
      }

      // For now, just store class in localStorage and continue to quiz
      // Backend update can be implemented later when schema is ready
      try {
        localStorage.setItem('userClass', standard)
        localStorage.setItem('userStandard', standard)
        console.log('Class stored locally:', standard)
        toast.success('Class information saved!')
        navigate("/quiz/instr/1")
      } catch (error) {
        console.error('Error storing class locally:', error)
        // Even if localStorage fails, continue to quiz
        toast('Continuing to quiz...')
        navigate("/quiz/instr/1")
      } finally {
        setIsProcessing(false)
      }
    }, 100)

    // TODO: Uncomment this when backend schema is updated
    /*
    const userId = data.$id || data.id || data.userId
    dbService
      .update({
        collectionId: "user",
        id: userId,
        data: { 
          class: parseInt(standard),
          standard: parseInt(standard)
        }
      })
      .then(() => {
        console.log('Class/Standard updated successfully')
        toast.success('Class information saved!')
        navigate("/quiz/instr/1")
      })
      .catch((error) => {
        console.error('Error updating class:', error)
        toast('Could not save class info, but continuing to quiz')
        navigate("/quiz/instr/1")
      })
    */
  }, [data, navigate, hasPrompted, isProcessing])

  // For section 0, show a proper UI instead of error screen
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

export default ClassPrompt
