import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Map,
  GreetingPoster,
  RegistrationSuccessHandler,
  QuizLivePoster
} from "../components/components"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { login, setData } from "../redux/user.slice"
import authService from "../api/auth.service"

const Home = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((user) => {
        dispatch(setData(user))
        dispatch(login())
      })
      .catch((error) => {
        if (error.message !== 'Not authenticated') {
          console.error('Auth check error:', error)
        }
      })
  }, [])

  return (
    <main>
      <Header />
      <GreetingPoster />
      {/* <QuizLivePoster/> */}
      <RegistrationSuccessHandler />
      <Hero />
      <About />
      <Events />
      <Sponsors />
      <Map />
      <Footer />
    </main>
  )
}

export default Home
