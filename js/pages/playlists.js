import { 
    getMyPlaylists,
    createPlaylist,
    deletePlaylist
 } from "../api/playlist-api.js";
import { isLoggedIn } from "../utils/auth-utils.js";

document.addEventListener("DOMContentLoaded", async () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";

        return;
    }

    await loadPlaylists();

});

document
    .getElementById("create-playlist-btn")
    .addEventListener(
        "click",
        createPlaylistHandler
    );

async function loadPlaylists() {

    try {

        const playlists = await getMyPlaylists();

        renderPlaylists(playlists);

    } catch (error) {

        console.error(error);

    }

}

function renderPlaylists(playlists) {

    const container =
        document.getElementById(
            "playlists-container"
        );

    container.innerHTML = "";

    if (playlists.length === 0) {

        container.innerHTML = `
            <p>No playlists found.</p>
        `;

        return;
    }

    playlists.forEach(playlist => {

        container.innerHTML += `
            <div class="card mb-3">

                <div class="card-body">

                    <h5>
                        ${playlist.title}
                    </h5>

                    <p>
                        ${playlist.description ?? ""}
                    </p>

                    <button
                        class="btn btn-success open-playlist-btn"
                        data-playlist-id="${playlist.id}">
                        Open
                    </button>

                    <button
                        class="btn btn-danger delete-playlist-btn"
                        data-playlist-id="${playlist.id}">
                        Delete
                    </button>

                </div>

            </div>
        `;
    });

    bindOpenButtons();

    bindDeleteButtons();

}

function bindOpenButtons() {

    document
        .querySelectorAll(".open-playlist-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const playlistId =
                    button.dataset.playlistId;

                window.location.href =
                    `playlist.html?id=${playlistId}`;

            });

        });

}

function bindDeleteButtons() {

    document
        .querySelectorAll(".delete-playlist-btn")
        .forEach(button => {

            button.addEventListener("click", async () => {

                const playlistId =
                    button.dataset.playlistId;

                const confirmed = confirm(
                    "Are you sure you want to delete this playlist?"
                );

                if (!confirmed) {
                    return;
                }

                try {

                    await deletePlaylist(
                        playlistId
                    );

                    alert(
                        "Playlist deleted successfully"
                    );

                    await loadPlaylists();

                } catch (error) {

                    console.error(error);

                    alert(
                        "Unable to delete playlist"
                    );
                }

            });

        });

}

async function createPlaylistHandler() {

    try {

        const title =
            prompt("Playlist title");

        if (!title) {
            return;
        }

        const description =
            prompt("Description");

        const playlist =
            await createPlaylist({
                title,
                description,
                isPublic: false
            });

        await loadPlaylists();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to create playlist"
        );
    }
}