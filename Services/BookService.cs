using System.Text.Json;
using MyProject.Interfaces;
using MyProject.Models;

namespace MyProject.Services;

public class BookService : IBookService
{
    private List<Book> books;
    private static string fileName = "book.json";
    private string filePath;

    public BookService(IHostEnvironment env)
    {
        filePath = Path.Combine(env.ContentRootPath, "Data", fileName);

        using (var jsonFile = File.OpenText(filePath))
        {
            books = JsonSerializer.Deserialize<List<Book>>(jsonFile.ReadToEnd(),new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
    }

    private void saveToFile()
    {
        File.WriteAllText(filePath, JsonSerializer.Serialize(books));
    }

    public List<Book> Get() => books;

    public Book Get(int id) => books.FirstOrDefault(b => b.Id == id);

    public int Create(Book newBook)
    {
        if (newBook == null || string.IsNullOrWhiteSpace(newBook.Name) || string.IsNullOrWhiteSpace(newBook.Author))
        {
            return -1;
        }

        int maxId = books.Count > 0 ? books.Max(b => b.Id) : 0;
        newBook.Id = maxId + 1;
        books.Add(newBook);
        saveToFile();
        return newBook.Id;
    }

    public bool Update(int id, Book newBook)
    {
        if (newBook == null || newBook.Id != id || string.IsNullOrWhiteSpace(newBook.Name) || string.IsNullOrWhiteSpace(newBook.Author))
        {
            return false;
        }

        var book = books.FirstOrDefault(b => b.Id == id);
        if (book == null)
            return false;

        var index = books.IndexOf(book);
        books[index] = newBook;
        saveToFile();
        return true;
    }

    public bool Delete(int id)
    {
        var book = Get(id);
        if (book == null)
            return false;

        books.Remove(book);
        saveToFile();
        return true;
    }

};

public static class BookUtilities
{
    public static void AddBookConst(this IServiceCollection services)
    {
        services.AddSingleton<IBookService, BookService>();
    }
}
