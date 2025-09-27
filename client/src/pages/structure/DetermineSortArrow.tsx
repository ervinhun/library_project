import {useAtom} from "jotai";
import {SortingAtom} from "../../Atom.ts";

export default function DetermineSortArrow() {

    const [sort] = useAtom(SortingAtom);

    if (!sort.value) return null;
    return sort.value === "asc" ? "▲" : "▼";
}