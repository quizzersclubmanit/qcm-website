import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet
} from "react-router-dom"
import { Home, Auth, PlayQuiz } from "./pages/pages.js"
import { AddQuiz, ManageQuiz } from "./dashboards/dashboards.js"
import { Provider } from "react-redux"
import store from "./redux/store.js"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route path="" element={<Home />} />
      <Route path="signup" element={<Auth />} />
      <Route path="login" element={<Auth label="login" />} />
      <Route path="admin/" element={<Outlet />}>
        <Route path="add" element={<AddQuiz />} />
        <Route path="manage" element={<ManageQuiz />} />
      </Route>
      <Route path="quiz" element={<PlayQuiz />} />
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
