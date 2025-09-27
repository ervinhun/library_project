import type {Author} from "./Author.ts";
import type {Genre} from "./Genre.ts";

export interface Book {
    id: string;
    title: string;
    pages: number;
    createdat: string;
    genreid: string;
    genre: Genre;
    authors: Author[];
}