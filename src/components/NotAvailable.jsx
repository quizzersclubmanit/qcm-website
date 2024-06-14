import { Container } from "./components"
import { Link } from "react-router-dom"

const NotAvailable = ({
  command,
  redirectURL,
  message = "No Questions Added Yet"
}) => {
  return (
    <Container className="h-screen flex flex-col justify-center items-center">
      <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 h-[25vh]">
        OOPS!
      </h1>
      <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white h-[10vh]">
        {message}
      </p>
      <Link
        to={redirectURL}
        className="inline-flex text-blue-600 bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
      >
        {command}
      </Link>
    </Container>
  )
}

export default NotAvailable
