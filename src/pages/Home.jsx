import "./pages.css"
import {
  Header,
  Footer,
  Hero,
  About,
  Events,
  Sponsors,
  Map,
  RegistrationSuccessHandler
} from "../components/components"
import QbitModal from "../components/QbitModal"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { login, setData } from "../redux/user.slice"
import authService from "../api/auth.service"
import SEO from "../components/SEO.jsx"
import { error as logError } from "../utils/log.js"
import { eventDetails } from "../assets/qcmData.json"

const Home = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((user) => {
        dispatch(setData(user))
        dispatch(login())
      })
      .catch((error) => {
        if (error.message !== 'Not authenticated') {
          logError('Auth check error:', error)
        }
      })
  }, [dispatch])

  // Handle in-page hash scroll reliably on mount or hash change
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" })
        }, 120)
      }
    }
  }, [location.hash])

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quizzersclub.com/" },
          { "@type": "ListItem", position: 2, name: "Team", item: "https://www.quizzersclub.com/team" },
          { "@type": "ListItem", position: 3, name: "FAQs", item: "https://www.quizzersclub.com/faqs" },
          { "@type": "ListItem", position: 4, name: "QBIT Registration", item: "https://www.quizzersclub.com/signup" },
        ],
      },
      {
        "@type": "ItemList",
        name: "Quiz events by Quizzers' Club NIT Bhopal",
        itemListElement: eventDetails.map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: e.title,
          url: `https://www.quizzersclub.com/events/${e.id}`,
        })),
      },
    ],
  }

  return (
    <>
      <SEO
        title="Quizzers' Club NIT Bhopal (QCM MANIT) — Official Quizzing Club"
        description="Quizzers' Club NIT Bhopal (QCM MANIT) — official quizzing club of MANIT Bhopal. QBIT, inter-city quizzes, college competitions and events."
        path="/"
        schema={homeSchema}
      />
      <div className="w-full relative overflow-x-clip">
        <RegistrationSuccessHandler />
        <QbitModal />
        <Header />
        <Hero />
        <About />
        <Events />
        <Sponsors />
        <Map />
        <Footer />
      </div>
    </>
  )
}

export default Home
