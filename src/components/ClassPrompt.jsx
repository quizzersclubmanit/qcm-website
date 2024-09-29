import dbService from "../api/db.service"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import env from "../../constants"
import { useSelector } from "react-redux"
import { Loader } from "./components"

const ClassPrompt = () => {
  const { data } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let standard = prompt(
      "Enter you class (numeric value, eg. 10 for students of 10th standard)"
    )
    dbService
      .update({
        collectionId: env.userId,
        documentId: data.docId,
        changes: { standard }
      })
      .then(() => navigate("/quiz/instr/1"))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />
  return <Outlet />
}

export default ClassPrompt
