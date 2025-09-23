using api.Etc;
using Api.Services;
using dataaccess;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Api;

namespace api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        ConfigurationService(builder.Services, builder.Configuration);

        var app = builder.Build();

        app.UseOpenApi();
        app.UseSwaggerUi(config => { config.Path = String.Empty; });
        app.UseCors("FrontendPolicy");
        app.MapControllers();
        app.GenerateApiClientsFromOpenApi("/../../client/src/models/generated-client.ts").GetAwaiter().GetResult();
        app.Run();
    }

    public static void ConfigurationService(IServiceCollection services, ConfigurationManager builderConfiguration)
    {
        services.AddOpenApiDocument(config =>
        {
            config.Title = "Library with Books and Authors";
            config.Version = "v1.0.0";
            config.Description = "Books with Genres, and Authors API for project.";
        });

        services.AddCors(options =>
        {
            options.AddPolicy("FrontendPolicy", policy =>
            {
                policy
                    .WithOrigins("http://localhost:5173", "https://client-quiet-surf-2481.fly.dev")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        services.AddSingleton<AppOptions>(provider =>
        {
            var configuration = provider.GetRequiredService<IConfiguration>();
            var appOptions = new AppOptions();
            configuration.GetSection(nameof(AppOptions)).Bind(appOptions);
            return appOptions;
        });
        
        services.AddDbContext<MyDbContext>(options =>
        {
            options.UseNpgsql(builderConfiguration.GetValue<string>("Db"));
        });
        
        services.AddControllers();
        services.AddScoped<ILibraryService, LibraryService>();
        //services.AddScoped<ISeeder, SeederWithRelations>();
        services.AddExceptionHandler<MyGlobalExceptionHandler>();
    }
}