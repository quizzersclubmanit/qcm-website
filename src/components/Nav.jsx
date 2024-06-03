import { NavLink } from "react-router-dom"
import {Button} from "./components"

const Nav = ({hidden=false}) => {
    const tabs = [
        {
            name: "Home",
            to: "/#hero"
        },
        {
            name: "About",
            to: "/#about"
        },
        {
            name: "Events",
            to: "/#events"
        },
        {
            name: "Team",
            to: "/#gallery"
        }
    ]

    return (
        <nav className={`items-center gap-2 md:justify-between justify-around w-3/4 md:w-1/2 ${hidden ? "hidden": ""} sm:flex`}>
            <div className="flex flex-col gap-[4vw] my-3 sm:flex-row sm:my-0">
                {tabs.map((tab, index) => (
                    <NavLink key={index} to={tab.to} className="hover:bg-white hover:text-gray-500 sm:hover:text-gray-300 transition-all p-2 rounded-lg sm:hover:bg-inherit text-lg">
                        {tab.name}
                    </NavLink>
                ))}
            </div>
            <Button
                label="Signup"
                className="py-2 px-3 tracking-widest shadow-lg text-black bg-white hover:bg-gray-200"
                onClick={() => {
                    console.log("Signup Clicked")
                }}
            />
        </nav>
    )
}

export default Nav
