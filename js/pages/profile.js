import { isLoggedIn } from "../utils/auth-utils.js";

document.addEventListener("DOMContentLoaded", () => {

    if (!isLoggedIn()) {

        alert("Session expired");

        window.location.href = "auth.html";
    }

});

// avatar preview
document.getElementById("uploadAvatar").addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById("avatarPreview").src = reader.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});