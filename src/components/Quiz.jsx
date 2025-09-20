// import env from "../../constants" // Not needed for new backend
import dbService from "../api/db.service"
import { Input, Button } from "./components"
import { useForm } from "react-hook-form"
import { addQuiz, editQuiz } from "../redux/quiz.slice"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { useState, useCallback } from "react"
import { CiFileOn, CiFileOff } from "react-icons/ci"
import { uploadFiles, deleteFiles } from "../utils/utils"

const Quiz = ({ quiz = {}, setShowModal = () => {} }) => {
  const { setValue, handleSubmit, formState, register } = useForm({
    defaultValues: {
      question: quiz.question || "",
      supportingPic: quiz.supportingPic || "",
      options: quiz.options || new Array(4).fill(""),
      answers: quiz.answers || new Array(4).fill(false),
      reward: quiz.reward || 0,
      nagativeMarking: quiz.nagativeMarking || 0,
      section: quiz.section || 1
    }
  })
  const { errors } = formState
  const editTab = Boolean(quiz.$id)
  const dispatch = useDispatch()
  const options = ["A", "B", "C", "D"]
  const [acceptFileFrom, setAcceptFileFrom] = useState(new Array(5).fill(false))
  const [optionsContainImg, setOptionsContainImg] = useState(false)

  const resetVals = useCallback(() => {
    setValue("question", "")
    setValue("options", new Array(4).fill(""))
    setValue("answers", new Array(4).fill(false))
    setValue("reward", 0)
    setValue("nagativeMarking", 0)
    setValue("section", 1)
    setValue("supportingPic", "")
  }, [])

  const File = useCallback(
    ({ index }) => {
      function toggleAcceptFile(index) {
        setAcceptFileFrom((prev) =>
          prev.map((bool, idx) => (idx == index ? !bool : bool))
        )
      }

      if (acceptFileFrom[index])
        return (
          <CiFileOff
            className="text-2xl cursor-pointer ml-4 bg-white rounded"
            onClick={() => {
              if (index > 0) setOptionsContainImg(true)
              toggleAcceptFile(index)
            }}
          />
        )
      return (
        <CiFileOn
          className="text-2xl cursor-pointer ml-4 bg-white rounded"
          onClick={() => {
            if (index > 0) setOptionsContainImg(false)
            toggleAcceptFile(index)
          }}
        />
      )
    },
    [acceptFileFrom]
  )

  const uploadQuizHandler = useCallback((formData) => {
    // For now, handle text-based quizzes without file uploads
    console.log('Adding quiz with data:', formData)
    
    // Validate required fields
    if (!formData.question || !formData.question.trim()) {
      toast.error('Question is required')
      return
    }
    
    if (!formData.options || formData.options.some(opt => !opt || !opt.trim())) {
      toast.error('All options are required')
      return
    }
    
    if (!formData.answers || !formData.answers.some(ans => ans === true)) {
      toast.error('At least one correct answer must be selected')
      return
    }
    
    const quizData = {
      question: formData.question.trim(),
      options: formData.options.map(opt => opt.trim()),
      answers: formData.answers,
      reward: Number(formData.reward) || 1,
      nagativeMarking: Number(formData.nagativeMarking) || 0,
      section: Number(formData.section) || 1,
      inActive: false,
      optionsContainImg: false,
      supportingPic: ""
    }
    
    console.log('Sending quiz data to API:', quizData)
    
    // Show loading toast
    const loadingToast = toast.loading('Adding quiz...')
    
    dbService
      .insert({
        collectionId: "quiz",
        data: quizData
      })
      .then((doc) => {
        console.log('Quiz added successfully:', doc)
        toast.dismiss(loadingToast)
        
        // Handle different response formats from the API
        const quizDoc = doc.data || doc
        dispatch(addQuiz(quizDoc))
        toast.success("Quiz Added Successfully!")
        resetVals()
      })
      .catch((error) => {
        console.error('Error adding quiz:', error)
        toast.dismiss(loadingToast)
        
        // Provide more specific error messages
        let errorMessage = 'Failed to add quiz'
        if (error.message) {
          if (error.message.includes('Network error')) {
            errorMessage = 'Network error: Please check your internet connection'
          } else if (error.message.includes('401')) {
            errorMessage = 'Authentication error: Please login again'
          } else if (error.message.includes('403')) {
            errorMessage = 'Permission denied: You need admin privileges'
          } else {
            errorMessage = error.message
          }
        }
        
        toast.error(errorMessage)
      })
  }, [dispatch, resetVals])

  const editQuizHandler = useCallback((formData) => {
    console.log('Updating quiz with data:', formData)
    
    dbService
      .update({
        collectionId: "quiz",
        id: quiz.$id || quiz.id,
        data: {
          question: formData.question,
          options: formData.options,
          answers: formData.answers,
          reward: Number(formData.reward),
          nagativeMarking: Number(formData.nagativeMarking),
          section: Number(formData.section),
          optionsContainImg: false, // For now, only text options
          supportingPic: "" // No image support for now
        }
      })
      .then((doc) => {
        console.log('Quiz updated successfully:', doc)
        dispatch(
          editQuiz({
            $id: quiz.$id || quiz.id,
            changes: doc
          })
        )
        toast.success("Quiz Updated Successfully!")
        setShowModal(false)
      })
      .catch((error) => {
        console.error('Error updating quiz:', error)
        toast.error(error.message || 'Failed to update quiz')
      })
  }, [quiz, dispatch, setShowModal])

  return (
    <form noValidate className="sm:w-2/3 w-4/5 flex flex-col gap-4">
      <Input
        error={errors.question}
        placeholder="Question here..."
        className="p-4 rounded-lg text-lg focus:outline-0"
        {...register("question", {
          required: {
            value: true,
            message: "This is a required field"
          }
        })}
      >
        {/* <File index={0} /> */}
        <span className="text-sm text-gray-500 ml-4">Text only for now</span>
      </Input>
      {/* Temporarily disabled file upload
      {acceptFileFrom[0] && (
        <Input
          oneline
          label="Supporting Picture"
          type="file"
          className="p-4 rounded-lg text-lg focus:outline-0"
          {...register("supportingPic")}
        />
      )}
      */}
      <div>
        {options.map((option, index) => (
          <Input
            type="text"
            key={index}
            className="px-4 py-2 rounded-lg focus:outline-0"
            error={errors.options}
            placeholder={`Option ${option}`}
            {...register(`options.${index}`, {
              required: {
                value: true,
                message: "This is a required field"
              }
            })}
          >
            {/* <File index={index + 1} /> */}
            <span className="text-xs text-gray-400 ml-2">Text only</span>
          </Input>
        ))}
      </div>
      <div className="flex flex-col items-center justify-between gap-6 bg-pink-500 p-2 rounded-lg">
        <div className="flex gap-6 items-center bg-pink-300 p-2 rounded-lg">
          <label className="text-lg" htmlFor="section">
            Section
          </label>
          <select
            id="section"
            className="p-1 cursor-pointer rounded-lg"
            defaultValue={0}
            {...register("section")}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div className="flex gap-5 items-center bg-pink-300 p-2 rounded-lg">
          <p className="text-lg">Answers: </p>
          <div className="flex items-center gap-5">
            {options.map((option, index) => (
              <Input
                label={option}
                key={index}
                type="checkbox"
                className="w-5 h-5 rounded focus:ring-blue-500 focus:ring-2"
                {...register(`answers.${index}`)}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-6">
          <Input
            type="number"
            className="p-2 rounded-lg focus:outline-0 focus:bg-pink-200 transition-all bg-pink-300"
            oneline
            label="Negative Marking"
            error={errors.nagativeMarking}
            {...register("nagativeMarking", {
              min: {
                value: 0,
                message: "Cannot be negative"
              }
            })}
          />
          <Input
            type="number"
            className="p-2 rounded-lg focus:outline-0 focus:bg-pink-200 transition-all bg-pink-300"
            oneline
            label="Enter Points"
            error={errors.reward}
            {...register("reward", {
              required: {
                value: true,
                message: "Points are required"
              },
              min: {
                value: 1,
                message: "Points must be at least 1"
              }
            })}
          />
        </div>
      </div>
      <Button
        type="button"
        className="text-xl hover:bg-[#FCA311] bg-yellow-400 w-full p-3 rounded-lg"
        label={editTab ? "Save" : "+ Add Question"}
        onClick={handleSubmit((formData) => {
          console.log('Form submitted with data:', formData)
          if (editTab) editQuizHandler(formData)
          else uploadQuizHandler(formData)
        })}
      />
    </form>
  )
}

export default Quiz
