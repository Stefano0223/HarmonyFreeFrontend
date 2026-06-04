import { getAllTracks, searchTracks } from "../api/track-api.js";

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
                                ${(track.genres || []).join(", ")}
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

                        </div>

                    </div>

                </div>

            </div>
        `;
    });

    bindTrackCards();
    bindPlayButtons();
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