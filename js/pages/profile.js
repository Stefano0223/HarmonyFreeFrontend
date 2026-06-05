import { isLoggedIn } from "../utils/auth-utils.js";
import { apiFetch } from "../services/apiClient.js";
import { CORE_BASE_URL } from "../services/config.js";

document.addEventListener("DOMContentLoaded", async () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";

        return;
    }

    await loadProfile();

});

// avatar preview
document.getElementById("uploadAvatar").addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById("avatarPreview").src = reader.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

async function loadProfile() {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/users/me`
    );

    const user = await response.json();

    console.log("User data:", user);

    document.getElementById("profile-name")
    .textContent = user.username;

    document.getElementById("profile-email")
        .textContent = user.email;

    document.getElementById("username-input")
        .value = user.username;

    document.getElementById("email-input")
        .value = user.email;

}