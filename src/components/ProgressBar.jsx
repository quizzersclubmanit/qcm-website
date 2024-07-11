import { Container } from "./components"

const ProgressBar = ({ progress = 0 }) => {
  return (
    <Container className="flex w-full h-4 bg-white rounded-r-lg">
      <div
        className="rounded-r-lg bg-[#FCA311] transition-all"
        style={{
          width: `${progress}%`
        }}
      ></div>
    </Container>
  )
}

export default ProgressBar
