import { Container, Input, Button, Modal } from "../components/components"
import { UpdatePhone } from "../dashboards/dashboards"
import { useForm } from "react-hook-form"
import authService from "../api/auth.service"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { login } from "../redux/user.slice"
import { useDispatch } from "react-redux"
import { useState } from "react"

const Verification = () => {
  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: {
      code: ""
    }
  })
  const { errors } = formState
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let { dets } = useParams()
  dets = JSON.parse(dets)
  const [disableResendBtn, setDisableResendBtn] = useState(false)
  const [showModal, setShowModal] = useState(false)

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
          <div>
            <Input
              className="h-[8vh] flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white"
              {...register("code", {
                required: {
                  value: true,
                  message: "Code is reqiured"
                },
                pattern: {
                  value: /^\d{6}$/,
                  message: "Code should be a 6 digit string"
                }
              })}
            />
            <p className="text-sm text-red-500">{errors.code?.message}</p>
          </div>

          <div className="flex flex-col space-y-5">
            <div>
              <Button
                label="Verify Account"
                className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-3 bg-[#020062] hover:bg-[#2b2b67] border-none text-white text-sm shadow-sm"
                onClick={handleSubmit((formData) => {
                  authService
                    .verifyToken({
                      userId: dets.userId,
                      secret: formData.code
                    })
                    .then(() => {
                      dispatch(login())
                      navigate("/")
                      toast("Logged In Successfully")
                    })
                    .catch((error) => {
                      toast(error.message)
                      console.error(error)
                    })
                    .finally(() => {
                      setValue("code", "")
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
                      toast(error.message)
                    })
                    .finally(() => {
                      setDisableResendBtn(true)
                    })
                }}
              />
            </div>

            <Button
              label="Change Phone Number?"
              className="text-sm text-blue-600"
              onClick={(e) => {
                e.preventDefault()
                setShowModal(true)
                setDisableResendBtn(false)
              }}
            />
          </div>
        </form>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <UpdatePhone setShowModal={setShowModal} dets={dets} />
        </Modal>
      )}
    </Container>
  )
}

export default Verification
