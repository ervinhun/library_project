using System.ComponentModel.DataAnnotations;
using dataaccess;

namespace Api.Dtos;

public class BookDto
{
    public BookDto(Book book)
    {
        Id = book.Id;
        Title = book.Title;
        Pages = book.Pages;
        Createdat = book.Createdat;
        Genreid = book.Genreid;
        Genre = new GenreDto(book.Genre!);
        Authors = book.Authors.Select(a => new AuthorDto(a)).ToList();
    }
    
    public List<BookDto> Books { get; set; } = new List<BookDto>();
    public string Id { get; set; }

    [MinLength(3, ErrorMessage = "A book must have a title, at least 3 characters long.")]
    public string Title { get; set; }

    [Range(49, int.MaxValue, ErrorMessage = "A book must have at least 49 pages.")]
    public int Pages { get; set; }

    [NotInFuture(ErrorMessage = "You can't create a book in the future.")]
    public DateTime? Createdat { get; set; }

    public string? Genreid { get; set; }

    public GenreDto? Genre { get; set; }

    public ICollection<AuthorDto> Authors { get; set; } = new List<AuthorDto>();
}