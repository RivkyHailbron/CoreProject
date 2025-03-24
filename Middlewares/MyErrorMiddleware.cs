
namespace MyProject.Middlewares;

public class MyErrorMiddleware
{
    private RequestDelegate next;
    public MyErrorMiddleware(RequestDelegate next)
    {
        this.next = next;
    }
    public async Task Invoke(HttpContext c)
    {
        c.Items["success"] = false;
        bool success = false;
        try
        {
            await next(c);
            c.Items["success"] = true;
        }
        catch (ApplicationException e)
        {
            c.Response.StatusCode = 400;
            await c.Response.WriteAsync(e.Message);
        }
        catch (Exception e)
        {
            c.Response.StatusCode = 500;
            await c.Response.WriteAsync(("פנה לתמיכה הטכנית"));
            // שולחים מייל במקרה של שגיאה חמורה
            // var emailService = c.RequestServices.GetRequiredService<EmailService>();
            // await emailService.SendEmailAsync("rivky2712a@gmail.com", "שגיאה חמורה בשרת", e.ToString());
        }
    }
};

public static class MiddlewareExtension
{
    public static WebApplication UseMyErrorMiddleware(this WebApplication app)
    {
        app.UseMiddleware<MyErrorMiddleware>();
        return app;
    }
}