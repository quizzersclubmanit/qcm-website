import { IoSearchSharp } from "react-icons/io5"
import { Container } from "./components"

const SearchBar = ({ content, setContent = () => {} }) => {
  return (
    <Container className="flex w-full justify-center items-center gap-3 mb-10">
      <input
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
        }}
        type="text"
        placeholder="Search"
        className="p-2 bg-white rounded-lg focus:outline-0 w-full sm:w-1/2"
      />
      <IoSearchSharp className="sm:text-[1.8vmax] text-[2.8vmax]" />
    </Container>
  )
}

export default SearchBar
