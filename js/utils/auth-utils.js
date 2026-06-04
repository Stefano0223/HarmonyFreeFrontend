export function getToken() {
    return localStorage.getItem("jwt");
}

export function isLoggedIn() {
    return !!getToken();
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}