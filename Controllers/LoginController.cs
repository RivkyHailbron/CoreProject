using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using MyProject.Interfaces;
using MyProject.Models;
using MyProject.Services;

namespace MyProject.Controllers;

[ApiController]
[Route("[controller]")]
public class LoginController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly JwtService _jwtService;

    public LoginController(IUserService userService, JwtService jwtService)
    {
        System.Console.WriteLine("LoginController constructor called");
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost]
    public IActionResult Login([FromBody] LoginRequest1 request)
    {
        User user = _userService.GetByEmail(request.Email);
        if (user == null)
        {
            return NotFound("User not found");
        }

        if (user.Password != request.Password)
        {
            return Unauthorized("Invalid password");
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new { token });
    }
}
public class LoginRequest1
{
    public string Email { get; set; }
    public string Password { get; set; }
}