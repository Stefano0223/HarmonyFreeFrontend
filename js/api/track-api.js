import { apiFetch } from "../services/apiClient.js";
import { CORE_BASE_URL } from "../services/config.js";

export async function getAllTracks() {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/tracks`
    );

    if (!response.ok) {
        throw new Error("Unable to load tracks");
    }

    return await response.json();
}

export async function getTrackById(trackId) {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/tracks/${trackId}`
    );

    if (!response.ok) {
        throw new Error("Track not found");
    }

    return await response.json();
}

export async function searchTracks(filters = {}) {

    const params = new URLSearchParams();

    if (filters.title) {
        params.append("title", filters.title);
    }

    if (filters.artist) {
        params.append("artist", filters.artist);
    }

    if (filters.genre) {
        params.append("genre", filters.genre);
    }

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/tracks/search?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error("Search failed");
    }

    return await response.json();
}