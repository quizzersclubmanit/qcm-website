import { createSlice } from "@reduxjs/toolkit"

const UserSlice = createSlice({
  name: "user",
  initialState: {
    data: {},
    loggedIn: false
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
    }
  }
})

export const { setData, login, logout } = UserSlice.actions

const userReducer = UserSlice.reducer

export default userReducer
