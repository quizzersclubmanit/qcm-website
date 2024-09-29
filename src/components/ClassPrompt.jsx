import dbService from "../api/db.service"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import env from "../../constants"
import { useSelector } from "react-redux"
import { Instructions } from "../pages/pages"

const ClassPrompt = () => {
  const { data } = useSelector((state) => state.user)
  const { sec } = useParams()
  const navigate = useNavigate()

  if (sec != 0) return <Instructions sec={sec} />

  let standard = prompt(
    "Enter you class (numeric value, eg. 10 for students of 10th standard)"
  )
  if (standard == "") navigate("/")

  dbService
    .update({
      collectionId: env.userId,
      documentId: data.docId,
      changes: { standard }
    })
    .then(() => navigate("/quiz/instr/1"))
    .catch((error) => console.error(error))

  return <Outlet />
}

export default ClassPrompt
