using Api.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Api.Services;

public interface IGetterService
{
    Task<BookDto> GetBookById(string bookDto);
    Task<AuthorDto> GetAuthorById(string authorId);
    Task<GenreDto> GetGenreById(string genreId);
    
    Task<List<BookDto>> GetAllBooks();
    Task<List<AuthorDto>> GetAllAuthors();
    Task<List<GenreDto>> GetAllGenres();
    
    Task<IActionResult> GetAllBooksByGenre(GenreDto genreId);
    Task<IActionResult> GetAllBooksByAuthor(AuthorDto authorId);
    Task<IActionResult> GetAllBooksByTitle(string title);
}