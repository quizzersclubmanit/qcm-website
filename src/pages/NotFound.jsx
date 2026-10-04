import { Link } from "react-router-dom"
import { FaHome, FaArrowLeft } from "react-icons/fa"

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-3xl font-bold mb-6 shadow-sm">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        The page you are looking for doesn't exist or may have been moved. If you are registering for QBIT'26, head to the registration page.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          <FaHome className="text-sm" /> Go to Home
        </Link>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
        >
          Register for QBIT'26
        </Link>
      </div>
    </div>
  )
}

export default NotFound
