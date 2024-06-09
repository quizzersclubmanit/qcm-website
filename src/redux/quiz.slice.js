import { createSlice } from "@reduxjs/toolkit"

const QuizSlice = createSlice({
  name: "quizes",
  initialState: [
    {
      $id: "",
      question: "",
      options: ["", "", "", ""],
      answer: 0,
      reward: 2,
      timeLimit: 60
    }
  ],
  reducers: {
    setQuizes: (state, action) => action.payload,
    addQuiz: (state, action) => {
      state.push(action.payload)
    },
    editQuiz: (state, action) => {
      state.forEach((item) => {
        if (item.$id == action.payload.$id) {
          const changes = action.payload.changes
          item = { ...item, ...changes }
        }
      })
    },
    deleteQuiz: (state, action) =>
      state.filter((item) => item.$id != action.payload)
  }
})

export const { setQuizes, addQuiz, editQuiz, deleteQuiz } = QuizSlice.actions

const quizReducer = QuizSlice.reducer
export default quizReducer
