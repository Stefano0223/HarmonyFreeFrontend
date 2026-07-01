import { getTrackById } from "../api/track-api.js";
import { isLoggedIn } from "../utils/auth-utils.js";
import { addFavorite } from "../api/favorite-api.js";
import { addTrackToPlaylist } from "../api/playlist-api.js";
import { loadPlaylistModal } from "./playlist-modal.js";

let playlistModal = null;

document.addEventListener("DOMContentLoaded", async () => {

    try {

        console.log("track.js caricato");

        const params = new URLSearchParams(window.location.search);

        const trackId = params.get("id");

        console.log("trackId =", trackId);

        const track = await getTrackById(trackId);

        console.log("track =", track);

        document.getElementById("track-title").textContent =
            track.title;

        document.getElementById("track-artist").textContent =
            track.artist;

        document.getElementById("track-album").textContent =
            track.album ?? "-";

        document.getElementById("track-genres").textContent =
            track.genres && track.genres.length > 0
                ? track.genres.join(", ")
                : "not available";

        document.getElementById("track-duration").textContent =
            formatDuration(track.duration);

        document.getElementById("track-cover").src =
            track.coverImageUrl;

        document.getElementById("audio-player").src =
            track.audioUrl;

        const downloadBtn = document.getElementById("download-btn");

        const favoriteBtn = document.getElementById("favorite-btn");

        const playlistBtn = document.getElementById("playlist-btn");

        if (track.downloadable) {

            console.log("the track is downloadable");

            downloadBtn.addEventListener("click", () => {

                window.open(
                    track.downloadUrl,
                    "_blank"
                );

            });

        } else {

            console.log("the track is NOT downloadable");

            downloadBtn.style.display = "none";

        }

        if (isLoggedIn()) {

            favoriteBtn.addEventListener("click", async (event) => {

                try {

                    await addFavorite(
                        trackId
                    );

                    alert("Added to favorites");

                } catch (error) {

                    alert(error.message);

                }

            });

            playlistBtn.addEventListener("click", async (event) => {

                loadPlaylistModal();

                playlistModal = new bootstrap.Modal(
                        document.getElementById(
                            "playlistModal"
                        )
                    );

                playlistModal.show();

            });

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
                            trackId
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

        } else {

            console.log("user is NOT logged in: tracks cannot be added to favorites/playlists");

            favoriteBtn.style.display = "none";
            playlistBtn.style.display = "none";

        }

    } catch (error) {

        console.error(error);

    }

});

function formatDuration(seconds) {

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}