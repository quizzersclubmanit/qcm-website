import { IoSearchSharp } from "react-icons/io5"

const SearchBar = ({content, setContent=()=>{}}) => {
  return (
    <div className="flex w-full justify-center items-center gap-3">
        <input value={content} onChange={e => {
          setContent(e.target.value)
        }} type="text" placeholder="Search" className="w-1/2 p-2 bg-white rounded-lg focus:outline-0" />
        <IoSearchSharp className="text-[1.8vmax]" />
    </div>
  )
}

export default SearchBar