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


// Forgot Password Component
const ForgotPasswordButton = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setLoading(true)
    try {
      await authService.sendEmailToken({ email })
      toast.success("Password reset link sent to your email!")
      setShowModal(false)
      setEmail("")
    } catch (error) {
      toast.error(error.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        className="text-blue-500 hover:text-blue-700 underline text-sm font-medium transition-colors duration-200"
        onClick={() => setShowModal(true)}
        type="button"
      >
        Forgot Password?
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Reset Password</h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEmail("")
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEmail("")
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

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

  const authenticate = useCallback((f = async () => { }, formData = {}) => {
    setLoading(true)
    f({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      school: formData.school,
      sex: formData.sex
    })
      .then((user) => {
        dispatch(setData(user))
        dispatch(login())
        if (formData.name) {
          navigate("/")
          toast("Registration successful! Welcome to QCM!")
        } else {
          navigate("/")
          toast("Logged In Successfully")
        }
      })
      .catch((error) => {
        console.error(error)
        navigate('/')
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
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setValue("school", ""); // reset school when city changes
  };
  return (
    <>
      <Container
        id="auth"
        className="poppins-regular sm:p-[3.5vmax] p-[2vmax] min-h-screen flex flex-col justify-center"
      >
        <div className="flex flex-col-reverse md:flex-row">
          <div className="left w-full md:flex flex-col items-center justify-center md:w-1/2">
            <img
              src={authIllustration}
              alt="Auth Illustration"
              className="hidden md:flex"
            />
            <div className="mt-4 md:self-start mb-0 flex flex-col ">
              <a
                className="text-sm text-yellow-400 underline text-left cursor-pointer w-fit  mb-1"
                href="https://drive.google.com/file/d/1c4P0ZzeJLSf-SEluBLZzi_WGeEbfJLP9/view?usp=drive_link"
                target="_blank"
              >
                Download IQC Sample Questions 
              </a>
              {/* <a
                className="text-sm text-yellow-400 underline text-left cursor-pointer w-fit mb-1"
                href="https://drive.google.com/file/d/1NN5XC3IZqS71jfkH3dDQoHBof8AyMetz/view?usp=sharing"
                target="_blank"
              >
                Download Instructions
              </a> */}
              <a
                className="text-sm text-yellow-400 underline text-left cursor-pointer w-fit  mb-1"
                href="https://drive.google.com/file/d/1qBS5jWor5SI7wEns-XA0T6FsDdSRUmWY/view?usp=sharing"
                target="_blank"
              >
                Download IQC 2025 Edition Brochure
              </a>
              {/* <a
                className="text-sm text-yellow-400 underline text-left cursor-pointer w-fit  mb-1"
                href="https://drive.google.com/file/d/1fDRrSJycHoWlM-ZH6m_JbdgeDR0aIswT/view?usp=sharing"
                target="_blank"
              >
                Download IQC Sample Preparation Booklet
              </a> */}
              <a
                className="text-sm text-yellow-400 underline text-left cursor-pointer w-fit  mb-1"
                href="https://whatsapp.com/channel/0029Vaj1E2e7DAWvNkgDhy2O"
                target="_blank"
              >
                Join Our WhatsApp Channel
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
                      className="p-1 cursor-pointer focus:outline-none"
                      {...register("city")}
                      value={selectedCity}
                      onChange={handleCityChange}
                    >
                      <option value="bhopal">Bhopal</option>
                      <option value="indore">Indore</option>
                      <option value="gwalior">Gwalior</option>
                      <option value="ujjain">Ujjain</option>
                      <option value="jabalpur">Jabalpur</option>
                    </select>

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
                placeholder={
                  label == "signup" ? "Set New Password" : "Password"
                }
                {...register("password", requiredCheck)}
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
              {/*               <Link
                className="text-blue-500"
                to={label == "signup" ? "/login" : "/register"}
              >
                {label == "signup"
                  ? "Already have an account?"
                  : "Not having an account?"}
              </Link> */}
              {label == "login" && (
                <ForgotPasswordButton />
              )}
            </div>
            <div className="md:mt-[-21px]  text-gray-600">
              <p className="text-black font-semibold">
                Kindly fill all the details carefully.
              </p>
              <p>
                Facing any difficulty while registering?
                <br />
                Please contact any of the undersigned
                <br />
                Pukhraj Motwani: +919244294331
                <br />
                Pankaj Soni: +919680032837
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
