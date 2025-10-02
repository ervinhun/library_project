using Api.Dtos;
using Api.Services;
using dataaccess;
using Microsoft.EntityFrameworkCore;

namespace tests
{
    public class LibraryServiceTests
    {
        private MyDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new MyDbContext(options);
        }

        [Fact]
        public async Task GetBookById_ShouldReturnBook_WhenBookExists()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var book = new Book { Id = "1", Title = "Test Book" };
            context.Books.Add(book);
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetBookById("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("1", result.Id);
            Assert.Equal("Test Book", result.Title);
        }

        [Fact]
        public async Task GetBookById_ShouldThrowException_WhenBookDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetBookById("1"));
        }
        
        [Fact]
        public async Task AddBook_ShouldAddBookToDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var bookCreateRequestDto = new BookCreateRequestDto
            {
                Title = "New Book",
                Pages = 100,
                Genreid = "111"
            };

            // Act
            var result = await service.AddBook(bookCreateRequestDto);

            // Assert
            var bookInDb = await context.Books.FindAsync(result.Id);
            Assert.NotNull(bookInDb);
            Assert.Equal("New Book", bookInDb.Title);
            Assert.Equal(100, bookInDb.Pages);
            Assert.Equal("111", bookInDb.Genreid);
        }

        [Fact]
        public async Task GetAuthorById_ShouldReturnAuthor_WhenAuthorExists()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var author = new Author { Id = "1", Name = "Test Author" };
            context.Authors.Add(author);
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAuthorById("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("1", result.Id);
            Assert.Equal("Test Author", result.Name);
        }

        [Fact]
        public async Task GetAuthorById_ShouldThrowException_WhenAuthorDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetAuthorById("1"));
        }

        [Fact]
        public async Task GetGenreById_ShouldReturnGenre_WhenGenreExists()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var genre = new Genre { Id = "1", Name = "Test Genre" };
            context.Genres.Add(genre);
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetGenreById("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("1", result.Id);
            Assert.Equal("Test Genre", result.Name);
        }

        [Fact]
        public async Task GetGenreById_ShouldThrowException_WhenGenreDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetGenreById("1"));
        }

        [Fact]
        public async Task GetAllBooks_ShouldReturnAllBooks_WhenBooksExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            context.Books.Add(new Book { Id = "1", Title = "Test Book 1" });
            context.Books.Add(new Book { Id = "2", Title = "Test Book 2" });
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllBooks();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("1", result[0].Id);
            Assert.Equal("Test Book 1", result[0].Title);
            Assert.Equal("2", result[1].Id);
            Assert.Equal("Test Book 2", result[1].Title);
        }

        [Fact]
        public async Task GetAllBooks_ShouldThrowException_WhenNoBooksExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetAllBooks());
        }

        [Fact]
        public async Task GetAllAuthors_ShouldReturnAllAuthors_WhenAuthorsExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            context.Authors.Add(new Author { Id = "1", Name = "Test Author 1" });
            context.Authors.Add(new Author { Id = "2", Name = "Test Author 2" });
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllAuthors();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetAllAuthors_ShouldThrowException_WhenNoAuthorsExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetAllAuthors());
        }

        [Fact]
        public async Task GetAllGenres_ShouldReturnAllGenres_WhenGenresExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            context.Genres.Add(new Genre { Id = "1", Name = "Test Genre 1" });
            context.Genres.Add(new Genre { Id = "2", Name = "Test Genre 2" });
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllGenres();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("1", result[0].Id);
            Assert.Equal("Test Genre 1", result[0].Name);
            Assert.Equal("2", result[1].Id);
            Assert.Equal("Test Genre 2", result[1].Name);       
        }

        [Fact]
        public async Task GetAllGenres_ShouldThrowException_WhenNoGenresExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetAllGenres());
        }

        [Fact]
        public async Task GetAllBooksByGenre_ShouldReturnBooks_WhenBooksWithGenreExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var genre = new Genre { Id = "1", Name = "Test Genre" };
            context.Genres.Add(genre);
            context.Books.Add(new Book { Id = "1", Title = "Test Book 1", Genreid = "1" });
            context.Books.Add(new Book { Id = "2", Title = "Test Book 2", Genreid = "1" });
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllBooksByGenre("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetAllBooksByGenre_ShouldThrowException_WhenNoBooksWithGenreExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetAllBooksByGenre("1"));
        }

        [Fact]
        public async Task GetAllBooksByTitle_ShouldReturnBooks_WhenBooksWithTitleExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            context.Books.Add(new Book { Id = "1", Title = "Test Book 1" });
            context.Books.Add(new Book { Id = "2", Title = "Test Book 2" });
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllBooksByTitle("Test Book");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetAllBooksByTitle_ShouldThrowException_WhenNoBooksWithTitleExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetAllBooksByTitle("Test Book"));
        }

        [Fact]
        public async Task GetAllBooksByAuthor_ShouldReturnBooks_WhenBooksWithAuthorExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var author = new Author { Id = "1", Name = "Test Author" };
            context.Authors.Add(author);
            context.Books.Add(new Book { Id = "1", Title = "Test Book 1", Authors = new List<Author> { author } });
            context.Books.Add(new Book { Id = "2", Title = "Test Book 2", Authors = new List<Author> { author } });
            await context.SaveChangesAsync();

            // Act
            var result = await service.GetAllBooksByAuthor("1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetAllBooksByAuthor_ShouldThrowException_WhenNoBooksWithAuthorExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GetAllBooksByAuthor("1"));
        }

        [Fact]
        public async Task AddAuthor_ShouldAddAuthorToDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var authorName = "New Author";

            // Act
            var result = await service.AddAuthor(authorName);

            // Assert
            var authorInDb = await context.Authors.FindAsync(result.Id);
            Assert.NotNull(authorInDb);
            Assert.Equal("New Author", authorInDb.Name);
        }

        [Fact]
        public async Task AddGenre_ShouldAddGenreToDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var genreName = "New Genre";

            // Act
            var result = await service.AddGenre(genreName);

            // Assert
            var genreInDb = await context.Genres.FindAsync(result.Id);
            Assert.NotNull(genreInDb);
            Assert.Equal("New Genre", genreInDb.Name);
        }

        [Fact]
        public async Task UpdateBook_ShouldUpdateBookInDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var book = new Book { Id = "1", Title = "Test Book" };
            context.Books.Add(book);
            await context.SaveChangesAsync();
            var bookUpdateRequestDto = new BookUpdateRequestDto
            {
                Id = "1",
                Title = "Updated Book",
                Pages = 200,
                Genreid = "2",
                Authors = new List<AuthorResponseDto>()
            };

            // Act
            var result = await service.UpdateBook("1", bookUpdateRequestDto);

            // Assert
            var bookInDb = await context.Books.FindAsync("1");
            Assert.NotNull(bookInDb);
            Assert.Equal("Updated Book", bookInDb.Title);
            Assert.Equal(200, bookInDb.Pages);
            Assert.Equal("2", bookInDb.Genreid);
        }

        [Fact]
        public async Task UpdateBook_ShouldThrowException_WhenBookDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var bookUpdateRequestDto = new BookUpdateRequestDto
            {
                Id = "1",
                Title = "Updated Book",
                Pages = 200,
                Genreid = "2",
                Authors = new List<AuthorResponseDto>()
            };

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.UpdateBook("1", bookUpdateRequestDto));
        }

        [Fact]
        public async Task UpdateAuthor_ShouldUpdateAuthorInDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var author = new Author { Id = "3", Name = "Test Author" };
            context.Authors.Add(author);
            await context.SaveChangesAsync();
            var authorRequestDto = new AuthorRequestDto
            {
                Name = "Updated Author"
            };

            // Act
            var result = await service.UpdateAuthor("3", authorRequestDto);

            // Assert
            var authorInDb = await context.Authors.FindAsync("3");
            Assert.NotNull(authorInDb);
            Assert.Equal("Updated Author", authorInDb.Name);
        }

        [Fact]
        public async Task UpdateAuthor_ShouldThrowException_WhenAuthorDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var authorRequestDto = new AuthorRequestDto
            {
                Name = "Updated Author"
            };

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.UpdateAuthor("3", authorRequestDto));
        }

        [Fact]
        public async Task UpdateGenre_ShouldUpdateGenreInDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var genre = new Genre { Id = "3", Name = "Test Genre" };
            context.Genres.Add(genre);
            await context.SaveChangesAsync();
            var genreRequestDto = new GenreRequestDto
            {
                Name = "Updated Genre"
            };

            // Act
            var result = await service.UpdateGenre("3", genreRequestDto);

            // Assert
            var genreInDb = await context.Genres.FindAsync("3");
            Assert.NotNull(genreInDb);
            Assert.Equal("Updated Genre", genreInDb.Name);
        }

        [Fact]
        public async Task UpdateGenre_ShouldThrowException_WhenGenreDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var genreRequestDto = new GenreRequestDto
            {
                Name = "Updated Genre"
            };

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.UpdateGenre("3", genreRequestDto));
        }

        [Fact]
        public async Task DeleteBook_ShouldDeleteBookFromDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var book = new Book { Id = "3", Title = "Test Book" };
            context.Books.Add(book);
            await context.SaveChangesAsync();

            // Act
            var result = await service.DeleteBook("3");

            // Assert
            Assert.True(result);
            var bookInDb = await context.Books.FindAsync("3");
            Assert.Null(bookInDb);
        }

        [Fact]
        public async Task DeleteBook_ShouldThrowException_WhenBookDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.DeleteBook("3"));
        }

        [Fact]
        public async Task DeleteAuthor_ShouldDeleteAuthorFromDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var author = new Author { Id = "3", Name = "Test Author" };
            context.Authors.Add(author);
            await context.SaveChangesAsync();

            // Act
            var result = await service.DeleteAuthor("3");

            // Assert
            Assert.True(result);
            var authorInDb = await context.Authors.FindAsync("3");
            Assert.Null(authorInDb);
        }

        [Fact]
        public async Task DeleteAuthor_ShouldThrowException_WhenAuthorDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.DeleteAuthor("3"));
        }

        [Fact]
        public async Task DeleteGenre_ShouldDeleteGenreFromDatabase()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);
            var genre = new Genre { Id = "3", Name = "Test Genre" };
            context.Genres.Add(genre);
            await context.SaveChangesAsync();

            // Act
            var result = await service.DeleteGenre("3");

            // Assert
            Assert.True(result);
            var genreInDb = await context.Genres.FindAsync("3");
            Assert.Null(genreInDb);
        }

        [Fact]
        public async Task DeleteGenre_ShouldThrowException_WhenGenreDoesNotExist()
        {
            // Arrange
            var context = CreateContext();
            var service = new LibraryService(context);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.DeleteGenre("3"));
        }
    }
}