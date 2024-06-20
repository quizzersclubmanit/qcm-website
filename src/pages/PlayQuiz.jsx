import "./pages.css"
import { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setQuizes, editQuiz } from "../redux/quiz.slice"
import env, { timeLimits } from "../../constants"
import { Navigate } from "react-router-dom"
import {
  Button,
  Container,
  ProgressBar,
  Loader,
  NotAvailable
} from "../components/components"
import { useNavigate } from "react-router-dom"
import dbService from "../api/db.service"
import storeService from "../api/store.service"
import { Query } from "appwrite"
import toast from "react-hot-toast"
import { arraysEqual } from "../utils/utils"

const PlayQuiz = () => {
  const quizes = useSelector((state) => state.quizes)
  const { loggedIn, data } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [currentQue, setCurrentQue] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState(
    new Array(4).fill(false)
  )
  const [score, setScore] = useState(0)
  const navigate = useNavigate()
  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [timer, setTimer] = useState(undefined)

  const handleNext = useCallback(() => {
    let len = quizes.length
    if (currentQue >= len || timeleft == false) {
      // Handles calculation part
      quizes.forEach((quiz) => {
        if (quiz.markedAnswers) {
          if (arraysEqual(quiz.markedAnswers, quiz.answers))
            setScore((prev) => prev + quiz.reward)
          else setScore((prev) => prev - quiz.nagativeMarking)
        }
      })
      setShowSubmitBtn(true)
    } else {
      setCurrentQue((prev) => prev + 1)
      setSelectedOptions([])
    }
  }, [])

  const handleSubmit = useCallback(() => {
    dbService
      .insert({
        collectionId: env.leaderboardId,
        data: { userId: data.$id, score }
      })
      .then(() => {
        navigate(`/quiz/result/${score}`)
        toast.success("Quiz Submitted Succesfully")
      })
      .catch((error) => {
        toast.error(error.message)
        console.error(error)
      })
  }, [])

  useEffect(() => {
    dbService
      .select({
        collectionId: env.quizId,
        queries: [Query.equal("inActive", false), Query.orderAsc("section")]
      })
      .then((docs) => {
        dispatch(setQuizes(docs))
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    dbService
      .select({
        collectionId: env.leaderboardId,
        queries: [Query.equal("userId", data.$id)]
      })
      .then((docs) => {
        if (docs.length != 0) {
          navigate("/")
          toast("You've already attempted the quiz")
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    dispatch(
      editQuiz({
        $id: quizes[currentQue - 1]?.$id || 0,
        changes: { markedAnswers: selectedOptions }
      })
    )
  }, [selectedOptions])

  useEffect(() => {
    let timeleft = timeLimits[quizes[currentQue - 1]?.section - 1] || 30
    setTimer(timeleft)
    const interval = setInterval(() => {
      timeleft--
      setTimer((prev) => (prev > 0 ? prev - 1 : prev))
    }, 60000)
    return () => {
      clearInterval(interval)
    }
  }, [quizes.length])

  if (!loggedIn) return <Navigate to="/signup" />
  if (loading) return <Loader />
  if (quizes.length == 0)
    return <NotAvailable command="Back to Home Page" redirectURL="/" />

  return (
    <Container
      id="play-quiz"
      className="londrina-solid-regular w-screen sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col justify-start gap-10 items-center sm:items-center"
    >
      <ProgressBar progress={(currentQue / quizes.length) * 100} />
      <div className="flex w-full justify-evenly py-2 items-center border-4 border-white rounded-lg sm:text-2xl text-xl">
        <div className="flex flex-col text-white">
          <span>Section: {quizes[currentQue - 1]?.section}</span>
          <span>
            Question: {currentQue}/{quizes.length}
          </span>
        </div>
        <div className="flex flex-col text-yellow-400">
          <span>
            Marking Scheme: +{quizes[currentQue - 1]?.reward}, -
            {quizes[currentQue - 1]?.nagativeMarking}
          </span>
          <span>Time Left: {timer} (m)</span>
        </div>
      </div>
      <p className="p-4 rounded-lg text-xl focus:outline-0 bg-white md:w-1/2 sm:w-4/5 cursor-default">
        Q. {quizes[currentQue - 1]?.question} ?
      </p>
      {quizes[currentQue - 1]?.supportingPic && (
        <img
          src={storeService.fetchFilePreview({
            fileId: quizes[currentQue - 1]?.supportingPic
          })}
          alt="Supporting Picture"
          className="w-1/3 sm:w-1/4 md:w-[20%]"
        />
      )}
      <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-1 gap-3 md:w-1/2 sm:w-4/5 w-full">
        {quizes[currentQue - 1]?.options.map((option, index) => {
          if (quizes[currentQue - 1]?.optionsContainImg)
            return (
              <img
                key={index}
                src={storeService.fetchFilePreview({
                  fileId: option
                })}
                className={`w-full aspect-video cursor-pointer ${selectedOptions[index] ? "border-4 border-yellow-400" : ""} ${!timer && "pointer-events-none"}`}
                alt={`Option ${index}`}
                onClick={() => {
                  setSelectedOptions((prev) =>
                    prev.map((bool, idx) => (idx == index ? !bool : bool))
                  )
                }}
              />
            )
          return (
            <p
              key={index}
              className={`p-4 rounded-lg focus:outline-0 w-full cursor-pointer transition-all ${selectedOptions[index] ? "bg-yellow-400" : "bg-white hover:bg-gray-100"} ${!timer && "pointer-events-none"}`}
              onClick={() => {
                setSelectedOptions((prev) =>
                  prev.map((bool, idx) => (idx == index ? !bool : bool))
                )
              }}
            >
              {option}
            </p>
          )
        })}
      </div>
      {showSubmitBtn ? (
        <Button
          label="Submit"
          className="text-xl bg-yellow-300 hover:bg-yellow-400 p-3 rounded-lg"
          onClick={handleSubmit}
        />
      ) : (
        <div className="flex justify-between md:w-1/2 sm:w-4/5 w-full">
          <Button
            label="Prev"
            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 text-xl"
            onClick={() => {
              setCurrentQue((prev) => (prev > 1 ? prev - 1 : prev))
              setSelectedOptions([])
            }}
          />
          <Button
            label="Next"
            className="bg-blue-400 py-2 px-4 rounded hover:bg-blue-500 text-xl"
            onClick={handleNext}
          />
        </div>
      )}
    </Container>
  )
}

export default PlayQuiz
