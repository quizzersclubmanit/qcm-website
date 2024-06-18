import "./pages.css"
import { useForm } from "react-hook-form"
import { Container, Input, SectionHead, Button } from "../components/components"
import { authIllustration } from "../assets/assets"
import { FcGoogle } from "react-icons/fc"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import authService from "../api/auth.service"
import { useCallback, useState } from "react"
import env from "../../env"
import { useDispatch } from "react-redux"
import { login, setData } from "../redux/user.slice"
import toast from "react-hot-toast"

const Auth = ({ label = "signup" }) => {
  const { handleSubmit, setValue, control, formState } = useForm({
    defaultValues: {
      Name: "",
      Email: "",
      Password: ""
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
      email: formData.Email,
      password: formData.Password,
      name: formData.Name
    })
      .then((user) => {
        dispatch(setData(user))
        dispatch(login())
        navigate("/")
        toast.success("Logged In Successfully")
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.message)
      })
      .finally(() => {
        setValue("Name", "")
        setValue("Email", "")
        setValue("Password", "")
      })
  }, [])

  return (
    <Container
      id="auth"
      className="londrina-solid-regular sm:p-[3.5vmax] p-[2vmax] min-h-screen flex justify-center items-center"
    >
      <div className="left w-1/2 items-center hidden md:flex">
        <img src={authIllustration} alt="Auth Illustration" />
      </div>

      <div className="right md:w-1/2 sm:w-[70vw] w-full min-h-[50vh] sm:h-full bg-white p-8 rounded-2xl flex flex-col gap-8">
        <SectionHead logo label={label == "signup" ? "Sign Up" : "Login"} />
        <form noValidate className="flex flex-col gap-4">
          {label == "signup" && (
            <Input
              errors={errors}
              name="Name"
              control={control}
              placeholder="Name"
              className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
              style={{ borderBottom: "2px solid blue" }}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field"
                }
              }}
            />
          )}

          <Input
            className="focus:outline-0 p-2 focus:bg-gray-100 transition-all"
            style={{ borderBottom: "2px solid blue" }}
            errors={errors}
            name="Email"
            type="email"
            control={control}
            placeholder="Email"
            rules={{
              required: {
                value: true,
                message: "This is a required field"
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid Email"
              }
            }}
          />

          <Input
            className="focus:outline-0 p-2 focus:bg-gray-100 transition-all"
            style={{ borderBottom: "2px solid blue" }}
            errors={errors}
            name="Password"
            type={showPassword ? "text" : "password"}
            control={control}
            placeholder="Password"
            rules={{
              required: {
                value: true,
                message: "This is a required field"
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-+])[^\s]{8,}$/,
                message:
                  "Password should contain at least 1 lowercase, uppercase, special character and should at least be 8 characters long"
              }
            }}
          >
            <Eye />
          </Input>

          <Button
            label={label == "signup" ? "Create Account" : "Login"}
            className="p-2 rounded-l text-lg text-white bg-[#020062] hover:bg-[#2b2b67]"
            onClick={handleSubmit((formData) => {
              if (label == "signup")
                authenticate(authService.signupAndLogin, formData)
              else authenticate(authService.login, formData)
            })}
          />

          <Button
            label="Continue with Google"
            className="flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition-all p-2 rounded-lg text-lg text-black"
            onClick={(e) => {
              e.preventDefault()
              authService.createSessionWithGoogle({
                // App in testing phase right now - to be published later
                home: env.HOME
              })
            }}
          >
            <FcGoogle style={{ fontSize: "2vmax" }} />
          </Button>
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
