import { createSlice } from "@reduxjs/toolkit"

const QuizSlice = createSlice({
  name: "quizes",
  initialState: [
    /*{
      $id: "",
      question: "",
      options: ["", "", "", ""],
      answer: null,
      reward: 0,
      timeLimit: 60,
      markedAnswer: null
    }*/
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
      state.filter((item) => item.$id != action.payload),
    addMarkedAnswerField: (state, action) =>
      state.map((item) => {
        if (item.$id == action.payload.$id)
          return { ...item, markedAnswer: action.payload.markedAnswer }
        return item
      })
  }
})

export const {
  setQuizes,
  addQuiz,
  editQuiz,
  deleteQuiz,
  addMarkedAnswerField
} = QuizSlice.actions

const quizReducer = QuizSlice.reducer
export default quizReducer
