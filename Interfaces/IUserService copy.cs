using Microsoft.AspNetCore.Mvc;
using MyProject.Models;

namespace MyProject.Interfaces;

public interface IUserService
{
    List<User> Get();
    User GetById(int id);
    User GetByEmail(string email);
    int Create(User newUser);
    bool Update(int id, User newUser);
    bool Delete(int id);
}
