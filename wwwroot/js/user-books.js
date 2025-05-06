// // async function loadUserBooks() {
// //     const token = getToken();
// //     const res = await fetch("/book", {
// //       headers: { Authorization: `Bearer ${token}` }
// //     });
// //     const books = await res.json();
// //     // filter or display books belonging to current user
// //   }

// //   async function updateUserDetails(details) {
// //     const token = getToken();
// //     await fetch("/user", {
// //       method: "PUT",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`
// //       },
// //       body: JSON.stringify(details)
// //     });
// //     alert("User updated");
// //   }

// //   // onload examples
// //   if (document.body.dataset.page === "admin-books") checkAuthAndRole(["Admin"]);
// //   if (document.body.dataset.page === "user") checkAuthAndRole(["User", "Admin"]);
// //   if (document.body.dataset.page === "admin-users") checkAuthAndRole(["Admin"]);

// document.addEventListener("DOMContentLoaded", () => {
//   const user = checkAuthAndRole(["User", "Admin"]);
//   if (!user) return;

//   getItems();
// });

// async function getItems() {
//   const token = getToken();
//   const response = await fetch("/book", {
//       method: "GET",
//       headers: {
//           "Authorization": `Bearer ${token}`
//       }
//   });

//   if (response.ok) {
//       const books = await response.json();
//       displayBooks(books);
//   } else {
//       console.error("Failed to fetch books:", response.statusText);
//   }
// }

// function displayBooks(books) {
//   const booksTable = document.getElementById("books");
//   booksTable.innerHTML = ""; // ניקוי התוכן הקודם

//   books.forEach(book => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//           <td>${book.author}</td>
//           <td>${book.name}</td>
//           <td>${book.price}</td>
//           <td><button onclick="editItem(${book.id})">ערוך</button></td>
//           <td><button onclick="deleteItem(${book.id})">מחק</button></td>
//       `;
//       booksTable.appendChild(row);
//   });
// }

// async function addItem() {
//   const name = document.getElementById("add-name").value;
//   const author = document.getElementById("add-author").value;
//   const price = parseFloat(document.getElementById("add-price").value);

//   const token = getToken();
//   const response = await fetch("/book", {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({ name, author, price })
//   });

//   if (response.ok) {
//       getItems(); // רענון הרשימה
//   } else {
//       console.error("Failed to add book:", response.statusText);
//   }
// }

// async function updateItem() {
//   const id = document.getElementById("edit-id").value;
//   const name = document.getElementById("edit-name").value;
//   const author = document.getElementById("edit-author").value;
//   const price = parseFloat(document.getElementById("edit-price").value);

//   const token = getToken();
//   const response = await fetch(`/book/${id}`, {
//       method: "PUT",
//       headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({ name, author, price })
//   });

//   if (response.ok) {
//       getItems(); // רענון הרשימה
//       closeInput(); // סגירת טופס העריכה
//   } else {
//       console.error("Failed to update book:", response.statusText);
//   }
// }

// async function deleteItem(id) {
//   const token = getToken();
//   const response = await fetch(`/book/${id}`, {
//       method: "DELETE",
//       headers: {
//           "Authorization": `Bearer ${token}`
//       }
//   });

//   if (response.ok) {
//       getItems(); // רענון הרשימה
//   } else {
//       console.error("Failed to delete book:", response.statusText);
//   }
// }

// function editItem(id) {
//   const bookRow = document.querySelector(`tr[data-id='${id}']`);
//   const name = bookRow.querySelector(".book-name").innerText;
//   const author = bookRow.querySelector(".book-author").innerText;
//   const price = bookRow.querySelector(".book-price").innerText;

//   document.getElementById("edit-id").value = id;
//   document.getElementById("edit-name").value = name;
//   document.getElementById("edit-author").value = author;
//   document.getElementById("edit-price").value = price;

//   document.getElementById("editForm").style.display = "block"; // הצגת טופס העריכה
// }

// function closeInput() {
//   document.getElementById("editForm").style.display = "none"; // הסתרת טופס העריכה
// }

// wwwroot/js/users.js

document.addEventListener("DOMContentLoaded", () => {
    const user = checkAuthAndRole(["User"]);
    loadUserBooks();
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
    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <h3>${book.title}</h3>
        <p>${book.description}</p>
        <button onclick="editBook(${book.id}, '${book.title}', '${book.description}')">✏️</button>
        <button onclick="deleteBook(${book.id})">🗑️</button>
      `;
        container.appendChild(card);
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
    const id = document.getElementById("bookId").value;
    const title = document.getElementById("bookTitle").value;
    const price = document.getElementById("bookPrice").value;

    const method = id ? "PUT" : "POST";
    const url = id ? `/book/${id}` : "/book";

    fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ id: 0, name: title, autor: "דוגמת שם", price })
    })
        .then(res => {
            if (!res.ok) throw new Error("שגיאה בשמירה");
            closeBookModal();
            loadUserBooks();
        })
        .catch(err => alert(err.message));
}

function editBook(id, title, description) {
    document.getElementById("bookId").value = id;
    document.getElementById("bookTitle").value = title;
    document.getElementById("bookPrice").value = description;
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
