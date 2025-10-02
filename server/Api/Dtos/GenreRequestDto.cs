using dataaccess;

namespace Api.Dtos;

public class GenreRequestDto
{
    public GenreRequestDto()
    {
    }

    public GenreRequestDto(Genre genre)
    {
        Id = genre.Id;
        Name = genre.Name;
    }

    public string Id { get; set; }

    public string Name { get; set; }
}