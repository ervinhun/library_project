using System.ComponentModel.DataAnnotations;
using dataaccess;

namespace Api.Dtos;

public class AuthorResponseDto
{
    public AuthorResponseDto(){}

    public AuthorResponseDto(Author author)
    {
        Id = author.Id;
        Name = author.Name;
        Createdat = author.Createdat;
    }
    public string Id { get; set; } = null!;

    [MinLength(3)]
    public string Name { get; set; } = null!;

    [NotInFuture(ErrorMessage = "You can't create an author in the future.")]
        public DateTime? Createdat { get; set; }
}