// using System.Text.Json;
// using MyProject.Interfaces;
// using MyProject.Models;

// namespace MyProject.Services;

// public class UserService : IUserService
// {
//     private List<User> users;
//     private static string fileName = "user.json";
//     private string filePath;

//     public UserService(IHostEnvironment env)
//     {
//         filePath = Path.Combine(env.ContentRootPath, "Data", fileName);

//         using (var jsonFile = File.OpenText(filePath))
//         {
//             users = JsonSerializer.Deserialize<List<User>>(jsonFile.ReadToEnd(),
//             new JsonSerializerOptions
//             {
//                 PropertyNameCaseInsensitive = true
//             });
//         }
//     }

//     private void saveToFile()
//     {
//         File.WriteAllText(filePath, JsonSerializer.Serialize(users));
//     }

//     public List<User> Get() => users;

//     public User Get(int id) => users.FirstOrDefault(b => b.Id == id);

//     public int Create(User newUser)
//     {
//         if (newUser == null || string.IsNullOrWhiteSpace(newUser.Name) || string.IsNullOrWhiteSpace(newUser.Password))
//         {
//             return -1;
//         }

//         int maxId = users.Count > 0 ? users.Max(b => b.Id) : 0;
//         newUser.Id = maxId + 1;
//         users.Add(newUser);
//         saveToFile();
//         return newUser.Id;
//     }

//     public bool Update(int id, User newuUser)
//     {
//         if (newuUser == null || newuUser.Id != id || string.IsNullOrWhiteSpace(newuUser.Password))
//         {
//             return false;
//         }
//         var user = users.FirstOrDefault(b => b.Id == id);
//         if (user == null)
//             return false;

//         user.Name = newuUser.Name;
//         user.Email = newuUser.Email;
//         user.Password = newuUser.Password;
//         saveToFile();
//         return true;
//     }

//     public bool Delete(int id)
//     {
//         var user = users.FirstOrDefault(b => b.Id == id);
//         if (user == null)
//             return false;

//         users.Remove(user);
//         saveToFile();
//         return true;
//     }
// };

// public static class UserUtilities
// {
//     public static void AddUserConst(this IServiceCollection services)
//     {
//         services.AddSingleton<IUserService, UserService>();
//     }
// }
