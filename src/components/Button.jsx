import { forwardRef } from "react"
import { useEffect } from "react"

const Button = forwardRef(
  (
    {
      label = "",
      className = "",
      onClick = () => {},
      children,
      onUnmount = () => {},
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      return () => {
        onUnmount()
      }
    }, [])

    return (
      <button
        ref={ref}
        className={`londrina-solid-black transition-all ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
        {label}
      </button>
    )
  }
)

export default Button
