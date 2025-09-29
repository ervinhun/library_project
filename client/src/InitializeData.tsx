import {useAtom} from "jotai";
import {AuthorAtom, BookAtom, GenreAtom} from "./Atom.ts";
import {useEffect, useState} from "react";
import {API_ENDPOINTS} from "./config/api.ts";

export default function InitializeData() {
    const [, setAllBooks] = useAtom(BookAtom);
    const [, setAllAuthors] = useAtom(AuthorAtom);
    const [, setAllGenres] = useAtom(GenreAtom);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(API_ENDPOINTS.books).then((r) => r.json()),
            fetch(API_ENDPOINTS.authors).then((r) => r.json()),
            fetch(API_ENDPOINTS.genres).then((r) => r.json()),
        ])
            .then(([books, authors, genres]) => {
                setAllBooks(books);
                setAllAuthors(authors);
                setAllGenres(genres);
            })
            .catch((error) => console.error("Error fetching initial data:", error))
            .finally(() => setLoading(false));
    }, [setAllBooks, setAllAuthors, setAllGenres]);


    return loading;
}