
const loginBox = document.querySelector(".login-box");
const registerBox = document.querySelector(".register-box");

document.getElementById("showLogin").addEventListener("click", function(e) {
    e.preventDefault();
    registerBox.classList.remove("active");
    loginBox.classList.add("active");
});

document.getElementById("showRegister").addEventListener("click", function(e) {
    e.preventDefault();
    loginBox.classList.remove("active");
    registerBox.classList.add("active");
});

// start view
registerBox.classList.add("active");
