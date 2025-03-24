using System.Diagnostics;

namespace MyProject.Middlewares;

public class MyLogMiddleware
{
    private RequestDelegate next;
    public MyLogMiddleware(RequestDelegate next)
    {
        this.next = next;
    }
    public async Task Invoke(HttpContext c)
    {
        await c.Response.WriteAsync($"My Log Middleware start\n");
        await next(c);
        Console.WriteLine($"{c.Request.Path}.{c.Request.Method}"
         + $" Success: {c.Items["success"]}"
            + $" User: {c.User?.FindFirst("userId")?.Value ?? "unknown"}");
        await c.Response.WriteAsync("My Log Middleware end\n");
    }
};

public static class MyLogMiddlewareExstention{
    public static void UseMyLogMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<MyLogMiddleware>();
    }
};