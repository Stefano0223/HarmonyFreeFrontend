import { register, login, getMe } from "../api/auth-api.js";
import { createUser } from "../api/user-api.js";
import { getToken } from "../utils/auth-utils.js";

document
    .getElementById("register-button")
    .addEventListener("click", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("register-email").value;

        const password =
            document.getElementById("register-password").value;

        const retypePassword =
            document.getElementById("register-retype-password").value;

        if (password !== retypePassword) {
            alert("Passwords do not match");
            return;
        }

        const username =
            document.getElementById("register-username").value;

        const firstName =
            document.getElementById("register-first-name").value;

        const lastName =
            document.getElementById("register-last-name").value;

        // chiamata API register
        try {

            console.log(email, password, retypePassword);

            // 1. Registrazione su Auth
            await register({
                email,
                password,
                confirmPassword: retypePassword
            });

            // 2. Login automatico
            const token = await login(email, password);

            console.log("Token salvato:", token);
            console.log("Token da localStorage:", getToken());

            // 3. Recupero dati utente Auth
            const authUser = await getMe();

            localStorage.setItem(
                "user",
                JSON.stringify(authUser)
            );

            console.log(username, firstName, lastName);

            // 4. Creazione utente nel Core
            await createUser({
                username,
                firstName,
                lastName
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