import { getTrackById } from "../api/track-api.js";

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
            (track.genres || []).join(", ");

        document.getElementById("track-duration").textContent =
            formatDuration(track.duration);

        document.getElementById("track-cover").src =
            track.coverImageUrl;

        document.getElementById("audio-player").src =
            track.audioUrl;

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