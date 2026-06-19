import { apiFetch } from "../services/apiClient.js";
import { ENV } from "../services/config.js";

export async function getAllTracks() {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/tracks`
    );

    if (!response.ok) {
        throw new Error("Unable to load tracks");
    }

    return await response.json();
}

export async function getTrackById(id) {

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/tracks/${id}`
    );

    if (!response.ok) {
        throw new Error("Unable to load track");
    }

    return await response.json();
}

export async function searchTracks(filters = {}) {

    const params = new URLSearchParams();

    params.append("offset", filters.offset ?? 0);
    params.append("limit", filters.limit ?? 20);

    if (filters.query) {
        params.append("query", filters.query);
    }

    if (filters.title) {
        params.append("title", filters.title);
    }

    if (filters.artist) {
        params.append("artist", filters.artist);
    }

    if (filters.album) {
        params.append("album", filters.album);
    }

    if (filters.genre) {
        params.append("genre", filters.genre);
    }

    const response = await apiFetch(
        `${ENV.CORE_API}/api/v1/tracks?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error("Search failed");
    }

    return await response.json();
}