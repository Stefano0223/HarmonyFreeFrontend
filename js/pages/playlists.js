import { 
    getMyPlaylists,
    createPlaylist,
    deletePlaylist
 } from "../api/playlist-api.js";
import { renderPlaylists, bindOpenButtons, bindDeleteButtons } from "./playlist-ui.js";
import { isLoggedIn } from "../utils/auth-utils.js";

console.log("MY PLAYLISTS PAGE");

document.addEventListener("DOMContentLoaded", async () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";

        return;
    }

    await loadPlaylists();

});

export async function loadPlaylists() {

    try {

        const playlists = await getMyPlaylists();

        renderPlaylists(playlists, true);
        bindOpenButtons(false);
        bindDeleteButtons(loadPlaylists);

    } catch (error) {

        console.error(error);

    }
}

//salvataggio della nuova playlist con la modale
const savePlaylistBtn =
    document.getElementById("savePlaylistBtn");

if (savePlaylistBtn) {

    savePlaylistBtn.addEventListener(
        "click",
        async () => {

            const title =
                document.getElementById("playlistTitle").value;

            const description =
                document.getElementById("playlistDescription").value;

            const request = {
                title,
                description,
                isPublic: document.getElementById("playlistPublic").checked
            };

            await createPlaylist(request);

            $("#createPlaylistModal").modal("hide");

            await loadPlaylists();
        }
    );
}