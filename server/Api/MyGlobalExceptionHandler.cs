using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Api;

public class MyGlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<MyGlobalExceptionHandler> _logger;

    public MyGlobalExceptionHandler(ILogger<MyGlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken)
    {
        // Log the exception details server-side
        _logger.LogError(exception, "An unhandled exception occurred.");

        var problemDetails = new ProblemDetails
        {
            Title = "An unexpected error occurred."
        };
        await httpContext.Response.WriteAsJsonAsync(problemDetails);
        return true;
    }
}