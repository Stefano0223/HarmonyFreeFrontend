import { isLoggedIn, getToken, getCurrentUser } from "../utils/auth-utils.js";
import { logout } from "../auth/logout.js";
import { apiFetch } from "../services/apiClient.js";
import { ENV } from "../services/config.js";

const loginLink =
        document.getElementById("login-link");

const logoutLink =
    document.getElementById("logout-link");

const profileLink =
        document.getElementById("profile-link");

const profileName =
    document.getElementById("profile-name");

document.addEventListener("DOMContentLoaded",  async () => {

    const token = localStorage.getItem("jwt");

    console.log(logoutLink);

    console.log("Inizializzo SlickNav");
    console.log(document.getElementById("profile-link").style.display);
    console.log(document.getElementById("logout-link").style.display);

    // Stato iniziale
    loginLink.style.display = "block";
    profileLink.style.display = "none";
    logoutLink.style.display = "none";

    if (isLoggedIn()) {

        loginLink.style.display = "none";
        logoutLink.style.display = "block";

        await loadNavbarUser();
    }

    // Gestione logout desktop + mobile
    document.addEventListener("click", event => {

        const logoutButton =
            event.target.closest(".logout-link");

        if (!logoutButton) {
            return;
        }

        console.log("click su logout");

        event.preventDefault();

        logout();

        console.log("Logout eseguito");

        window.location.href = "auth.html";

    });

    // Rigenera il menu mobile
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

});

async function loadNavbarUser() {

    console.log(getToken());
    console.log(getCurrentUser());

    const response =
        await apiFetch(
            `${ENV.CORE_API}/api/v1/users/me`
        );

    const user =
        await response.json();

    console.log(user.username);

    profileName.textContent =
        user.username;

    profileLink.style.display =
        "block";

    profileLink.href = "profile.html";
}