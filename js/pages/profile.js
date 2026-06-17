import { isLoggedIn } from "../utils/auth-utils.js";
import { apiFetch } from "../services/apiClient.js";
import { getMe, patchEmail } from "../api/auth-api.js";
import { logout } from "../auth/logout.js";
import { ENV } from "../services/config.js";

let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";

        return;
    }

    await loadProfile();
    await loadFavorites();
    await loadPlaylists();

});

// avatar preview
document
    .getElementById("uploadAvatar")
    .addEventListener("change", async function (e) {

        const reader = new FileReader();

        reader.onload = function () {
            document.getElementById(
                "avatarPreview"
            ).src = reader.result;
        };

        reader.readAsDataURL(e.target.files[0]);

        // upload backend
        await uploadAvatar();
});

//Upload della nuova immagine al backend
async function uploadAvatar() {

    const file =
        document.getElementById("uploadAvatar")
            .files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${ENV.CORE_API}/api/v1/users/me/avatar`,
        {
            method: "PATCH",
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("jwt")}`
            },
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Avatar upload failed");
    }

    return await response.json();
}

async function loadProfile() {

    const coreResponse = await apiFetch(
        `${ENV.CORE_API}/api/v1/users/me`
    );

    const coreUser = await coreResponse.json();

    console.log("core User data:", coreUser);

    const authUser = await getMe();

    console.log("auth User data:", authUser);

    currentUser = { ...coreUser, ...authUser };

    document.getElementById("profile-username")
        .textContent = currentUser.username;

    document.getElementById("profile-firstname")
        .textContent = `First name: ${currentUser.firstName}`;

    document.getElementById("profile-lastname")
        .textContent = `Last name: ${currentUser.lastName}`;

    document.getElementById("profile-email")
        .textContent = `Email: ${currentUser.email}`;

    document.getElementById("avatarPreview").src =
    currentUser.profileImageUrl
        ? `${ENV.CORE_API}${currentUser.profileImageUrl}`
        : "img/default-user.png";

}

async function loadFavorites() {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/users/me/favorites`
    );

    const favorites =
        await response.json();

    const container =
        document.getElementById(
            "profile-favorites-container"
        );

    if (favorites.length === 0) {

        container.innerHTML =
            "<p style='color:white;'>No favorites yet.</p>";

        return;
    }

    console.log("Favorites data:", favorites);

    const favoritesToShow = favorites.slice(0, 5);

    container.innerHTML =
        favoritesToShow.map(f => `
            <div style="color:white;">
                🎵 ${f.title} by ${f.artist}
            </div>
        `).join("");

    if (favorites.length > 5) {
        container.innerHTML += `
            <div>
                <button class="btn btn-primary" style="margin-top: 10px;">
                    <a href="favorites.html" style="color: white; text-decoration: none;">
                        View all favorites
                    </a>
                </button>
            </div>
        `;
    }
}

async function loadPlaylists() {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/me`
    );

    const playlists =
        await response.json();

    const container =
        document.getElementById(
            "profile-playlists-container"
        );

    if (playlists.length === 0) {

        container.innerHTML =
            "<p style='color:white;'>No playlists found.</p>";

        return;
    }

    console.log("Playlists data:", playlists);

    const playlistsToShow = playlists.slice(0, 5);

    container.innerHTML =
        playlistsToShow.map(p => `
            <div style="color:white;">
                🎶 ${p.title}
            </div>
        `).join("");

    if (playlists.length > 5) {
        container.innerHTML += `
            <div>
                <button class="btn btn-primary" style="margin-top: 10px;">
                    <a href="playlists.html" style="color: white; text-decoration: none;">
                        View all playlists
                    </a>
                </button>
            </div>
        `;
    }
}

document
    .getElementById("edit-profile-btn")
    .addEventListener(
        "click",
        () => {

            document.getElementById(
                "modal-username"
            ).value =
                currentUser.username;

            document.getElementById(
                "modal-firstname"
            ).value =
                currentUser.firstName;

            document.getElementById(
                "modal-lastname"
            ).value =
                currentUser.lastName;

            document.getElementById(
                "modal-email"
            ).value =
                currentUser.email;

            const modal =
                new bootstrap.Modal(
                    document.getElementById(
                        "editProfileModal"
                    )
                );

            modal.show();
        }
);

let editProfileModal = null;
document
    .getElementById("save-profile-btn")
    .addEventListener(
        "click",
        async () => {

            const coreUserpayload = {
                username:
                    document.getElementById(
                        "modal-username"
                    ).value,

                firstName:
                    document.getElementById(
                        "modal-firstname"
                    ).value,

                lastName:
                    document.getElementById(
                        "modal-lastname"
                    ).value
            };

            const authUserPayload = {
                email:
                    document.getElementById(
                        "modal-email"
                    ).value
            };

            try {
                
                await patchEmail(authUserPayload);

                alert("Email updated successfully. Please login again.");

                logout();

            } catch (error) {

                alert(error.message);

            }

            await apiFetch(
                `${ENV.CORE_API}/api/v1/users/me`,
                {
                    method: "PATCH",
                    body: JSON.stringify(coreUserpayload),
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            await loadProfile();

            editProfileModal =
                new bootstrap.Modal(
                        document.getElementById(
                            "editProfileModal"
                        )
                    )
                .hide();
        }
);