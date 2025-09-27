import {useAtom} from "jotai";
import {FilterAtom, GenreAtom, SortingAtom} from "../Atom.ts";
import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import DetermineSortArrow from "./structure/DetermineSortArrow.tsx";

export function Genres() {
    const [getGenres] = useAtom(GenreAtom);
    const [, setFilter] = useAtom(FilterAtom);
    const [sort, setSort] = useAtom(SortingAtom);
    const navigate = useNavigate();

    const sortedAuthors = useMemo(() => {
        const result = [...getGenres];
        if (sort.type === "author") {
            result.sort((a, b) =>
                sort.value === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }
        return result;
    }, [getGenres, sort]);


    function getSort() {
        return <button
            type="button"
            className="text-grey-100 cursor-pointer hover:underline bg-transparent border-none p-0 ml-10 font-bold text-xl"
            onClick={() =>
                setSort((prev) => ({
                    type: "author",
                    value: prev.type === "author" && prev.value === "asc" ? "desc" : "asc",
                }))
            }
        >
            Genres {sort.type === "author" ? <DetermineSortArrow /> : ""}
        </button>;
    }

    return <>
        {getSort()}
        <table className="table table-zebra ml-10">
            {sortedAuthors.map((a) => (
                <tr key={a.id}>
                    <th className="text-left">
                        <button
                            type="button"
                            className="text-grey-100 cursor-pointer hover:underline bg-transparent border-none p-0"
                            onClick={() => {
                                setFilter({type: "genre", id: a.id, value: a.name});
                                navigate("/");
                            }}
                        >
                            {a.name}
                        </button>
                    </th>
                    <th>Edit</th>
                    <th >Delete</th>
                </tr>
            ))}
        </table>
    </>
}