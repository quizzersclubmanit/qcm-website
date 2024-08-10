import { Input, Button } from "../components/components"
import { useForm } from "react-hook-form"
import authService from "../api/auth.service"
import dbService from "../api/db.service"
import constants from "../../constants"
import { useNavigate } from "react-router-dom"
import { setData } from "../redux/user.slice"
import { useDispatch, useSelector } from "react-redux"

const UpdatePhone = ({ dets = {}, setShowModal = () => {} }) => {
  const { register, handleSubmit, setValue, formState } = useForm({
    defaultValues: {
      password: "",
      phone: ""
    }
  })
  const { errors } = formState
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.data)
  const dispatch = useDispatch()

  return (
    <form className="flex flex-col gap-3">
      <Input
        type="tel"
        error={errors.phone}
        placeholder="* Phone"
        className="text-sm focus:outline-0 p-3 font-normal rounded-xl border border-blue-500"
        {...register("phone", {
          required: true,
          pattern: {
            value: /^(?:(?:\+91|0)?(?:\s[-.\s])?\d{3}\s?\d{3}\s?\d{4})?$/,
            message: "Enter a valid Indian phone number"
          }
        })}
      />
      <Input
        className="text-sm focus:outline-0 p-3 font-normal rounded-xl border border-blue-500"
        error={errors.password}
        type="password"
        placeholder="* Password"
        {...register("password", {
          required: true,
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-+_])[^\s]{8,}$/,
            message:
              "Password should contain at least 1 lowercase, uppercase, special character and should at least be 8 characters long"
          }
        })}
      />
      <Button
        label="Update"
        className="p-2 rounded-xl text-white hover:bg-[#1d2d50] bg-[#14213D]"
        onClick={handleSubmit((formData) => {
          authService
            .addPhoneNumber({
              phone: formData.phone,
              password: formData.password
            })
            .then(() => {
              dets.phone = `+91${formData.phone}`
              dbService
                .update({
                  collectionId: constants.userId,
                  documentId: user.$id,
                  changes: {
                    contactNo: `+91${formData.phone}`
                  }
                })
                .then(() => {
                  dispatch(
                    setData({ ...user, contactNo: `+91${formData.phone}` })
                  )
                  authService.sendVerificationToken()
                  navigate(`/account/verification/${JSON.stringify(dets)}`)
                  setShowModal(false)
                })
                .catch((error) => console.error(error))
            })
            .catch((error) => console.error(error))
            .finally(() => {
              setValue("phone", "")
              setValue("password", "")
            })
        })}
      />
    </form>
  )
}

export default UpdatePhone
