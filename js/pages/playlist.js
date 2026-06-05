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

        console.log(track);

        container.innerHTML += `
            <div class="card mb-3">

                <div class="row g-0">

                    <div class="col-md-3">

                        <img
                            src="${track.coverImageUrl}"
                            class="img-fluid rounded-start">

                    </div>

                    <div class="col-md-9">

                        <div class="card-body">

                            <h5>${track.title}</h5>

                            <p>${track.artist}</p>

                            <p>${track.album}</p>

                            <p>
                                ${
                                    track.genres?.length
                                    ? track.genres.join(", ")
                                    : "Genres: not available"
                                }
                            </p>

                            <button
                                class="btn btn-success play-track-btn"
                                data-track-id="${track.id}"
                                data-audio-url="${track.audioUrl}">
                                Play
                            </button>

                            <button
                                class="btn btn-danger remove-playlist-btn"
                                data-track-id="${track.id}">
                                Remove
                            </button>

                            ${track.downloadable ? `
                                <button
                                    class="btn btn-secondary download-btn"
                                    data-download-url="${track.downloadUrl}">
                                    Download
                                </button>
                            ` : ""}

                        </div>

                    </div>

                </div>

            </div>
        `;
    });

    bindPlayButtons();
    bindRemoveButtons();
    bindDownloadButtons();

}

function bindPlayButtons() {

    const player =
        document.getElementById("audio-player");

    document
        .querySelectorAll(".play-track-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const audioUrl =
                        button.dataset.audioUrl;

                    player.src = audioUrl;
                    player.play();

                }
            );

        });

}

function bindRemoveButtons() {

    document
        .querySelectorAll(
            ".remove-playlist-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const trackId =
                        button.dataset.trackId;

                    await removeTrackFromPlaylist(
                        playlistId,
                        trackId
                    );

                    await loadPlaylist();
                }
            );
        });
}

//funzione per gestire il click sui pulsanti Download e aprire il link di download in una nuova finestra
function bindDownloadButtons() {

    document
        .querySelectorAll(".download-btn")
        .forEach(button => {

            button.addEventListener("click", (event) => {

                event.stopPropagation();

                const downloadUrl =
                    button.dataset.downloadUrl;

                window.open(downloadUrl, "_blank");

            });

        });
}