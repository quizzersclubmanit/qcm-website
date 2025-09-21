// import env from "../../constants" // Not needed for new backend
import dbService from "../api/db.service"
import storeService from "../api/store.service"
import { Input, Button } from "./components"
import { useForm } from "react-hook-form"
import { addQuiz, editQuiz } from "../redux/quiz.slice"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { useState, useCallback } from "react"
import { CiFileOn, CiFileOff } from "react-icons/ci"
import { uploadFiles, deleteFiles } from "../utils/utils"

const Quiz = ({ quiz = {}, setShowModal = () => {} }) => {
  const { setValue, handleSubmit, formState, register, watch } = useForm({
    defaultValues: {
      question: quiz.question || "",
      supportingPic: quiz.supportingPic || "",
      options: quiz.options || new Array(4).fill(""),
      answers: quiz.answers || new Array(4).fill(false),
      reward: quiz.reward || 0,
      nagativeMarking: quiz.nagativeMarking || 0,
      section: quiz.section || 1,
      optionImages: new Array(4).fill(""),
      isInteger: false,
      integerAnswer: ""
    }
  })
  const { errors } = formState
  const editTab = Boolean(quiz.$id)
  const dispatch = useDispatch()
  const options = ["A", "B", "C", "D"]
  const [acceptFileFrom, setAcceptFileFrom] = useState(new Array(5).fill(false))
  const [optionsContainImg, setOptionsContainImg] = useState(false)
  const selSection = watch("section")
  const isInteger = watch("isInteger")

  const resetVals = useCallback(() => {
    setValue("question", "")
    setValue("options", new Array(4).fill(""))
    setValue("answers", new Array(4).fill(false))
    setValue("reward", 0)
    setValue("nagativeMarking", 0)
    setValue("section", 1)
    setValue("supportingPic", "")
    setValue("optionImages", new Array(4).fill(""))
    setAcceptFileFrom(new Array(5).fill(false))
    setOptionsContainImg(false)
  }, [setValue])

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
              toggleAcceptFile(index)
              // Update optionsContainImg based on whether any option has file upload enabled
              if (index > 0) {
                const newAcceptFileFrom = acceptFileFrom.map((bool, idx) => 
                  idx === index ? false : bool
                )
                const hasOptionImages = newAcceptFileFrom.slice(1).some(bool => bool)
                setOptionsContainImg(hasOptionImages)
              }
            }}
          />
        )
      return (
        <CiFileOn
          className="text-2xl cursor-pointer ml-4 bg-white rounded"
          onClick={() => {
            toggleAcceptFile(index)
            // Update optionsContainImg when enabling file upload for options
            if (index > 0) {
              setOptionsContainImg(true)
            }
          }}
        />
      )
    },
    [acceptFileFrom]
  )

  const uploadQuizHandler = useCallback(async (formData) => {
    console.log('Adding quiz with data:', formData)
    
    // Validate required fields
    if (!formData.question || !formData.question.trim()) {
      toast.error('Question is required')
      return
    }
    
    const integerMode = Number(formData.section) === 3 && formData.isInteger === true
    
    if (!integerMode) {
      if (!formData.options || formData.options.some(opt => !opt || !opt.trim())) {
        toast.error('All options are required')
        return
      }
      if (!formData.answers || !formData.answers.some(ans => ans === true)) {
        toast.error('At least one correct answer must be selected')
        return
      }
    } else {
      // Integer mode validations
      if (!formData.integerAnswer || String(formData.integerAnswer).trim() === "") {
        toast.error('Please enter the integer correct answer')
        return
      }
    }
    
    let correctAnswerIndex = -1
    let correctAnswer = ""
    if (!integerMode) {
      // Allow multiple correct answers; serialize as letters (e.g., 'A C')
      const selectedIdxs = (formData.answers || [])
        .map((v, i) => (v ? i : -1))
        .filter((i) => i >= 0)

      if (selectedIdxs.length === 0) {
        toast.error('Please select at least one correct answer')
        return
      }

      if (selectedIdxs.length === 1) {
        correctAnswerIndex = selectedIdxs[0]
        correctAnswer = formData.options[correctAnswerIndex]
        if (!correctAnswer || !correctAnswer.trim()) {
          toast.error('Correct answer cannot be empty')
          return
        }
      } else {
        // Multiple correct: store letters so play scorer can map to indices
        const letters = selectedIdxs.map((i) => String.fromCharCode(65 + i)) // A,B,C,D
        correctAnswer = letters.join(' ')
      }
    } else {
      correctAnswer = String(formData.integerAnswer).trim()
    }
    
    // Ensure all options are non-empty after trimming when not integer mode
    const trimmedOptions = formData.options.map(opt => opt.trim()).filter(opt => opt.length > 0)
    if (!integerMode) {
      if (trimmedOptions.length !== 4) {
        toast.error('All 4 options must be filled')
        return
      }
    }
    
    // Show loading toast
    const loadingToast = toast.loading('Processing quiz and uploading files...')
    
    try {
      let supportingPicUrl = null
      let optionImageUrls = []
      
      // Handle supporting picture upload
      if (formData.supportingPic && formData.supportingPic[0]) {
        console.log('Uploading supporting picture...')
        try {
          const supportingPicFile = formData.supportingPic[0]
          const uploadResult = await storeService.uploadFile({ file: supportingPicFile })
          if (uploadResult && (uploadResult.$id || uploadResult.id || uploadResult.url)) {
            supportingPicUrl = uploadResult.$id || uploadResult.id || uploadResult.url
            console.log('Supporting picture uploaded:', supportingPicUrl)
          } else {
            console.error('Upload result is invalid:', uploadResult)
            toast.error('Failed to upload supporting picture - invalid result')
          }
        } catch (error) {
          console.error('Error uploading supporting picture:', error)
          toast.error('Failed to upload supporting picture: ' + error.message)
        }
      }
      
      // Handle option images upload (skip in integer mode)
      const hasOptionImages = !integerMode && optionsContainImg && formData.optionImages && 
        formData.optionImages.some(img => img && img[0])
      
      if (hasOptionImages) {
        console.log('Uploading option images...')
        try {
          // Upload each option image individually
          optionImageUrls = await Promise.all(
            formData.optionImages.map(async (imgArray, index) => {
              if (imgArray && imgArray[0]) {
                try {
                  const uploadResult = await storeService.uploadFile({ file: imgArray[0] })
                  if (uploadResult && (uploadResult.$id || uploadResult.id || uploadResult.url)) {
                    console.log(`Option ${index + 1} image uploaded:`, uploadResult.$id || uploadResult.id || uploadResult.url)
                    return uploadResult.$id || uploadResult.id || uploadResult.url
                  }
                } catch (error) {
                  console.error(`Error uploading option ${index + 1} image:`, error)
                }
              }
              return null
            })
          )
          console.log('All option images processed:', optionImageUrls)
        } catch (error) {
          console.error('Error uploading option images:', error)
          toast.error('Failed to upload option images: ' + error.message)
        }
      }
      
      // Prepare final options (mix of text and image URLs)
      // Backend requires options to be a non-empty array; for integer mode, send blanks
      const finalOptions = integerMode
        ? new Array(4).fill("")
        : trimmedOptions.map((option, index) => {
            if (optionImageUrls[index]) {
              return optionImageUrls[index] // Use image URL if available
            }
            return option // Use text option
          })
      
      // Update correct answer to match the final options
      let finalCorrectAnswer = correctAnswer.trim()
      if (!integerMode && correctAnswerIndex > -1 && optionImageUrls[correctAnswerIndex]) {
        finalCorrectAnswer = optionImageUrls[correctAnswerIndex]
      }
      
      // Format data to match Prisma Quiz schema
      const quizData = {
        question: formData.question.trim(),
        options: finalOptions,
        correctAnswer: finalCorrectAnswer, // Use updated correct answer
        section: Number(formData.section) || 1,
        supportingPic: supportingPicUrl,
        optionsContainImg: !integerMode && hasOptionImages,
        inActive: false
      }
      
      console.log('=== Quiz Data Validation ===');
      console.log('Question:', quizData.question, 'Length:', quizData.question.length);
      console.log('Options:', quizData.options, 'Count:', quizData.options.length);
      console.log('Options lengths:', quizData.options.map(opt => opt ? opt.length : 0));
      console.log('Correct Answer:', quizData.correctAnswer, 'Length:', quizData.correctAnswer ? quizData.correctAnswer.length : 0);
      console.log('Section:', quizData.section, 'Type:', typeof quizData.section);
      console.log('Supporting Pic:', quizData.supportingPic ? 'Present (length: ' + quizData.supportingPic.length + ')' : 'null');
      console.log('Options Contain Img:', quizData.optionsContainImg, 'Type:', typeof quizData.optionsContainImg);
      console.log('Inactive:', quizData.inActive, 'Type:', typeof quizData.inActive);
      
      // Check for potential issues (reduced threshold since we now have compression)
      const hasLargeData = quizData.options.some(opt => opt && opt.length > 500000) || 
                          (quizData.supportingPic && quizData.supportingPic.length > 500000) ||
                          (quizData.correctAnswer && quizData.correctAnswer.length > 500000);
      
      if (hasLargeData) {
        console.warn('⚠️ Large data detected - this might cause server issues');
        console.log('Data sizes:', {
          supportingPic: quizData.supportingPic ? quizData.supportingPic.length : 0,
          options: quizData.options.map(opt => opt ? opt.length : 0),
          correctAnswer: quizData.correctAnswer ? quizData.correctAnswer.length : 0
        });
        
        // Ask user if they want to proceed without images
        const proceedWithoutImages = window.confirm(
          'The images are too large and might cause server errors. Would you like to save the quiz without images?'
        );
        
        if (proceedWithoutImages) {
          // Reset to text-only quiz (or integer mode payload)
          quizData.supportingPic = null;
          if (integerMode) {
            // Keep non-empty array to satisfy backend validation
            quizData.options = new Array(4).fill("")
            quizData.correctAnswer = String(formData.integerAnswer).trim()
          } else {
            quizData.options = trimmedOptions; // Use original text options
            quizData.correctAnswer = correctAnswer.trim(); // Use original text answer
          }
          quizData.optionsContainImg = false;
          console.log('Proceeding without images...');
        } else {
          toast.dismiss(loadingToast);
          toast.error('Quiz creation cancelled due to large image sizes');
          return;
        }
      }
      
      console.log('=== Sending to API ===');
      
      toast.dismiss(loadingToast)
      const savingToast = toast.loading('Saving quiz to database...')
      
      let doc;
      try {
        doc = await dbService.insert({
          collectionId: "quiz",
          data: quizData
        })
      } catch (serverError) {
        console.error('=== Server Error Details ===');
        console.error('Error message:', serverError.message);
        console.error('Error status:', serverError.status);
        console.error('Has supporting pic:', !!quizData.supportingPic);
        console.error('Has option images:', quizData.optionsContainImg);
        console.error('Full error:', serverError);
        
        // If server error and we have images, automatically try without images
        if ((serverError.message.includes('500') || serverError.status === 500) && (quizData.supportingPic || quizData.optionsContainImg)) {
          console.warn('🔄 Server error with images detected, automatically retrying without images...');
          toast.dismiss(savingToast);
          
          const retryToast = toast.loading('Retrying without images...');
          
          // Create text-only version
          const textOnlyQuizData = {
            question: formData.question.trim(),
            options: trimmedOptions,
            correctAnswer: correctAnswer.trim(),
            section: Number(formData.section) || 1,
            supportingPic: null,
            optionsContainImg: false,
            inActive: false
          };
          
          console.log('Retrying with text-only data:', textOnlyQuizData);
          
          try {
            doc = await dbService.insert({
              collectionId: "quiz",
              data: textOnlyQuizData
            });
            toast.dismiss(retryToast);
            toast.success('Quiz saved successfully (without images due to server limitations)');
          } catch (retryError) {
            console.error('Retry also failed:', retryError);
            toast.dismiss(retryToast);
            
            // If retry also fails, ask user what to do
            const tryAgain = window.confirm(
              'Both attempts failed. The server might be having issues. Would you like to try again?'
            );
            
            if (!tryAgain) {
              throw new Error('Quiz creation failed. Please try again later or contact support.');
            } else {
              throw retryError;
            }
          }
        } else {
          // No images or different error - just throw the original error
          throw serverError;
        }
      }
      
      console.log('Quiz added successfully:', doc)
      toast.dismiss(savingToast)
      
      // Handle different response formats from the API
      const quizDoc = doc.data || doc
      dispatch(addQuiz(quizDoc))
      toast.success("Quiz Added Successfully!")
      resetVals()
      
    } catch (error) {
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
    }
  }, [dispatch, resetVals, optionsContainImg])

  const editQuizHandler = useCallback((formData) => {
    console.log('Updating quiz with data:', formData)
    
    // Convert answers array to correctAnswer string (matching Prisma schema)
    const correctAnswerIndex = formData.answers.findIndex(ans => ans === true)
    const correctAnswer = formData.options[correctAnswerIndex]
    
    dbService
      .update({
        collectionId: "quiz",
        id: quiz.$id || quiz.id,
        data: {
          question: formData.question,
          options: formData.options,
          correctAnswer: correctAnswer, // Single correct answer as string
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
        <File index={0} />
        <span className="text-sm text-gray-500 ml-4">Click file icon to add supporting image</span>
      </Input>
      {acceptFileFrom[0] && (
        <Input
          oneline
          label="Supporting Picture"
          type="file"
          accept="image/*"
          className="p-4 rounded-lg text-lg focus:outline-0"
          {...register("supportingPic")}
        />
      )}
      <div>
        {/* Integer mode hint and input when Section 3 (hidden as per new requirement) */}
        {false && (
          <div className="mb-3 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm bg-pink-200 px-2 py-1 rounded">
              <input type="checkbox" {...register("isInteger")} />
              Integer Type (Section 3)
            </label>
            {isInteger && (
              <Input
                oneline
                label="Integer Answer"
                type="text"
                placeholder="Enter correct integer"
                className="px-4 py-2 rounded-lg focus:outline-0"
                {...register("integerAnswer")}
              />
            )}
          </div>
        )}

        {/* Options only when not integer mode */}
        {!(Number(selSection) === 3 && isInteger) && (
          <>
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
                <File index={index + 1} />
                <span className="text-xs text-gray-400 ml-2">Click file icon for image option</span>
              </Input>
            ))}

            {/* File inputs for options */}
            {acceptFileFrom.slice(1).map((acceptFile, index) =>
              acceptFile && (
                <Input
                  key={`option-file-${index}`}
                  oneline
                  label={`Option ${String.fromCharCode(65 + index)} Image`}
                  type="file"
                  accept="image/*"
                  className="p-4 rounded-lg text-lg focus:outline-0"
                  {...register(`optionImages.${index}`)}
                />
              )
            )}
          </>
        )}
      </div>
      <div className="flex flex-col items-center justify-between gap-6 bg-pink-500 p-2 rounded-lg">
        <div className="flex gap-6 items-center bg-pink-300 p-2 rounded-lg">
          <label className="text-lg" htmlFor="section">
            Section
          </label>
          <select
            id="section"
            className="p-1 cursor-pointer rounded-lg"
            defaultValue={1}
            {...register("section")}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        {!(Number(selSection) === 3 && isInteger) && (
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
        )}
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
      <div className="flex gap-4 w-full">
        <Button
          type="button"
          className="text-xl hover:bg-[#FCA311] bg-yellow-400 flex-1 p-3 rounded-lg"
          label={editTab ? "Save" : "+ Add Question"}
          onClick={handleSubmit((formData) => {
            console.log('Form submitted with data:', formData)
            if (editTab) editQuizHandler(formData)
            else uploadQuizHandler(formData)
          })}
        />
        
        {!editTab && (
          <Button
            type="button"
            className="text-lg hover:bg-gray-600 bg-gray-500 text-white px-4 py-3 rounded-lg whitespace-nowrap"
            label="Text Only"
            onClick={handleSubmit((formData) => {
              console.log('Adding text-only quiz:', formData)
              
              // Force text-only mode
              const textOnlyData = {
                ...formData,
                supportingPic: null,
                optionImages: new Array(4).fill(""),
              }
              
              // Temporarily disable images
              const originalOptionsContainImg = optionsContainImg
              setOptionsContainImg(false)
              
              uploadQuizHandler(textOnlyData).finally(() => {
                setOptionsContainImg(originalOptionsContainImg)
              })
            })}
          />
        )}
      </div>
    </form>
  )
}

export default Quiz
