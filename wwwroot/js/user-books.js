document.addEventListener("DOMContentLoaded", () => {
    const user = checkAuthAndRole(["User"]);
    loadUserDetails();
    loadUserBooks();
    document.getElementById("userForm").addEventListener("submit", saveUser);
    document.getElementById("bookForm").addEventListener("submit", saveBook);
});

function loadUserBooks() {
    fetch("/book", {
        headers: { Authorization: `Bearer ${getToken()}` }
    })
        .then(res => res.json())
        .then(books => renderBooks(books))
        .catch(console.error);
}

function renderBooks(books) {
    const container = document.getElementById("bookList");
    container.innerHTML = "";
    books.forEach((book) => {
        container.innerHTML += `
          <div class="card">
            <h3>${book.name}</h3>
            <p> ${book.author}</p>
            <p> ${book.price} ש"ח </p>
            <button onclick='editBook(${JSON.stringify(book)})'>Edit</button>
            <button onclick='deleteBook(${book.id})'>Delete</button>
          </div>`;
    });
}

function openBookModal() {
    document.getElementById("bookModal").classList.remove("hidden");
    document.getElementById("bookId").value = "";
    document.getElementById("bookTitle").value = "";
    document.getElementById("bookPrice").value = "";
}

function closeBookModal() {
    document.getElementById("bookModal").classList.add("hidden");
}

function saveBook(e) {
    e.preventDefault();
    const id = document.getElementById("bookId").value || 0;
    const title = document.getElementById("bookTitle").value;
    const price = document.getElementById("bookPrice").value;

    const author = document.getElementById("bookAuthor").value;
    const method = id ? "PUT" : "POST";
    const url = id ? `/book/${id}` : "/book";

    fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ id, name: title, author, price })
    })
        .then(res => {
            if (!res.ok) throw new Error("שגיאה בשמירה");
            closeBookModal();
            loadUserBooks();
        })
        .catch(err => alert(err.message));
}


function editBook(book) {
    document.getElementById("bookId").value = book.id;
    document.getElementById("bookTitle").value = book.name;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookPrice").value = book.price;
    document.getElementById("bookModal").classList.remove("hidden");
}

function deleteBook(id) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הספר?")) return;
    fetch(`/book/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
    })
        .then(res => {
            if (!res.ok) throw new Error("שגיאה במחיקה");
            loadUserBooks();
        })
        .catch(err => alert(err.message));
}


//user details
const loadUserDetails = () => {
    const token = getToken();
    const id = getUserIdFromToken(token);
    fetch(`/user/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(user => {
            document.getElementById("editUserBtn").addEventListener("click", () => editUser(user));
            document.getElementById("currentUserName").innerText = user.name;
            document.getElementById("userName").innerText = user.name || user.email;
            document.getElementById("userEmail").innerText = user.email;
            document.getElementById("userPassword").innerText = user.password;
        })
        .catch(console.error);
}

const getUserIdFromToken = (token) => {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const userData = JSON.parse(decodedPayload);
    return userData.id;
}

const openUserModal = (user) => {
    document.getElementById("userModal").classList.remove("hidden");
    document.getElementById("userId").value = user?.id ;
    document.getElementById("userName").value = user?.name || "";
    document.getElementById("userEmail").value = user?.email || "";
    document.getElementById("userPassword").value = user?.password || "";
}

function closeUserModal() {
    document.getElementById("userModal").classList.add("hidden");
}

function saveUser(e) {
    e.preventDefault();
    const id = getUserIdFromToken(getToken());
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;
    const role = "User";

    const method = "PUT";
    const url = id ? `/user/${id}` : "/user";

    const data = { id, name, email, password, role };

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
            loadUserDetails();
        })
        .catch((err) => alert(err.message));
}

function editUser(user) {
    openUserModal(user);
}