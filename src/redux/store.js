import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./user.slice"
import quizReducer from "./quiz.slice"

const store = configureStore({
  reducer: {
    user: userReducer,
    quizes: quizReducer
  }
})

export default store
