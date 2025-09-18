using api.Etc;
using Api.Services;
using dataaccess;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApiDocument(config =>
{
    config.Title = "Library with Books and Authors";
    config.Version = "v1.0.0";
    config.Description = "Books with Genres, and Authors API for project.";
});
builder.Services.AddControllers();
builder.Services.AddScoped<ILibraryService, LibraryService>();

builder.Services.AddDbContext<MyDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetValue<string>("Db"));
});

var app = builder.Build();

app.UseOpenApi();
app.UseSwaggerUi(config =>
{
    config.Path = String.Empty;
});
app.MapControllers();
app.GenerateApiClientsFromOpenApi("/../../client/src/models/generated-client.ts").GetAwaiter().GetResult();
await app.RunAsync();