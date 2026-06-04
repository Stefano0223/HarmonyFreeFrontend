import { apiFetch } from "../services/apiClient.js";
import { CORE_BASE_URL } from "../services/config.js";

export async function addFavorite(trackId) {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/favorites/${trackId}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Unable to add favorite");
    }
}

export async function getFavorites() {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/favorites`
    );

    if (!response.ok) {
        throw new Error("Unable to load favorites");
    }

    return await response.json();
}

export async function removeFavorite(trackId) {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/favorites/${trackId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Unable to remove favorite");
    }
}