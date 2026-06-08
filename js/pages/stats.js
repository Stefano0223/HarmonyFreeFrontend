import {
    getMostPopularTracks,
    getMostFavoritedTracks
} from "../api/stats-api.js";

async function loadPopularTracks() {

    try {

        const tracks = await getMostPopularTracks(5);

        const list =
            document.getElementById("popular-tracks");

        list.innerHTML = "";

        tracks.forEach((track, index) => {

            list.innerHTML += `
                <div class="track-item">
                    <div class="track-rank">
                        #${index + 1}
                    </div>

                    <div class="track-info">
                        <div class="track-title">
                            ${track.title}
                        </div>

                        <div class="track-artist">
                            ${track.artist || track.artistName}
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {

        console.error("Error loading popular tracks:", error);

        document.getElementById("popular-tracks").innerHTML =
            "<p>Unable to load data</p>";
    }
}

async function loadFavoritedTracks() {

    try {

        const tracks = await getMostFavoritedTracks(5);

        const list =
            document.getElementById("favorited-tracks");

        list.innerHTML = "";

        tracks.forEach((track, index) => {

            list.innerHTML += `
                <div class="track-item">
                    <div class="track-rank">
                        #${index + 1}
                    </div>

                    <div class="track-info">
                        <div class="track-title">
                            ${track.title}
                        </div>

                        <div class="track-artist">
                            ${track.artist || track.artistName}
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {

        console.error("Error loading favorited tracks:", error);

        document.getElementById("favorited-tracks").innerHTML =
            "<p>Unable to load data</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {

    loadPopularTracks();
    loadFavoritedTracks();
});