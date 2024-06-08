import { createContext, useContext } from "react"

const QuizContext = createContext({
    quizes: [
        /*{
            $id: ""
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

const QuizProvider = QuizContext.Provider

const useQuizContext = ()=>{
    return useContext(QuizContext)
}

export {QuizProvider, useQuizContext}