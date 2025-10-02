using System.ComponentModel.DataAnnotations;
using Api.Dtos;
using dataaccess;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class LibraryService(MyDbContext ctx) : ILibraryService
{
    private static readonly String NoBooksFoundMessage = "Could not find any books";
    public async Task<BookResponseDto> GetBookById(string bookId)
    {
        var book = await ctx.Books
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .FirstOrDefaultAsync(b => b.Id == bookId);
        
        if (book == null)
            throw new KeyNotFoundException("Could not find book with id: " + bookId + "");
        return new BookResponseDto(book);
    }

    public async Task<AuthorResponseDto> GetAuthorById(string authorId)
    {
        var author = await ctx.Authors.FirstOrDefaultAsync(a => a.Id == authorId);
        if (author == null)
            throw new KeyNotFoundException("Could not find author with id: " + authorId + "");
        return new AuthorResponseDto(author);
    }

    public async Task<GenreResponseDto> GetGenreById(string genreId)
    {
        var genre = await ctx.Genres.FirstOrDefaultAsync(g => g.Id == genreId);
        if (genre == null)
            throw new KeyNotFoundException("Could not find genre with id: " + genreId + "");
        return new GenreResponseDto(genre);
    }

    public async Task<List<BookResponseDto>> GetAllBooks()
    {
        List<BookResponseDto> books = new List<BookResponseDto>();
        var booksDbEntities = 
            await ctx.Books
                .Include(b => b.Genre)
                .Include(b => b.Authors)
                .ToListAsync();
        foreach (var book in booksDbEntities)
        {
            books.Add(new BookResponseDto(book));
            Console.WriteLine(book.Title);
        }
        if (books.Count == 0)
            throw new KeyNotFoundException(NoBooksFoundMessage);
        return  books;
    }

    public async Task<List<AuthorResponseDto>> GetAllAuthors()
    {
        var authors = await ctx.Authors.ToListAsync();
        List<AuthorResponseDto> authorDtos = new List<AuthorResponseDto>();
        if (authors.Count == 0)
            throw new KeyNotFoundException("Could not find any authors");
        foreach (var author in authors)
        {
            authorDtos.Add(new AuthorResponseDto(author));
        }
        return authorDtos;
        
    }

    public async Task<List<GenreResponseDto>> GetAllGenres()
    {
        List<GenreResponseDto> genresDto = new List<GenreResponseDto>();
        var genres = await ctx.Genres.ToListAsync();
        if (genres.Count == 0)
            throw new KeyNotFoundException("Could not find any genres");
        foreach (var genre in genres)
        {
            genresDto.Add(new GenreResponseDto(genre));
        }
        return genresDto;
    }

    public async Task<List<BookResponseDto>> GetAllBooksByGenre(string genreId)
    {
        var books = await ctx.Books.Where(b => b.Genreid == genreId)
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .ToListAsync();
        if (books.Count == 0)
            throw new KeyNotFoundException(NoBooksFoundMessage);
        var booksDto = books.Select(b => new BookResponseDto(b)).ToList();
        return booksDto;
        
    }

    public async Task<List<BookResponseDto>> GetAllBooksByTitle(string title)
    {
        var books = await ctx.Books.Where(b => b.Title.Contains(title))
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .ToListAsync();
        if (books.Count == 0)
            throw new KeyNotFoundException(NoBooksFoundMessage);
        var booksDto = books.Select(b => new BookResponseDto(b)).ToList();
        return booksDto;
    }

    public async Task<List<BookResponseDto>> GetAllBooksByAuthor(string authorId)
    {
        var books = await ctx.Books
            .Where(b => b.Authors.Any(a => a.Id == authorId))
            .Include(b => b.Genre)
            .Include(b => b.Authors)
            .ToListAsync();
        if (books.Count == 0)
            throw new KeyNotFoundException(NoBooksFoundMessage);
        var booksDto = books.Select(b => new BookResponseDto(b)).ToList();
        return booksDto;
    }

    public async Task<BookResponseDto> AddBook(BookCreateRequestDto bookResponseDto)
    {
        Validator.ValidateObject(bookResponseDto, new ValidationContext(bookResponseDto), true);
        var newBook = new Book
        {
            Id = Guid.NewGuid().ToString(),
            Title = bookResponseDto.Title,
            Pages = bookResponseDto.Pages,
            Createdat = DateTime.Now.ToUniversalTime(),
            Genreid = bookResponseDto.Genreid
        };
        ctx.Books.Add(newBook);
        var result = await ctx.SaveChangesAsync();
        return result == 0 ? throw new InvalidOperationException("Could not add book") : new BookResponseDto(newBook);
    }

    public async Task<AuthorResponseDto> AddAuthor(string authorName)
    {
        var author = new Author()
        {
            Id = Guid.NewGuid().ToString(),
            Name = authorName,
            Createdat = DateTime.Now.ToUniversalTime()
        };
        Validator.ValidateObject(author, new ValidationContext(author), true);
        
        await ctx.Authors.AddAsync(author);
        await ctx.SaveChangesAsync();
        return new AuthorResponseDto(author);
    }

    public async Task<GenreResponseDto> AddGenre(string genreName)
    {
        var genre = new Genre()
        {
            Id = Guid.NewGuid().ToString(),
            Name = genreName,
            Createdat = DateTime.Now.ToUniversalTime()
        };
        Validator.ValidateObject(genre, new ValidationContext(genre), true);
        
        await ctx.Genres.AddAsync(genre);
        await ctx.SaveChangesAsync();
        return new GenreResponseDto(genre);
    }

    public async Task<BookResponseDto> UpdateBook(string bookId, BookUpdateRequestDto bookResponseDto)
    {
        Validator.ValidateObject(bookResponseDto, new ValidationContext(bookResponseDto), true);
        var existingBook = await ctx.Books
            .Include(b => b.Authors) // Make sure authors are loaded
            .FirstOrDefaultAsync(b => b.Id == bookId);

        if (existingBook == null)
            throw new KeyNotFoundException($"Could not find book with id: {bookId}");

        existingBook.Title = bookResponseDto.Title;
        existingBook.Pages = bookResponseDto.Pages;
        existingBook.Genreid = bookResponseDto.Genreid;

        // Track existing author IDs
        var existingAuthorIds = existingBook.Authors.Select(a => a.Id).ToList();
        var newAuthorIds = bookResponseDto.Authors.Select(a => a.Id).ToList();

        // Remove authors no longer present
        var toRemove = existingBook.Authors.Where(a => !newAuthorIds.Contains(a.Id)).ToList();
        foreach (var a in toRemove)
            existingBook.Authors.Remove(a);

        // Add new authors if not already associated
        foreach (var a in bookResponseDto.Authors)
        {
            if (!existingAuthorIds.Contains(a.Id))
            {
                var authorEntity = await ctx.Authors.FindAsync(a.Id);
                if (authorEntity != null)
                    existingBook.Authors.Add(authorEntity);
            }
        }

        await ctx.SaveChangesAsync();
        return new BookResponseDto(existingBook);
    }


    public async Task<AuthorResponseDto> UpdateAuthor(string authorId, AuthorRequestDto authorResponseDto)
    {
        if (authorId.Equals("1") || authorId.Equals("2"))
            throw new ArgumentException("The first two authors (id 1 and 2) cannot be updated.");
        Validator.ValidateObject(authorResponseDto, new ValidationContext(authorResponseDto), true);
        var existingAuthor = await ctx.Authors.FirstOrDefaultAsync(a => a.Id == authorId);
        if (existingAuthor == null)
            throw new KeyNotFoundException("Could not find author with id: " + authorId + "");
        existingAuthor.Name = authorResponseDto.Name;
        var result = await ctx.SaveChangesAsync();
        return result == 0 ? throw new InvalidOperationException("Could not update author with id: " + authorId + "") : new AuthorResponseDto(existingAuthor);
    }

    public async Task<GenreResponseDto> UpdateGenre(string genreId, GenreRequestDto genreResponseDto)
    {
        var genre = await ctx.Genres.FirstOrDefaultAsync(g => g.Id == genreId);
        if (genre == null)
            throw new KeyNotFoundException("Could not find genre with id: " + genreId + "");
        
        genre.Name = genreResponseDto.Name;
        var result = await ctx.SaveChangesAsync();
        if (result == 0)
            throw new InvalidOperationException("Could not update genre with id: " + genreId + "");
        return new GenreResponseDto(genre);
    }

    public async Task<bool> DeleteBook(string bookId)
    {
        if (bookId.Equals("1") || bookId.Equals("2"))
            throw new ArgumentException(FirstTwoCannotBeDeleted("books"));
        var existingBook = await ctx.Books.FirstOrDefaultAsync(b => b.Id == bookId);
        if (existingBook == null)
            throw new KeyNotFoundException(CannotFind("book", bookId));
        ctx.Books.Remove(existingBook);
        var result = await ctx.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteAuthor(string authorId)
    {
        if (authorId.Equals("1") || authorId.Equals("2"))
            throw new ArgumentException(FirstTwoCannotBeDeleted("authors"));
        var author = await ctx.Authors.FirstOrDefaultAsync(a => a.Id == authorId);
        if (author == null)
            throw new KeyNotFoundException(CannotFind("author", authorId));
        if (await CheckIfBookExistsWithAuthor(authorId))
            throw new InvalidOperationException($"Cannot delete author with id: {authorId} because there are books associated with it.");
        ctx.Authors.Remove(author);
        var result = await ctx.SaveChangesAsync();
        return result > 0;
    }

    public async Task<bool> DeleteGenre(string genreId)
    {
        if (genreId.Equals("1") || genreId.Equals("2"))
            throw new ArgumentException(FirstTwoCannotBeDeleted("genres"));
        var genre = await ctx.Genres.FirstOrDefaultAsync(g => g.Id == genreId);
        if (genre == null)
            throw new KeyNotFoundException(CannotFind("genre", genreId));
        if (await CheckIfBookExistsWithGenre(genreId))
            throw new InvalidOperationException("Cannot delete genre with id: " + genreId + " because there are books associated with it.");
        ctx.Genres.Remove(genre);
        var result = await ctx.SaveChangesAsync();
        return result > 0;
    }

    private async Task<bool> CheckIfBookExistsWithGenre(string genreId)
    {
        return await ctx.Books.AnyAsync(b => b.Genre != null && b.Genre.Id == genreId);
    }
    
    private async Task<bool> CheckIfBookExistsWithAuthor(string authorId)
    {
        return await ctx.Books.AnyAsync(b => b.Authors.Any(a => a.Id == authorId));
    }

    private String FirstTwoCannotBeDeleted(String what)
    {
        return $"The first two {what} (id 1 and 2) cannot be deleted.";
    }

    private String CannotFind(String what, String id)
    {
        return $"Could not find {what} with id: {id}";
    }
}