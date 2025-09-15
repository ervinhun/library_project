using dataaccess;

namespace Api.Dtos;

public class GenreDto
{

    public GenreDto(Genre genre)
    {
        Id = genre.Id;
        Name = genre.Name;
        Createdat = genre.Createdat;
    }
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    [NotInFuture(ErrorMessage = "You can't create a genre in the future.")]
    public DateTime? Createdat { get; set; }
}