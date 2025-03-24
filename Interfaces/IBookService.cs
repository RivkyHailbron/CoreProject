using Microsoft.AspNetCore.Mvc;
using MyProject.Models;

namespace MyProject.Interfaces;

public interface IBookService
{
    List<Book> Get();
    Book Get(int id);
    int Create(Book newBook);
    bool Update(int id, Book newBook);
    bool Delete(int id);
    // int Count { get; }
}
