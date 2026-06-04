export function logout() {

    localStorage.removeItem("jwt");
    localStorage.removeItem("user");

    window.location.href = "auth.html";
}