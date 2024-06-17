import "./pages.css"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setQuizes, editQuiz } from "../redux/quiz.slice"
import env from "../../env"
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
import { Query } from "appwrite"
import toast from "react-hot-toast"

const PlayQuiz = () => {
  const quizes = useSelector((state) => state.quizes)
  const { loggedIn, data } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [currentQue, setCurrentQue] = useState(1)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const navigate = useNavigate()
  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [timeleft, setTimeleft] = useState(undefined)

  useEffect(() => {
    dbService
      .select({
        collectionId: env.quizId,
        queries: [Query.equal("inActive", false)]
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
        collectionId: env.scoreId,
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
        changes: { markedAnswer: selectedOption }
      })
    )
  }, [selectedOption])

  const handleNext = (timeObj = {}) => {
    let len = quizes.length
    if (currentQue >= len) {
      // Handles calculation part
      quizes.forEach((quiz) => {
        console.log(quiz)
        if (quiz.markedAnswer && quiz.markedAnswer == quiz.answer) {
          setScore((prev) => prev + quiz.reward)
        }
      })
      setShowSubmitBtn(true)
    } else {
      setCurrentQue((prev) => prev + 1)
      setSelectedOption(null)
    }
    timeObj.seconds = 0
  }

  const handleSubmit = () => {
    dbService
      .insert({
        collectionId: env.scoreId,
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
  }

  useEffect(() => {
    let timeObj = { seconds: 0 }
    const submitTime = 15,
      defaultTimerTime = 60
    if (showSubmitBtn) setTimeleft(submitTime)
    else setTimeleft(quizes[currentQue - 1]?.timeLimit || defaultTimerTime)
    const interval = setInterval(() => {
      timeObj.seconds++
      setTimeleft((prev) => prev - 1)
      if (showSubmitBtn && timeObj.seconds >= submitTime) handleSubmit()
      else if (
        !showSubmitBtn &&
        timeObj.seconds >=
          (quizes[currentQue - 1]?.timeLimit || defaultTimerTime)
      )
        handleNext(timeObj)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [quizes.length, showSubmitBtn, currentQue])

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
      <div className="flex w-full justify-evenly items-center border border-white rounded-lg">
        <span className="text-white text-2xl">
          Question: {currentQue}/{quizes.length}
        </span>
        <div className="flex flex-col">
          <span className="text-yellow-400 text-2xl">
            Reward: {quizes[currentQue - 1]?.reward}
          </span>
          <span className="text-yellow-400 text-2xl">
            {showSubmitBtn ? "Auto Submit in" : "Time Left"}: {timeleft} (s)
          </span>
        </div>
      </div>
      <p className="p-4 rounded-lg text-xl focus:outline-0 bg-white md:w-1/2 sm:w-4/5 cursor-default">
        Q. {quizes[currentQue - 1]?.question} ?
      </p>
      <div className="flex flex-col gap-1 md:w-1/2 sm:w-4/5 w-full">
        {quizes[currentQue - 1]?.options.map((option, index) => (
          <p
            key={index}
            className={`p-4 rounded-lg focus:outline-0 w-full cursor-pointer transition-all ${selectedOption == index ? "bg-yellow-400" : "bg-white hover:bg-gray-100"} ${showSubmitBtn && "pointer-events-none"}`}
            onClick={() => {
              setSelectedOption(index)
            }}
          >
            {option}
          </p>
        ))}
      </div>
      {showSubmitBtn ? (
        <Button
          label="Submit"
          className="text-xl bg-yellow-300 hover:bg-yellow-400 p-3 rounded-lg"
          onClick={handleSubmit}
        />
      ) : (
        <Button
          label="Next"
          className="bg-blue-400 py-2 px-4 rounded hover:bg-blue-500 text-xl"
          onClick={handleNext}
        />
      )}
    </Container>
  )
}

export default PlayQuiz
