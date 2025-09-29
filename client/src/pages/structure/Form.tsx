import {useAtom} from "jotai";
import {AuthorAtom, BookAtom, GenreAtom} from "../../Atom.ts";
import {useEffect, useState} from "react";
import type {Genre} from "../../models/Genre.ts";
import type {Book} from "../../models/Book.ts";
import type {Author} from "../../models/Author.ts";
import {API_BASE_URL} from "../../config/api.ts";
import {
    type AuthorRequestDto,
    type AuthorResponseDto,
    type GenreRequestDto,
    LibraryClient
} from "../../models/generated-client.ts";

type SlideInFormProps = {
    formType: "book" | "author" | "genre" | null;
    publicId?: string;
    open: boolean;
    onClose: () => void;
};

export default function Form({
                                 formType,
                                 publicId,
                                 open,
                                 onClose,
                             }: Readonly<SlideInFormProps>) {
    const [books] = useAtom(BookAtom);
    const [authors, setAuthors] = useAtom(AuthorAtom);
    const [genres, setGenres] = useAtom(GenreAtom);

    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const [, setSelectedBook] = useState<Book | null>(null);

    const [title, setTitle] = useState("");
    const [pages, setPages] = useState<number>(0);

    const editing = !!publicId;
    const client = new LibraryClient(API_BASE_URL);


    // Reset form state
    const resetForm = () => {
        setSelectedAuthors([]);
        setSelectedGenre(null);
        setSelectedBook(null);
        setTitle("");
        setPages(0);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
            return;
        }

        if (editing && publicId) {
            switch (formType) {
                case "author": {
                    const author = authors.find((a) => a.id === publicId);
                    if (author) setSelectedAuthors([author]);
                    break;
                }
                case "genre": {
                    const genre = genres.find((g) => g.id === publicId);
                    if (genre) setSelectedGenre(genre);
                    break;
                }
                case "book": {
                    const book = books.find((b) => b.id === publicId);
                    if (book) {
                        setSelectedAuthors(book.authors || []);
                        setSelectedGenre(book.genre);
                        setSelectedBook(book);
                        setTitle(book.title);
                        setPages(book.pages);
                    }
                    break;
                }
            }
        } else {
            resetForm();
        }
    }, [open, formType, publicId, editing, books, authors, genres]);

    function toggleAuthor(id: string, checked: boolean) {
        const author = authors.find((a) => a.id === id);
        if (!author) return;

        setSelectedAuthors((prev) =>
            checked ? [...prev, author] : prev.filter((a) => a.id !== id)
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        switch (formType) {
            case "author": {
                if (!editing) {
                    const dto : AuthorResponseDto = await client.addAuthor(selectedAuthors?.[0].name ?? "");
                    const newAuthor: Author = {
                        id: dto.id!,
                        name: dto.name ?? "",
                        createdat: dto.createdat ?? new Date().toISOString()
                    };
                    setAuthors(prev => [...prev, newAuthor]);
                }
                else
                    {
                        const dto: AuthorRequestDto = { id: selectedAuthors?.[0].id, name: selectedAuthors?.[0].name ?? "" };
                        await client.updateAuthor(dto);

                        const updatedAuthor: Author = {
                            id: dto.id ?? "",
                            name: dto.name ?? "",
                            createdat: new Date().toUTCString() ?? new Date().toISOString()
                        };

                        setAuthors(prev => prev.map(a => a.id === updatedAuthor.id ? updatedAuthor : a));

                    }
                break;
            }

            case "genre": {
                if (!editing) {
                    const newGenreDto = await client.addGenre(selectedGenre?.name ?? "");
                    const newGenre: Genre = {
                        id: newGenreDto.id!,
                        name: newGenreDto.name ?? "",
                        createdAt: newGenreDto.createdat ?? new Date().toISOString()
                    };
                    setGenres(prev => [...prev, newGenre]);
                }
                else
                {
                    const dto: GenreRequestDto = { id: selectedGenre?.id, name: selectedGenre?.name ?? "" };
                    await client.updateGenre(dto);
                    const updatedGenre: Genre = {
                        id: dto.id!,
                        name: dto.name ?? "",
                        createdAt: new Date().toUTCString() ?? new Date().toISOString()
                    };

                    setGenres(prev => prev.map(g => g.id === updatedGenre.id ? updatedGenre : g));
                }
                break;
            }

            case "book": {
                const payload = {
                    id: editing ? publicId : undefined,
                    title,
                    pages,
                    genreId: selectedGenre?.id,
                    authorIds: selectedAuthors.map((a) => a.id),
                };

                const url = editing
                    ? `/swagger/books/${publicId}`
                    : `/swagger/books`;
                const method = editing ? "PUT" : "POST";

                const res = await fetch(url, {
                    method,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload),
                });

                if (!res.ok) throw new Error("Failed to save book");
                // optional: update books state if needed
                break;
            }
        }
        onClose();
    }

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-opacity-50 z-40" onClick={onClose}/>
            <div
                className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-base-100 z-50 shadow-lg overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {editing ? "Edit" : "New"} {formType}
                    </h2>
                    <button className="text-red-500 font-bold" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form className="p-4 space-y-4" onSubmit={handleSubmit}>
                    {(formType === "author" || formType === "genre") && (
                        <>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                className="input input-bordered w-full"
                                placeholder="Name"
                                value={
                                    formType === "author"
                                        ? selectedAuthors[0]?.name ?? ""
                                        : selectedGenre?.name ?? ""
                                }
                                onChange={(e) => {
                                    const name = e.target.value;
                                    if (formType === "author") {
                                        setSelectedAuthors([{...selectedAuthors[0], name}]);
                                    } else if (formType === "genre") {
                                        setSelectedGenre(
                                            selectedGenre
                                                ? {...selectedGenre, name}
                                                : {id: "", name, createdAt: new Date().toISOString()}
                                        );
                                    }
                                }}
                            />
                        </>
                    )}

                    {formType === "book" && (
                        <>
                            <label className="block text-sm font-medium">Title</label>
                            <input
                                className="input input-bordered w-full"
                                placeholder="Book title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <label className="block text-sm font-medium">Pages</label>
                            <input
                                className="input input-bordered w-full"
                                type="number"
                                min="1"
                                value={pages}
                                onChange={(e) => setPages(Number(e.target.value))}
                            />

                            <label className="block text-sm font-medium">Genre</label>
                            <div className="dropdown">
                                <label tabIndex={0} className="btn m-1">
                                    {selectedGenre?.name || "Select genre"}
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                                >
                                    {genres.map((genre) => (
                                        <li key={genre.id}>
                                            <a onClick={() => setSelectedGenre(genre)}>{genre.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <label className="block text-sm font-medium">Authors</label>
                            <div className="space-y-2">
                                {authors.map((author) => (
                                    <label key={author.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={author.id}
                                            checked={selectedAuthors.some((a) => a.id === author.id)}
                                            onChange={(e) => toggleAuthor(author.id, e.target.checked)}
                                            className="checkbox"
                                        />
                                        {author.name}
                                    </label>
                                ))}
                            </div>
                        </>
                    )}

                    <button className="btn btn-primary" type="submit">
                        Save
                    </button>
                </form>
            </div>
        </>
    );
}
