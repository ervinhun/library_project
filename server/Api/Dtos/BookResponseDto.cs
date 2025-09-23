using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using dataaccess;

namespace Api.Dtos;

public class BookResponseDto
{
    public BookResponseDto() {}
    public BookResponseDto(Book book)
    {
        Id = book.Id;
        Title = book.Title;
        Pages = book.Pages;
        Createdat = book.Createdat;
        Genreid = book.Genreid;
        Genre = book.Genre != null ? new GenreResponseDto(book.Genre!) : null;
        Authors = book.Authors?.Select(a => new AuthorResponseDto(a)).ToList() ?? new List<AuthorResponseDto>();
    }
    public string Id { get; set; }

    [MinLength(3, ErrorMessage = "A book must have a title, at least 3 characters long.")]
    public string Title { get; set; }

    [Range(49, int.MaxValue, ErrorMessage = "A book must have at least 49 pages.")]
    public int Pages { get; set; }

    [NotInFuture(ErrorMessage = "You can't create a book in the future.")]
    public DateTime? Createdat { get; set; }

    public string? Genreid { get; set; }

    public GenreResponseDto? Genre { get; set; }

    public ICollection<AuthorResponseDto> Authors { get; set; } = new List<AuthorResponseDto>();
}