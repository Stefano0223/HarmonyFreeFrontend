import { getPlaylistById, removeTrackFromPlaylist } from "../api/playlist-api.js";
import { isLoggedIn } from "../utils/auth-utils.js";

const params = new URLSearchParams(window.location.search);

const playlistId = params.get("id");

document.addEventListener("DOMContentLoaded", async () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";

        return;
    }

    await loadPlaylist();
});

async function loadPlaylist() {

    const playlist = await getPlaylistById(playlistId);

    console.log(playlist);

    renderPlaylist(playlist);
}

function renderPlaylist(playlist) {

    document.getElementById(
        "playlist-title"
    ).textContent = playlist.title;

    document.getElementById(
        "playlist-description"
    ).textContent =
        playlist.description ?? "";

    const container =
        document.getElementById(
            "playlist-tracks-container"
        );

    container.innerHTML = "";

    playlist.tracks.forEach(track => {

        console.log(track.id);

        container.innerHTML += `
            <div class="card mb-3">

                <div class="card-body">

                    <h5>${track.title}</h5>

                    <p>${track.artist}</p>

                    <button
                        class="btn btn-success play-btn"
                        data-audio-url="${track.audioUrl}">
                        Play
                    </button>

                    <button
                        class="btn btn-danger remove-track-btn"
                        data-track-id="${track.id}">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    bindPlayButtons();
    bindRemoveButtons();

}

function bindPlayButtons() {

    document
        .querySelectorAll(".play-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const audioUrl =
                    button.dataset.audioUrl;

                const player =
                    document.getElementById(
                        "audio-player"
                    );

                player.src = audioUrl;

                player.play();

            });

        });

}

function bindRemoveButtons() {

    document
        .querySelectorAll(".remove-track-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const trackId =
                        button.dataset.trackId;

                    const confirmed =
                        confirm(
                            "Remove track from playlist?"
                        );

                    if (!confirmed) {
                        return;
                    }

                    try {

                        await removeTrackFromPlaylist(
                            playlistId,
                            trackId
                        );

                        await loadPlaylist();

                    } catch (error) {

                        console.error(error);

                    }

                }
            );

        });

}