import { createContext, useContext } from "react"

const QuizContext = createContext({
    quizes: [
        /*{
            _id: "",
            queNo: 1,
            question: "",
            options: ["","","",""],
            answer: 0,  // index
            reward: 2,  // points
            timeLimit: 60   // seconds
        }*/
    ],
    setQuizes: (quizes=[])=>{},
    addQuiz: (quiz={})=>{},
    editQuiz: (quizId="", changes={})=>{},
    deleteQuiz: (quizId="")=>{}
})