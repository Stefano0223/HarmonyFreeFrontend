import { getAllTracks, searchTracks } from "../api/track-api.js";
import { getMyPlaylists, addTrackToPlaylist } from "../api/playlist-api.js";
import { isLoggedIn } from "../utils/auth-utils.js";
import { addFavorite } from "../api/favorite-api.js";

//al caricamento della pagina, recupera e mostra tutte le tracce
document.addEventListener("DOMContentLoaded", async () => {

    try {

        const tracks = await searchTracks();

        renderTracks(tracks);

    } catch (error) {

        console.error(error);

        document.getElementById("tracks-container").innerHTML =
            `<div class="alert alert-danger">
                Unable to load tracks
            </div>`;
    }

});

//gestisce la ricerca con i filtri quando l'utente clicca sul pulsante Search
document.getElementById("search-btn").addEventListener("click", async () => {

        const filters = {
            query: document.getElementById("search-input").value,
            title: document.getElementById("title-filter").value,
            artist: document.getElementById("artist-filter").value,
            album: document.getElementById("album-filter")?.value,
            genre: document.getElementById("genre-filter").value
        };

        try {

            const tracks = await searchTracks(filters);

            renderTracks(tracks);

        } catch (error) {

            console.error(error);

        }

    });

//funzione per mostrare le tracce nella pagina
function renderTracks(tracks) {

    const container = document.getElementById("tracks-container");

    container.innerHTML = "";

    tracks.forEach(track => {

        console.log(track);

        container.innerHTML += `
            <div class="card mb-3 track-card" data-track-id="${track.id}">

                <div class="row g-0">

                    <div class="col-md-3">

                        <img
                            src="${track.coverImageUrl}"
                            class="img-fluid rounded-start"
                            alt="${track.title}">

                    </div>

                    <div class="col-md-9">

                        <div class="card-body">

                            <h5 class="card-title">
                                ${track.title}
                            </h5>

                            <p class="card-text">
                                <strong>Artist:</strong>
                                ${track.artist}
                            </p>

                            <p class="card-text">
                                <strong>Album:</strong>
                                ${track.album ?? "-"}
                            </p>

                            <p class="card-text">
                                <strong>Genres:</strong>
                                ${track.genres && track.genres.length > 0
                                    ? track.genres.join(", ")
                                    : "not available"}
                            </p>

                            <p class="card-text">
                                <strong>Duration:</strong>
                                ${formatDuration(track.duration)}
                            </p>

                            <button
                                class="btn btn-success play-btn"
                                data-audio-url="${track.audioUrl}">
                                Play
                            </button>

                            ${track.downloadable ? `
                                <button
                                    class="btn btn-secondary download-btn"
                                    data-download-url="${track.downloadUrl}">
                                    Download
                                </button>
                            ` : ""}

                            ${isLoggedIn() ? `
                                <button
                                    class="btn btn-warning favorite-btn"
                                    data-track-id="${track.id}">
                                    Add to Favorites
                                </button>

                                <button
                                    class="btn btn-info playlist-btn"
                                    data-track-id="${track.id}">
                                    Add to Playlist
                                </button>
                            ` : ""}

                        </div>

                    </div>

                </div>

            </div>
        `;
    });

    bindTrackCards();
    bindPlayButtons();
    bindDownloadButtons();
    bindFavoriteButtons();
    bindPlaylistButtons();
}

//funzione per formattare la durata da secondi a mm:ss
function formatDuration(seconds) {

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

//funzione per gestire il click sui pulsanti Play e far partire la traccia nell'audio player
function bindPlayButtons() {

    const audioPlayer =
        document.getElementById("audio-player");

    document
        .querySelectorAll(".play-btn")
        .forEach(button => {

            button.addEventListener("click", (event) => {

                event.stopPropagation();

                audioPlayer.src =
                    button.dataset.audioUrl;

                audioPlayer.play();

            });

        });
}

//funzione per gestire il click sulle card delle tracce e navigare alla pagina di dettaglio della traccia
function bindTrackCards() {

    document
        .querySelectorAll(".track-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                const trackId =
                    card.dataset.trackId;

                window.location.href =
                    `track.html?id=${trackId}`;

            });

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

//funzione per gestire il click sui pulsanti Add to Favorites e aggiungere la traccia ai preferiti dell'utente
function bindFavoriteButtons() {

    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            button.addEventListener("click", async (event) => {

                //evita che il click sul pulsante si propaghi alla card e apra la pagina di dettaglio della traccia
                event.stopPropagation();

                try {

                    await addFavorite(
                        button.dataset.trackId
                    );

                    alert("Added to favorites");

                } catch (error) {

                    alert(error.message);

                }

            });

        });
}

function bindPlaylistButtons() {

    document
        .querySelectorAll(".playlist-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async (event) => {

                    //evita che il click sul pulsante si propaghi alla card e apra la pagina di dettaglio della traccia
                    event.stopPropagation();

                    const trackId =
                        button.dataset.trackId;

                    console.log("Adding track to playlist, trackId =", trackId);

                    await addTrackToPlaylistHandler(
                        trackId
                    );

                }
            );

        });

}

async function addTrackToPlaylistHandler(
    trackId
) {

    try {

        const playlists =
            await getMyPlaylists();

        if (playlists.length === 0) {

            alert(
                "Create a playlist first"
            );

            return;
        }

        const message =
            playlists
                .map(
                    p =>
                        `${p.id} - ${p.title}`
                )
                .join("\n");

        const playlistId =
            prompt(
                `Choose playlist (specify the id):\n\n${message}`
            );

        if (!playlistId) {
            return;
        }

        await addTrackToPlaylist(
            playlistId,
            trackId
        );

        alert(
            "Track added to playlist"
        );

    } catch (error) {

        alert(error.message);

    }

}