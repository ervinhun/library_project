import {useAtom} from "jotai";
import {BookAtom, ShowBookAtom, SortingAtom} from "../Atom.ts";
import {useNavigate} from "react-router-dom"
import {useMemo} from "react";


export default function Home() {

    const [books, ] = useAtom(BookAtom);
    const [show, ] = useAtom(ShowBookAtom);
    const [sort, ] = useAtom(SortingAtom);
    const navigate = useNavigate();

    const filteredBooks = useMemo(() => {
        let result = [...books];

        // Filter


        if (sort === "name") result = [...result].sort((a, b) => a.title.localeCompare(b.title));
            //TODO: make the sorting
        else if (sort === "id") result = [...result].sort((a, b) => a.id.localeCompare(b.id));

        return result;
    }, [books, show, sort]);


    return (
        <div className="flex flex-col min-h-screen bg-gray-100 items-center">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl bg-gray-100 px-6 py-12 rounded-lg shadow-md">
                {/* Logo + Title */}
                <div className="flex items-center space-x-4 mb-6 md:mb-0">
                    <img
                        src="src/assets/book.jpg"
                        alt="book icon"
                        className="w-16 h-16 object-cover"
                    />
                    <h1 className="text-4xl md:text-6xl font-bold text-black">
                        Library - Ervin
                    </h1>
                </div>

                {/* Menu / Buttons */}
                <div>

                </div>
            </div>


            {/* Content Section */}
            <div
                className="flex-1 flex flex-col items-center bg-blue-400 text-black p-6 rounded-2xl w-full shadow-lg mt-6">
                {filteredBooks.map((b) => (
                    <div
                        key={b.id}
                        className={`card card-side bg-blue-500 shadow-md m-4 w-full cursor-pointer ${
                            b.pages < 100 ? "opacity-50" : ""
                        }`}
                        onClick={() => navigate(`/pet/${b.id}`)}
                    >

                        <div className="card-body justify-center">
                            <h2 className="card-title">{b.id} - {b.title}</h2>
                            <p>
                                Authors: {b.authors?.length ? b.authors.map(a => a.name).join(', ') : 'No authors'}
                            </p>

                            <p>Pages: {b.pages}</p>
                            <p className="font-bold">Genre: {b.genre.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}