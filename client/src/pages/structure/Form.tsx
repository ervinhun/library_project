import {useAtom} from "jotai";
import {AuthorAtom, BookAtom, GenreAtom} from "../../Atom.ts";
import {useEffect, useState} from "react";
import type {Genre} from "../../models/Genre.ts";
import type {Book} from "../../models/Book.ts";
import type {Author} from "../../models/Author.ts";
import {
    type AuthorRequestDto,
    type AuthorResponseDto,
    type GenreRequestDto,
    type GenreResponseDto
} from "../../models/generated-client.ts";
import {client} from "../../config/client.ts";

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
    const [books, setBooks] = useAtom(BookAtom);
    const [authors, setAuthors] = useAtom(AuthorAtom);
    const [genres, setGenres] = useAtom(GenreAtom);

    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const [title, setTitle] = useState("");
    const [pages, setPages] = useState<number>(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);


    const editing = !!publicId;

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
                    const dto: AuthorResponseDto = await client.addAuthor(selectedAuthors?.[0].name ?? "");
                    const newAuthor: Author = {
                        id: dto.id!,
                        name: dto.name ?? "",
                        createdat: dto.createdat ?? new Date().toISOString()
                    };
                    setAuthors(prev => [...prev, newAuthor]);
                } else {
                    const dto: AuthorRequestDto = {id: selectedAuthors?.[0].id, name: selectedAuthors?.[0].name ?? ""};
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
                } else {
                    const dto: GenreRequestDto = {id: selectedGenre?.id, name: selectedGenre?.name ?? ""};
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
                if (!title || pages <= 0 || !selectedGenre) {
                    alert("Please fill out all the necessary fields - title, pages, genre.");
                    return;
                }
                if (!editing) {

                    const bookDto = {
                        title,
                        pages,
                        genreid: selectedGenre.id,
                    };

                    const newBookResponse = await client.addBook(bookDto)
                    const bookToAdd: Book = {
                        id: newBookResponse.id!,
                        title: newBookResponse.title ?? "",
                        pages: newBookResponse.pages ?? 0,
                        genreid: newBookResponse.genreid ?? "",
                        genre: genres.find(g => g.id === newBookResponse.genreid)
                            ?? {id: "", name: "Unknown", createdAt: new Date().toISOString()},
                        authors: [],
                        createdat: newBookResponse.createdat ?? new Date().toISOString()
                    }
                    setBooks((prev) => [...prev, bookToAdd]);

                    if (selectedAuthors.length > 0) {
                        selectedAuthors.forEach(a => bookToAdd.authors.push(a));
                        await client.updateBook(bookToAdd);
                    }
                } else {
                    if (!publicId) {
                        alert("Missing book ID for editing.");
                        return;
                    }
                    const genreDto: GenreResponseDto = {
                        id: selectedGenre.id,
                        name: selectedGenre.name,
                        createdat: selectedGenre.createdAt
                    }
                    const authorsDto: AuthorResponseDto[] = selectedAuthors.map(a => ({
                        id: a.id,
                        name: a.name,
                        createdat: a.createdat
                    }));

                    const dto = {
                        id: selectedBook?.id ?? publicId,
                        title,
                        pages,
                        genreid: selectedGenre.id,
                        genre: genreDto ?? undefined,
                        authors: authorsDto ?? undefined
                    };
                    await client.updateBook(dto);
                    const updatedBook: Book = {
                        id: dto.id ?? "",
                        title: dto.title ?? "",
                        pages: dto.pages ?? 0,
                        genreid: dto.genreid ?? "",
                        genre: selectedGenre,
                        authors: selectedAuthors,
                        createdat: new Date().toUTCString() ?? new Date().toISOString()
                    };

                    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
                }
            }
        }
        onClose();
    }

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-opacity-50 z-40" onClick={onClose}/>
            <div
                className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-base-100 z-50 shadow-lg overflow-auto rounded-box p-2 border border-b-primary-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {editing ? "Edit" : "New"} {formType}
                    </h2>
                    <button type="button" className="text-red-500 font-bold cursor-pointer" onClick={onClose}>
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
                                autoFocus
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
                                autoFocus
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

                            <div className="dropdown dropdown-right" onClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    className="btn m-1"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {selectedGenre?.name || "Select genre"}
                                </button>
                                {dropdownOpen && (
                                    <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm border border-b-primary-content">
                                        {genres
                                            .slice()
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((genre) => (
                                                <li key={genre.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedGenre(genre);
                                                            setDropdownOpen(false); // closes dropdown without closing form
                                                        }}
                                                    >
                                                        {genre.name}
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                )}
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
