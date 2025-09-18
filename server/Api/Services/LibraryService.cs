using Api.Dtos;
using dataaccess;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class LibraryService(MyDbContext ctx) : ILibraryService
{
    public async Task<BookDto> GetBookById(string bookId)
    {
        var book = await ctx.Books
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .FirstOrDefaultAsync(b => b.Id == bookId);
        
        if (book == null)
            throw new KeyNotFoundException("Could not find book with id: " + bookId + "");
        return new BookDto(book);
    }

    public async Task<AuthorDto> GetAuthorById(string authorId)
    {
        var author = await ctx.Authors.FirstOrDefaultAsync(a => a.Id == authorId);
        if (author == null)
            throw new KeyNotFoundException("Could not find author with id: " + authorId + "");
        return new AuthorDto(author);
    }

    public async Task<GenreDto> GetGenreById(string genreId)
    {
        var genre = await ctx.Genres.FirstOrDefaultAsync(g => g.Id == genreId);
        if (genre == null)
            throw new KeyNotFoundException("Could not find genre with id: " + genreId + "");
        return new GenreDto(genre);
    }

    public async Task<List<BookDto>> GetAllBooks()
    {
        List<BookDto> books = new List<BookDto>();
        var booksDbEntities = 
            await ctx.Books
                .Include(b => b.Genre)
                .Include(b => b.Authors)
                .ToListAsync();
        foreach (var book in booksDbEntities)
        {
            books.Add(new BookDto(book));
            Console.WriteLine(book.Title);
        }
        if (books.Count == 0)
            throw new KeyNotFoundException("Could not find any books");
        return  books;
    }

    public async Task<List<AuthorDto>> GetAllAuthors()
    {
        var authors = await ctx.Authors.ToListAsync();
        List<AuthorDto> authorDtos = new List<AuthorDto>();
        if (authors.Count == 0)
            throw new KeyNotFoundException("Could not find any authors");
        foreach (var author in authors)
        {
            authorDtos.Add(new AuthorDto(author));
        }
        return authorDtos;
        
    }

    public async Task<List<GenreDto>> GetAllGenres()
    {
        List<GenreDto> genresDto = new List<GenreDto>();
        var genres = await ctx.Genres.ToListAsync();
        if (genres.Count == 0)
            throw new KeyNotFoundException("Could not find any genres");
        foreach (var genre in genres)
        {
            genresDto.Add(new GenreDto(genre));
        }
        return genresDto;
    }

    public async Task<List<BookDto>> GetAllBooksByGenre(string genreId)
    {
        var books = await ctx.Books.Where(b => b.Genreid == genreId)
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .ToListAsync();
        if (books.Count == 0)
            throw new KeyNotFoundException("Could not find any books");
        var booksDto = books.Select(b => new BookDto(b)).ToList();
        return booksDto;
        
    }

    public async Task<List<BookDto>> GetAllBooksByTitle(string title)
    {
        var books = await ctx.Books.Where(b => b.Title.Contains(title))
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .ToListAsync();
        if (books.Count == 0)
            throw new KeyNotFoundException("Could not find any books");
        var booksDto = books.Select(b => new BookDto(b)).ToList();
        return booksDto;
    }

    public async Task<List<BookDto>> GetAllBooksByAuthor(string authorId)
    {
        var books = await ctx.Books
            .Where(b => b.Authors.Any(a => a.Id == authorId))
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .ToListAsync();
        if (books.Count == 0)
            throw new KeyNotFoundException("Could not find any books");
        var booksDto = books.Select(b => new BookDto(b)).ToList();
        return booksDto;
    }

    public async Task<BookDto> AddBook(BookDto bookDto)
    {
        throw new NotImplementedException();
    }

    public async Task<AuthorDto> AddAuthor(AuthorDto authorDto)
    {
        throw new NotImplementedException();
    }

    public async Task<GenreDto> AddGenre(GenreDto genreDto)
    {
        throw new NotImplementedException();
    }

    public async Task<BookDto> UpdateBook(string bookId, BookDto bookDto)
    {
        throw new NotImplementedException();
    }

    public async Task<AuthorDto> UpdateAuthor(string authorId, AuthorDto authorDto)
    {
        throw new NotImplementedException();
    }

    public async Task<GenreDto> UpdateGenre(string genreId, GenreDto genreDto)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteBook(string bookId)
    {
        if (bookId.Equals("1") || bookId.Equals("2"))
            throw new ArgumentException("The first two books (id 1 and 2) are cannot be deleted.");
        var ac = ctx.Books.FirstOrDefaultAsync(b => b.Id == bookId);
        if (ac.Result == null)
            throw new KeyNotFoundException("Could not find the book with id: " + bookId + "");
        ctx.Books.Remove(ac.Result);
        var result = await ctx.SaveChangesAsync();
        return result > 0;
    }

    public async Task<IActionResult> DeleteAuthor(string authorId)
    {
        if (authorId.Equals("1") || authorId.Equals("2"))
            throw new ArgumentException("The first two authors (id 1 and 2) cannot be deleted.");
        var author = await ctx.Authors.FirstOrDefaultAsync(a => a.Id == authorId);
        if (author == null)
            throw new KeyNotFoundException("Could not find the author with id: " + authorId + "");
        if (await CheckIfBookExistsWithAuthor(authorId))
            throw new InvalidOperationException($"Cannot delete author with id: {authorId} because there are books associated with it.");
        ctx.Authors.Remove(author);
        var result = await ctx.SaveChangesAsync();
        if (result > 0)
            return new OkResult();
        return new BadRequestResult();
    }

    public async Task<IActionResult> DeleteGenre(string genreId)
    {
        if (genreId.Equals("1") || genreId.Equals("2"))
            throw new ArgumentException("The first two genres (id 1 and 2) cannot be deleted.");
        var genre = await ctx.Genres.FirstOrDefaultAsync(g => g.Id == genreId);
        if (genre == null)
            throw new KeyNotFoundException("Could not find the genre with id: " + genreId + "");
        if (await CheckIfBookExistsWithGenre(genreId))
            throw new InvalidOperationException("Cannot delete genre with id: " + genreId + " because there are books associated with it.");
        ctx.Genres.Remove(genre);
        var result = await ctx.SaveChangesAsync();
        if (result > 0)
            return new OkResult();
        return new BadRequestResult();
    }

    private async Task<bool> CheckIfBookExistsWithGenre(string genreId)
    {
        return await ctx.Books.AnyAsync(b => b.Genre.Id == genreId);
    }
    
    private async Task<bool> CheckIfBookExistsWithAuthor(string authorId)
    {
        return await ctx.Books.AnyAsync(b => b.Authors.Any(a => a.Id == authorId));
    }
}