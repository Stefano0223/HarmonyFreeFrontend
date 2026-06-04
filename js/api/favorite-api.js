import { apiFetch } from "../services/apiClient.js";
import { CORE_BASE_URL } from "../services/config.js";

export async function getFavorites() {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/users/me/favorites`
    );

    return response.json();
}

export async function addFavorite(trackId) {

    await apiFetch(
        `${CORE_BASE_URL}/api/v1/users/me/favorites/${trackId}`,
        {
            method: "POST"
        }
    );
}

export async function removeFavorite(trackId) {

    await apiFetch(
        `${CORE_BASE_URL}/api/v1/users/me/favorites/${trackId}`,
        {
            method: "DELETE"
        }
    );
}