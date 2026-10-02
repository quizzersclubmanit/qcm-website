import { IoIosArrowDropdownCircle } from "react-icons/io"

// Account button in the desktop nav. The whole pill toggles the menu
// (not just the chevron), which rotates to indicate open state.
// eslint-disable-next-line react/prop-types
const UserBtn = ({ name, showDropDown, setShowDropDown }) => {
  return (
    <div
      className="poppins-regular py-3 px-4 flex items-center justify-center gap-2 text-sm lg:text-white border-black rounded-3xl border-2 lg:border-white overflow-y-hidden hover:backdrop-blur-md hover:text-black cursor-pointer select-none"
      onClick={() => {
        setShowDropDown((prev) => !prev)
      }}
    >
      <span className="uppercase text-black lg:text-white">{name}</span>
      <IoIosArrowDropdownCircle
        className={`text-xl transition-transform duration-200 ${showDropDown ? "rotate-180" : ""}`}
      />
    </div>
  )
}

export default UserBtn
