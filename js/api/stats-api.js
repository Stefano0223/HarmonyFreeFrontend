import { apiFetch } from "../services/apiClient.js";
import { CORE_BASE_URL } from "../services/config.js";

export async function getMostPopularTracks(limit = 10) {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/stats/tracks/most-popular?limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Unable to load popular tracks");
    }

    return await response.json();
}

export async function getMostFavoritedTracks(limit = 10) {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/stats/tracks/most-favorited?limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Unable to load favorited tracks");
    }

    return await response.json();
}