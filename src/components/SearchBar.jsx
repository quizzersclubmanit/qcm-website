import { IoSearchSharp } from "react-icons/io5"
import { Container } from "./components"

const SearchBar = ({
  logo = false,
  content,
  setContent = () => {},
  placeholder = "Search",
  className = ""
}) => {
  return (
    <Container className="flex w-full justify-center items-center gap-3 mb-10">
      <input
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
        }}
        type="text"
        placeholder={placeholder}
        className={className}
      />
      {logo && (
        <IoSearchSharp className="md:text-[1.8vmax] text-[4vmax] text-white" />
      )}
    </Container>
  )
}

export default SearchBar
