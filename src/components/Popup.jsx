import { Button } from "./components"

const Popup = ({
  functionality,
  submitLabel = "",
  fieldComponents = [],
  className,
  children
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <form className="flex flex-col gap-3">
        {fieldComponents.map((Component) => Component)}
        <Button
          label={submitLabel}
          className="p-2 rounded-xl text-white hover:bg-[#1d2d50] bg-[#14213D]"
          onClick={functionality}
        />
      </form>
      {children}
    </div>
  )
}

export default Popup
