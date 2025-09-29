import { useState, useEffect } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"nord" | "dracula">("dracula");

    useEffect(() => {
        document.querySelector("html")?.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "nord" ? "dracula" : "nord"));
    };

    return (
        <button type="button" className="dock-button" onClick={toggleTheme}>
            <span className="dock-icon size-[1.7em]">
                {theme === "nord" ? "🌙" : "☀️"}
            </span>
            <span className="dock-label text-accent">
                {theme === "nord" ? "Dark" : "Light"}
            </span>
        </button>
    );
}
