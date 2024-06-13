import axios from "axios"

async function fetchResults(userIds = []) {
  try {
    const res = await axios.post("/api/users", { userIds })
    return res.data
  } catch (error) {
    throw error
  }
}

export default fetchResults
