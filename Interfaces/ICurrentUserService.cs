using Microsoft.AspNetCore.Mvc;
using MyProject.Models;

namespace MyProject.Interfaces;

public interface ICurrentUserService
{
    string UserId { get; }
    string Role { get; }
    string Name { get; }
    string Email { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
}
