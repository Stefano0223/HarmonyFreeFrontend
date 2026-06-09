import { deletePlaylist } from "../api/playlist-api.js";

export function renderPlaylists(
    playlists,
    showDelete = true
) {

    const container =
        document.getElementById(
            "playlists-container"
        );

    container.innerHTML = "";

    if (!playlists || playlists.length === 0) {

        container.innerHTML =
            "<p>No playlists found.</p>";

        return;
    }

    playlists.forEach(playlist => {

        const card =
            document.createElement("div");

        card.className =
            "playlist-card";

        card.innerHTML = `
            <h4>${playlist.title}</h4>

            <p>
                ${playlist.description ?? ""}
            </p>

            <div class="playlist-actions">

                <button
                    class="btn btn-primary open-playlist-btn"
                    data-playlist-id="${playlist.id}">
                    Open
                </button>

                ${
                    showDelete
                        ? `
                        <button
                            class="btn btn-danger delete-playlist-btn"
                            data-playlist-id="${playlist.id}">
                            Delete
                        </button>
                        `
                        : ""
                }

            </div>
        `;

        container.appendChild(card);
    });
}

export function bindOpenButtons(
    isPublicPage = false
) {

    document
        .querySelectorAll(".open-playlist-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const playlistId =
                    button.dataset.playlistId;

                const targetUrl =
                    isPublicPage
                        ? `playlist.html?id=${playlistId}&public=true`
                        : `playlist.html?id=${playlistId}`;

                window.location.href = targetUrl;

            });

        });

}

export function bindDeleteButtons(onDeleteSuccess) {

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

                    await deletePlaylist(playlistId);

                    alert(
                        "Playlist deleted successfully"
                    );

                    if (onDeleteSuccess) {
                        await onDeleteSuccess();
                    }

                } catch (error) {

                    console.error(error);

                    alert(
                        "Unable to delete playlist"
                    );
                }
            });
        });
}