import { getLatestTracks } from "../api/track-api.js";

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            const tracks = await getLatestTracks(3);

            console.log(tracks);

            updateLatestTracks(tracks);

        } catch (error) {

            console.error(error);
        }

    }
);

function updateLatestTracks(tracks) {

    tracks.forEach((track, index) => {

        console.log(track, index);

        const position = index + 1;

        document.getElementById(
            `latest-track-title-${position}`
        ).textContent = track.title;

        document.getElementById(
            `latest-track-img-${position}`
        ).style.backgroundImage =
            `url('${track.coverImageUrl}')`;

    });

}