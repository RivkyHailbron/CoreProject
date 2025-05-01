async function loadBooks() {
    const token = getToken();
    const res = await fetch("/book", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const books = await res.json();
    // populate table...
  }
  
  async function addBook(book) {
    const token = getToken();
    await fetch("/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(book)
    });
    loadBooks();
  }
  
  async function deleteBook(id) {
    const token = getToken();
    await fetch(`/book/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadBooks();
  }