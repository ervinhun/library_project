using Api.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Api.Services;

public interface ILibraryService
{
    Task<BookDto> GetBookById(string bookDto);
    Task<AuthorDto> GetAuthorById(string authorId);
    Task<GenreDto> GetGenreById(string genreId);
    
    Task<List<BookDto>> GetAllBooks();
    Task<List<AuthorDto>> GetAllAuthors();
    Task<List<GenreDto>> GetAllGenres();
    
    Task<List<BookDto>> GetAllBooksByGenre(string genreId);
    Task<List<BookDto>> GetAllBooksByAuthor(string authorId);
    Task<List<BookDto>> GetAllBooksByTitle(string title);
    
    Task<BookDto> AddBook(BookDto bookDto);
    Task<AuthorDto> AddAuthor(AuthorDto authorDto);
    Task<GenreDto> AddGenre(GenreDto genreDto);
    
    Task<BookDto> UpdateBook(string bookId, BookDto bookDto);
    Task<AuthorDto> UpdateAuthor(string authorId, AuthorDto authorDto);
    Task<GenreDto> UpdateGenre(string genreId, GenreDto genreDto);
    
    Task<IActionResult> DeleteBook(string bookId);
    Task<IActionResult> DeleteAuthor(string authorId);
    Task<IActionResult> DeleteGenre(string genreId);
}