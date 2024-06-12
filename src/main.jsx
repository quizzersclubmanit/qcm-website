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
import { Home, Auth, PlayQuiz, Event, Result } from "./pages/pages.js"
import { AddQuiz, ManageQuiz } from "./dashboards/dashboards.js"
import { Provider } from "react-redux"
import store from "./redux/store.js"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="signup" element={<Auth />} />
      <Route path="login" element={<Auth label="login" />} />
      <Route path="events/:eventId" element={<Event />} />
      <Route path="admin/" element={<Outlet />}>
        <Route path="add" element={<AddQuiz />} />
        <Route path="manage" element={<ManageQuiz />} />
      </Route>
      <Route path="quiz/" element={<Outlet />}>
        <Route path="play" element={<PlayQuiz />} />
        <Route path="result/:score" element={<Result />} />
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
