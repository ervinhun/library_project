import {useAtom} from "jotai";
import {AuthorAtom, FilterAtom} from "../Atom.ts";
import {useMemo, useState} from "react";
import DetermineSortArrow from "./structure/DetermineSortArrow.tsx";
import Form from "./structure/Form.tsx";
import {client} from "../config/client.ts";
import {DELETE_ENDPOINTS} from "../config/api.ts";
import {confirmAndDelete} from "./structure/HandleDelete.tsx";


export function Authors() {
    const [getAuthors, setAuthors] = useAtom(AuthorAtom);
    const [, setFilter] = useAtom(FilterAtom);
    const [sort, setSort] = useState<{ type: "author"; value: "asc" | "desc" }>({
        type: "author",
        value: "asc",
    });
    const [openForm, setForm] = useState<"book" | "author" | "genre" | null>(null);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);


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
        <Form
            formType={openForm}
            publicId={editingId}
            open={openForm !== null}
            onClose={() => {
                setForm(null);
                setEditingId(undefined);
            }}
        />
        {getSort()}
        <table className="table table-zebra ml-10">
            <tbody>
            {sortedAuthors.map((a) => (
                <tr className="mt-4 space-y-2 ml-10" key={a.id}>
                    <th className="text-left w-3/4">
                        <button
                            type="button"
                            className="text-grey-100 cursor-pointer hover:underline bg-transparent border-none p-0"
                            onClick={() => confirmAndDelete(
                                client,
                                a.id,
                                a.name,
                                DELETE_ENDPOINTS.author,
                                setFilter,
                                setAuthors)}
                        >
                            {a.name}
                        </button>
                    </th>
                    <th>
                        <button type="button"
                                className="text-grey-100 cursor-pointer hover:underline bg-transparent border-none p-0"
                                onClick={() => {
                                    setForm("author");
                                    setEditingId(a.id);
                                }}>
                            Edit
                        </button>
                    </th>
                    <th>
                        <button type="button"
                                className="text-grey-100 cursor-pointer hover:underline bg-transparent border-none p-0"
                                onClick={() => confirmAndDelete(
                                    client,
                                    a.id,
                                    a.name,
                                    DELETE_ENDPOINTS.author,
                                    setFilter,
                                    setAuthors
                                )}>
                            Delete
                        </button>
                    </th>
                </tr>
            ))}
            </tbody>
        </table>
    </>
}