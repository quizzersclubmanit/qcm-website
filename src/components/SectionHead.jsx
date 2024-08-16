const SectionHead = ({ label = "QCM", className = "", outline = false }) => {
  return (
    <h2
      className={`text-[5vmax] poppins-bold flex items-center gap-2 ${outline && "text-outline"} ${className}`}
    >
      {label}
    </h2>
  )
}

export default SectionHead
