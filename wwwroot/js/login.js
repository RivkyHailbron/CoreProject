document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    form.onsubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.status === 401) {
            document.getElementById("error").innerText = "פרטי התחברות שגויים";
            return;
        } else if (response.status !== 200) {
            document.getElementById("error").innerText = "שגיאה בשרת";
            return;
        }
        const data = await response.json();
        sessionStorage.setItem("token", data.token);
        redirectToRolePage();
    };
});
// async function login() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     const res = await fetch('/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//     });

//     if (res.ok) {
//         const data = await res.json();
//         sessionStorage.setItem("token", data.token);
//         window.location.href = "index.html";
//     } else {
//         alert("Login failed");
//     }
// }
