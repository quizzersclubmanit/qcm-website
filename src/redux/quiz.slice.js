import { createSlice } from "@reduxjs/toolkit"

const QuizSlice = createSlice({
  name: "quizes",
  initialState: [
    /*{
      $id: "",
      question: "",
      options: ["", "", "", ""],
      answers: [false, false, false, false],
      reward: null,
      inActive: false,
      negativeMarking: 0,
      markedAnswers: [false, false, false, false]
    }*/
  ],
  reducers: {
    setQuizes: (state, action) => action.payload,
    addQuiz: (state, action) => {
      state.push(action.payload)
    },
    editQuiz: (state, action) => {
      const { $id, changes } = action.payload
      const todoIndex = state.findIndex((todo) => todo.$id === $id)
      if (todoIndex >= 0) {
        state[todoIndex] = {
          ...state[todoIndex],
          ...changes
        }
      }
    },
    deleteQuiz: (state, action) =>
      state.filter((item) => item.$id != action.payload)
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
