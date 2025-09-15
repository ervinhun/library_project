using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

public class Getters : ControllerBase
{
    
    private readonly IGetterService _service;

    public Getters(IGetterService service)
    {
        _service = service;
    }
    
    
    [HttpGet(nameof(GetBookById))]
    public async Task<ActionResult<BookDto>> GetBookById([FromQuery] string bookId)
    {
        var book = await _service.GetBookById(bookId);
        return Ok(book);
    }
    
    [HttpGet(nameof(GetAuthorById))]
    public async Task<ActionResult<AuthorDto>> GetAuthorById([FromQuery] string authorId)
    {
        var authorById = await _service.GetAuthorById(authorId);
        return Ok(authorById);
    }
    
    [HttpGet(nameof(GetGenreById))]
    public async Task<ActionResult<GenreDto>> GetGenreById([FromQuery] string genreId)
    {
        var genre = await _service.GetGenreById(genreId);
        return Ok(genre);
    }
    
    [HttpGet(nameof(GetAllBooks))]
    public async Task<ActionResult<List<BookDto>>> GetAllBooks()
    {
        var books = await _service.GetAllBooks();
        return Ok(books);
    }
    [HttpGet(nameof(GetAllAuthors))]
    public async Task<ActionResult<List<AuthorDto>>> GetAllAuthors()
    {
        var authors = await _service.GetAllAuthors();
        return Ok(authors);
    }
    [HttpGet(nameof(GetAllGenres))]
    public async Task<ActionResult<List<GenreDto>>> GetAllGenres()
    {
        var genres = await _service.GetAllGenres();
        return Ok(genres);
    }
}