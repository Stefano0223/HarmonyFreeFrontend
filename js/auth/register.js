import { register, login, getMe } from "../api/auth-api.js";
import { createUser } from "../api/user-api.js";

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("register-email").value.trim();

        const username = document.getElementById("register-username").value.trim();

        const firstName = document.getElementById("register-first-name").value.trim();

        const lastName = document.getElementById("register-last-name").value.trim();

        const profileImageUrl = document.getElementById("register-profile-image-url").value.trim();

        const password = document.getElementById("register-password").value;

        const confirmPassword = document.getElementById("register-confirm-password").value;

        try {

            // 1. Registrazione su Auth
            await register({
                email,
                password,
                confirmPassword
            });

            // 2. Login automatico
            const token = await login(email, password);

            localStorage.setItem("jwt", token);

            console.log("Token salvato:", token);
            console.log("Token da localStorage:", localStorage.getItem("jwt"));

            // 3. Recupero dati utente Auth
            const authUser = await getMe();

            localStorage.setItem(
                "user",
                JSON.stringify(authUser)
            );

            // 4. Creazione utente nel Core
            await createUser({
                username,
                firstName,
                lastName,
                profileImageUrl
            });

            alert("Registration successful!");

            window.location.href = "../index.html";

        } catch (error) {

            console.error(error);

            alert(
                error.message || "Registration failed"
            );

        }

    });

}