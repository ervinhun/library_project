import {useAtom} from "jotai";
import {BookAtom} from "./Atom.ts";
import {useEffect} from "react";

export default function InitializeData() {
    const [, setAllBooks] = useAtom(BookAtom);

    useEffect(() => {
        fetch('https://server-nameless-star-9223.fly.dev/GetAllBooks')
            .then(response => response.json())
            .then(data => setAllBooks(data))
            .catch(error => console.error('Error fetching data:', error))
    }, []);
}