const Container = ({children, className="", ...props}) => {
  return (
    <div className={`w-screen sm:p-[3.5vmax] p-[2vmax] ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Container