import { apiFetch } from "../services/apiClient.js";
import { CORE_BASE_URL } from "../services/config.js";

const API_URL = `${CORE_BASE_URL}/api/v1/users/me/favorites`;

export async function getFavorites() {

    const token = localStorage.getItem("jwt");

    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Cannot load favorites");
    }

    return await response.json();
}

export async function addFavorite(jamendoTrackId) {

    const token = localStorage.getItem("jwt");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            jamendoTrackId
        })
    });

    if (!response.ok) {
        throw new Error("Cannot add favorite");
    }

    return await response.json();
}

export async function removeFavorite(trackId) {

    const token = localStorage.getItem("jwt");

    const response = await fetch(
        `${API_URL}/${trackId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Cannot remove favorite");
    }
}