import { useEffect, useState, useMemo } from "react"
import dbService from "../api/db.service"
import {
  Container,
  Logo,
  Loader,
  NotAvailable,
  SearchBar
} from "../components/components"
import toast from "react-hot-toast"

const Leaderboard = () => {
  const [leaderBoard, setLeaderBoard] = useState([])
  const [loading, setLoading] = useState(true)
  let data = useMemo(() => new Map())
  const [searchCity, setSearchCity] = useState("")
  const [searchSchool, setSearchSchool] = useState("")

  const bars = [
    {
      name: "City",
      content: searchCity,
      setContent: setSearchCity
    },
    {
      name: "School",
      content: searchSchool,
      setContent: setSearchSchool
    }
  ]

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // Fetch leaderboard entries (backend: GET /api/quiz/leaderboard)
        const docs = await dbService.select({
          collectionId: "leaderboard",
          // filter out disqualified on server if supported; otherwise we'll filter below
          queries: ["disqualified=false"]
        })

        // Normalize response formats
        let entries = []
        if (Array.isArray(docs)) entries = docs
        else if (docs && Array.isArray(docs.leaderboard)) entries = docs.leaderboard
        else if (docs && Array.isArray(docs.data)) entries = docs.data

        // Client-side fallback filter if server ignored query: treat missing `disqualified` as allowed
        entries = (entries || []).filter((e) => e && e.disqualified !== true)

        // Aggregate by userId, keep max score and normalize fields for UI
        const byUser = new Map()
        for (const obj of entries) {
          const uid = obj?.userId?.$id || obj?.userId?.id || obj?.userId || obj?.userID
          if (!uid) continue
          const currentScore = obj?.score ?? 0
          const prev = byUser.get(uid)
          if (!prev || currentScore > (prev.score ?? 0)) {
            byUser.set(uid, {
              userId: uid,
              name: obj?.name || obj?.fullName || obj?.username || uid,
              city: obj?.city || obj?.town || obj?.location || "",
              educationalInstitute: obj?.educationalInstitute || obj?.school || obj?.college || "",
              score: currentScore
            })
          }
        }

        const list = Array.from(byUser.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        setLeaderBoard(list)
      } catch (error) {
        console.error(error)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  if (loading) return <Loader />
  if (leaderBoard.length == 0)
    return (
      <NotAvailable
        message="None of the Contestants played yet"
        command="Back to Home Page"
        redirectURL="/"
      />
    )

  return (
    <Container
      id="results"
      className="poppins-regular w-screen sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col sm:justify-start gap-5 items-center sm:items-start background-blue"
    >
      <Logo className="w-[8vmax] md:w-[5vmax] sm:w-[7vmax]" />
      <div className="flex w-full sm:gap-[10vw] gap-2">
        {bars.map((bar, index) => (
          <SearchBar
            key={index}
            content={bar.content}
            setContent={bar.setContent}
            placeholder={bar.name}
            className="p-2 bg-white rounded-xl focus:outline-0 w-full"
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="flex justify-between w-full sm:text-[2vmax] text-[3vmax] text-white font-bold text-outline-thin">
          <span>Rank</span>
          <span>Details</span>
          <span>Score</span>
        </div>
        {leaderBoard
          .filter(
            (user) =>
              user.city?.toLowerCase().includes(searchCity?.toLowerCase()) &&
              user.educationalInstitute
                ?.toLowerCase()
                .includes(searchSchool?.toLowerCase())
          )
          .map((user, index) => (
            <div
              key={index}
              className="bg-white py-3 pl-5 rounded-xl justify-between px-5 flex gap-5 items-center w-full"
            >
              <span className="text-yellow-500">{index + 1}. </span>
              <p
                className="uppercase w-[70%] md:w-auto"
                onClick={() => {
                  console.log(user)
                }}
              >
                {user.name} | {user.educationalInstitute} | {user.city}
              </p>
              <span>{user.score}</span>
            </div>
          ))}
      </div>
    </Container>
  )
}

export default Leaderboard
