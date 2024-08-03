import { createSlice } from "@reduxjs/toolkit"

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: {},
    loggedIn: false,
    score: 0
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload
    },
    login: (state) => {
      state.loggedIn = true
    },
    logout: (state) => {
      state.loggedIn = false
    },
    setScore: (state, action) => {
      state.score = action.payload
    }
  }
})

export const { setData, login, logout, setScore } = UserSlice.actions

const userReducer = UserSlice.reducer

export default userReducer
