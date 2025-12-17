import { useId, forwardRef } from "react"

const Input = forwardRef(
  (
    {
      label = "",
      oneline = false,
      type = "text",
      error = {},
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const id = useId()

    return (
      <div className="flex flex-col gap-1 w-full">
        <div
          className={`flex ${oneline ? "flex-row justify-between items-center" : "flex-col items-center"}`}
        >
          <label className="text-lg" htmlFor={id}>
            {label}
          </label>

          <div className="w-full flex items-center">
            <input
              ref={ref}
              id={id}
              type={type}
              className={`w-full ${className}`}
              {...props}
            />
            {children}
          </div>
        </div>
        <p className="text-red-500 text-sm">{error?.message}</p>
      </div>
    )
  }
)

export default Input
