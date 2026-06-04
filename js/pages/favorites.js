import { isLoggedIn } from "../utils/auth-utils.js";

import {
    getFavorites,
    removeFavorite
} from "../api/favorite-api.js";

document.addEventListener("DOMContentLoaded", () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";
    }

    loadFavorites();

});

async function loadFavorites() {

    try {

        const favorites =
            await getFavorites();

        renderFavorites(favorites);

    } catch (error) {

        console.error(error);

    }
}

function renderFavorites(tracks) {

    const container =
        document.getElementById(
            "favorites-container"
        );

    container.innerHTML = "";

    if (tracks.length === 0) {

        container.innerHTML =
            "<p>No favorite tracks found.</p>";

        return;
    }

    tracks.forEach(track => {

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

                            <p>
                                ${
                                    track.genres?.length
                                    ? track.genres.join(", ")
                                    : "Genres: not available"
                                }
                            </p>

                            <button
                                class="btn btn-danger remove-favorite-btn"
                                data-track-id="${track.id}">
                                Remove
                            </button>

                            <button
                                class="btn btn-success play-track-btn"
                                data-track-id="${track.id}"
                                data-audio-url="${track.audioUrl}">
                                Play
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        `;
    });

    bindRemoveButtons();
    bindPlayButtons();
}

function bindRemoveButtons() {

    document
        .querySelectorAll(
            ".remove-favorite-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const trackId =
                        button.dataset.trackId;

                    await removeFavorite(
                        trackId
                    );

                    loadFavorites();
                }
            );
        });
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