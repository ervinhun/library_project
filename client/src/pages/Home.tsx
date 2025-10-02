import {useAtom} from "jotai";
import {BookAtom, FilterAtom, SortingAtom} from "../Atom.ts";
import {useNavigate} from "react-router-dom"
import {useMemo} from "react";
import DetermineSortArrow from "./structure/DetermineSortArrow.tsx";


export default function Home() {

    const [books,] = useAtom(BookAtom);
    const [sort, setSort] = useAtom(SortingAtom);
    const [filter, setFilter] = useAtom(FilterAtom);
    const navigate = useNavigate();

    const filteredBooks = useMemo(() => {
        let result = [...books];

        // Filter
        if (filter) {
            if (filter.type === "author") {
                result = result.filter((b) =>
                    b.authors?.some((a) => a.id === filter.id)
                );
            } else if (filter.type === "genre") {
                result = result.filter((b) => b.genre.id === filter.id);
            }
        }

        // Apply sorting on filtered result
        if (sort.type === "title") {
            result.sort((a, b) =>
                sort.value === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
            );
        } else if (sort.type === "pages") {
            result.sort((a, b) =>
                sort.value === "asc" ? a.pages - b.pages : b.pages - a.pages
            );
        } else if (sort.type === "author") {
            result.sort((a, b) =>
                sort.value === "asc"
                    ? (a.authors[0]?.name || "").localeCompare(b.authors[0]?.name || "")
                    : (b.authors[0]?.name || "").localeCompare(a.authors[0]?.name || "")
            );
        } else if (sort.type === "genre") {
            result.sort((a, b) =>
                sort.value === "asc"
                    ? a.genre.name.localeCompare(b.genre.name)
                    : b.genre.name.localeCompare(a.genre.name)
            );
        }

        return result;
    }, [books, filter, sort]);

    return (
        <div className="overflow-x-auto">
            <table className="table table-sm table-pin-rows table-pin-cols ml-10 table-zebra">
                <thead>
                <tr>
                    <td
                        className="cursor-pointer text-accent font-bold"
                        onClick={() =>
                            setSort((prev) => ({
                                type: "title",
                                value: prev.type === "title" && prev.value === "asc" ? "desc" : "asc",
                            }))
                        }>Title {sort.type === "title" ? <DetermineSortArrow/> : ""}</td>
                    <td
                        className="cursor-pointer text-accent font-bold"
                        onClick={() =>
                            setSort((prev) => ({
                                type: "author",
                                value: prev.type === "author" && prev.value === "asc" ? "desc" : "asc",
                            }))
                        }>Author {sort.type === "author" ? <DetermineSortArrow/> : ""}
                    </td>
                    <td
                        className="cursor-pointer text-accent font-bold"
                        onClick={() =>
                            setSort((prev) => ({
                                type: "pages",
                                value: prev.type === "pages" && prev.value === "asc" ? "desc" : "asc",
                            }))
                        }>Pages {sort.type === "pages" ? <DetermineSortArrow/> : ""}
                    </td>
                    <td
                        className="cursor-pointer text-accent font-bold"
                        onClick={() =>
                            setSort((prev) => ({
                                type: "genre",
                                value: prev.type === "genre" && prev.value === "asc" ? "desc" : "asc",
                            }))
                        }>Genre {sort.type === "genre" ? <DetermineSortArrow/> : ""}
                    </td>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {filteredBooks.map((b) => (
                    <tr key={b.id} className="cursor-pointer" onClick={() => navigate(`/book/${b.id}`)}>

                        <td className="card-body justify-center">
                            <h2 className="card-title">{b.title}</h2>
                        </td>
                        <td>
                            <p>
                                {b.authors?.length ? (
                                    b.authors.map((a, idx) => (
                                        <span key={idx} >
                                        <button
                                            key={a.id}
                                            className="text-base-500 hover:underline mr-0 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent row navigation
                                                setFilter({type: "author", id: a.id, value: a.name});   // set author filter
                                            }}
                                        >
                                            {a.name}
                                        </button>
                                            {idx < b.authors.length - 1 && ", "}
                                            </span>
                                    ))
                                ) : (
                                    <span className="italic text-base-500/40 cursor-default">
                                    No authors
                                    </span>
                                )}
                            </p>
                        </td>
                        <td>
                            <p>
                                {b.pages ?? "N/A"}
                            </p>
                        </td>
                        <td>
                            <p>
                                <button
                                    className="text-base-500 hover:underline cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilter({type: "genre", id: b.genre.id, value: b.genre.name}); // set genre filter
                                    }}
                                >
                                    {b.genre.name}
                                </button>
                            </p>
                        </td>
                    </tr>

                ))}
                </tbody>
            </table>
        </div>
    )
}