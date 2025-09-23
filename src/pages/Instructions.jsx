import { Link, useNavigate } from "react-router-dom"
import { Container } from "../components/components"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { timeLimits } from "../../constants"
import { instructions } from "../assets/qcmData.json"

const Instructions = ({ sec }) => {
  const { data } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const instrs = [
    {
      key: "Duration",
      value: `${timeLimits[sec - 1]} minutes`
    },
    {
      key: "Section",
      value: sec
    },
    {
      key: "Question Count",
      value: instructions[`section-${sec}`].questions
    },
    {
      key: "Problem Type",
      value: instructions[`section-${sec}`].type
    },
    {
      key: "Marking Scheme",
      value: instructions[`section-${sec}`]["marking-scheme"]
    }
  ]

  // Pre-check: block ONLY if server confirms user already attempted this section
  useEffect(() => {
    const userId = data?.$id || data?.id || data?.userId
    if (!userId || !sec) return
    const check = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token')
        const res = await fetch(`https://qcm-backend-ln5c.onrender.com/api/quiz/leaderboard?userId=${userId}&section=${Number(sec)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          mode: 'cors'
        })
        if (res.ok) {
          const body = await res.json()
          let arr = []
          if (Array.isArray(body)) arr = body
          else if (body && Array.isArray(body.data)) arr = body.data
          else if (body && Array.isArray(body.leaderboard)) arr = body.leaderboard
          const hasAny = (arr || []).some((e) => Number(e?.section) === Number(sec))
          if (hasAny) {
            toast("You've attempted the quiz")
            navigate('/')
          }
        } else {
          // Do not block on non-OK; allow user to proceed
          console.warn('Attempt pre-check non-OK status:', res.status)
        }
      } catch (e) {
        console.error('Instructions pre-check error:', e)
        // Do not block on network error; allow user to proceed
      }
    }
    check()
  }, [data?.$id, data?.id, data?.userId, sec])

  return (
    <Container
      className="flex justify-center items-center min-h-screen sm:px-2"
      style={{
        background: 'url("/image-quiz-bg.png") no-repeat center center/cover'
      }}
    >
      <div className="bg-white p-10 sm:rounded-lg shadow-lg sm:w-3/4 min-h-1/2 flex sm:flex-row flex-col gap-5 items-center">
        <div className="sm:w-1/2 flex flex-col sm:gap-5">
          <h1 className="text-xl font-semibold">
            Hey <span className="uppercase">{data?.name || data?.username || 'Student'}</span>, Welcome
          </h1>
          <h2 className="text-2xl font-bold mt-2">
            Read The Following Details Carefully
          </h2>
          <ul className="text-gray-700 leading-relaxed">
            {instrs.map((obj, index) => (
              <li key={index}>
                <strong className="text-sm">{obj.key}:</strong>
                <span className="text-emerald-600 text-lg"> {obj.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:w-1/2 flex flex-col gap-5">
          <h2 className="text-xl font-semibold">General Instructions</h2>
          <hr />
          <ul className="mt-2 text-gray-700 leading-relaxed">
            {Object.keys(instructions.general).map((key, index) => (
              <li key={index}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(instructions.general[key])
                  ? instructions.general[key].map((remark, idx) => (
                      <p key={idx}>{remark}</p>
                    ))
                  : instructions.general[key]}
              </li>
            ))}
          </ul>
          <Link
            className="background-blue text-center text-white px-4 py-2 rounded-lg
          mr-4 mt-6"
            to={`/quiz/play/${sec}`}
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default Instructions
