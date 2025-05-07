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
    [Authorize(Policy = "User")]
    public ActionResult<IEnumerable<Book>> Get()
    {
        if (!currentUserService.IsAuthenticated)
        {
            return Unauthorized();
        }
        List<Book> books = this.bookService.Get();
        if (currentUserService.IsAdmin)
            return Ok(books);
        System.Console.WriteLine(currentUserService.Name+" is not admin");
        return Ok(books.Where(b => b.Author == currentUserService.Name).ToList());
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
    [Authorize(Policy = "User")]
    public ActionResult Post([FromBody] Book newBook)
    {
        System.Console.WriteLine(newBook);
        Book book = new Book
        {
            Id = newBook.Id,
            Name = newBook.Name,
            Author = newBook.Author,
            Price = newBook.Price
        };
        if (book == null)
            return BadRequest();
        var newId = this.bookService.Create(book);
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