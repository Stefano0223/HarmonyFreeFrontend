import { apiFetch } from "../services/apiClient.js";

export async function getFavorites() {

    const response = await apiFetch(
        "/api/v1/users/me/favorites"
    );

    return response.json();
}

export async function addFavorite(trackId) {

    await apiFetch(
        `/api/v1/users/me/favorites/${trackId}`,
        {
            method: "POST"
        }
    );
}

export async function removeFavorite(trackId) {

    await apiFetch(
        `/api/v1/users/me/favorites/${trackId}`,
        {
            method: "DELETE"
        }
    );
}