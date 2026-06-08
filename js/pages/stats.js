import {
    getMostPopularTracks,
    getMostFavoritedTracks
} from "../api/statsApi.js";

async function loadPopularTracks() {

    try {

        const tracks = await getMostPopularTracks(5);

        const list =
            document.getElementById("popular-tracks");

        list.innerHTML = "";

        tracks.forEach(track => {

            list.innerHTML += `
                <li>
                    ${track.title}
                    - ${track.artistName}
                    (${track.score})
                </li>
            `;
        });

    } catch (error) {

        console.error("Error loading popular tracks:", error);

        document.getElementById("popular-tracks").innerHTML =
            "<li>Unable to load data</li>";
    }
}

async function loadFavoritedTracks() {

    try {

        const tracks = await getMostFavoritedTracks(5);

        const list =
            document.getElementById("favorited-tracks");

        list.innerHTML = "";

        tracks.forEach(track => {

            list.innerHTML += `
                <li>
                    ${track.title}
                    - ${track.artistName}
                    (${track.score})
                </li>
            `;
        });

    } catch (error) {

        console.error("Error loading favorited tracks:", error);

        document.getElementById("favorited-tracks").innerHTML =
            "<li>Unable to load data</li>";
    }
}

document.addEventListener("DOMContentLoaded", () => {

    loadPopularTracks();
    loadFavoritedTracks();
});