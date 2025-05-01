using Microsoft.AspNetCore.Mvc;
using MyProject.Models;
using MyProject.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace MyProject.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private IUserService userService;
    public UserController(IUserService userService)
    {
        this.userService = userService;
    }
    [HttpGet]
    // [Route("[action]")]
    [Authorize(Policy = "Admin")]
    public ActionResult<IEnumerable<User>> Get()
    {
        return this.userService.Get();
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "User")]
    public ActionResult<User> Get(int id)
    {
        var user = this.userService.GetById(id);
        if (user == null)
            return NotFound();
        return user;
    }

    [HttpPost]
    [Authorize(Policy = "Admin")]
    public ActionResult Post(User newUser)
    {
        var newId = this.userService.Create(newUser);
        if (newId == -1)
        {
            return BadRequest();
        }
        return CreatedAtAction(nameof(Post), new { Id = newId });

    }

    [HttpPut("{id}")]
    [Authorize(Policy = "User")]
    public ActionResult Put(int id, User newUser)
    {
        if (this.userService.Update(id, newUser))
        {
            return NoContent();
        }
        return BadRequest();
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Admin")]
    public ActionResult Delete(int id)
    {
        if (this.userService.Delete(id))
            return Ok();
        return NotFound();
    }
}