import { getAllTracks, searchTracks } from "../api/track-api.js";
import { getMyPlaylists, addTrackToPlaylist } from "../api/playlist-api.js";
import { isLoggedIn } from "../utils/auth-utils.js";
import { addFavorite } from "../api/favorite-api.js";

let currentFilters = {};
let currentOffset = 0;
const limit = 20;

async function loadTracks() {

    //viene restituita una pagina contenente sia le tracce, sia le informazioni di paginazione
    const page = await searchTracks({
        ...currentFilters,
        offset: currentOffset,
        limit
    });

    console.log(page);

    renderTracks(page.content);

    renderPagination(page);
}

//al caricamento della pagina, recupera e mostra tutte le tracce
document.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadTracks();

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

        currentFilters = filters;

        // nuova ricerca -> si riparte dalla prima pagina
        currentOffset = 0;

        try {

            await loadTracks();

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

            card.addEventListener("click", event => {

                if (event.target.closest("button")) {
                    return;
                }

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

                //evita che il click sul pulsante si propaghi alla card e apra la pagina di dettaglio della traccia
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

//Apertura modal

let selectedTrackId = null;
let playlistModal = null;
document.addEventListener("click", async event => {

    const button =
        event.target.closest(".playlist-btn");

    if (!button) {
        return;
    }

    event.stopPropagation();
    event.preventDefault();

    selectedTrackId =
        button.dataset.trackId;

    await loadPlaylistModal();

    playlistModal = new bootstrap.Modal(
            document.getElementById(
                "playlistModal"
            )
        );

    playlistModal.show();
    
});

async function loadPlaylistModal() {

    const playlists =
        await getMyPlaylists();

    const container =
        document.getElementById(
            "playlist-list"
        );

    container.innerHTML = playlists
        .map(
            playlist => `
                <button
                    class="btn btn-info w-100 mb-2 playlist-select-btn"
                    data-playlist-id="${playlist.id}">
                    ${playlist.title}
                </button>
            `
        )
        .join("");
}

document.addEventListener(
    "click",
    async event => {

        if (
            event.target.classList.contains(
                "playlist-select-btn"
            )
        ) {

            const playlistId =
                event.target.dataset.playlistId;

            await addTrackToPlaylist(
                playlistId,
                selectedTrackId
            );

            alert(
                "Track added successfully"
            );

            playlistModal =
        new bootstrap.Modal(
            document.getElementById(
                "playlistModal"
            )
        );

        console.log(playlistModal);

        if (playlistModal) {
            playlistModal.hide();
        }

        }
    }
);

function renderPagination(page) {

    const topContainer =
        document.getElementById(
            "pagination-container-top"
        );

    const bottomContainer =
        document.getElementById(
            "pagination-container-bottom"
        );

    const paginationHtml =
        buildPaginationHtml(page);

    topContainer.innerHTML =
        paginationHtml;

    bottomContainer.innerHTML =
        paginationHtml;

    bindPaginationButtons();

}

function buildPaginationHtml(page) {

    let html = "";

    const totalPages = Math.ceil(
        page.totalElements / page.limit
    );

    const currentPage =
        Math.floor(
            page.offset / page.limit
        ) + 1;

    //non vogliamo creare tutti i pulsanti delle pagine,
    //ma solo quelli che si trovano intorno alla pagina corrente.
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // First
    html += `
        <button
            class="btn btn-secondary me-2 page-btn"
            data-page="1"
            ${currentPage === 1 ? "disabled" : ""}>
            First
        </button>
    `;

    // Prev
    html += `
        <button
            class="btn btn-secondary me-2 page-btn"
            data-page="${currentPage - 1}"
            ${currentPage === 1 ? "disabled" : ""}>
            Prev
        </button>
    `;

    // Numeri pagina
    for (let i = startPage; i <= endPage; i++) {

        html += `
            <button
                class="btn ${
                    i === currentPage
                        ? "btn-primary"
                        : "btn-outline-primary"
                } me-1 page-btn"
                data-page="${i}">
                ${i}
            </button>
        `;
    }

    // Next
    html += `
        <button
            class="btn btn-secondary ms-2 page-btn"
            data-page="${currentPage + 1}"
            ${!page.hasNext ? "disabled" : ""}>
            Next
        </button>
    `;

    // Last
    html += `
        <button
            class="btn btn-secondary ms-2 page-btn"
            data-page="${totalPages}"
            ${currentPage === totalPages ? "disabled" : ""}>
            Last
        </button>
    `;

    return html;

}

function bindPaginationButtons() {

    document
        .querySelectorAll(".page-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const page =
                        parseInt(
                            button.dataset.page
                        );

                    currentOffset =
                        (page - 1) * limit;

                    await loadTracks();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        });
    
}