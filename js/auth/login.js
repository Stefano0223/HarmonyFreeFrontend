import { login, getMe } from "../api/auth-api.js";

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("login-email").value.trim();

        const password =
            document.getElementById("login-password").value;

        try {

            // Login -> riceve JWT
            const token = await login(email, password);

            localStorage.setItem("jwt", token);

            // Recupera dati utente
            const user = await getMe();

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // Redirect home
            window.location.href = "../index.html";

        } catch (error) {

            console.error(error);

            alert("Invalid email or password");

        }

    });

}