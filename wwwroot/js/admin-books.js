document.addEventListener("DOMContentLoaded", () => {
  const user = checkAuthAndRole(["Admin"]);
  if (!user) return;

  loadBooks();

  document.getElementById("bookForm").addEventListener("submit", saveBook);
});

function loadBooks() {
  fetch("/book", {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  })
    .then((res) => res.json())
    .then((books) => {
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
    });
}

function openBookModal(book = null) {
  document.getElementById("bookModal").classList.remove("hidden");
  document.getElementById("bookId").value = book?.id || "";
  document.getElementById("bookTitle").value = book?.name || "";
  document.getElementById("bookAuthor").value = book?.author || "";
  document.getElementById("bookPrice").value = book?.price || "";

}

function saveBook(e) {
  e.preventDefault();
  const id = document.getElementById('bookId').value.trim() === "" || document.getElementById('bookId').value.trim() === undefined ? 0 : document.getElementById('bookId').value.trim();
  const Name = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const price = document.getElementById("bookPrice").value;
  //מה יש בID?
  //אם יש ID אז אני מעדכן ספר קיים
  //אם אין ID אז אני מוסיף ספר חדש
  const newBook = {
    "id": id,
    "name": Name,
    "author": author,
    "price": price
  }
  const method = id ? "PUT" : "POST";
  const url = id ? `/book/${id}` : "/book";
  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(newBook),

  }).then((res) => {
    if (!res.ok) throw new Error("Failed to save****************************** book");
    closeBookModal();
    loadBooks();
  }).catch((err) => alert(err.message));
}
function closeBookModal() {
  document.getElementById("bookModal").classList.add("hidden");
}

function editBook(book) {
  openBookModal(book);
}

function deleteBook(id) {
  if (!confirm("Are you sure?")) return;
  fetch(`/book/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to delete book");
      loadBooks();
    })
    .catch((err) => alert(err.message));
}

