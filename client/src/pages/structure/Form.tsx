import {useAtom} from "jotai";
import {AuthorAtom, BookAtom, GenreAtom} from "../../Atom.ts";
import {useEffect, useState} from "react";
import type {Genre} from "../../models/Genre.ts";
import type {Book} from "../../models/Book.ts";
import type {Author} from "../../models/Author.ts";
import {API_ENDPOINTS} from "../../config/api.ts";

type SlideInFormProps = {
    formType: "book" | "author" | "genre" | null;
    publicId?: string;
    open: boolean;
    onClose: () => void;
};

type AuthorRequest = {
    id: string;
    name: string;
};

type GenreRequest = {
    id: string;
    name: string;
}

type BookRequest = {
    id: string;
    title: string;
    pages: number;
    genreId: string;
    authorIds: string[];
}


export default function Form({formType, publicId, open, onClose}: SlideInFormProps) {


    const [getBook,] = useAtom(BookAtom);
    const [getAuthors,setAuthors] = useAtom(AuthorAtom);
    const [getGenre,] = useAtom(GenreAtom);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const [, setSelectedBook] = useState<Book | null>(null);
    const editing = publicId !== undefined;



    useEffect(() => {
        if (!open) {
            setSelectedAuthors([]);
            setSelectedGenre(null);
            setSelectedBook(null);
            return;
        }

        if (editing && publicId) {
            switch (formType) {
                case "author": {
                    const author = getAuthors.find(a => a.id === publicId);
                    if (author) setSelectedAuthors([author]);
                    break;
                }
                case "genre": {
                    const genre = getGenre.find(g => g.id === publicId);
                    if (genre) setSelectedGenre(genre);
                    break;
                }
                case "book": {
                    const book = getBook.find(b => b.id === publicId);
                    if (book) {
                        setSelectedAuthors(book.authors || []);
                        setSelectedGenre(book.genre);
                        setSelectedBook(book);
                    }
                    break;
                }
            }
        } else {
            // Reset fields for new forms
            setSelectedAuthors([]);
            setSelectedGenre(null);
            setSelectedBook(null);
        }
    }, [open, formType, publicId, editing, getBook, getAuthors, getGenre]);


    function toggleAuthor(id: string, checked: boolean) {
        const author = getAuthors.find(a => a.id === id);
        if (!author) return;

        setSelectedAuthors((prev) =>
            checked
                ? [...prev, author] // add
                : prev.filter((x) => x.id !== id) // remove by id
        );
    }

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // prevent page reload

        try {
            if (formType === "author") {
                let payload: any;
                let url: string;
                let method: "POST" | "PUT";

                if (editing) {
                    // PUT /UpdateAuthor expects { id, name }
                    payload = {
                        id: publicId,
                        name: selectedAuthors[0].name,
                    };
                    url = API_ENDPOINTS.updateAuthor;
                    method = "PUT";
                } else {
                    // POST /AddAuthor expects just a string
                    payload = selectedAuthors[0].name;
                    url = API_ENDPOINTS.addAuthor;
                    method = "POST";
                }

                try {
                    const response = await fetch(url, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to ${editing ? "update" : "add"} author`);
                    }
                    console.log("Author saved successfully");
                    const data : Author = await response.json();

                    if (editing) {
                        setAuthors(prev =>
                            prev.map(a => (a.id === publicId ? data : a))
                        );
                    } else {
                        setAuthors(prev => [...prev, data]);
                    }

                    onClose();
                }
                catch (error) {
                    console.error("Error saving author:", error);
                }
            }

            if (formType === "genre") {
                const payload = { id: editing ? publicId : undefined, name: selectedGenre?.name };
                const url = editing
                    ? API_ENDPOINTS.updateGenre
                    : API_ENDPOINTS.addGenre;
                const method = editing ? "PUT" : "POST";

                await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (formType === "book") {
                const payload = {
                    id: editing ? publicId : undefined,
                    title: (document.querySelector<HTMLInputElement>('input[placeholder="Book title"]')?.value) || "",
                    pages: parseInt(document.querySelector<HTMLInputElement>('input[placeholder="Pages"]')?.value || "0"),
                    genreId: selectedGenre?.id,
                    authorIds: selectedAuthors.map(a => a.id),
                };
                const url = editing ? `/swagger/books/${publicId}` : `/swagger/books`;
                const method = editing ? "PUT" : "POST";

                await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            // close form on success
            onClose();
        } catch (error) {
            console.error("Error saving:", error);
        }
    }



    return (
        <>
            <div
                className="fixed inset-0 bg-opacity-50 z-40"
                onClick={onClose} // clicking outside closes the form
            />
            <div
                className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-base-100 z-50 shadow-lg overflow-auto"
                onClick={(e) => e.stopPropagation()} // clicking inside does not close
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {formType === "book" && "New Book"}
                        {formType === "author" && "New Author"}
                        {formType === "genre" && "New Genre"}
                    </h2>
                    <button className="text-red-500 font-bold"
                            onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/*Form*/}
                <form className="p-4 space-y-4" onSubmit={handleSubmit}>
                    {/* Author and Genre */}
                    {(formType === "author" || formType === "genre") && (
                        <>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                className="input input-bordered w-full"
                                placeholder="Name"
                                value={
                                formType === "author"
                                    ? selectedAuthors[0]?.name ?? ""
                                    : formType === "genre"
                                        ? selectedGenre?.name ?? ""
                                        : ""
                                }
                                onChange={(e) => {
                                    const name = e.target.value;

                                    if (formType === "author") {
                                        if (selectedAuthors.length > 0) {
                                            setSelectedAuthors([{ ...selectedAuthors[0], name }]);
                                        } else {
                                            setSelectedAuthors([{id: "", name }]); // temporary ID for new author
                                        }
                                    } else if (formType === "genre") {
                                        if (selectedGenre) {
                                            setSelectedGenre({ ...selectedGenre, name });
                                        } else {
                                            setSelectedGenre({ id: "", name }); // temporary ID
                                        }
                                    }
                                }}

                            />
                        </>
                    )}

                    {/* Book */}
                    {formType === "book" && (
                        <>
                            <label className="block text-sm font-medium">Title</label>
                            <input className="input input-bordered w-full" placeholder="Book title"/>

                            <label className="block text-sm font-medium">Number of pages</label>
                            <input className="input input-bordered w-full" placeholder="Pages" type="number" min="1"/>

                            <label className="block text-sm font-medium">Genre</label>
                            <div className="dropdown">
                                <label tabIndex={0} className="btn m-1">{selectedGenre?.name || "Select genre"}</label>
                                <ul tabIndex={0}
                                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                    {getGenre.map((genre) => (
                                        <li key={genre.id}>
                                            <a onClick={() => setSelectedGenre(genre)}>{genre.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <label className="block text-sm font-medium">Authors</label>
                            <div className="space-y-2">
                                {getAuthors.map((author) => (
                                    <label key={author.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={author.id}
                                            checked={selectedAuthors.some(a => a.id === author.id)}
                                            onChange={e => toggleAuthor(author.id, e.target.checked)}
                                            className="checkbox"
                                        />
                                        {author.name}
                                    </label>
                                ))}
                            </div>
                        </>
                    )}

                    <button className="btn btn-primary" type="submit">Save</button>
                </form>
            </div>

        </>
    )
}