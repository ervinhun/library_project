using Api.Dtos;
using dataaccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata;

namespace api.Controller;

public class AddSampleData(MyDbContext db) : ControllerBase
{
    [HttpPost(nameof(AddSampleDataOnce))]
    public List<AuthorResponseDto> AddSampleDataOnce()
    {
        List<Author> authors = new List<Author>();
        
        if (db.Authors.Count() < 2)
        {
            //var id = "1";
            var genreId = "1"; //Fantasy
            authors.Add(new Author
            {
                Id = "1", Name = "George Orwell", Createdat = DateTime.UtcNow,
                Books = [new Book { Id = "1", Title = "1984", Createdat = DateTime.UtcNow, Genreid = genreId}],
            });
            //id = "2";
            authors.Add(new Author
            {
                Id = "2", Name = "J.K. Rowling", Createdat = DateTime.UtcNow,
                Books =
                [
                    new Book { Id = "2", Title = "Harry Potter and the Philosopher's Stone", Createdat = DateTime.UtcNow, Genreid = genreId}
                ]
            });
        }
        else
        {
            throw new InvalidOperationException("Sample data already added");
        }

        db.Authors.AddRange(authors);
        db.SaveChanges();
        return authors.Select(a => new AuthorResponseDto(a)).ToList();
    }
}