using Api.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Api.Services;

public interface ILibraryService
{
    Task<BookResponseDto> GetBookById(string bookDto);
    Task<AuthorResponseDto> GetAuthorById(string authorId);
    Task<GenreResponseDto> GetGenreById(string genreId);
    
    Task<List<BookResponseDto>> GetAllBooks();
    Task<List<AuthorResponseDto>> GetAllAuthors();
    Task<List<GenreResponseDto>> GetAllGenres();
    
    Task<List<BookResponseDto>> GetAllBooksByGenre(string genreId);
    Task<List<BookResponseDto>> GetAllBooksByAuthor(string authorId);
    Task<List<BookResponseDto>> GetAllBooksByTitle(string title);
    
    Task<BookResponseDto> AddBook(BookCreateRequestDto bookResponseDto);
    Task<AuthorResponseDto> AddAuthor(string authorName);
    Task<GenreResponseDto> AddGenre(string genreName);
    
    Task<BookResponseDto> UpdateBook(string bookId, BookUpdateRequestDto bookResponseDto);
    Task<AuthorResponseDto> UpdateAuthor(string authorId, AuthorRequestDto authorResponseDto);
    Task<GenreResponseDto> UpdateGenre(string genreId, GenreRequestDto genreResponseDto);
    
    Task<bool> DeleteBook(string bookId);
    Task<bool> DeleteAuthor(string authorId);
    Task<bool> DeleteGenre(string genreId);
}