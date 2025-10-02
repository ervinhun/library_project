using System.ComponentModel.DataAnnotations;
using dataaccess;

namespace Api.Dtos;

public class BookCreateRequestDto
{
    public BookCreateRequestDto(){}
    public BookCreateRequestDto(Book book)
    {
        Title = book.Title;
        Pages = book.Pages;
        Genreid = book.Genreid;
    }

    [MinLength(3, ErrorMessage = "A book must have a title, at least 3 characters long.")]
    public string Title { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "A book must have at least 1 page.")]
    public int Pages { get; set; }

    public string? Genreid { get; set; }
}