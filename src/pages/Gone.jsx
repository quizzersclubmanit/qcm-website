import { Link } from "react-router-dom"
import SEO from "../components/SEO.jsx"

// Retired quiz-play URLs (/quiz/*) while live quizzes are paused.
// Explicit "removed" + noindex kills Search Console soft-404s
// (a plain SPA fallback would otherwise serve 200 + app shell).
const Gone = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <SEO
        title="Quiz Removed | Quizzers' Club NIT Bhopal"
        description="This live quiz has ended or was removed. Explore QBIT registration, quiz events and FAQs by Quizzers' Club NIT Bhopal."
        path="/quiz"
        noindex
      />
      <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-2xl font-bold mb-6 shadow-sm">
        410
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
        This Quiz Is No Longer Available
      </h1>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        Live quizzes are currently paused while we focus on team registrations for QBIT&apos;26. Check out our events or register your team instead.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          Register for QBIT&apos;26
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default Gone
