import env from "../../env"
import { useEffect, useState } from "react"
import dbService from "../api/db.service"
import { Query } from "appwrite"
import fetchResults from "../utils/fetchResults"
import {
  Container,
  SectionHead,
  Loader,
  NotAvailable
} from "../components/components"
import toast from "react-hot-toast"

const Results = () => {
  const [leaderBoard, setLeaderBoard] = useState([])
  const [loading, setLoading] = useState(true)
  let scores = []

  useEffect(() => {
    dbService
      .select({
        collectionId: env.scoreId,
        queries: [Query.orderDesc("score")]
      })
      .then((res) => {
        scores = res.map((obj) => obj.score)
        const userIds = res.map((obj) => obj.userId)
        return fetchResults(userIds)
      })
      .then((usernames) => {
        let i = 0
        setLeaderBoard(
          usernames.map((username) => ({ name: username, score: scores[i++] }))
        )
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
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
      className="londrina-solid-regular w-screen sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col sm:justify-start gap-5 items-center sm:items-start"
    >
      <SectionHead label="Leaderboard" className="text-white" />
      <div className="flex flex-col gap-3 w-full items-center">
        {leaderBoard.map((user, index) => (
          <div
            key={index}
            className="bg-white py-3 rounded-xl flex justify-center gap-5 items-center sm:w-1/4 w-full"
          >
            <span className="sm:text-xl text-[3vmax] text-purple-800 font-bold">
              {index + 1}.{" "}
            </span>
            <p className="sm:text-base text-2xl uppercase">
              {user.name} : {user.score}
            </p>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Results
