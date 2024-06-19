import env from "../../constants"
import { useEffect, useState, useMemo } from "react"
import dbService from "../api/db.service"
import { Query } from "appwrite"
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
  let scores = useMemo(() => [])

  useEffect(() => {
    dbService
      .select({
        collectionId: env.leaderboardId,
        queries: [Query.orderDesc("score")]
      })
      .then((res) => {
        scores = res.map((obj) => obj.score)
        const userIds = res.map((obj) => obj.userId)
        dbService
          .select({
            collectionId: env.userId,
            queries: [Query.equal("userId", userIds)]
          })
          .then((usersData) => {
            let i = 0
            setLeaderBoard(
              usersData.map((userData) => ({
                ...userData,
                score: scores[i++]
              }))
            )
          })
          .catch((error) => {
            console.error(error)
          })
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
      <SectionHead logo outline label="Leaderboard" className="text-white" />
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="flex justify-around w-full sm:w-3/4 md:w-1/2 sm:text-[2vmax] text-[3vmax] text-white font-bold text-outline-thin">
          <span>Rank</span>
          <span>Details</span>
          <span>Score</span>
        </div>
        {leaderBoard.map((user, index) => (
          <div
            key={index}
            className="bg-white py-3 pl-5 rounded-xl justify-around flex gap-5 items-center w-full sm:w-3/4 md:w-1/2"
          >
            <span className="text-[3vmax] sm:text-[2.5vmax] text-yellow-500">
              {index + 1}.{" "}
            </span>
            <p
              className="text-[3vmax] sm:text-[2vmax]"
              onClick={() => {
                console.log(user)
              }}
            >
              {user.name}, {user.educationalInstitute}, {user.city}
            </p>
            <span className="text-[3vmax] sm:text-[2.5vmax]">{user.score}</span>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Results
