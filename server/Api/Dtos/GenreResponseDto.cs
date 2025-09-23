using dataaccess;

namespace Api.Dtos;

public class GenreResponseDto
{
    public GenreResponseDto(){}
    public GenreResponseDto(Genre genre)
    {
        Id = genre.Id;
        Name = genre.Name;
        Createdat = genre.Createdat;
    }
    public string Id { get; set; }

    public string Name { get; set; }

    [NotInFuture(ErrorMessage = "You can't create a genre in the future.")]
    public DateTime? Createdat { get; set; }
}