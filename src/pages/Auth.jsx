import "./pages.css"
import { useForm } from "react-hook-form"
import {
  Container,
  Input,
  SectionHead,
  Button,
  Footer,
  Loader,
  Popup
} from "../components/components"
import { authIllustration } from "../assets/assets"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import authService from "../api/auth.service"
import dbService from "../api/db.service"
import { useCallback, useState } from "react"
import env from "../../constants"
import { useDispatch } from "react-redux"
import { setData, login } from "../redux/user.slice"
import toast from "react-hot-toast"
import { schools } from "../assets/qcmData.json"
import { filterObjects } from "../utils/utils"

const Auth = ({ label = "signup" }) => {
  let [searchParams, setSearchParams] = useSearchParams()
  const token = searchParams.get("secret")
  const { handleSubmit, setValue, formState, register } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      school: "",
      sex: "1",
      city: "bhopal"
    }
  })
  const [selectedCity, setSelectedCity] = useState("bhopal")

  const { errors } = formState
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [userId, setUserId] = useState("")
  const [newPass, setNewPass] = useState("")
  const fields = [
    <Input
      className="text-sm focus:outline-0 p-3 font-normal rounded-xl border border-blue-500"
      key={2}
      placeholder="User Id"
      value={userId}
      onChange={(e) => setUserId(e.target.value)}
    />,
    <Input
      className="text-sm focus:outline-0 p-3 font-normal rounded-xl border border-blue-500"
      key={3}
      placeholder="New Password"
      value={newPass}
      onChange={(e) => setNewPass(e.target.value)}
    />
  ]

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
    setLoading(true)
    f({
      email: formData.email,
      password: formData.password,
      name: formData.name
    })
      .then((user) => {
        if (formData.name) {
          dbService
            .insert({
              collectionId: env.userId,
              data: {
                userId: user.$id,
                name: formData.name.toLowerCase(),
                contactNo: `+91${formData.phone}`,
                educationalInstitute: formData.school.toLowerCase(),
                city: formData.city,
                sex: formData.sex
              }
            })
            .then((res) => {
              user = { ...user, ...res }
              dispatch(setData(user))
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
                        phone: `+91${formData.phone}`
                      })
                      navigate(`/account/verification/${dets}`)
                    })
                    .catch((error) => {
                      console.error(error)
                      toast(error.message)
                    })
                    .finally(() => setLoading(false))
                })
                .catch((error) => {
                  console.error(error)
                  toast(error.message)
                })
                .finally(() => setLoading(false))
            })
            .catch((error) => {
              console.error(error)
            })
            .finally(() => setLoading(false))
        } else {
          dispatch(setData(user))
          dispatch(login())
          navigate("/")
          toast("Thank you for Registering")
        }
      })
      .catch((error) => {
        console.error(error)
        toast(error.message)
      })
      .finally(() => {
        setValue("name", "")
        setValue("email", "")
        setValue("password", "")
        setValue("phone", "")
        setValue("school", "")
        setValue("sex", "1")
        setValue("city", "bhopal")
        setSelectedCity("")
      })
  }, [])

  const requiredCheck = {
    required: {
      value: true,
      message: "This is a required field"
    }
  }

  if (loading) return <Loader />
  if (label == "update-password")
    return (
      <Popup
        submitLabel="Update"
        className="h-screen justify-center w-1/2 mx-auto"
        fieldComponents={fields}
        functionality={(e) => {
          e.preventDefault()
          authService
            .resetPassword({
              token,
              userId,
              newPass
            })
            .then(() => {
              toast("Password updated successfully")
              navigate("/")
            })
            .catch((error) => console.error(error))
            .finally(() => {
              setUserId("")
              setNewPass("")
            })
        }}
      >
        <p className="text-sm">
          For obtaining User Id, Whatsapp on +91{env.devContact}
        </p>
      </Popup>
    )
  return (
    <>
      <Container
        id="auth"
        className="poppins-regular sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col justify-center"
      >
        <div className="flex">
          <div className="left w-1/2 items-center hidden md:flex flex-col justify-centre">
            <img src={authIllustration} alt="Auth Illustration" />
            <div className="absolute bottom-4 left-6 flex flex-col">
                <a
                  className="text-sm text-yellow-400 underline text-left cursor-pointer w-fit mb-1"
                  href="https://drive.google.com/file/d/1NN5XC3IZqS71jfkH3dDQoHBof8AyMetz/view?usp=sharing"
                  target="_blank"
                >
                  Download Instructions
                </a>
                <a
                  className="text-sm text-yellow-400 underline text-left cursor-pointer w-fit"
                  href="https://drive.google.com/file/d/1hB1P7cMSwPrQcW1NFB-7g1CbDmdgC7zN/view"
                  target="_blank"
                >
                  Download IQC 2024 Edition Brochure
                </a>
            </div>
          </div>

          <div className="right md:w-1/2 sm:w-[70vw] w-full sm:h-full bg-white sm:pt-0 pt-4 pb-6 sm:px-8 px-6 rounded-2xl flex flex-col gap-8 my-auto">
            <SectionHead
              blue
              className="poppins-bold"
              label={label == "signup" ? "Register" : "Welcome"}
              logo
            />
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
                  <div className="flex gap-5 items-center">
                    <select
                      className="p-1 cursor-pointer focus:outline-none"
                      {...register("sex", requiredCheck)}
                    >
                      <option value="0">Male</option>
                      <option value="1">Female</option>
                      <option value="2">Other</option>
                    </select>
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
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <select
                      className="p-1 cursor-pointer focus:outline-none text-gray-400"
                      defaultValue=""
                      {...register("school", requiredCheck)}
                    >
                      <option value="" disabled>
                        Your School
                      </option>
                      {filterObjects(schools, "city", selectedCity).map(
                        (obj, index) => {
                          const v = `${obj.institution} - ${obj["pin code"]}`
                          return (
                            <option
                              key={index}
                              value={v}
                              className="text-black"
                            >
                              {v}
                            </option>
                          )
                        }
                      )}
                    </select>

                    <select
                      className="p-1 cursor-pointer focus:outline-none"
                      {...register("city")}
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="bhopal">Bhopal</option>
                      <option value="indore">Indore</option>
                      <option value="gwalior">Gwalior</option>
                      <option value="ujjain">Ujjain</option>
                      <option value="jabalpur">Jabalpur</option>
                    </select>
                  </div>
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
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-+_])[^\s]{8,}$/,
                    message:
                      "Password should contain at least 1 lowercase, uppercase, special character and should at least be 8 characters long"
                  }
                })}
              >
                <Eye />
              </Input>

              <Button
                label={label == "signup" ? "Register" : "Login"}
                className="p-2 rounded-lg text-lg text-white hover:bg-[#1d2d50] bg-[#14213D]"
                onClick={handleSubmit((formData) => {
                  if (label == "signup")
                    authenticate(authService.signupAndLogin, formData)
                  else authenticate(authService.login, formData)
                })}
              />
            </form>

            <div className="flex justify-between text-sm">
              <Link
                className="text-blue-500"
                to={label == "signup" ? "/login" : "/register"}
              >
                {label == "signup"
                  ? "Already have an account?"
                  : "Not having an account?"}
              </Link>
              {label == "login" && (
                <Button
                  className="text-blue-500"
                  onClick={() => {
                    const email = prompt("Your Email")
                    if (!email) return
                    authService
                      .sendEmailToken({ email })
                      .then(() =>
                        toast("Password reset link has been sent to your email")
                      )
                      .catch((error) => console.error(error))
                  }}
                >
                  Forgot Password
                </Button>
              )}
            </div>
            <div className="md:mt-[-21px]  text-gray-600">
              <p className="text-black font-semibold">
                Kindly fill all the details carefully.
              </p>
              <p>
                For any technical query, please contact :
                <span  > Pankaj Soni - 9680032837</span> 
              </p>
              </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  )
}

export default Auth
