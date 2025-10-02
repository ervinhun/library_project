using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controller;

[ApiController]
[Route("api/[controller]")]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _service;

    public LibraryController(ILibraryService service)
    {
        _service = service;
    }


    [HttpGet(nameof(GetBookById))]
    public async Task<ActionResult<BookResponseDto>> GetBookById([FromQuery] string bookId)
    {
        var book = await _service.GetBookById(bookId);
        return Ok(book);
    }

    [HttpGet(nameof(GetAuthorById))]
    public async Task<ActionResult<AuthorResponseDto>> GetAuthorById([FromQuery] string authorId)
    {
        var authorById = await _service.GetAuthorById(authorId);
        return Ok(authorById);
    }

    [HttpGet(nameof(GetGenreById))]
    public async Task<ActionResult<GenreResponseDto>> GetGenreById([FromQuery] string genreId)
    {
        var genre = await _service.GetGenreById(genreId);
        return Ok(genre);
    }

    [HttpGet(nameof(GetAllBooks))]
    public async Task<ActionResult<List<BookResponseDto>>> GetAllBooks()
    {
        var books = await _service.GetAllBooks();
        return Ok(books);
    }

    [HttpGet(nameof(GetAllAuthors))]
    public async Task<ActionResult<List<AuthorResponseDto>>> GetAllAuthors()
    {
        var authors = await _service.GetAllAuthors();
        return Ok(authors);
    }

    [HttpGet(nameof(GetAllGenres))]
    public async Task<ActionResult<List<GenreResponseDto>>> GetAllGenres()
    {
        var genres = await _service.GetAllGenres();
        return Ok(genres);
    }

    [HttpGet(nameof(GetAllBooksByGenre))]
    public async Task<ActionResult<List<BookResponseDto>>> GetAllBooksByGenre([FromQuery] string genreId)
    {
        return Ok(await _service.GetAllBooksByGenre(genreId));
    }

    [HttpGet(nameof(GetAllBooksByAuthor))]
    public async Task<ActionResult<List<BookResponseDto>>> GetAllBooksByAuthor([FromQuery] string authorId)
    {
        return Ok(await _service.GetAllBooksByAuthor(authorId));
    }

    [HttpGet(nameof(GetAllBooksByTitle))]
    public async Task<ActionResult<List<BookResponseDto>>> GetAllBooksByTitle([FromQuery] string title)
    {
        return Ok(await _service.GetAllBooksByTitle(title));
    }

    [HttpPost(nameof(AddBook))]
    public async Task<ActionResult<BookResponseDto>> AddBook([FromBody] BookCreateRequestDto bookCreateRequestDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
            return BadRequest(errors);
        }
        if(bookCreateRequestDto == null)
            throw new ArgumentNullException(nameof(bookCreateRequestDto));
        try
        {
            var book = await _service.AddBook(bookCreateRequestDto);
            return Ok(book);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost(nameof(AddAuthor))]
    public async Task<ActionResult<AuthorResponseDto>> AddAuthor([FromBody] string authorName)
    {
        if (authorName == null)
            throw new ArgumentNullException(nameof(authorName));
        try
        {
            var author = await _service.AddAuthor(authorName );
            return Ok(author);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost(nameof(AddGenre))]
    public async Task<ActionResult<GenreResponseDto>> AddGenre([FromBody] string genreName)
    {
        if (genreName == null)
            throw new ArgumentNullException(nameof(genreName));
        try
        {
            var genre = await _service.AddGenre(genreName);
            return Ok(genre);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut(nameof(UpdateBook))]
    public async Task<ActionResult<BookResponseDto>> UpdateBook([FromBody] BookUpdateRequestDto bookResponseDto)
    {
        if (bookResponseDto.Id.Equals("1") || bookResponseDto.Id.Equals("2"))
            throw new ArgumentException("The first two books (id 1 and 2) cannot be updated.");
        if (bookResponseDto == null)
            throw new ArgumentNullException(nameof(bookResponseDto));
        try
        {
            bookResponseDto.Authors ??= new List<AuthorResponseDto>();
            var result = await _service.UpdateBook(bookResponseDto.Id, bookResponseDto);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut(nameof(UpdateAuthor))]
    public async Task<ActionResult<AuthorResponseDto>> UpdateAuthor([FromBody] AuthorRequestDto authorResponseDto)
    {
        try
        {
            await _service.UpdateAuthor(authorResponseDto.Id, authorResponseDto);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut(nameof(UpdateGenre))]
    public async Task<ActionResult<GenreResponseDto>> UpdateGenre([FromBody] GenreRequestDto genreResponseDto)
    {
        try
        {
            await _service.UpdateGenre(genreResponseDto.Id, genreResponseDto);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete(nameof(DeleteBook))]
    public async Task<ActionResult> DeleteBook([FromBody] string bookId)
    {
        var result = await _service.DeleteBook(bookId);
        return result ? Ok() : BadRequest();
    }

    [HttpDelete(nameof(DeleteAuthor))]
    public async Task<ActionResult> DeleteAuthor([FromBody] string authorId)
    {
        var result = await _service.DeleteAuthor(authorId);
        return result ? Ok() : BadRequest();
    }

    [HttpDelete(nameof(DeleteGenre))]
    public async Task<ActionResult> DeleteGenre([FromBody] string genreId)
    {
        var result = await _service.DeleteGenre(genreId);
        return result ? Ok() : BadRequest();
    }
}