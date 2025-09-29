import {useNavigate, useParams} from "react-router-dom";
import {BookAtom, FilterAtom} from "../Atom.ts";
import {useAtom} from "jotai";
import toast from "react-hot-toast";
import {confirmAndDelete} from "./structure/HandleDelete.tsx";
import {client} from "../config/client.ts";
import {DELETE_ENDPOINTS} from "../config/api.ts";
import {useState} from "react";
import Form from "./structure/Form.tsx";

export default function BookDetail() {
    const BookId = useParams<{ id: string }>();
    const [getBooks, setBooks] = useAtom(BookAtom);
    const [, setFilter] = useAtom(FilterAtom);
    const bookToShow = getBooks.find(b => b.id === BookId.id);
    const [openForm, setForm] = useState<"book" | "author" | "genre" | null>(null);

    const navigate = useNavigate();

    if (!bookToShow) {
        toast("Book not found, redirecting to home...");
        navigate("/");
        return null;
    }


    return (<>
        <Form
            formType={openForm}
            publicId={bookToShow.id}
            open={openForm !== null}
            onClose={() => {
                setForm(null);
            }}
        />
        <div className="card w-96 bg-base-100 shadow-xl mx-auto my-10">
            <div className="card-body">
                    <h2 className="card-title">{bookToShow.title}</h2>
                <p>Pages: {bookToShow.pages}</p>
                <p>Genre: {bookToShow.genre.name}</p>
                <p>Authors: {bookToShow.authors.map(a => a.name).join(", ")}</p>
                <div className="flex gap-2 mb-4">

                </div>
                <div className="card-actions justify-end mt-4 space-x-2">
                    <button
                        className="btn btn-sm btn-warning h-10 w-15 text-xl"
                        onClick={() => {
                            setForm("book");
                        }}
                    >✎
                    </button>
                    <button
                        className="btn btn-sm btn-error h-10 w-15 text-xl"
                        onClick={() => {
                            confirmAndDelete(
                                client,
                                bookToShow.id,
                                bookToShow?.title,
                                DELETE_ENDPOINTS.book,
                                setFilter,
                                undefined,
                                undefined,
                                setBooks
                            );
                            navigate("/");
                        }
                        }
                    >
                        🗑
                    </button>
                    <button className="btn btn-info h-10 w-15 text-xl" onClick={() => navigate(-1)}>
                        🔙
                    </button>
                </div>
            </div>
        </div>
    </>);

}