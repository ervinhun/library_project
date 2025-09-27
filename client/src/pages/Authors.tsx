import {useAtom} from "jotai";
import {AuthorAtom, FilterAtom, SortingAtom} from "../Atom.ts";
import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import DetermineSortArrow from "./structure/DetermineSortArrow.tsx";

export function Authors() {
    const [getAuthors] = useAtom(AuthorAtom);
    const [, setFilter] = useAtom(FilterAtom);
    const [sort, setSort] = useAtom(SortingAtom);
    const navigate = useNavigate();

    const sortedAuthors = useMemo(() => {
        const result = [...getAuthors];
        if (sort.type === "author") {
            result.sort((a, b) =>
                sort.value === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }
        return result;
    }, [getAuthors, sort]);

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
            Authors {sort.type === "author" ? <DetermineSortArrow/> : ""}
        </button>;
    }

    return <>
        {getSort()}
        <table className="table table-zebra ml-10">
            <tbody>
            {sortedAuthors.map((a) => (
                <tr className="mt-4 space-y-2 ml-10" key={a.id}>
                    <th>
                        <button
                            type="button"
                            className="text-grey-100 cursor-pointer hover:underline bg-transparent border-none p-0"
                            onClick={() => {
                                setFilter({type: "author", id: a.id, value: a.name});
                                navigate("/");
                            }}
                        >
                            {a.name}
                        </button>
                    </th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            ))}
            </tbody>
        </table>
    </>
}