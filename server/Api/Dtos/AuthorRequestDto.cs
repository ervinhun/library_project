using System.ComponentModel.DataAnnotations;
using dataaccess;

namespace Api.Dtos;

public class AuthorRequestDto
{
    public AuthorRequestDto(){}

    public AuthorRequestDto(Author author)
    {
        Id = author.Id;
        Name = author.Name;
    }
    public string Id { get; set; } = null!;

    [MinLength(3)]
    public string Name { get; set; } = null!;
}