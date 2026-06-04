import { logout } from "../auth/logout.js";

export function getToken() {
    return localStorage.getItem("jwt");
}

export function isLoggedIn() {

    const token = localStorage.getItem("jwt");
    const expiration = localStorage.getItem("jwtExpiration");

    if (!token || !expiration) {
        return false;
    }

    if (Date.now() > Number(expiration)) {

        logout();

        return false;
    }

    return true;
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}