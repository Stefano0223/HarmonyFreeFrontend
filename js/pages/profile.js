import { isLoggedIn } from "../utils/auth-utils.js";

document.addEventListener("DOMContentLoaded", () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";
    }

});