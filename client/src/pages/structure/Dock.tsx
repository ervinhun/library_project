import {NavLink} from "react-router-dom";
import ThemeToggle from "../../config/ThemeTogle.tsx";

export default function Dock() {
    return (

        <div className="dock rounded-t-xl shadow-md bg-base-100">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `dock-button ${isActive ? "dock-active" : ""}`
                }
            >
                <img src="https://img.icons8.com/?size=100&id=14096&format=png&color=FE9900"
                     alt="Home"
                     className="dock-icon size-[1.7em]"/>
                <span className="dock-label text-accent">Home</span>
            </NavLink>

            <NavLink
                to="/authors"
                className={({ isActive }) =>
                    `dock-button ${isActive ? "dock-active" : ""}`
                }
            >
                <img src="https://img.icons8.com/?size=100&id=14312&format=png&color=FE9900"
                     alt="Author"
                     className="dock-icon size-[1.7em]"/>
                <span className="dock-label text-accent">Author</span>
            </NavLink>

            <NavLink
                to="/genres"
                className={({ isActive }) =>
                    `dock-button ${isActive ? "dock-active" : ""}`
                }
            >
                <img src="https://img.icons8.com/?size=100&id=mtJxvLzdC_x2&format=png&color=FE9900"
                     alt="Genre"
                     className="dock-icon size-[1.7em]"/>
                <span className="dock-label text-accent">Genre</span>
            </NavLink>
            <ThemeToggle />
        </div>
    )
}