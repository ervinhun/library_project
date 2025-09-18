using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

public class LibraryController : ControllerBase
{
    
    private readonly ILibraryService _service;

    public LibraryController(ILibraryService service)
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

    [HttpGet(nameof(GetAllBooksByGenre))]
    public async Task<ActionResult<List<BookDto>>> GetAllBooksByGenre(string genreId)
    {
        return Ok(await _service.GetAllBooksByGenre(genreId));
    }

    [HttpGet(nameof(GetAllBooksByAuthor))]
    public async Task<ActionResult<List<BookDto>>> GetAllBooksByAuthor(string authorId)
    {
        return Ok(await _service.GetAllBooksByAuthor(authorId));
    }

    [HttpGet(nameof(GetAllBooksByTitle))]
    public async Task<ActionResult<List<BookDto>>> GetAllBooksByTitle(string title)
    {
        return Ok(await _service.GetAllBooksByTitle(title));
    }

    [HttpPost(nameof(AddBook))]
    public ActionResult<BookDto> AddBook(BookDto bookDto)
    {
        throw new NotImplementedException();
    }

    [HttpPost(nameof(AddAuthor))]
    public ActionResult<AuthorDto> AddAuthor(AuthorDto authorDto)
    {
        throw new NotImplementedException();
    }

    [HttpPost(nameof(AddGenre))]
    public ActionResult<GenreDto> AddGenre(GenreDto genreDto)
    {
        throw new NotImplementedException();
    }

    [HttpPut(nameof(UpdateBook))]
    public ActionResult<BookDto> UpdateBook(string bookId, BookDto bookDto)
    {
        throw new NotImplementedException();
    }

    [HttpPut(nameof(UpdateAuthor))]
    public ActionResult<AuthorDto> UpdateAuthor(string authorId, AuthorDto authorDto)
    {
        throw new NotImplementedException();
    }

    [HttpPut(nameof(UpdateGenre))]
    public ActionResult<GenreDto> UpdateGenre(string genreId, GenreDto genreDto)
    {
        throw new NotImplementedException();
    }

    [HttpDelete(nameof(DeleteBook))]
    public async Task<ActionResult> DeleteBook(string bookId)
    {
        var result = await _service.DeleteBook(bookId);
        return result ? Ok() : BadRequest();
    }

    [HttpDelete(nameof(DeleteAuthor))]
    public async Task<ActionResult> DeleteAuthor(string authorId)
    {
        var result = await _service.DeleteAuthor(authorId);
        return result ? Ok() : BadRequest();
    }

    [HttpDelete(nameof(DeleteGenre))]
    public async Task<ActionResult> DeleteGenre(string genreId)
    {
        var result = await _service.DeleteGenre(genreId);
        return result ? Ok() : BadRequest();
    }
}