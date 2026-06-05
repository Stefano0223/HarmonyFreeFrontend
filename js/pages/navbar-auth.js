import { logout } from "../auth/logout.js";
import { apiFetch } from "../services/apiClient.js";
import { CORE_BASE_URL } from "../services/config.js";

document.addEventListener("DOMContentLoaded",  async () => {

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

        await loadNavbarUser();
    }

    logoutLink?.addEventListener("click", event => {

        event.preventDefault();

        logout();

        window.location.href = "auth.html";

    });

});

async function loadNavbarUser() {

    const response =
        await apiFetch(
            `${CORE_BASE_URL}/api/v1/users/me`
        );

    const user =
        await response.json();

    const profileLink =
        document.getElementById("profile-link");

    const profileName =
        document.getElementById("profile-name");

    profileName.textContent =
        user.username;

    profileLink.style.display =
        "inline-block";
}