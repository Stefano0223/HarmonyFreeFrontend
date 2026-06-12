export function logout() {

    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("jwtExpiration");

    window.location.href = "auth.html";
}