import { IoIosArrowDropdownCircle } from "react-icons/io"

// Account button in the desktop nav. The whole pill toggles the menu
// (not just the chevron), which rotates to indicate open state.
// eslint-disable-next-line react/prop-types
const UserBtn = ({ name, showDropDown, setShowDropDown }) => {
  return (
    <div
      className="poppins-regular py-1.5 px-4 flex items-center justify-center gap-2 text-sm text-white rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer select-none"
      onClick={() => {
        setShowDropDown((prev) => !prev)
      }}
    >
      <span className="uppercase text-xs font-semibold tracking-wider text-white">{name}</span>
      <IoIosArrowDropdownCircle
        className={`text-lg text-[#fe9c02] transition-transform duration-200 ${showDropDown ? "rotate-180" : ""}`}
      />
    </div>
  )
}

export default UserBtn
