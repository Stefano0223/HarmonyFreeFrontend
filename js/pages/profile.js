import { isLoggedIn } from "../utils/auth-utils.js";
import { apiFetch } from "../services/apiClient.js";
import { getMe } from "../api/auth-api.js";
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

    const coreResponse = await apiFetch(
        `${CORE_BASE_URL}/api/v1/users/me`
    );

    const coreUser = await coreResponse.json();

    console.log("core User data:", coreUser);

    const authUser = await getMe();

    console.log("auth User data:", authUser);

    document.getElementById("profile-username")
        .textContent = coreUser.username;

    document.getElementById("profile-firstname")
        .textContent = `First name: ${coreUser.firstName}`;

    document.getElementById("profile-lastname")
        .textContent = `Last name: ${coreUser.lastName}`;

    document.getElementById("profile-email")
        .textContent = `Email: ${authUser.email}`;

}