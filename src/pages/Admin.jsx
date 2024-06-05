import dbService from "../api/db.service"
import authService from "../api/auth.service"
import {Container, Input, Button} from "../components/components"
import { useForm } from "react-hook-form"
import env from "../../env"
import { useQuizContext } from "../contexts/quiz.context"
import { useUserContext } from "../contexts/user.context"
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Admin = () => {
  const {setValue, handleSubmit, control, formState, register} = useForm({
    defaultValues: {
      question: "",
      options: ["","","",""],
      answer: 0,
      reward: 0,
      timeLimit: 60
    }
  })
  const {errors} = formState
  const {addQuiz, quizCount} = useQuizContext()
  const {login, loggedIn, userData, setUserData} = useUserContext()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    authService.getCurrentUser()
    .then(user => {
      setUserData(user)
      login()
    })
    .catch(err => {
      console.error(err)
    })
    .finally(()=>{
      setLoading(false)
    })
  },[])

  if (loading) return (
    <Container className="h-screen flex justify-center items-center">
      <h1 className="text-[3vmax] font-bold">Loading...</h1>
    </Container>
  )
  if (!loggedIn || userData.name != "admin") return <Navigate to="/" />
  return (
    <div id="admin" className="londrina-solid-regular tracking-wider">
      <Container className="min-h-screen flex justify-center items-center">
        <form noValidate className="md:w-[40vw] flex flex-col gap-4">
          <Input rules={{
            required: {
              value: true,
              message: "This is a required field"
            }
          }} control={control} name="question" errors={errors} placeholder="Question here..." className="p-4 rounded-lg text-lg focus:outline-0"/>
          <div>
            <Input rules={{
              required: {
                value: true,
                message: "This is a required field"
              }
            }} className="px-4 py-2 rounded-lg text-lg focus:outline-0" control={control} name="options.0" errors={errors} placeholder="Option A"/>
            <Input rules={{
              required: {
                value: true,
                message: "This is a required field"
              }
            }} className="px-4 py-2 rounded-lg text-lg focus:outline-0" control={control} name="options.1" errors={errors} placeholder="Option B"/>
            <Input rules={{
              required: {
                value: true,
                message: "This is a required field"
              }
            }} className="px-4 py-2 rounded-lg text-lg focus:outline-0" control={control} name="options.2" errors={errors} placeholder="Option C"/>
            <Input rules={{
              required: {
                value: true,
                message: "This is a required field"
              }
            }} className="px-4 py-2 rounded-lg text-lg focus:outline-0" control={control} name="options.3" errors={errors} placeholder="Option D"/>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="left flex w-full justify-evenly bg-pink-500 p-1 rounded-lg">
              <label className='text-lg' htmlFor="answer">Correct Option</label>
              <select id="answer" className="p-1 cursor-pointer rounded-lg" defaultValue={0} {...register("answer")}>
                <option value={0}>A</option>
                <option value={1}>B</option>
                <option value={2}>C</option>
                <option value={3}>D</option>
              </select>
            </div>
            <div className="right flex flex-col w-full bg-pink-500 p-1 rounded-lg">
              <div>
                <Input rules={{
                  required: {
                    value: true,
                    message: "This is a required field"
                  }
                }} className="p-2 rounded-lg focus:outline-0 focus:bg-pink-200 transition-all bg-pink-300" oneline label="Enter Points" control={control} name="reward" errors={errors}/>
              </div>
              <div>
                <Input className="p-2 rounded-lg focus:outline-0 focus:bg-pink-200 transition-all bg-pink-300" oneline label="Time Limit" control={control} name="timeLimit" errors={errors}/>
              </div>
            </div>
          </div>
          <Button className="text-xl bg-yellow-300 hover:bg-yellow-400 w-full p-3 rounded-lg" label="+ Add Question" onClick={handleSubmit(formData => {
            dbService.insert({
              collectionId: env.quizId,
              question: formData.question,
              options: formData.options,
              answer: Number(formData.answer),
              reward: Number(formData.reward),
              timeLimit: Number(formData.timeLimit)
            })
            .then(doc => {
              addQuiz({
                _id: doc._id,
                qNo: quizCount+1,
                question: doc.question,
                options: doc.options,
                answer: doc.answer,
                reward: doc.reward,
                timeLimit: doc.timeLimit
              })
            })
            .catch(err => {
              alert(err.message)
              console.error(err)
            })
            .finally(()=>{
              setValue("question","")
              setValue("options",["","","",""])
              setValue("answer",0)
              setValue("reward",0)
              setValue("timeLimit",60)
            })
          })} />
        </form>
      </Container>
    </div>
  )
}

export default Admin