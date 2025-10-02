import {useAtom} from "jotai";
import {FilterAtom, GenreAtom} from "../Atom.ts";
import {useNavigate} from "react-router-dom";
import {useMemo, useState} from "react";
import DetermineSortArrow from "./structure/DetermineSortArrow.tsx";
import Form from "./structure/Form.tsx";
import {LibraryClient} from "../models/generated-client.ts";
import {API_BASE_URL_PROD, DELETE_ENDPOINTS} from "../config/api.ts";
import {confirmAndDelete} from "./structure/HandleDelete.tsx";

export function Genres() {
    const [getGenres, setGenres] = useAtom(GenreAtom);
    const [, setFilter] = useAtom(FilterAtom);
    const [sort, setSort] = useState<{ type: "genres"; value: "asc" | "desc" }>({
        type: "genres",
        value: "asc",
    });
    const navigate = useNavigate();
    const [openForm, setForm] = useState<"book" | "author" | "genre" | null>(null);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);

    const client = new LibraryClient(API_BASE_URL_PROD);

    const sortedAuthors = useMemo(() => {
        const result = [...getGenres];
        if (sort.type === "genres") {
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
            className="cursor-pointer text-accent font-bold ml-13"
            onClick={() =>
                setSort((prev) => ({
                    type: "genres",
                    value: prev.type === "genres" && prev.value === "asc" ? "desc" : "asc",
                }))
            }
        >
            Genres {sort.type === "genres" ? <DetermineSortArrow/> : ""}
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
        <table className="table table-zebra table-sm ml-10">
            <tbody>
            {sortedAuthors.map((a) => (
                <tr key={a.id}>
                    <th className="text-left w-3/4">
                        <button
                            type="button"
                            className="text-base cursor-pointer hover:underline bg-transparent border-none p-0"
                            onClick={() => {
                                setFilter({type: "genre", id: a.id, value: a.name});
                                navigate("/");
                            }}
                        >
                            {a.name}
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            className="text-base cursor-pointer bg-transparent border-none p-0 text-xl"
                            onClick={() => {
                                setForm("genre");
                                setEditingId(a.id);
                            }}
                        >
                            ✎
                        </button>
                    </th>
                    <th>
                        <button type="button"
                                className="text-base cursor-pointer bg-transparent border-none p-0 text-xl"
                                onClick={() => confirmAndDelete(
                                    client,
                                    a.id,
                                    a.name,
                                    DELETE_ENDPOINTS.genre,
                                    setFilter,
                                    undefined,
                                    setGenres
                                )}>
                            🗑
                        </button>
                    </th>
                </tr>
            ))}
            </tbody>
        </table>
    </>
}