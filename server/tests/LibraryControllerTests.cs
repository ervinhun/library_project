using api.Controller;
using Api.Dtos;
using Api.Services;
using dataaccess;
using Microsoft.AspNetCore.Mvc;

namespace tests
{
    public class LibraryControllerTests
    {
        private readonly LibraryController _controller;
        private readonly ILibraryService _service;

        public LibraryControllerTests()
        {
            _service = new LibraryServiceMock();
            _controller = new LibraryController(_service);
        }

        [Fact]
        public async Task GetBookById_ShouldReturnOkResult_WithBook()
        {
            // Arrange
            var bookId = "A1";
            var bookTitle = "Test Book";
            var genreId = "1";
            var pages = 100;

            // Act
            var result = await _controller.GetBookById(bookId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var book = Assert.IsType<BookResponseDto>(okResult.Value);
            Assert.Equal(bookId, book.Id);
            Assert.Equal(bookTitle, book.Title);
            Assert.Equal(genreId, book.Genreid);
            Assert.Equal(pages, book.Pages);
        }
        
        [Fact]
        public async Task AddBook_ShouldReturnOkResult_WithBook()
        {
            // Arrange
            var bookCreateRequestDto = new BookCreateRequestDto
            {
                Title = "New Book",
                Pages = 100,
                Genreid = "1"
            };

            // Act
            var result = await _controller.AddBook(bookCreateRequestDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var book = Assert.IsType<BookResponseDto>(okResult.Value);
            var bookInDb = await _service.GetBookById(book.Id);
            Assert.NotNull(book);
            Assert.Equal(bookCreateRequestDto.Title, book.Title);
            Assert.Equal(bookCreateRequestDto.Pages, book.Pages);
            Assert.Equal(bookCreateRequestDto.Genreid, book.Genreid);
            Assert.NotEqual("1", book.Id);
            Assert.True(Guid.TryParse(book.Id, out _));
            Assert.Equal(bookCreateRequestDto.Title, bookInDb.Title);
            Assert.Equal(bookCreateRequestDto.Pages, bookInDb.Pages);
            Assert.Equal(bookCreateRequestDto.Genreid, bookInDb.Genreid);
        }

        [Fact]
        public async Task AddBook_ShouldFailFor_PageNumberSmallerThan1()
        {
            //Arrange
            var bookCreateRequestDto = new BookCreateRequestDto
            {
                Title = "New Book",
                Pages = 0,
                Genreid = "1"
            };
            _controller.ModelState.AddModelError("Pages", "A book must have at least 1 page.");
            
            //Act
            var result = await _controller.AddBook(bookCreateRequestDto);
            
            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errors = Assert.IsType<List<string>>(badRequestResult.Value);
            Assert.Contains("A book must have at least 1 page.", errors);
        }
        
        [Fact]
        public async Task AddBook_ShouldFailFor_TitleShorterThan3Characters()
        {
            //Arrange
            var bookCreateRequestDto = new BookCreateRequestDto
            {
                Title = "Ne",
                Pages = 100,
                Genreid = "1"
            };
            _controller.ModelState.AddModelError("Title", "A book must have a title, at least 3 characters long.");
            
            //Act
            var result = await _controller.AddBook(bookCreateRequestDto);
            
            //Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            var errors = Assert.IsType<List<string>>(badRequestResult.Value);
            Assert.Contains("A book must have a title, at least 3 characters long.", errors);
        }

        [Fact]
        public async Task GetAllBooks_ShouldReturnOkResult()
        {
            var result = await _controller.GetAllBooks();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<BookResponseDto>>(okResult.Value);
            Assert.NotEmpty(books);
            Assert.Equal(4, books.Count);
        }
        
        [Fact]
        public async Task GetAllAuthors_ShouldReturnOkResult()
        {
            var result = await _controller.GetAllAuthors();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var authors = Assert.IsType<List<AuthorResponseDto>>(okResult.Value);
            Assert.NotEmpty(authors);
            Assert.Equal(3, authors.Count);
            Assert.Equal("Great author", authors[0].Name);
            Assert.Equal("Great author 2", authors[1].Name);
            Assert.Equal("Great author 3", authors[2].Name);
        }
        
        [Fact]
        public async Task GetAllGenres_ShouldReturnOkResult()
        {
            var result = await _controller.GetAllGenres();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var genres = Assert.IsType<List<GenreResponseDto>>(okResult.Value);
            Assert.NotEmpty(genres);
            Assert.Equal(3, genres.Count);
            Assert.Equal("Test genre", genres[0].Name);
            Assert.Equal("Test genre 2", genres[1].Name);
        }
        
        [Fact]
        public async Task GetAllBooksByGenre_ShouldReturnOkResult()
        {
            var genreId = "1";
            var result = await _controller.GetAllBooksByGenre(genreId);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<BookResponseDto>>(okResult.Value);
            Assert.NotEmpty(books);
            Assert.Equal(2, books.Count);
            Assert.Equal("Test Book", books[0].Title);
        }
        
        [Fact]
        public async Task GetAllBooksByTitle_ShouldReturnOkResult()
        {
            var title = "Test";
            var result = await _controller.GetAllBooksByTitle(title);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<BookResponseDto>>(okResult.Value);
            Assert.NotEmpty(books);
            Assert.Equal(4, books.Count);
            Assert.Equal("Test Book", books[0].Title);
        }

        [Fact]
        public async Task UpdateBook_ShouldReturnOkResult_WithBook()
        {
            var bookId = "A1";
            var bookTitle = "Updated Book";
            var genreId = "1";
            var pages = 101;
            var bookUpdateRequestDto = new BookUpdateRequestDto
            {
                Id = bookId,
                Title = bookTitle,
                Pages = pages,
                Genreid = genreId
            };
            var result = await _controller.UpdateBook(bookUpdateRequestDto);
            var okResult = Assert.IsType<OkResult>(result.Result);

            var bookInDb = await _service.GetBookById(bookId);
            Assert.NotNull(bookInDb);
            Assert.Equal(bookTitle, bookInDb.Title);
            Assert.Equal(pages, bookInDb.Pages);
            Assert.Equal(genreId, bookInDb.Genreid);
        }
        
        [Fact]
        public async Task UpdateBook_ShouldFail_WhenIdDoesNotExists()
        {
            var bookId = "INVALID_ID";
            var bookTitle = "Updated Book";
            var genreId = "1";
            var pages = 101;
            var bookUpdateRequestDto = new BookUpdateRequestDto
            {
                Id = bookId,
                Title = bookTitle,
                Pages = pages,
                Genreid = genreId
            };
            
            var result = await _controller.UpdateBook(bookUpdateRequestDto);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            var bookInDb = await _service.GetBookById(bookId);
            Assert.Null(bookInDb);
        }

    }
    
    

    public class LibraryServiceMock : ILibraryService
    {
        private readonly List<Book> _books;

        public LibraryServiceMock()
        {
            _books = new List<Book>
            {
                new Book { Id = "A1", Title = "Test Book", Pages = 100, Genreid = "1" },
                new Book { Id = "2", Title = "Test Book 2", Pages = 200, Genreid = "2" },
                new Book { Id = "3", Title = "Test Book 3", Pages = 300, Genreid = "3" },
                new Book { Id = "4", Title = "Test Book 4", Pages = 400, Genreid = "1" },
            };
        }
        public Task<BookResponseDto> GetBookById(string bookId)
        {
            var book = _books.FirstOrDefault(b => b.Id == bookId);
            return Task.FromResult(book != null ? new BookResponseDto(book) : null);
        }

        public Task<AuthorResponseDto> GetAuthorById(string authorId)
        {
            return Task.FromResult(new AuthorResponseDto(new Author { Id = "1", Name = "Great author" }));
        }

        public Task<GenreResponseDto> GetGenreById(string genreId)
        {
            return Task.FromResult(new GenreResponseDto(new Genre { Id = "1", Name = "Test genre" }));
        }

        public Task<List<BookResponseDto>> GetAllBooks()
        {
            var books = _books.Select(b => new BookResponseDto(b)).ToList();
            return Task.FromResult(books);
        }

        public Task<List<AuthorResponseDto>> GetAllAuthors()
        {
            var authors = new List<AuthorResponseDto>();
            authors.Add(new AuthorResponseDto(new Author { Id = "1", Name = "Great author" }));
            authors.Add(new AuthorResponseDto(new Author { Id = "2", Name = "Great author 2" }));
            authors.Add(new AuthorResponseDto(new Author { Id = "3", Name = "Great author 3" }));
            return Task.FromResult(authors);
        }

        public Task<List<GenreResponseDto>> GetAllGenres()
        {
            var genres = new List<GenreResponseDto>();
            genres.Add(new GenreResponseDto(new Genre { Id = "1", Name = "Test genre" }));
            genres.Add(new GenreResponseDto(new Genre { Id = "2", Name = "Test genre 2" }));
            genres.Add(new GenreResponseDto(new Genre { Id = "3", Name = "Test genre 3" }));
            return Task.FromResult(genres);
        }

        public Task<List<BookResponseDto>> GetAllBooksByGenre(string genreId)
        {
            var books = _books.Where(b => b.Genreid == genreId).Select(b => new BookResponseDto(b)).ToList();
            return Task.FromResult(books);
        }



        public Task<List<BookResponseDto>> GetAllBooksByTitle(string title)
        {
            var books = _books.Where(b => b.Title.Contains(title, StringComparison.OrdinalIgnoreCase))
                .Select(b => new BookResponseDto(b)).ToList();
            return Task.FromResult(books);
        }

        public Task<List<BookResponseDto>> GetAllBooksByAuthor(string authorId)
        {
            var auth = new AuthorResponseDto(new Author { Id = "1", Name = "Great author" });
            var allBooks = _books.Select(b => new BookResponseDto(b)).ToList();
            for (var i = 0; i < allBooks.Count; i++)
            {
                if (i % 2 == 0)
                {
                    allBooks[i].Authors.Add(auth);
                    Console.WriteLine("ADding author to book " + allBooks[i].Title);
                }
            }

            var books = _books.Where(b => b.Authors.Any(a => a.Id == authorId))
                .Select(b => new BookResponseDto(b)).ToList();
            return Task.FromResult(books);
        }

        public Task<BookResponseDto> AddBook(BookCreateRequestDto bookCreateRequestDto)
        {
            var book = new Book
            {
                Id = Guid.NewGuid().ToString(),
                Title = bookCreateRequestDto.Title,
                Pages = bookCreateRequestDto.Pages,
                Genreid = bookCreateRequestDto.Genreid,
                Authors = new List<Author>()
            };
            _books.Add(book);
            return Task.FromResult(new BookResponseDto(book));
        }

        public Task<AuthorResponseDto> AddAuthor(string authorName)
        {
            var Author = new AuthorResponseDto(new Author { Id = Guid.NewGuid().ToString(), Name = authorName });
            return Task.FromResult(Author);
        }

        public Task<GenreResponseDto> AddGenre(string genreName)
        {
            var Genre = new GenreResponseDto(new Genre { Id = Guid.NewGuid().ToString(), Name = genreName });
            return Task.FromResult(Genre);
        }

        public Task<BookResponseDto> UpdateBook(string bookId, BookUpdateRequestDto bookResponseDto)
        {
            var book = _books.FirstOrDefault(b => b.Id == bookId);
            if (book == null)
                throw new KeyNotFoundException($"Could not find book with id: {bookId}");
            book.Title = bookResponseDto.Title;
            book.Pages = bookResponseDto.Pages;
            book.Genreid = bookResponseDto.Genreid;
            return Task.FromResult(new BookResponseDto(book));
        }

        public Task<AuthorResponseDto> UpdateAuthor(string authorId, AuthorRequestDto authorResponseDto)
        {
            throw new NotImplementedException();
        }

        public Task<GenreResponseDto> UpdateGenre(string genreId, GenreRequestDto genreResponseDto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteBook(string bookId)
        {
            _books.Add(new Book { Id = "Del", Title = "Deleting Book", Pages = 1100, Genreid = "1" });
            var bookToRemove = _books.FirstOrDefault(b => b.Id == bookId);
            if (bookToRemove != null)
            {
                _books.Remove(bookToRemove);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public Task<bool> DeleteAuthor(string authorId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteGenre(string genreId)
        {
            throw new NotImplementedException();
        }
    }
}
