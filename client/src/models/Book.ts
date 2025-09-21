export interface Book {
    id: string;
    title: string;
    pages: number;
    createdat: string;
    genreid: string;
    genre: Genre;
    authors: Author[];
}

export interface Author {
    id: string;
    name: string;
    createdat: string;
}

export interface Genre {
    id: string;
    name: string;
    createdAt: string;
}