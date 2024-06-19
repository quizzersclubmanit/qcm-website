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
import { login, setData } from "../redux/user.slice"
import toast from "react-hot-toast"

const Auth = ({ label = "signup" }) => {
  const { handleSubmit, setValue, formState, register } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      school: "",
      city: ""
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
        if (user.name) {
          dbService
            .insert({
              collectionId: env.userId,
              data: {
                userId: user.$id,
                name: formData.name,
                contactNo: formData.phone,
                educationalInstitute: formData.school,
                city: formData.city
              }
            })
            .then((res) => {
              user = { ...user, ...res }
            })
            .catch((error) => {
              console.error(error)
            })
        }
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
        setValue("name", "")
        setValue("email", "")
        setValue("password", "")
        setValue("phone", "")
        setValue("school", "")
        setValue("city", "")
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
        <SectionHead logo label={label == "signup" ? "Register" : "Login"} />
        <form noValidate className="flex flex-col gap-4">
          {label == "signup" && (
            <>
              <Input
                error={errors.name}
                placeholder="Name"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("name", {
                  required: {
                    value: true,
                    message: "This is a required field"
                  }
                })}
              />

              <Input
                type="tel"
                error={errors.phone}
                placeholder="Phone"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("phone", {
                  required: {
                    value: true,
                    message: "This is a required field"
                  },
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
                {...register("school", {
                  required: {
                    value: true,
                    message: "This is a required field"
                  }
                })}
              />

              <Input
                error={errors.city}
                placeholder="City"
                className="focus:outline-0 p-3 focus:bg-gray-100 transition-all"
                style={{ borderBottom: "2px solid blue" }}
                {...register("city", {
                  required: {
                    value: true,
                    message: "This is a required field"
                  }
                })}
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
              required: {
                value: true,
                message: "This is a required field"
              },
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
            })}
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
