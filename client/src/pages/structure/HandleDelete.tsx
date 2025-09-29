import {DELETE_ENDPOINTS} from "../../config/api.ts";
import type {LibraryClient} from "../../models/generated-client.ts";
import type {Author} from "../../models/Author.ts";
import type {Genre} from "../../models/Genre.ts";
import type {Book} from "../../models/Book.ts";

type filterType = {
    type: "author" | "genre";
    id?: string;
    value: string;
}

type JotaiSetter<T> = (update: T | ((prev: T) => T)) => void;

export async function confirmAndDelete(
    client: LibraryClient,
    id: string,
    name: string,
    what: string,
    setFilter: JotaiSetter<filterType | null>,
    setAuthors?: JotaiSetter<Author[]>,
    setGenres?: JotaiSetter<Genre[]>,
    setBooks?: JotaiSetter<Book[]>,
) {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
        switch (what) {
            case DELETE_ENDPOINTS.author:
                await client.deleteAuthor(id);
                setFilter(null);
                if (setAuthors) {
                    setAuthors((prev) => prev ? prev.filter((aa) => aa.id !== id) : []);
                }
                break;

            case DELETE_ENDPOINTS.genre:
                await client.deleteGenre(id);
                setFilter(null);
                if (setGenres) {
                    setGenres((prev) => prev ? prev.filter((gg) => gg.id !== id) : []);
                }
                break;

            case DELETE_ENDPOINTS.book:
                await client.deleteBook(id);
                if (setBooks) {
                    setBooks((prev) => prev ? prev.filter((bb) => bb.id !== id) : []);
                }
                break;

            default:
                console.error("Unknown delete type:", what);
        }
    } catch (err) {
        console.error("Delete failed:", err);
    }
}