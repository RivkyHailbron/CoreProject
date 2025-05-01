using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.Interfaces;
using MyProject.Models;

namespace MyProject.Controllers;

[ApiController]
[Route("[controller]")]
public class BookController : ControllerBase
{
    private IBookService bookService;
    private ICurrentUserService currentUserService;
    public BookController(IBookService bookService, ICurrentUserService currentUserService)
    {
        this.bookService = bookService;
        this.currentUserService = currentUserService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Book>> Get()
    {
        if (!currentUserService.IsAuthenticated)
            return Unauthorized();
        List<Book> books = this.bookService.Get();
        if (currentUserService.IsAdmin)
            return Ok(books);
        return books.Where(b => b.Id.ToString() == currentUserService.UserId).ToList();
    }

    [HttpGet("{id}")]

    [Authorize(Policy = "User")]
    public ActionResult<Book> Get(int id)
    {
        var book = this.bookService.Get(id);
        if (book == null)
            return NotFound();
        return book;
    }

    [HttpPost]
    [Authorize(Policy = "user")]
    public ActionResult Post(Book newBook)
    {
        var newId = this.bookService.Create(newBook);
        if (newId == -1)
        {
            return BadRequest();
        }
        return CreatedAtAction(nameof(Post), new { Id = newId });
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "User")]
    public ActionResult Put(int id, Book newBook)
    {
        if (this.bookService.Update(id, newBook))
        {
            return NoContent();
        }
        return BadRequest();
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "User")]
    public ActionResult Delete(int id)
    {
        if (this.bookService.Delete(id))
            return Ok();
        return NotFound();
    }
}