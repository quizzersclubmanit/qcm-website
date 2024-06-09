import { Controller } from "react-hook-form"
import { useId } from "react"

const Input = ({
  name = "",
  label = "",
  oneline = false,
  type = "text",
  control,
  rules = {},
  errors = {},
  ...props
}) => {
  const id = useId()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue=""
      render={({ field: { value, onChange } }) => (
        <div className="flex flex-col gap-1">
          <div
            className={`flex ${oneline ? "flex-row justify-between items-center" : "flex-col"}`}
          >
            <label className="text-lg" htmlFor={id}>
              {label}
            </label>
            <input
              id={id}
              value={value}
              type={type}
              onChange={onChange}
              {...props}
            />
          </div>
          <p className="text-red-500">{errors[name]?.message}</p>
        </div>
      )}
    />
  )
}

export default Input
