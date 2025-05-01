document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        const error = await response.text();
        errorMessage.textContent = error || 'שגיאה בהתחברות';
        return;
      }
  
      const data = await response.json();
      sessionStorage.setItem('token', data.token);
  
      // ניתוח תפקיד מתוך הטוקן (לצורך ניווט)
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const role = payload.role;
  
      if (role === 'Admin') {
        window.location.href = '/admin-books.html';
      } else {
        window.location.href = '/user-books.html';
      }
    } catch (err) {
      console.error(err);
      errorMessage.textContent = 'שגיאה בעת ניסיון התחברות';
    }
  });
  