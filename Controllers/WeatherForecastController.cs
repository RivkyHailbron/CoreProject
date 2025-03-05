using Microsoft.AspNetCore.Mvc;

namespace MyProject.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private static List<WeatherForecast> lst;

    public WeatherForecastController()
    {
        lst = Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToList();
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return lst;
    }

    [HttpGet("{id}")]
    public ActionResult<WeatherForecast> Get(int id)
    {
        if (id > lst.Count() || id < 0)
            return BadRequest();
        return lst[id];
    }

    [HttpPost]
    public void Post(WeatherForecast newItem)
    {
        lst.Add(newItem);
    }

    [HttpPut("{id}")]
    public void Put(int id, WeatherForecast newItem)
    {
        if (id > lst.Count || id < 0)
            BadRequest();
        else
            lst[id] = newItem;
    }

    [HttpDelete("{id}")]
    public void Delete(int id)
    {
        if (id > lst.Count || id < 0)
            BadRequest();
        else
            lst.RemoveAt(id);
    }
}
