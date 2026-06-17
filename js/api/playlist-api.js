import { apiFetch } from "../services/apiClient.js";
import { ENV } from "../services/config.js";

// GET /api/v1/playlists/me
export async function getMyPlaylists() {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/me`
    );

    if (!response.ok) {
        throw new Error("Unable to load playlists");
    }

    return await response.json();
}

// GET /api/v1/playlists/{id}
export async function getPlaylistById(id) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/${id}`
    );

    if (!response.ok) {
        throw new Error("Unable to load playlist");
    }

    return await response.json();
}

// GET /api/v1/playlists/public
export async function getPublicPlaylists() {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/public`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to load playlists"
        );
    }

    return await response.json();
}

// GET /api/v1/playlists/public/{id}
export async function getPublicPlaylistById(id) {

    const response = await fetch(
        `${ENV.CORE_API}/api/v1/playlists/public/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to load public playlist"
        );
    }

    return await response.json();
}

// POST /api/v1/playlists
export async function createPlaylist(request) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        throw new Error("Unable to create playlist");
    }

    return await response.json();
}

// PUT /api/v1/playlists/{id}
export async function updatePlaylist(id, request) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        throw new Error("Unable to update playlist");
    }

    return await response.json();
}

// DELETE /api/v1/playlists/{id}
export async function deletePlaylist(id) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Unable to delete playlist");
    }
}

// GET /api/v1/playlists/{id}/tracks
export async function getPlaylistTracks(id) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/${id}/tracks`
    );

    if (!response.ok) {
        throw new Error("Unable to load playlist tracks");
    }

    return await response.json();
}

// POST /api/v1/playlists/{id}/tracks
export async function addTrackToPlaylist(
    playlistId,
    trackId
) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/${playlistId}/tracks`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                jamendoTrackId: trackId
            })
        }
    );

    if (!response.ok) {

        const errorData = await response.json();
        throw new Error(errorData.message);

    }

    return await response.json();
}

// DELETE /api/v1/playlists/{playlistId}/tracks/{trackId}
export async function removeTrackFromPlaylist(
    playlistId,
    trackId
) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/playlists/${playlistId}/tracks/${trackId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Unable to remove track");
    }
}