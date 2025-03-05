
using Microsoft.AspNetCore.Mvc;

using MyProject.Models;

namespace MyProject.Services;

public static class BookService
{
    private static List<Book> lst;
    static BookService()
    {
        lst = new List<Book>
        {
            new Book { Id  =1, Name="להישאר יהודי",Author="הרב זילבר" , Price=80},
            new Book { Id  =2, Name="דופליקטים ",Author="יונה ספיר " , Price=59.9}

        };
    }

    public static List<Book> Get()
    {
        return lst;
    }

    public static Book Get(int id)
    {
        var book = lst.FirstOrDefault(b => b.Id == id);
        //if not found return null
        return book;
    }

    public static int Create(Book newBook)
    {
        if (newBook == null
         || string.IsNullOrWhiteSpace(newBook.Name)
         || string.IsNullOrWhiteSpace(newBook.Author))
        {
            return -1;
        }
        int maxId = lst.Max(b => b.Id);
        newBook.Id = maxId + 1;
        lst.Add(newBook);
        return newBook.Id;
    }

    public static bool Update(int id, Book newBook)
    {
        if (newBook == null || newBook.Id != id
            || string.IsNullOrWhiteSpace(newBook.Name)
            || string.IsNullOrWhiteSpace(newBook.Author))
        {
            return false;
        }
        var book = lst.FirstOrDefault(b => b.Id == id);
        if (book == null)
            return false;
        var index = lst.IndexOf(book);
        lst[index] = newBook;
        return true;
    }

    public static bool Delete(int id)
    {
        var book = lst.FirstOrDefault(b => b.Id == id);
        if (book == null)
            return false;
        var index = lst.IndexOf(book);
        lst.RemoveAt(index);
        return true;
    }
}
