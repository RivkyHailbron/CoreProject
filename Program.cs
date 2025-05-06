
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyProject.Interfaces;
using MyProject.Middlewares;
using MyProject.Services;

var builder = WebApplication.CreateBuilder(args);
Console.WriteLine($"Content root path: {builder.Environment.ContentRootPath}");

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddBookConst();
builder.Services.AddUserConst();
builder.Services.AddLoginConst();


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//   builder.Services.AddOpenApi();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthorization(cfg =>
{
    cfg.AddPolicy("Admin", policy => policy.RequireClaim(ClaimTypes.Role, "Admin"));
    cfg.AddPolicy("User", policy => policy.RequireClaim(ClaimTypes.Role, "User", "Admin"));
});
// // הוספת אימות JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(cfg =>
{
    cfg.RequireHttpsMetadata = false;
    cfg.TokenValidationParameters = new JwtService(builder.Configuration).GetTokenValidationParameters();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

// app.UseMyLogMiddleware();
// app.UseMyErrorMiddleware();
app.UseRouting();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
