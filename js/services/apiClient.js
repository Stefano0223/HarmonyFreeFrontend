
/*
* Client centralizzato per tutte le chiamate al Core.
*/

import { CORE_API } from "./config.js";

export async function apiFetch(path, options = {}) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${CORE_API}${path}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {})
            }
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response;
}