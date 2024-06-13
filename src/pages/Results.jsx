import env from "../../env"
import { useEffect, useState } from "react"
import dbService from "../api/db.service"
import { Query } from "appwrite"
import fetchResults from "../utils/fetchResults"
import { Container, SectionHead, Loader } from "../components/components"

const Results = () => {
  const [leaderBoard, setLeaderBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dbService
      .select({
        collectionId: env.scoreId,
        queries: [Query.orderDesc("score"), Query.select("userId")]
      })
      .then((res) => {
        const userIds = res.map((obj) => obj.userId)
        return fetchResults(userIds)
      })
      .then((users) => {
        setLeaderBoard(users)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <Loader />
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
            <span className="sm:text-base text-xl">{user}</span>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default Results
