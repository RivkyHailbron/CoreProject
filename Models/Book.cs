namespace MyProject.Models;

public class Book
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Author { get; set; }
    public double Price { get; set; }
    
};

public class BookFromBody
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Author { get; set; }
    public double Price { get; set; }
}