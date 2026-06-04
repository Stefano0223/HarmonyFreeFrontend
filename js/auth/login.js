import { login, getMe } from "../api/auth-api.js";

document
    .getElementById("login-button")
    .addEventListener("click", async () => {

        const email =
            document.getElementById("login-email").value;

        const password =
            document.getElementById("login-password").value;

        console.log(email, password);

        // chiamata API login
        try {

            // Login -> riceve JWT
            const token = await login(email, password);

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