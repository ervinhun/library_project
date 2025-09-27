import bookImage from "../../assets/books.png"
import {useAtom} from "jotai";
import {FilterAtom} from "../../Atom.ts";

export default function Header() {

    const [filter, setFilter] = useAtom(FilterAtom);


    function getTitle() {
        return <>
            {/* Logo + Title */}
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <img
                    src={bookImage}
                    alt="book icon"
                    className="w-16 h-16 object-cover"
                />
                <h1 className="text-4xl md:text-6xl font-bold text-default-400">
                    Library - Ervin
                </h1>
            </div>
        </>;
    }

    function getMenu() {
        return <>
            {/* Menu */}
            <div className="absolute top-4 right-4 dropdown dropdown-end px-6 py-11">
                <div className="dropdown dropdown-end">
                    <label title="Add an item" tabIndex={0} className="btn btn-accent btn-circle btn-lg">
                        +
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-40 mt-2"
                    >
                        <li className="py-1">
                            Book
                        </li>
                        <li className="py-1">
                            Author
                        </li>
                        <li className="py-1">
                            Genre
                        </li>
                    </ul>
                </div>
            </div>
        </>;
    }

    function getFilterIndication() {
        return <>
            {filter && (
                <code className="p-2 rounded-md">
                    <div className="flex items-center space-x-2 mt-2 text-sm bg-accent-content px-2 py-1">
                            <span className=" text-gray-100 rounded">
                              {filter.type === "author" ? "Author: " : "Genre: "}
                                {filter.value}
                            </span>
                        <button
                            className="text-red-500 font-bold"
                            onClick={() => setFilter(null)}
                        >
                            ×
                        </button>
                    </div>
                </code>
            )}
        </>;
    }

    return <>
        <div
            className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-6 py-12 rounded-lg shadow-md">
            {getTitle()}
            {getMenu()}
        </div>
        <div className="flex items-center space-x-2 mt-2 text-sm">
            {getFilterIndication()}
        </div>
    </>
}