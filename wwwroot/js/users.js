async function loadUserBooks() {
    const token = getToken();
    const res = await fetch("/book", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const books = await res.json();
    // filter or display books belonging to current user
  }
  
  async function updateUserDetails(details) {
    const token = getToken();
    await fetch("/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(details)
    });
    alert("User updated");
  }
  
  // onload examples
  if (document.body.dataset.page === "admin-books") checkAuthAndRole(["Admin"]);
  if (document.body.dataset.page === "user") checkAuthAndRole(["User", "Admin"]);
  if (document.body.dataset.page === "admin-users") checkAuthAndRole(["Admin"]);
  