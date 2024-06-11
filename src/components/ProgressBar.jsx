const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="flex w-full h-4 bg-white rounded-r-lg">
      <div
        className="rounded-r-lg bg-blue-900"
        style={{
          width: `${progress}%`
        }}
      ></div>
    </div>
  )
}

export default ProgressBar
