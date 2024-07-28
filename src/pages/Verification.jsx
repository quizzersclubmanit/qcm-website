import { Container, Input, Button } from "../components/components"
import { useForm } from "react-hook-form"
import authService from "../api/auth.service"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { login } from "../redux/user.slice"
import { useDispatch } from "react-redux"
import { useState } from "react"

const Verification = () => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      codeArr: new Array(6).fill("")
    }
  })
  const dispatch = useDispatch()
  const digits = [0, 1, 2, 3, 4, 5]
  const navigate = useNavigate()
  let { dets } = useParams()
  dets = JSON.parse(dets)
  const [disableResendBtn, setDisableResendBtn] = useState(false)

  return (
    <Container className="poppins-regular relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl flex flex-col gap-7">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <p className="font-semibold text-[2vmax]">Phone Verification</p>
          <p className="flex flex-row text-sm font-medium text-gray-400">
            We have sent a code to {dets.phone}
          </p>
        </div>
        <form noValidate className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-3">
            {digits.map((digit) => (
              <Input
                key={digit}
                maxLength={1}
                className="h-[8vh] flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white"
                {...register(`codeArr.${digit}`, {
                  required: {
                    value: true,
                    message: "Enter the entire code"
                  }
                })}
              />
            ))}
          </div>

          <div className="flex flex-col space-y-5">
            <div>
              <Button
                label="Verify Account"
                className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-3 bg-[#020062] hover:bg-[#2b2b67] border-none text-white text-sm shadow-sm"
                onClick={handleSubmit((formData) => {
                  const code = formData.codeArr.join("")
                  authService
                    .verifyToken({
                      userId: dets.userId,
                      secret: code
                    })
                    .then(() => {
                      dispatch(login())
                      navigate("/")
                      toast.success("Logged In Successfully")
                    })
                    .catch((error) => {
                      console.error(error)
                    })
                    .finally(() => {
                      setValue("codeArr", new Array(6).fill(""))
                    })
                })}
              />
            </div>

            <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
              <p>Didn't recieve code?</p>{" "}
              <Button
                className={`flex flex-row items-center ${disableResendBtn ? "text-gray-500" : "text-blue-600"}`}
                disabled={disableResendBtn}
                label="Resend"
                onClick={(e) => {
                  e.preventDefault()
                  authService
                    .sendVerificationToken()
                    .catch((error) => {
                      console.error(error)
                      toast.error(error.message)
                    })
                    .finally(() => {
                      setDisableResendBtn(true)
                    })
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Verification
