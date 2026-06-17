import { ENV } from "../services/config.js";
import { renderPlaylists, bindOpenButtons } from "./playlist-ui.js";

console.log("PUBLIC PLAYLISTS PAGE");

document.addEventListener("DOMContentLoaded", () => {
    loadPublicPlaylists();
});

async function loadPublicPlaylists() {

    const response = await fetch(
        `${ENV.CORE_API}/api/v1/playlists/public`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to load public playlists"
        );
    }

    const playlists =
        await response.json();

    renderPlaylists(playlists, false);
    bindOpenButtons(true);
    
}