import "./pages.css"
import { useForm } from "react-hook-form"
import { Container, Input, SectionHead, Button } from "../components/components"
import { authIllustration } from "../assets/assets"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import authService from "../api/auth.service"
import dbService from "../api/db.service"
import { useCallback, useState } from "react"
import env from "../../constants"
import { useDispatch } from "react-redux"
import { setData, login } from "../redux/user.slice"
import toast from "react-hot-toast"

const Auth = ({ label = "signup" }) => {
  const { handleSubmit, setValue, formState, register } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      school: "",
      city: "",
      sex: ""
    }
  })
  const { errors } = formState
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)

  const Eye = useCallback(() => {
    if (!showPassword)
      return (
        <IoEye
          className="text-xl cursor-pointer"
          onClick={() => {
            setShowPassword(true)
          }}
        />
      )
    return (
      <IoEyeOff
        className="text-xl cursor-pointer"
        onClick={() => {
          setShowPassword(false)
        }}
      />
    )
  }, [showPassword])

  const authenticate = useCallback((f = async () => {}, formData = {}) => {
    f({
      email: formData.email,
      password: formData.password,
      name: formData.name
    })
      .then((user) => {
        if (formData.name) {
          authService
            .addPhoneNumber({
              phone: formData.phone,
              password: formData.password
            })
            .then(() => {
              authService
                .sendVerificationToken()
                .then(() => {
                  const dets = JSON.stringify({
                    userId: user.userId,
                    phone: formData.phone
                  })
                  navigate(`/account/verification/${dets}`)
                })
                .catch((error) => {
                  console.error(error)
                  toast.error(error.message)
                })
            })
            .catch((error) => {
              console.error(error)
            })
        }

        if (formData.name) {
          dbService
            .insert({
              collectionId: env.userId,
              data: {
                userId: user.$id,
                name: formData.name.toLowerCase(),
                contactNo: formData.phone,
                educationalInstitute: formData.school.toLowerCase(),
                city: formData.city.toLowerCase(),
                sex: formData.sex.toLowerCase()
              }
            })
            .then((res) => {
              user = { ...user, ...res }
            })
            .catch((error) => {
              console.error(error)
            })
        } else {
          dispatch(login())
          navigate("/")
          toast.success("Logged In Successfully")
        }
        dispatch(setData(user))
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.message)
      })
      .finally(() => {
        setValue("name", "")
        setValue("email", "")
        setValue("password", "")
        setValue("phone", "")
        setValue("school", "")
        setValue("city", "")
        setValue("sex", "")
      })
  }, [])

  const requiredCheck = {
    required: {
      value: true,
      message: "This is a required field"
    }
  }

  return (
    <Container
      id="auth"
      className="alatsi-regular sm:p-[3.5vmax] p-[2vmax] min-h-screen flex justify-center items-center"
    >
      <div className="left w-1/2 items-center hidden md:flex">
        <img src={authIllustration} alt="Auth Illustration" />
      </div>

      <div className="right md:w-1/2 sm:w-[70vw] w-full sm:h-full bg-white p-8 rounded-2xl flex flex-col gap-8">
        <SectionHead logo label={label == "signup" ? "Register" : "Login"} />
        <form noValidate className="flex flex-col gap-4">
          {label == "signup" && (
            <>
              <Input
                error={errors.name}
                placeholder="Name"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("name", requiredCheck)}
              />

              <Input
                error={errors.sex}
                placeholder="Male / Female / Other"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("sex", requiredCheck)}
              />

              <Input
                type="tel"
                error={errors.phone}
                placeholder="Phone"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("phone", {
                  ...requiredCheck,
                  pattern: {
                    value:
                      /^(?:(?:\+91|0)?(?:\s[-.\s])?\d{3}\s?\d{3}\s?\d{4})?$/,
                    message: "Enter a valid Indian phone number"
                  }
                })}
              />

              <Input
                error={errors.school}
                placeholder="School"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("school", requiredCheck)}
              />

              <Input
                error={errors.city}
                placeholder="City"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("city", requiredCheck)}
              />
            </>
          )}

          <Input
            className="focus:outline-0 p-2 focus:bg-gray-100 transition-all"
            style={{ borderBottom: "2px solid blue" }}
            error={errors.email}
            type="email"
            placeholder="Email"
            {...register("email", {
              ...requiredCheck,
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid Email"
              }
            })}
          />

          <Input
            className="focus:outline-0 p-2 focus:bg-gray-100 transition-all"
            style={{ borderBottom: "2px solid blue" }}
            error={errors.password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", {
              ...requiredCheck,
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-+])[^\s]{8,}$/,
                message:
                  "Password should contain at least 1 lowercase, uppercase, special character and should at least be 8 characters long"
              }
            })}
          >
            <Eye />
          </Input>

          <Button
            label={label == "signup" ? "Register" : "Login"}
            className="p-2 rounded-l text-lg text-white bg-[#020062] hover:bg-[#2b2b67]"
            onClick={handleSubmit((formData) => {
              if (label == "signup")
                authenticate(authService.signupAndLogin, formData)
              else authenticate(authService.login, formData)
            })}
          />
        </form>

        <Link
          className="w-fit text-blue-500"
          to={label == "signup" ? "/login" : "/signup"}
        >
          {label == "signup"
            ? "Already have an account?"
            : "Not having an account?"}
        </Link>
      </div>
    </Container>
  )
}

export default Auth
