import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Instructions } from "../pages/pages"
import toast from "react-hot-toast"
import { instructions } from "../assets/qcmData.json"

const ClassPrompt = () => {
  const { data } = useSelector((state) => state.user)
  const { sec } = useParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasAttemptedQuiz, setHasAttemptedQuiz] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ...your checkQuizAttempt effect (unchanged)
    const checkQuizAttempt = async () => {
      setIsLoading(true);
      const userId = data?.id;
      if (!userId) {
        toast.error("User not authenticated properly");
        navigate("/");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://qcm-backend-ln5c.onrender.com/api/user/scores?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          if (result.score !== null) {
            setHasAttemptedQuiz(true);
            toast.warn("You have already completed the quiz!");
          }
        }
      } catch (error) {
        console.error("Error checking quiz attempt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (String(sec) === "0") checkQuizAttempt();
    else setIsLoading(false);
  }, [data, navigate, sec]);

  const handleClassSelect = async (classValue) => {
    setIsProcessing(true)
    const userId = data.$id || data.id || data.userId
    try {
      await fetch(`https://qcm-backend-ln5c.onrender.com/api/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ class: classValue }),
      })
      localStorage.setItem("userClass", classValue)
      localStorage.setItem("userStandard", classValue)
      toast.success("Class information saved!")
      navigate("/quiz/instr/1")
    } catch (error) {
      console.error("Error saving class:", error)
      localStorage.setItem("userClass", classValue)
      localStorage.setItem("userStandard", classValue)
      toast.error("Could not save to database, but continuing...")
      navigate("/quiz/instr/1")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        <p className="ml-3">Loading...</p>
      </div>
    )
  }

  if (hasAttemptedQuiz) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600">You've already taken the quiz.</h2>
          <p className="mt-3 text-gray-700">You are not allowed to attempt it more than once.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (String(sec) !== "0") {
    return <Instructions sec={sec} />
  }

  // ===== UPDATED UI: prevents overflow by constraining card height and enabling inner scroll ====
  return (
    <div
      className="flex justify-center items-center min-h-screen p-4 sm:p-8"
      // optional background; keep it but it's not forcing overflow
      style={{
        background: 'url("/image-quiz-bg.png") no-repeat center center/cover',
      }}
    >
      <div
        className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full sm:max-w-4xl
                   max-h-[85vh] overflow-y-auto flex sm:flex-row flex-col gap-5 items-stretch"
      >
        {/* LEFT: instructions -- allow it to shrink and scroll if needed */}
        <div className="sm:w-1/2 flex-1 min-w-0 overflow-auto">
          <h1 className="text-lg sm:text-xl font-semibold">
            Hey{" "}
            <span className="uppercase">
              {data?.name || data?.username || "Student"}
            </span>
            , Welcome
          </h1>
          <h2 className="text-2xl font-bold mt-2">IQC Round 1</h2>
          <ul className="text-gray-700 leading-relaxed mt-3 space-y-2 text-sm">
            <li><strong>Format:</strong> There are <span className="text-emerald-600 font-semibold">4 sections</span>.</li>
            <li><strong>Progression:</strong> You must submit the current section to enter the next one.</li>
            <li className="text-red-600 font-semibold">
              ⚠ Warning: If you press <kbd>Esc</kbd> or try to exit full screen,
              you will be <u>disqualified immediately</u> without any warning.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">General Instructions</h2>
          <hr />
          <ul className="mt-2 text-gray-700 leading-relaxed">
            {Object.keys(instructions.general).map((key, index) => (
              <li key={index}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(instructions.general[key])
                  ? instructions.general[key].map((remark, idx) => (
                    <p key={idx}>{remark}</p>
                  ))
                  : instructions.general[key]}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Class Selection */}
        <div className="sm:w-1/2 flex flex-col gap-5 items-center">
          <h2 className="text-xl font-semibold">Select Your Standard to </h2>
          <hr className="w-full" />
          {isProcessing ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            // responsive grid: 3 columns on small screens, auto-fit on larger
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
              {[8, 9, 10, 11, 12].map((classValue) => (
                <button
                  key={classValue}
                  onClick={() => handleClassSelect(classValue)}
                  className="py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-sm"
                >
                  {classValue}
                </button>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-600 mt-3">Please select your class to continue.</p>
        </div>
      </div>
    </div>
  )
}

export default ClassPrompt
