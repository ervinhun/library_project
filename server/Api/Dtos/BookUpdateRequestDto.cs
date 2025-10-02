using System.ComponentModel.DataAnnotations;
using dataaccess;

namespace Api.Dtos;

public class BookUpdateRequestDto
{
    public BookUpdateRequestDto()
    {
    }

    public BookUpdateRequestDto(Book book)
    {
        Id = book.Id;
        Title = book.Title;
        Pages = book.Pages;
        Genreid = book.Genreid;
        Genre = book.Genre != null ? new GenreResponseDto(book.Genre!) : null;
        Authors = book.Authors?.Select(a => new AuthorResponseDto(a)).ToList() ?? new List<AuthorResponseDto>();
    }

    public string Id { get; set; }

    [MinLength(3, ErrorMessage = "A book must have a title, at least 3 characters long.")]
    public string Title { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "A book must have at least 1 page.")]
    public int Pages { get; set; }

    public string? Genreid { get; set; }

    public GenreResponseDto? Genre { get; set; }

    public ICollection<AuthorResponseDto> Authors { get; set; } = new List<AuthorResponseDto>();
}