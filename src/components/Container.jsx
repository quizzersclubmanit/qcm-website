const Container = ({children, className="", ...props}) => {
  return (
    <div className={`w-screen p-[3vmax] ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Container