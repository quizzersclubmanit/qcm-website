import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import Layout from "./Layout.jsx"
import SignupPage from "./components/SignupPage.jsx"
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  // QUIZ-PAUSED: Outlet
} from "react-router-dom"
import {
  Home,
  Auth,
  Event,
  // QUIZ-PAUSED: Result,
  Verification,
  Team,
  // QUIZ-PAUSED: Leaderboard,
  ResetPassword,

} from "./pages/pages.js"
import {
  ManageTeams,
  ManageSheets,
  ManageDriveLinks,
} from "./dashboards/dashboards.js"
import NotFound from "./pages/NotFound.jsx"
// QUIZ-PAUSED: import { Admin, FAQs, ClassPrompt } from "./components/components.js"
import { Admin, FAQs } from "./components/components.js"
import { Provider } from "react-redux"
import store from "./redux/store.js"
import AppInitializer from "./AppInitializer.jsx"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="team" element={<Team />} />
      <Route path="signup" element={<SignupPage />} />

      <Route path="signin" element={<Auth label="login" />} />
      <Route path="reset-password" element={<Auth label="update-password" />} />
      <Route path="login" element={<Auth label="login" />} />
      <Route path="update-phone" element={<Auth label="update" />} />
      <Route
        path="update-password"
        element={<Auth label="update-password" />}
      />
      <Route path="account/verification/:dets" element={<Verification />} />
      <Route path="events/:eventId" element={<Event />} />
      {/* QUIZ-PAUSED: quiz play routes hidden while focusing on team registrations
      <Route path="quiz/" element={<Outlet />}>
        <Route path="instr/:sec" element={<ClassPrompt />} />
        <Route path="play/:sec" element={<PlayQuiz />} />
        <Route path="result/:msg" element={<Result />} />
      </Route>
      */}
      <Route path="admin/" element={<Admin />}>
        {/* QUIZ-PAUSED: <Route path="add" element={<AddQuiz />} /> */}
        {/* QUIZ-PAUSED: <Route path="manage" element={<ManageQuiz />} /> */}
        <Route index element={<Navigate to="teams" replace />} />
        <Route path="teams" element={<ManageTeams />} />
        <Route path="sheets" element={<ManageSheets />} />
        <Route path="drives" element={<ManageDriveLinks />} />
        {/* QUIZ-PAUSED: <Route path="results" element={<Leaderboard />} /> */}
      </Route>
      <Route path="faqs" element={<FAQs />} />
      <Route path="reset-password-page" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const elem = document.getElementById("root")
const root = ReactDOM.createRoot(elem)
root.render(
  <Provider store={store}>
    <AppInitializer>
      <RouterProvider router={router} />
    </AppInitializer>
  </Provider>
)
