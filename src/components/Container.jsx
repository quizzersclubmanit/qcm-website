const Container = ({children, className=""}) => {
  return (
    <div className={`w-screen min-h-screen p-24 ${className}`}>
      {children}
    </div>
  )
}

export default Container