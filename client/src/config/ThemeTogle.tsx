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
        <button className="btn btn-sm btn-outline" onClick={toggleTheme}>
            {theme === "nord" ? "🌙 Dark" : "☀️ Light"}
        </button>
    );
}
