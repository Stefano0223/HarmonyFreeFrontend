import { getMyPlaylists } from "../api/playlist-api.js";

export async function loadPlaylistModal() {

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