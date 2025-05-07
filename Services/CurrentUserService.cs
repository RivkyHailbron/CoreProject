using System.Security.Claims;
using MyProject.Interfaces;

namespace MyProject.Services;

public class CurrentUserService : ICurrentUserService
{
    public string UserId { get; }
    public string Role { get; }
    public string Email { get; }
    public string Name { get; }
    public bool IsAuthenticated { get; }
    public bool IsAdmin { get; }
    public CurrentUserService(IHttpContextAccessor httpContextAccessor){
        var user = httpContextAccessor.HttpContext?.User;
        if(user == null){
            IsAuthenticated = false;
            IsAdmin = false;
            return;
        }
        UserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Role = user.FindFirst(ClaimTypes.Role)?.Value;
        Email = user.FindFirst(ClaimTypes.Email)?.Value;
        Name = user.FindFirst(ClaimTypes.Name)?.Value;
        IsAuthenticated = user.Identity.IsAuthenticated;
        IsAdmin = Role == "Admin";
    }
    
}


