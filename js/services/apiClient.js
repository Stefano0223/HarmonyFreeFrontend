
/*
* Client centralizzato per tutte le chiamate AL CORE.
*/

export async function apiFetch(url, options = {}) {

    const token = localStorage.getItem("jwt");

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response;
}