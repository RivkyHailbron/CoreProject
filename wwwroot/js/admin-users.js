const token = sessionStorage.getItem('token');
if (!token) location.href = "login.html";

async function loadUsers() {
    const res = await fetch("/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    const users = await res.json();
    document.getElementById("usersList").innerHTML = users.map(user =>
        `<div>${user.email}</div>`).join("");
}
function navigateToBooks() {
    window.location.href = "admin-books.html";
}
loadUsers();
