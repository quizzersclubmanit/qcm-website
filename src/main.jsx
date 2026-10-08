import { lazy, Suspense, useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import Layout from "./Layout.jsx"
// NOTE: import Home directly — the pages.js barrel re-exports every page,
// which would pull all lazy routes into the main chunk and defeat splitting.
import Home from "./pages/Home.jsx"
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  // QUIZ-PAUSED: Outlet
} from "react-router-dom"
import { Provider } from "react-redux"
import store from "./redux/store.js"
import AppInitializer from "./AppInitializer.jsx"

// Code-split below-the-fold / non-LCP routes so the home bundle stays lean.
// Home stays eager (LCP); everything else loads on demand.
const SignupPage = lazy(() => import("./components/SignupPage.jsx"))
const Auth = lazy(() => import("./pages/Auth.jsx"))
const Event = lazy(() => import("./pages/Event.jsx"))
const Verification = lazy(() => import("./pages/Verification.jsx"))
const Team = lazy(() => import("./pages/Team.jsx"))
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"))
const NotFound = lazy(() => import("./pages/NotFound.jsx"))
const Gone = lazy(() => import("./pages/Gone.jsx"))
const FAQs = lazy(() => import("./components/FAQs.jsx"))
const Admin = lazy(() => import("./components/Admin.jsx"))
const ManageTeams = lazy(() => import("./dashboards/ManageTeams.jsx"))
const ManageSheets = lazy(() => import("./dashboards/ManageSheets.jsx"))
const ManageDriveLinks = lazy(() => import("./dashboards/ManageDriveLinks.jsx"))

// Inline fallback (NOT the Loader component — it imports the full barrel
// and would defeat code-splitting). Delayed 600ms: route chunks are
// modulepreloaded (scripts/preloads.cjs), so fast loads commit with no
// fallback flash and ~zero layout shift; the loader only appears when the
// network genuinely stalls, as user feedback.
const DelayedFallback = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 600)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <span className="sr-only">Loading...</span>
      <div className="h-8 w-8 bg-black rounded-full animate-bounce" />
    </div>
  )
}

const withSuspense = (el) => (
  <Suspense fallback={<DelayedFallback />}>{el}</Suspense>
)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="team" element={withSuspense(<Team />)} />
      <Route path="signup" element={withSuspense(<SignupPage />)} />

      <Route path="signin" element={withSuspense(<Auth label="login" />)} />
      <Route path="reset-password" element={withSuspense(<Auth label="update-password" />)} />
      <Route path="login" element={withSuspense(<Auth label="login" />)} />
      <Route path="update-phone" element={withSuspense(<Auth label="update" />)} />
      <Route
        path="update-password"
        element={withSuspense(<Auth label="update-password" />)}
      />
      <Route path="account/verification/:dets" element={withSuspense(<Verification />)} />
      <Route path="events/:eventId" element={withSuspense(<Event />)} />
      {/* QUIZ-PAUSED: quiz play routes hidden while focusing on team registrations
      <Route path="quiz/" element={<Outlet />}>
        <Route path="instr/:sec" element={<ClassPrompt />} />
        <Route path="play/:sec" element={<PlayQuiz />} />
        <Route path="result/:msg" element={<Result />} />
      </Route>
      */}
      <Route path="admin/" element={withSuspense(<Admin />)}>
        {/* QUIZ-PAUSED: <Route path="add" element={<AddQuiz />} /> */}
        {/* QUIZ-PAUSED: <Route path="manage" element={<ManageQuiz />} /> */}
        <Route index element={<Navigate to="teams" replace />} />
        <Route path="teams" element={withSuspense(<ManageTeams />)} />
        <Route path="sheets" element={withSuspense(<ManageSheets />)} />
        <Route path="drives" element={withSuspense(<ManageDriveLinks />)} />
        {/* QUIZ-PAUSED: <Route path="results" element={<Leaderboard />} /> */}
      </Route>
      <Route path="quiz/*" element={withSuspense(<Gone />)} />
      <Route path="faqs" element={withSuspense(<FAQs />)} />
      <Route path="reset-password-page" element={withSuspense(<ResetPassword />)} />
      <Route path="*" element={withSuspense(<NotFound />)} />
    </Route>
  )
)

// Remove the SEO prerender fallback (injected at build time for crawlers)
// before React takes over, to avoid duplicate H1s after hydration.
document.getElementById("seo-fallback")?.remove()

// Full-DOM prerender signal: headless Chromium snapshots after intro
// animations settle so crawlers get the final visible HTML.
if (new URLSearchParams(window.location.search).has("prerender")) {
  window.__PRERENDER_PENDING = true
  setTimeout(() => {
    window.__PRERENDER_READY = true
  }, 4000)
}

const elem = document.getElementById("root")
const root = ReactDOM.createRoot(elem)
root.render(
  <Provider store={store}>
    <AppInitializer>
      <RouterProvider router={router} />
    </AppInitializer>
  </Provider>
)
