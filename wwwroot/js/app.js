

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

  if (user.role === "Admin") {
    window.location.href = "admin-books.html";
  } else if (user.role === "User") {
    window.location.href = "users.html";
  } else {
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

function checkAuthAndRole(requiredRoles = []) {
  const token = getToken();
  if (!token) return window.location.href = "login.html";
  const user = parseJwt(token);
  if (!user || (requiredRoles.length && !requiredRoles.includes(user.role))) {
    alert("Unauthorized");
    return window.location.href = "login.html";
  }
  return user;
}
