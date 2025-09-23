import {useAtom} from "jotai";
import {BookAtom} from "./Atom.ts";
import {useEffect} from "react";

export default function InitializeData() {
    const [, setAllBooks] = useAtom(BookAtom);

    useEffect(() => {
        // Use API URL from environment variable, fallback to default if not set
        const apiUrl = process.env.REACT_APP_API_URL || 'https://server-nameless-star-9223.fly.dev/GetAllBooks';
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setAllBooks(data))
            .catch(error => console.error('Error fetching data:', error))
    }, []);
}