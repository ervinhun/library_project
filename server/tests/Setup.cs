using api;
using Api;
using dataaccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Configuration;
using Testcontainers.PostgreSql;

namespace tests;

public class Startup
{
    public static void ConfigureServices(IServiceCollection services)
    {
        Program.ConfigurationService(services, new ConfigurationManager());
        services.RemoveAll(typeof(MyDbContext));
        services.AddScoped<MyDbContext>(factory =>
        {
            var postgreSqlContainer = new PostgreSqlBuilder().Build();
            postgreSqlContainer.StartAsync().GetAwaiter().GetResult();
            var connectionString = postgreSqlContainer.GetConnectionString();
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseNpgsql(connectionString)
                .Options;

            var ctx = new MyDbContext(options);
            ctx.Database.EnsureCreated();
            return ctx;
        });
        services.RemoveAll(typeof(ISeeder));
        services.AddScoped<ISeeder, Seeder>();
    }
}