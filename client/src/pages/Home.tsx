import {useAtom} from "jotai";
import {BookAtom, FilterAtom, SortingAtom} from "../Atom.ts";
import {useNavigate} from "react-router-dom"
import {useMemo} from "react";


export default function Home() {

    const [books, ] = useAtom(BookAtom);
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

    function determineSortArrow() {
        return sort.value === "asc" ? "▲" : "▼";
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-xs table-pin-rows table-pin-cols">
                <thead>
                <tr>
                    <td
                        className="cursor-pointer"
                        onClick={() =>
                        setSort((prev) => ({
                            type: "title",
                            value: prev.type === "title" && prev.value === "asc" ? "desc" : "asc",
                        }))
                    }>Title {sort.type === "title" ? determineSortArrow() : ""}</td>
                    <td>Author</td>
                    <td>Pages</td>
                    <td>Genre</td>
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
                                    b.authors.map((a) => (
                                        <button
                                            key={a.id}
                                            className="text-blue-500 hover:underline mr-1"
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent row navigation
                                                setFilter({ type: "author", id: a.id, value: a.name });   // set author filter
                                            }}
                                        >
                                            {a.name}
                                        </button>
                                    ))
                                ) : (
                                    "No authors"
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
                                    className="text-blue-500 hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilter({ type: "genre", id: b.genreid, value: b.genre.name }); // set genre filter
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