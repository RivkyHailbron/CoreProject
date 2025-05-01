function getToken() {
  return sessionStorage.getItem("token");
}

function parseJwt(token) {
  if (!token) return null;
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
}

function redirectToRolePage() {
  const token = getToken();
  if (!token) return window.location.href = "login.html";

  const user = parseJwt(token);
  if (!user) return window.location.href = "login.html";
  const role = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (role === "Admin") {
    window.location.href = "admin-books.html";
  } else if (role === "User") {
    window.location.href = "user-books.html";
  } else {
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

function checkAuthAndRole(requiredRoles = []) {
  const token = getToken();
  if (!token) window.location.href = "login.html";
  const user = parseJwt(token);
  const role = user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (!user || (requiredRoles.length && !requiredRoles.includes(role))) {
    alert("Unauthorized");
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
  }
  return user;
}

async function loadBooks(isAdmin) {
  const token = getToken();
  const res = await fetch("/book", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const books = await res.json();
  const container = document.getElementById("books");
  container.innerHTML = "";
  books.forEach(book => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <button onclick="editBook(${book.id})">Edit</button>
      <button onclick="deleteBook(${book.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function loadUsers() {
  const token = getToken();
  const res = await fetch("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
  const users = await res.json();
  const container = document.getElementById("users");
  container.innerHTML = "";
  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <p>${user.role}</p>
      <button onclick="editUser(${user.id})">Edit</button>
      <button onclick="deleteUser(${user.id})">Delete</button>
    `;
    container.appendChild(div);
  });
}

async function deleteBook(id) {
  const token = getToken();
  await fetch(`/book/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  location.reload();
}

async function deleteUser(id) {
  const token = getToken();
  await fetch(`/user/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  location.reload();
}

function createBookForm() {
  alert("TODO: Show modal to create book");
}

function createUserForm() {
  alert("TODO: Show modal to create user");
}

function editBook(id) {
  alert("TODO: Load book into modal and allow edit: ID " + id);
}

function editUser(id) {
  alert("TODO: Load user into modal and allow edit: ID " + id);
}

function loadUsersPage() {
  window.location.href = "admin-users.html";
}

function loadBooksPage() {
  window.location.href = "admin-books.html";
}


///////////////////////////////
// function getToken() {
//   return sessionStorage.getItem("token");
// }

// function getUserFromToken() {
//   const token = getToken();
//   if (!token) return null;

//   const payload = JSON.parse(atob(token.split('.')[1]));
//   return { email: payload.Email, role: payload.Role, userId: payload.UserId };
// }

// function authHeaders() {
//   return {
//     'Authorization': 'Bearer ' + getToken(),
//     'Content-Type': 'application/json'
//   };
// }

// function checkAuth(requiredRole) {
//   const user = getUserFromToken();
//   if (!user || (requiredRole && user.role !== requiredRole)) {
//     window.location.href = "login.html";
//   }
// }
