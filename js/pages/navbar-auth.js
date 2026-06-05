import { logout } from "../auth/logout.js";

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("jwt");

    const loginLink =
        document.getElementById("login-link");

    const logoutLink =
        document.getElementById("logout-link");

    if (token) {

        loginLink?.style &&
            (loginLink.style.display = "none");

        logoutLink?.style &&
            (logoutLink.style.display = "inline-block");
    }

    logoutLink?.addEventListener("click", event => {

        event.preventDefault();

        logout();

        window.location.href = "auth.html";

    });

});