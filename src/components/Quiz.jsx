import env from "../../env"
import dbService from "../api/db.service"
import { Input, Button } from "./components"
import { useForm } from "react-hook-form"
import { addQuiz, editQuiz } from "../redux/quiz.slice"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"

const Quiz = ({ quiz = {}, setShowModal = () => {} }) => {
  const { setValue, handleSubmit, control, formState, register } = useForm({
    defaultValues: {
      question: quiz.question || "",
      options: quiz.options || ["", "", "", ""],
      answer: quiz.answer || null,
      reward: quiz.reward || 0,
      timeLimit: quiz.timeLeft || 60
    }
  })
  const { errors } = formState
  const editTab = Boolean(quiz.$id)
  const dispatch = useDispatch()

  return (
    <form noValidate className="md:w-[40vw] flex flex-col gap-4">
      <Input
        rules={{
          required: {
            value: true,
            message: "This is a required field"
          }
        }}
        control={control}
        name="question"
        errors={errors}
        placeholder="Question here..."
        className="p-4 rounded-lg text-xl focus:outline-0"
      />
      <div>
        <Input
          rules={{
            required: {
              value: true,
              message: "This is a required field"
            }
          }}
          className="px-4 py-2 rounded-lg text-lg focus:outline-0"
          control={control}
          name="options.0"
          errors={errors}
          placeholder="Option A"
        />
        <Input
          rules={{
            required: {
              value: true,
              message: "This is a required field"
            }
          }}
          className="px-4 py-2 rounded-lg text-lg focus:outline-0"
          control={control}
          name="options.1"
          errors={errors}
          placeholder="Option B"
        />
        <Input
          rules={{
            required: {
              value: true,
              message: "This is a required field"
            }
          }}
          className="px-4 py-2 rounded-lg text-lg focus:outline-0"
          control={control}
          name="options.2"
          errors={errors}
          placeholder="Option C"
        />
        <Input
          rules={{
            required: {
              value: true,
              message: "This is a required field"
            }
          }}
          className="px-4 py-2 rounded-lg text-lg focus:outline-0"
          control={control}
          name="options.3"
          errors={errors}
          placeholder="Option D"
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <div className="left flex w-full justify-evenly bg-pink-500 p-1 rounded-lg">
          <label className="text-lg" htmlFor="answer">
            Correct Option
          </label>
          <select
            id="answer"
            className="p-1 cursor-pointer rounded-lg"
            defaultValue={0}
            {...register("answer")}
          >
            <option value={0}>A</option>
            <option value={1}>B</option>
            <option value={2}>C</option>
            <option value={3}>D</option>
          </select>
        </div>
        <div className="right flex flex-col w-full bg-pink-500 p-2 rounded-lg">
          <div>
            <Input
              rules={{
                required: {
                  value: true,
                  message: "This is a required field"
                }
              }}
              className="p-2 rounded-lg focus:outline-0 focus:bg-pink-200 transition-all bg-pink-300"
              oneline
              label="Enter Points"
              control={control}
              name="reward"
              errors={errors}
            />
          </div>
          <div>
            <Input
              className="p-2 rounded-lg focus:outline-0 focus:bg-pink-200 transition-all bg-pink-300"
              oneline
              label="Time Limit"
              control={control}
              name="timeLimit"
              errors={errors}
            />
          </div>
        </div>
      </div>
      <Button
        className="text-xl bg-yellow-300 hover:bg-yellow-400 w-full p-3 rounded-lg"
        label={editTab ? "Save" : "+ Add Question"}
        onClick={handleSubmit((formData) => {
          if (editTab) {
            dbService
              .update({
                collectionId: env.quizId,
                documentId: quiz.$id,
                changes: {
                  ...formData,
                  answer: Number(formData.answer),
                  reward: Number(formData.reward),
                  timeLimit: Number(formData.timeLimit)
                }
              })
              .then((doc) => {
                dispatch(
                  editQuiz({
                    $id: quiz.$id,
                    changes: doc
                  })
                )
                toast.success("Quiz Updated Successfully")
              })
              .catch((error) => {
                console.error(err)
                toast.error(error.message)
              })
              .finally(() => {
                setShowModal(false)
              })
          } else {
            dbService
              .insert({
                collectionId: env.quizId,
                data: {
                  ...formData,
                  answer: Number(formData.answer),
                  reward: Number(formData.reward),
                  timeLimit: Number(formData.timeLimit)
                }
              })
              .then((doc) => {
                dispatch(addQuiz(doc))
                toast.success("Quiz Added Successfully")
              })
              .catch((error) => {
                toast.error(error.message)
                console.error(err)
              })
              .finally(() => {
                setValue("question", "")
                setValue("options", ["", "", "", ""])
                setValue("answer", null)
                setValue("reward", 0)
                setValue("timeLimit", 60)
              })
          }
        })}
      />
    </form>
  )
}

export default Quiz
