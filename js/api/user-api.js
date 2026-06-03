import { apiFetch } from "../services/apiClient.js";
import { AUTH_BASE_URL, CORE_BASE_URL } from "../services/config.js";

/**
 * Crea il profilo utente nel Core
 */
export async function createUser(userData) {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/users`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        }
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            errorText || "Unable to create user"
        );
    }

    return await response.json();
}

/**
 * Dati utente provenienti da Auth
 */
export async function getAuthCurrentUser() {

    const response = await apiFetch(
        `${AUTH_BASE_URL}/api/v1/users/me`
    );

    if (!response.ok) {
        throw new Error("Unable to load user");
    }

    return await response.json();
}

/**
 * Profilo Core dell'utente loggato
 */
export async function getCoreCurrentUserProfile() {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/users/me`
    );

    if (!response.ok) {
        throw new Error("Unable to load user profile");
    }

    return await response.json();
}

/**
 * Playlist dell'utente loggato
 */
export async function getMyPlaylists() {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/playlists/me`
    );

    if (!response.ok) {
        throw new Error("Unable to load playlists");
    }

    return await response.json();
}

/**
 * Preferiti dell'utente loggato
 */
export async function getMyFavorites() {

    const response = await apiFetch(
        `${CORE_BASE_URL}/api/v1/favorites/me`
    );

    if (!response.ok) {
        throw new Error("Unable to load favorites");
    }

    return await response.json();
}

/**
 * Profilo completo (Auth + Core)
 */
export async function getProfileData() {

    const [user, playlists, favorites] = await Promise.all([
        getCoreCurrentUserProfile(),
        getMyPlaylists(),
        getMyFavorites()
    ]);

    return {
        user,
        playlistCount: playlists.length,
        favoriteCount: favorites.length
    };
}