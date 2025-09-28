// Base URL of your backend
export const API_BASE_URL =
    "https://server-nameless-star-9223.fly.dev";

// Endpoints
export const API_ENDPOINTS = {
    books: `${API_BASE_URL}/GetAllBooks`,
    authors: `${API_BASE_URL}/GetAllAuthors`,
    genres: `${API_BASE_URL}/GetAllGenres`,
    addBook: `${API_BASE_URL}/AddBook`,
    addAuthor: `${API_BASE_URL}/AddAuthor`,
    addGenre: `${API_BASE_URL}/AddGenre`,
    deleteBook: `${API_BASE_URL}/DeleteBook`,
    deleteAuthor: `${API_BASE_URL}/DeleteAuthor`,
    deleteGenre: `${API_BASE_URL}/DeleteGenre`,
    updateBook: `${API_BASE_URL}/UpdateBook`,
    updateAuthor: `${API_BASE_URL}/UpdateAuthor`,
    updateGenre: `${API_BASE_URL}/UpdateGenre`,
};
