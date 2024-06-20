import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import Layout from "./Layout.jsx"
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet
} from "react-router-dom"
import {
  Home,
  Auth,
  PlayQuiz,
  Event,
  Result,
  Results,
  Verification
} from "./pages/pages.js"
import { AddQuiz, ManageQuiz } from "./dashboards/dashboards.js"
import { Admin } from "./components/components.js"
import { Provider } from "react-redux"
import store from "./redux/store.js"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="signup" element={<Auth />} />
      <Route path="login" element={<Auth label="login" />} />
      <Route path="account/verification/:dets" element={<Verification />} />
      <Route path="events/:eventId" element={<Event />} />
      <Route path="quiz/" element={<Outlet />}>
        <Route path="play" element={<PlayQuiz />} />
        <Route path="result/:score" element={<Result />} />
      </Route>
      <Route path="admin/" element={<Admin />}>
        <Route path="add" element={<AddQuiz />} />
        <Route path="manage" element={<ManageQuiz />} />
        <Route path="results" element={<Results />} />
      </Route>
    </Route>
  )
)

const elem = document.getElementById("root")
const root = ReactDOM.createRoot(elem)
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
