import {atom} from "jotai";
import type {Book} from "./models/Book.ts";

export const BookAtom = atom<Book[]>([]);
BookAtom.debugLabel = "BookAtom";

export const ShowBookAtom = atom("all");
ShowBookAtom.debugLabel = "ShowBookAtom";

export const SortingAtom = atom("name");
SortingAtom.debugLabel = "SortingAtom";