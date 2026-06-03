import { AUTH_API } from "./config.js";

export async function register(data) {

    const response = await fetch(
        `${AUTH_API}/api/v1/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.text();
}

export async function login(email, password) {

    const response = await fetch(
        `${AUTH_API}/api/v1/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    if (!response.ok) {
        throw new Error("Login fallito");
    }

    const data = await response.json();

    // Salva il JWT
    localStorage.setItem("token", data.token);

    return data;
}

export function logout() {
    localStorage.removeItem("token");
}