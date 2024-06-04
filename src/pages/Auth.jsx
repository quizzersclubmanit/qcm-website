import { useForm } from "react-hook-form"
import {useUserContext} from "../contexts/user.context"
import {Container, Input, SectionHead, Button} from "../components/components"
import { authIllustration } from "../assets/assets"
import { FcGoogle } from "react-icons/fc"
import { Link, useNavigate } from "react-router-dom"
import authService from "../api/auth.service"
import { useCallback } from "react"
import env from "../../env"

const Auth = ({label="signup"}) => {
  const {login, setUserData} = useUserContext()
  const {handleSubmit, setValue, control, formState} = useForm({
    defaultValues: {
      Name: "",
      Email: "",
      Password: ""
    }
  })
  const {errors} = formState
  const navigate = useNavigate()

  const authenticate = useCallback((f=async()=>{}, formData={})=>{
    f({
      email: formData.Email,
      password: formData.Password,
      name: formData.Name
    })
    .then(user => {
      setUserData(user)
      login()
      navigate("/")
    })
    .catch(err => {
      alert(err.message)  // Hot Toast
      console.error(err)
    })
    .finally(()=>{
      setValue("Name","")
      setValue("Email","")
      setValue("Password","")
    })
  },[])

  return (
    <div id="auth" className="londrina-solid-regular">
      <Container className="min-h-screen flex items-center">
        <div className="left w-1/2 items-center hidden sm:flex">
          <img src={authIllustration} alt="Auth Illustration" className="h-3/4" />
        </div>

        <div className="right sm:w-1/2 w-full min-h-[50vh] sm:h-full bg-white p-8 rounded-2xl flex flex-col gap-8">
          <SectionHead label={label=="signup" ? "Sign Up":"Login"} />
          <form noValidate className="flex flex-col gap-4">
            {label=="signup" &&
              <Input errors={errors} name="Name" control={control} placeholder="Name" className="focus:outline-0 p-3 focus:bg-gray-100 transition-all" style={{borderBottom: "2px solid blue"}} rules={{
                required: {
                  value: true,
                  message: "This is a required field"
                }
              }} />
            }

            <Input className="focus:outline-0 p-2 focus:bg-gray-100 transition-all" style={{borderBottom: "2px solid blue"}} errors={errors} name="Email" type="email" control={control} placeholder="Email" rules={{
              required: {
                value: true,
                message: "This is a required field"
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid Email"
              }
            }} />

            <Input className="focus:outline-0 p-2 focus:bg-gray-100 transition-all" style={{borderBottom: "2px solid blue"}} errors={errors} name="Password" type="password" control={control} placeholder="Password" rules={{
              required: {
                value: true,
                message: "This is a required field"
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-+])[^\s]{8,}$/,
                message: "Password should contain at least 1 lowercase, uppercase, special character and should at least be 8 characters long"
              }
            }} />

            <Button label={label=="signup" ? "Create Account":"Login"} className="p-2 rounded-lg tracking-wider text-lg text-white bg-[#020062] hover:bg-[#2b2b67]" onClick={handleSubmit(formData => {
              if (label == "signup")
                authenticate(authService.signup, formData)
              else authenticate(authService.login, formData)
            })} />

            <Button label="Continue with Google" className="flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition-all p-2 rounded-lg text-lg tracking-wide text-black" onClick={e => {
              e.preventDefault()
              authService.createSessionWithGoogle({
                home: env.HOME
              })
            }}>
              <FcGoogle style={{fontSize: "2vmax"}} />
            </Button>
          </form>

          <Link className="text-blue-500 tracking-wider w-fit" to={label == "signup" ? "/login":"/signup"}>{label == "signup" ? "Already have an account?":"Not having an account?"}</Link>
        </div>
      </Container>
    </div>
  )
}

export default Auth