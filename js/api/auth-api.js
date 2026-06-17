import { ENV } from "../services/config.js";

export async function register(userData) {

    console.log(ENV.AUTH_API);

    const response = await fetch(
        `${ENV.AUTH_API}/api/v1/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        }
    );

    if (!response.ok) {
        throw new Error("Registration failed");
    }
}

export async function login(email, password) {

    const response = await fetch(
        `${ENV.AUTH_API}/api/v1/auth/login`,
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
    localStorage.setItem("jwt", data.token);

    localStorage.setItem(
        "jwtExpiration",
        Date.now() + 3600000    //il token scade dopo 1 ora
    );

    return data.token;
}

export async function getMe() {
    console.log(localStorage.getItem("jwt"));
    console.log(ENV.AUTH_API);
    const response = await fetch(
        `${ENV.AUTH_API}/api/v1/users/me`,
        {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Unable to load current user");
    }

    return await response.json();
}

export async function patchEmail(request) {

    const response = await fetch(
        `${ENV.AUTH_API}/api/v1/users/me/email`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        throw new Error("Unable to update email");
    }

    return await response.json();
}