const Button = ({label="", className="", onClick=()=>{}, children, ...props}) => {
  return (
    <button className={`londrina-solid-black z-10 text-black bg-white hover:bg-gray-200 transition-all ${className}`} onClick={onClick} {...props}>
      {children}
      {label}
    </button>
  )
}

export default Button