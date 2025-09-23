import "../pages/pages.css"
import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import arraysEqual from "../utils/arraysEqual"
import { useSelector, useDispatch } from "react-redux"
import { setQuizes, editQuiz } from "../redux/quiz.slice"
import { setScore } from "../redux/user.slice"
import env, { timeLimits } from "../../constants"
import { instructions } from "../assets/qcmData.json"
import { Navigate, useParams } from "react-router-dom"
import {
  Button,
  Container,
  Loader,
  NotAvailable
} from "../components/components"
import { useNavigate } from "react-router-dom"
import dbService from "../api/db.service"
import storeService from "../api/store.service"
import toast from "react-hot-toast"
// Removed duplicate arraysEqual import from utils/utils
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6"
import { liveGif } from "../assets/assets"

const PlayQuiz = () => {
  const { sec } = useParams()
  let section = useMemo(() => Number(sec))
  const quizes = useSelector((state) => state.quizes)
  const [currentQue, setCurrentQue] = useState(1)
  const multiCorrect = useMemo(() => {
    const q = quizes[currentQue - 1]
    if (!q) return false
    // Section C (3): first 5 are multi-correct (tagged with isInteger=false)
    if (Number(q.section) === 3) return q.isInteger !== true
    return false
  }, [quizes, currentQue])
  const { loggedIn, data, score } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState(
    new Array(4).fill(false)
  )
  const [roundScore, setRoundScore] = useState(0)
  const navigate = useNavigate()
  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [timer, setTimer] = useState(undefined)
  const timesFullScreenExited = useRef(0)
  const handlingFullscreen = useRef(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const submittedRef = useRef(false)
  const [quizzesLoading, setQuizzesLoading] = useState(true)
  const [noQuizzes, setNoQuizzes] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [userInput, setUserInput] = useState("") // for Integer Type (section 4)

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' })
      setIsPaused(false)
    } catch (e) {
      console.warn('Re-enter fullscreen failed:', e?.message)
      setIsPaused(true)
    }
  }

  const handleNext = useCallback(() => {
    if (isPaused) return
    let len = quizes.length
    if (currentQue >= len || timer <= 0) {
      // End of section questions: just reveal Submit button; score is computed on submit
      setShowSubmitBtn(true)
    } else {
      setCurrentQue((prev) => (prev < len ? prev + 1 : prev))
      let ans = quizes[currentQue].markedAnswers
      setSelectedOptions(ans || [false, false, false, false])
    }
  }, [quizes, currentQue])

  // Helper to compute score for the current section using marking scheme from qcmData.json
  const computeSectionScore = (list) => {
    const normalize = (v) => {
      if (v === undefined || v === null) return ''
      return String(v).trim().toLowerCase().replace(/\s+/g, ' ')
    }

    // Determine marks function per section based on qcmData.json instructions
    const marksFn = (secNum) => {
      const secKey = `section-${Number(secNum)}`
      const scheme = instructions?.[secKey]?.["marking-scheme"] || ''
      // Parse like "+4 for correct, -1 for incorrect" or "+5 for correct, 0 for incorrect"
      const m = scheme.match(/([+\-]?\d+)\s*for\s*correct.*?([+\-]?\d+)\s*for\s*incorrect/i)
      let pos = 0, neg = 0
      if (m) {
        pos = Number(m[1] || 0)
        neg = Number(m[2] || 0)
      } else {
        // Fallbacks if parsing fails
        if (Number(secNum) === 3) { pos = 5; neg = 0 }
        else if (Number(secNum) === 4) { pos = 5; neg = -1 }
        else { pos = 4; neg = -1 }
      }
      return (correct) => (correct ? pos : neg)
    }

    return (list || []).reduce((acc, quiz, qIndex) => {
      try {
        const secNum = Number(quiz?.section)
        const marks = marksFn(secNum)
        const opts = Array.isArray(quiz?.options) ? quiz.options : []
        const isBlankOptions = opts.length === 0 || opts.every((o) => normalize(o) === '')

        // Integer type (section 3 second half) or explicit integer flag
        if (secNum === 3 && (quiz?.isInteger === true || isBlankOptions || (quiz && typeof quiz.userInput === 'string'))) {
          const userVal = normalize(quiz?.userInput)
          const correctVal = normalize(quiz?.correctAnswer)
          const correct = !!userVal && userVal === correctVal
          return acc + marks(correct)
        }

        // Options-based evaluation
        const marked = Array.isArray(quiz?.markedAnswers) ? quiz.markedAnswers : []
        const pickedIdxs = marked.map((b, i) => (b ? i : -1)).filter((i) => i >= 0)
        if (pickedIdxs.length === 0) return acc

        const preprocess = (s) => normalize(s)
          .replace(/^answer[:.\_\-\s]*/, '')
          .replace(/^\(?[abcd]\)?[).:\-\s]*/, '')
        const corrRaw = quiz?.correctAnswer
        const corrNorm = preprocess(corrRaw)
        const stripLead = (s) => normalize(s).replace(/^\(?[abcd]\)?[).:\-\s]*/, '')
        const optNorms = (quiz?.options || []).map((o) => stripLead(o))

        const tokens = String(corrRaw || '')
          .split(/[\s,;|]+/)
          .map((t) => t.trim())
          .filter(Boolean)

        let corrIdxs = []
        if (tokens.length > 1) {
          corrIdxs = tokens
            .map((t) => t.replace(/\(|\)/g, '').toLowerCase())
            .map((t) => {
              if (["a","b","c","d"].includes(t)) return { a:0,b:1,c:2,d:3 }[t]
              const idx = optNorms.findIndex((o) => o === normalize(t))
              return idx >= 0 ? idx : -1
            })
            .filter((i) => i >= 0)
        } else {
          let idx = optNorms.findIndex((o) => o === corrNorm)
          if (idx < 0) {
            const letter = String(corrRaw || '').trim().toLowerCase().replace(/[^a-d]/g, '')
            if (["a","b","c","d"].includes(letter)) idx = { a:0,b:1,c:2,d:3 }[letter]
          }
          if (idx >= 0) corrIdxs = [idx]
        }

        let correct = false
        if (corrIdxs.length > 1) {
          const a = new Set(pickedIdxs)
          const b = new Set(corrIdxs)
          correct = a.size === b.size && [...a].every((x) => b.has(x))
        } else if (corrIdxs.length === 1) {
          correct = pickedIdxs.length === 1 && pickedIdxs[0] === corrIdxs[0]
        } else {
          correct = pickedIdxs.some((i) => optNorms[i] === corrNorm)
        }

        const delta = marks(correct)
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[Score] Q${qIndex+1} sec=${secNum}`, { pickedIdxs, corrIdxs, correct, delta, corrRaw, options: quiz?.options })
        }
        return acc + delta
      } catch {
        return acc
      }
    }, 0)
  }

  async function submitQuiz(disqualified = false) {
    if (hasSubmitted || submittedRef.current) return
    setHasSubmitted(true)
    submittedRef.current = true
    let msg = disqualified
      ? "You are disqualified for exiting full-screen"
      : "Quiz Submitted Successfully"

    // Include the latest selection of the current question before computing
    const quizzesForScore = quizes.map((q, idx) => (
      idx === (currentQue - 1)
        ? { ...q, markedAnswers: Array.isArray(selectedOptions) ? selectedOptions : [false, false, false, false] }
        : q
    ))

    // Compute score for current section using qcmData.json marking scheme
    const sectionScore = computeSectionScore(quizzesForScore)
    console.log(`Section ${section} score:`, sectionScore)
    
    // Add to cumulative score from previous sections (stored in Redux)
    const totalScore = score + sectionScore
    const safeScore = Number(Math.min(180, Math.max(0, totalScore)))
    
    console.log(`Total cumulative score: ${score} + ${sectionScore} = ${totalScore} (capped: ${safeScore})`)

    try {
      // Final server-side pre-check to avoid duplicates
      const existing = await dbService.select({
        collectionId: "leaderboard",
        queries: [
          `userId=${data.$id || data.id}`,
          `section=${Number(section)}`
        ]
      })
      let list = []
      if (Array.isArray(existing)) list = existing
      else if (existing && Array.isArray(existing.data)) list = existing.data
      else if (existing && Array.isArray(existing.leaderboard)) list = existing.leaderboard

      const already = (list || []).some((e) => Number(e?.section) === Number(section) && (e?.userId === (data.$id || data.id) || e?.userId?.id === (data.$id || data.id) || e?.userId?.$id === (data.$id || data.id)))
      if (already) {
        toast("You've attempted the quiz")
        await document.exitFullscreen().catch(() => {})
        navigate("/")
        return
      }

      await dbService.insert({
        collectionId: "leaderboard",
        data: {
          userId: data.$id || data.id,
          score: safeScore,
          section: Number(section),
          disqualified: Boolean(disqualified)
        }
      })

      await document.exitFullscreen().catch(() => {})
      toast("Quiz Submitted Succesfully")
      navigate(`/quiz/result/${msg}`)
    } catch (error) {
      console.error(error)
      // Handle duplicate/validation errors gracefully
      if (error?.status === 409 || /duplicate/i.test(error?.message || '')) {
        toast("You've already submitted")
        await document.exitFullscreen().catch(() => {})
        navigate("/")
        return
      }
      toast(error.message || 'Submission failed')
      setHasSubmitted(false)
      submittedRef.current = false
    }
  }

  const handleSubmit = useCallback(() => {
    if (isPaused) return
    
    // Compute section score and update Redux store
    const quizzesForScore = quizes.map((q, idx) => (
      idx === (currentQue - 1)
        ? { ...q, markedAnswers: Array.isArray(selectedOptions) ? selectedOptions : [false, false, false, false] }
        : q
    ))
    const sectionScore = computeSectionScore(quizzesForScore)
    const newTotalScore = score + sectionScore
    
    console.log(`Section ${section} completed with score: ${sectionScore}`)
    console.log(`New total score: ${score} + ${sectionScore} = ${newTotalScore}`)
    
    dispatch(setScore(newTotalScore))
    
    if (section < 4) {
      navigate(`/quiz/instr/${section + 1}`)
    } else {
      // Final section: submit to leaderboard
      submitQuiz()
    }
  }, [quizes, selectedOptions, currentQue, score, section, computeSectionScore])

  useEffect(() => {
    console.log('=== STARTING QUIZ DATA FETCH ===')
    console.log('Section:', section)
    
    // Since the direct API call works but dbService fails, let's use direct fetch for now
    const fetchQuizData = async () => {
      try {
        setQuizzesLoading(true)
        setNoQuizzes(false)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token')
        console.log('Using direct fetch with token:', !!token)
        
        const response = await fetch('https://qcm-backend-ln5c.onrender.com/api/quiz', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors'
        })
        
        console.log('Direct fetch response status:', response.status)
        
        if (response.ok) {
          const docs = await response.json()
          console.log('Direct fetch response data:', docs)
          
          // Handle the response format we know works
          let quizData = []
          if (docs && docs.quizzes && Array.isArray(docs.quizzes)) {
            quizData = docs.quizzes
            console.log('✅ Found quizzes in docs.quizzes:', quizData.length)
          }
          
          console.log('Processed quiz data:', quizData)
          console.log('Quiz data length:', quizData.length)
          
          if (quizData.length === 0) {
            console.error('❌ NO QUIZ DATA FOUND!')
            console.log('Available response properties:', Object.keys(docs || {}))
            setNoQuizzes(true)
            setQuizzesLoading(false)
          } else {
            console.log('✅ Found', quizData.length, 'quiz questions')
            console.log('First question sample:', quizData[0])
            
            // Filter questions by section (coerce to number for safety)
            let sectionQuizzes = quizData.filter(quiz => Number(quiz.section) === Number(section))
            console.log(`✅ Found ${sectionQuizzes.length} questions for section ${section} (of total ${quizData.length})`)

            // For Section 3: first 5 = multi-correct, next 5 = integer
            if (Number(section) === 3) {
              // Sort deterministically by createdAt asc then id
              sectionQuizzes = sectionQuizzes.sort((a,b) => {
                const ta = new Date(a.createdAt || 0).getTime()
                const tb = new Date(b.createdAt || 0).getTime()
                if (ta !== tb) return ta - tb
                const ia = String(a.id || a.$id || '')
                const ib = String(b.id || b.$id || '')
                return ia.localeCompare(ib)
              }).map((q, idx) => ({ ...q, isInteger: idx >= 5 }))
            }
            
            // Ensure each quiz has a markedAnswers array to track selections
          const withMarks = (list) => list.map(q => ({
            ...q,
            markedAnswers: Array.isArray(q.markedAnswers) ? q.markedAnswers : [false, false, false, false]
          }))

          if (sectionQuizzes.length > 0) {
            console.log('🎯 Dispatching section-specific quizzes to Redux store')
            dispatch(setQuizes(withMarks(sectionQuizzes)))
            setNoQuizzes(false)
          } else {
            console.warn(`⚠️ No questions found for section ${section}, using all questions`)
            console.log('🎯 Dispatching all quizzes to Redux store')
            dispatch(setQuizes(withMarks(quizData)))
            // If even "all" is zero we already handled above; here we treat as available
            setNoQuizzes(sectionQuizzes.length === 0 && quizData.length === 0)
          }
          setQuizzesLoading(false)
          }
        } else {
          console.error('Direct fetch failed with status:', response.status)
          setQuizzesLoading(false)
        }
      } catch (error) {
        console.error('Direct fetch error:', error)
        setQuizzesLoading(false)
      }
    }
    
    fetchQuizData()
  }, [section])

  useEffect(() => {
    const userId = data?.$id || data?.id || data?.userId

    // Wait for userId to be available
    if (!userId) {
      return
    }

    // Check if user has already attempted the quiz using dbService
    const checkLeaderboard = async () => {
      try {
        const docs = await dbService.select({
          collectionId: "leaderboard",
          queries: [
            `userId=${userId}`,
            `section=${Number(section)}`
          ]
        })

        let leaderboardData = []
        if (Array.isArray(docs)) leaderboardData = docs
        else if (docs && Array.isArray(docs.data)) leaderboardData = docs.data
        else if (docs && Array.isArray(docs.leaderboard)) leaderboardData = docs.leaderboard

        // Fallback safety filter if server ignored filters
        const filtered = (leaderboardData || []).filter(
          (e) => Number(e?.section) === Number(section) &&
            (e?.userId === userId || e?.userId?.id === userId || e?.userId?.$id === userId)
        )

        if (filtered.length > 0) {
          navigate("/")
          toast("You've attempted the quiz")
        } else {
          // No previous attempt recorded on server, allow entering fullscreen and proceed
          document.documentElement.requestFullscreen({ navigationUI: 'hide' })
        }
      } catch (error) {
        console.error('Leaderboard check error:', error)
        // Do not enter fullscreen on error; inform the user instead
        toast("Network error. Please try again.")
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    checkLeaderboard()

    // Define handler references so we can remove them properly
    const onFullscreenChange = () => {
      // Debounce rapid duplicate events
      if (handlingFullscreen.current) return
      handlingFullscreen.current = true
      setTimeout(() => (handlingFullscreen.current = false), 300)

      if (!document.fullscreenElement) {
        // If we've already started submitting (normal finish), ignore leave-fullscreen events
        if (submittedRef.current) {
          return
        }
        // Immediate disqualification on leaving fullscreen
        toast("You're disqualified")
        submitQuiz(true)
      } else {
        // Fullscreen restored
        setIsPaused(false)
      }
    }

    const onKeyDown = (e) => {
      if (e.code === 'F12') e.preventDefault()
      if (e.code === 'Escape') {
        // Try to prevent leaving; browser may still exit fullscreen.
        e.preventDefault()
        // Immediate disqualification on ESC
        if (!submittedRef.current) {
          toast("You're disqualified")
          submitQuiz(true)
        }
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [data?.$id, data?.id, data?.userId, section])

  useEffect(() => {
    const currentQuiz = quizes[currentQue - 1]
    if (!currentQuiz) return
    const existing = currentQuiz.markedAnswers || [false, false, false, false]
    if (arraysEqual(existing, selectedOptions)) return
    dispatch(
      editQuiz({
        $id: currentQuiz.$id || currentQuiz.id || 0,
        changes: { markedAnswers: selectedOptions }
      })
    )
  }, [selectedOptions, currentQue])

  // Keep local userInput in sync for section 4
  useEffect(() => {
    const q = quizes[currentQue - 1]
    if (!q) return
    if (Number(q.section) === 4) {
      setUserInput(q.userInput || "")
    } else {
      setUserInput("")
    }
  }, [currentQue, quizes.length])

  useEffect(() => {
    let timeleft = 60 * (timeLimits[quizes[currentQue - 1]?.section - 1] || 5) // in seconds
    setTimer(timeleft)
    const interval = setInterval(() => {
      if (!isPaused) {
        timeleft--
        setTimer((prev) => (prev > 0 ? prev - 1 : prev))
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [quizes.length, sec, isPaused])

  if (!loggedIn) return <Navigate to="/signup" />
  if (loading || quizzesLoading) return <Loader />
  if (noQuizzes) return <NotAvailable command="Back to Home Page" redirectURL="/" message={`No Questions Found for Section ${section}`} />

  return (
    <Container
      id="play-quiz"
      className="Fira Sans w-screen sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col justify-around items-center sm:items-center sm:gap-5 gap-1 relative"
      onContextMenu={(e) => {
        e.preventDefault()
      }}
    >
      
      <img
        src={liveGif}
        alt="Live Gif"
        className="absolute top-0 right-3 w-1/5 md:w-fit"
      />
      <div className="flex w-full md:w-[70vw] justify-between mt-6 items-center glass-box">
        <div className="flex w-[45%] flex-col text-white font-bold overflow-y-hidden uppercase sm:text-2xl">
          <p className="flex items-center text-sm sm:text-xl">
            Section -&nbsp;
            <span className="overflow-y-hidden text-[#FCA311]">
              {quizes[currentQue - 1]?.section}
            </span>
          </p>
        </div>
        {multiCorrect && (
          <span className="overflow-y-hidden text-[#FCA311] text-sm sm:text-xl font-bold">
            Multicorrect
          </span>
        )}
        <div className="flex justify-end w-[45%] text-[#FCA311] font-bold overflow-y-hidden sm:text-2xl">
          <p className="text-white text-sm sm:text-xl overflow-y-hidden flex items-center uppercase">
            Time Left -&nbsp;
            <span className="text-[#FCA311] overflow-y-hidden">
              {Math.floor(timer / 60)}:{timer % 60} minutes
            </span>
          </p>
        </div>
      </div>
      <span className="md:text-2xl text-xs leading-none overflow-y-hidden m-3 font-bold text-white z-1 glass-box">
        {currentQue}/{quizes.length}
      </span>
      <p className="p-1 rounded-lg text-center sm:text-lg text-white leading-relaxed focus:outline-0  md:w-1/2 sm:w-4/5 cursor-default z-10 glass-box">
        Q. {quizes[currentQue - 1]?.question}
      </p>
      {quizes[currentQue - 1]?.supportingPic && (
        <img
          src={storeService.fetchFilePreview({
            fileId: quizes[currentQue - 1]?.supportingPic
          })}
          alt="Supporting Picture"
          className="w-1/3"
        />
      )}
      {(Number(quizes[currentQue - 1]?.section) === 3 && quizes[currentQue - 1]?.isInteger === true) ? (
        <div className="md:w-1/2 sm:w-4/5 w-full mt-4 sm:mt-0">
          <label className="block text-white font-semibold mb-2">Enter your answer</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9\-\.]*"
            className="w-full p-3 rounded-lg focus:outline-0"
            placeholder="Type integer value here"
            value={userInput}
            onChange={(e) => {
              const val = e.target.value
              setUserInput(val)
              const q = quizes[currentQue - 1]
              if (q) {
                dispatch(
                  editQuiz({
                    $id: q.$id || q.id || 0,
                    changes: { userInput: val }
                  })
                )
              }
            }}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-2 gap-5 md:w-1/2 sm:w-4/5 w-full mt-4 sm:mt-0">
          {quizes[currentQue - 1]?.options.map((option, index) => (
            quizes[currentQue - 1]?.optionsContainImg ? (
              <img
                key={index}
                src={storeService.fetchFilePreview({ fileId: option })}
                className={`w-full mx-auto rounded z-10 aspect-video object-contain cursor-pointer border-4 ${selectedOptions[index] ? "border-yellow-400" : "border-white"} ${!timer && "pointer-events-none"}`}
                alt={`Option ${index}`}
                onClick={() => {
                  if (isPaused) return
                  if (multiCorrect) {
                    setSelectedOptions((prev) => {
                      const next = prev.map((bool, idx) => (idx == index ? !bool : bool))
                      const q = quizes[currentQue - 1]
                      if (q) dispatch(editQuiz({ $id: q.$id || q.id || 0, changes: { markedAnswers: next } }))
                      return next
                    })
                  } else {
                    setSelectedOptions((prev) => {
                      const next = prev.map((bool, idx) => (idx == index ? (bool ? false : true) : false))
                      const q = quizes[currentQue - 1]
                      if (q) dispatch(editQuiz({ $id: q.$id || q.id || 0, changes: { markedAnswers: next } }))
                      return next
                    })
                  }
                }}
              />
            ) : (
              <p
                key={index}
                className={`p-4 z-10 rounded-lg focus:outline-0 w-full cursor-pointer transition-all ${selectedOptions[index] ? "bg-yellow-400" : "bg-white hover:bg-gray-100"} ${!timer && "pointer-events-none"}`}
                onClick={() => {
                  if (isPaused) return
                  if (multiCorrect) {
                    setSelectedOptions((prev) => {
                      const next = prev.map((bool, idx) => (idx == index ? !bool : bool))
                      const q = quizes[currentQue - 1]
                      if (q) dispatch(editQuiz({ $id: q.$id || q.id || 0, changes: { markedAnswers: next } }))
                      return next
                    })
                  } else {
                    setSelectedOptions((prev) => {
                      const next = prev.map((bool, idx) => (idx == index ? (bool ? false : true) : false))
                      const q = quizes[currentQue - 1]
                      if (q) dispatch(editQuiz({ $id: q.$id || q.id || 0, changes: { markedAnswers: next } }))
                      return next
                    })
                  }
                }}
              >
                {option}
              </p>
            )
          ))}
        </div>
      )}
      {showSubmitBtn && (
        <Button
          label="Submit"
          className="font-bold p-1 uppercase mt-4 py-1 px-4 bg-green-400 rounded-2xl hover:bg-green-500"
          onClick={handleSubmit}
        />
      )}
      <div className="flex z-10 justify-between items-center md:w-[60%] sm:w-4/5 w-full p-4 rounded">
        <Button
          label="Prev"
          className="font-bold uppercase previous flex justify-between items-center py-1 px-4 rounded-2xl bg-[#E5E5E5] hover:bg-gray-300 gap-1"
          onClick={() => {
            if (isPaused) return
            setCurrentQue((prev) => (prev > 1 ? prev - 1 : prev))
            let ans = quizes[currentQue >= 2 ? currentQue - 2 : 0].markedAnswers
            setSelectedOptions(ans || [false, false, false, false])
            setShowSubmitBtn(false)
          }}
        >
          <FaAngleLeft />
        </Button>
        <Button
          label="Next"
          className="font-bold uppercase next flex flex-row-reverse justify-between items-center py-1 px-4 rounded-2xl bg-[#FCA311] hover:bg-yellow-500 gap-1"
          onClick={handleNext}
        >
          <FaAngleRight />
        </Button>
      </div>
      <img
        src="/image-quiz-left-illustration.png"
        className="absolute hidden md:block  z-0 left-0 top-[25vh]"
      />
      <img
        src="/image-quiz-left-illustration.png"
        className="absolute hidden md:block z-0 right-0 top-[25vh] scale-x-[-1]"
      />
    </Container>
  )
}

export default PlayQuiz
