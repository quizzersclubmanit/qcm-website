import "./pages.css"
import { useEffect, useState, useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setQuizes, editQuiz } from "../redux/quiz.slice"
import { setScore } from "../redux/user.slice"
import env, { timeLimits } from "../../constants"
import { Navigate, useParams } from "react-router-dom"
import {
  Button,
  Container,
  ProgressBar,
  Loader,
  NotAvailable, Logo
} from "../components/components"
import { useNavigate } from "react-router-dom"
import dbService from "../api/db.service"
import storeService from "../api/store.service"
import { Query } from "appwrite"
import toast from "react-hot-toast"
import { arraysEqual } from "../utils/utils"

const PlayQuiz = () => {
  const { sec } = useParams()
  const [section, setSection] = useState(sec)
  const quizes = useSelector((state) => state.quizes)
  const { loggedIn, data, score } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [currentQue, setCurrentQue] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState(
    new Array(4).fill(false)
  )
  const [roundScore, setRoundScore] = useState(0)
  const navigate = useNavigate()
  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [timer, setTimer] = useState(undefined)
  const logoRef = useRef(null)

  const handleNext = useCallback(() => {
    let len = quizes.length
    if (currentQue >= len || timer <= 0) {
      // Handles calculation part
      quizes.forEach((quiz) => {
        if (arraysEqual(quiz.markedAnswers || [], quiz.answers))
          setRoundScore((prev) => prev + quiz.reward)
        else setRoundScore((prev) => prev - quiz.nagativeMarking)
      })
      setShowSubmitBtn(true)
    } else {
      setCurrentQue((prev) => prev + 1)
      setSelectedOptions([false, false, false, false])
    }
  }, [quizes])

  const handleSubmit = useCallback(() => {
    if (section <= 3) {
      dispatch(setScore(score + roundScore))
      if (sec < 3) navigate(`/quiz/instr/${Number(sec) + 1}`)
      else setSection(sec + 1)
      return
    }
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
  }, [roundScore, section])

  useEffect(() => {
    dbService
      .select({
        collectionId: env.quizId,
        queries: [
          Query.and([
            Query.equal("section", Number(sec)),
            Query.equal("inActive", false)
          ])
        ]
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
  }, [quizes.length, sec])

  if (!loggedIn) return <Navigate to="/signup" />
  if (loading) return <Loader />

  if (quizes.length == 0)
    return <NotAvailable command="Back to Home Page" redirectURL="/" />

  return (
    <Container
      id="play-quiz"
      className="Fira Sans w-screen sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col justify-center items-center sm:items-center"
      onContextMenu={(e) => {
        e.preventDefault()
      }}
    >
      {/* <ProgressBar progress={(currentQue / quizes.length) * 100} /> */}
      <div className="flex w-full md:w-[70vw] justify-between  mt-6  p-4 items-center bg-white bg-opacity-25  rounded-3xl sm:text-xl">
        <div className="flex w-[45%] flex-col text-white font-bold overflow-y-hidden " >
          <div className="flex items-center ">SECTION-
            <span className="text-xl md:text-3xl  overflow-y-hidden text-[#FCA311] ">
              {quizes[currentQue - 1]?.section}</span>
          </div>
        </div>
        <Logo ref={logoRef} className=" h-10 " />
        <div className="flex justify-end w-[45%] text-[#FCA311] font-bold overflow-y-hidden">
          <span>
            {/* Marking Scheme: +{quizes[currentQue - 1]?.reward}, - */}
            {/* {quizes[currentQue - 1]?.nagativeMarking} */}
          </span>
          <span className="text-white overflow-y-hidden flex items-center">TIME LEFT-
            <span className="text-[#FCA311] text-xl md:text-3xl overflow-y-hidden">
              {timer}:00</span>
          </span>
        </div>
      </div>
      <span className="text-4xl leading-none overflow-y-hidden m-3 font-bold text-white z-1">
        {currentQue}/{quizes.length}
      </span>
      <p className="p-4 rounded-lg text-xl text-center text-white leading-none focus:outline-0  md:w-1/2 sm:w-4/5 cursor-default z-10">
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
        {quizes[currentQue - 1]?.options.map((option, index) =>
          quizes[currentQue - 1]?.optionsContainImg ? (
            <img
              key={index}
              src={storeService.fetchFilePreview({
                fileId: option
              })}
              className={`w-full z-10 rounded-3xl aspect-video cursor-pointer  ${selectedOptions[index] ? "border-4 border-yellow-400" : ""} ${!timer && "pointer-events-none"}`}
              alt={`Option ${index}`}
              onClick={() => {
                setSelectedOptions((prev) =>
                  prev.map((bool, idx) => (idx == index ? !bool : bool))
                )
              }}
            />
          ) : (
            <p
              key={index}
              className={`p-4 z-10 rounded-lg focus:outline-0 w-full cursor-pointer transition-all ${selectedOptions[index] ? "bg-yellow-400" : "bg-white hover:bg-gray-100"} ${!timer && "pointer-events-none"}`}
              onClick={() => {
                setSelectedOptions((prev) =>
                  prev.map((bool, idx) => (idx == index ? !bool : bool))
                )
              }}
            >
              {option}
            </p>
          )
        )}
      </div>
      {showSubmitBtn ? (
        <Button
          label="Submit"
          className="text-xl bg-orange-300 hover:bg-orange-400 p-3 rounded-lg"
          onClick={handleSubmit}
        />
      ) : (
        <div className="flex z-10 justify-between items-center md:w-[60%] sm:w-4/5 w-full p-4 rounded">
          <div className="previous flex flex-row items-center bg-[#E5E5E5] py-1 px-4 rounded-2xl hover:bg-gray-300">
            <svg className="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
            <button className="text-xs font-bold p-1" onClick={() => {
              setCurrentQue((prev) => (prev > 1 ? prev - 1 : prev))
              setSelectedOptions([false, false, false, false])
            }}>
              NEXT
            </button>
          </div>
          <div className="next flex flex-row justify-between items-center py-1 px-4 bg-yellow-600 rounded-2xl hover:bg-yellow-500">


            <button className="text-xs font-bold p-1" onClick={handleNext} >
              NEXT
            </button>
            <svg className="h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" /></svg>
          </div>
        </div>
      )}
      <img src="/src/assets/image-quiz-left-illustration.png" alt="" srcset="" className="absolute hidden md:block  z-0 left-0 top-[25vh]" />
      <img src="/src/assets/image-quiz-right-illustration.png" alt="" srcset="" className="absolute hidden md:block z-0 right-0 top-[25vh]" />
    </Container>
  )
}

export default PlayQuiz
