let user = document.getElementById("user");
let password = document.getElementById("password");
let login = document.getElementById("login");

login.addEventListener("click", (e) => {
    e.preventDefault();
    if (user.value == "admin" && password.value == "1234") {
        localStorage.setItem("user", "admin");
        window.location.href = "unOrders.html";
    } else {
        alert("Wrong Username or Password");
    }
});