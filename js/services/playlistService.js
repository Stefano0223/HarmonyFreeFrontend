import { apiFetch } from "./apiClient.js";

export async function getMyPlaylists() {

    const response = await apiFetch(
        "/api/v1/playlists/me"
    );

    return response.json();
}

export async function createPlaylist(request) {

    const response = await apiFetch(
        "/api/v1/playlists",
        {
            method: "POST",
            body: JSON.stringify(request)
        }
    );

    return response.json();
}

export async function deletePlaylist(id) {

    await apiFetch(
        `/api/v1/playlists/${id}`,
        {
            method: "DELETE"
        }
    );
}