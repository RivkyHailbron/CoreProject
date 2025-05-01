document.addEventListener("DOMContentLoaded", () => {
    const user = checkAuthAndRole(["Admin"]);
    if (!user) return;
  
    loadUsers();
  
    document.getElementById("userForm").addEventListener("submit", saveUser);
  });
  
  function loadUsers() {
    fetch("/user", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((users) => {
        const container = document.getElementById("userList");
        container.innerHTML = "";
        users.forEach((user) => {
          container.innerHTML += `
            <div class="card">
              <h3>${user.fullName || user.email}</h3>
              <p>Email: ${user.email}</p>
              <p>Role: ${user.role}</p>
              <button onclick='editUser(${JSON.stringify(user)})'>Edit</button>
              <button onclick='deleteUser(${user.id})'>Delete</button>
            </div>`;
        });
      });
  }
  
  function openUserModal(user = null) {
    document.getElementById("userModal").classList.remove("hidden");
    document.getElementById("userId").value = user?.id || "";
    document.getElementById("userEmail").value = user?.email || "";
    document.getElementById("userPassword").value = "";
    document.getElementById("userRole").value = user?.role || "User";
  }
  
  function closeUserModal() {
    document.getElementById("userModal").classList.add("hidden");
  }
  
  function saveUser(e) {
    e.preventDefault();
    const id = document.getElementById("userId").value;
    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;
    const role = document.getElementById("userRole").value;
  
    const method = id ? "PUT" : "POST";
    const url = id ? `/user/${id}` : "/user";
  
    const data = { id, email, password, role };
  
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save user");
        closeUserModal();
        loadUsers();
      })
      .catch((err) => alert(err.message));
  }
  
  function editUser(user) {
    openUserModal(user);
  }
  
  function deleteUser(id) {
    if (!confirm("Are you sure?")) return;
    fetch(`/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete user");
        loadUsers();
      })
      .catch((err) => alert(err.message));
  }
  