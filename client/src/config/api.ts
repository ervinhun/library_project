// Base URL of your backend
export const API_BASE_URL_PROD =
    "https://server-nameless-star-9223.fly.dev/api/library";
export const API_BASE_URL_DEV = "http://localhost:3000";

// Endpoints
export const API_ENDPOINTS = {
    books: `${API_BASE_URL_PROD}/GetAllBooks`,
    authors: `${API_BASE_URL_PROD}/GetAllAuthors`,
    genres: `${API_BASE_URL_PROD}/GetAllGenres`,
    addBook: `${API_BASE_URL_PROD}/AddBook`,
    addAuthor: `${API_BASE_URL_PROD}/AddAuthor`,
    addGenre: `${API_BASE_URL_PROD}/AddGenre`,
    deleteBook: `${API_BASE_URL_PROD}/DeleteBook`,
    deleteAuthor: `${API_BASE_URL_PROD}/DeleteAuthor`,
    deleteGenre: `${API_BASE_URL_PROD}/DeleteGenre`,
    updateBook: `${API_BASE_URL_PROD}/UpdateBook`,
    updateAuthor: `${API_BASE_URL_PROD}/UpdateAuthor`,
    updateGenre: `${API_BASE_URL_PROD}/UpdateGenre`,
};

export const DELETE_ENDPOINTS = {
    book: "book",
    author: "author",
    genre: "genre",
}
