function showAccount() {
    document.getElementById("accountWindow").style.display = "flex";

    const savedUsername = localStorage.getItem("gameHubUsername");

    if (savedUsername) {
        document.getElementById("username").value = savedUsername;

        document.getElementById("accountMessage").innerText =
            "Welcome back, " + savedUsername + "!";
    }
}

function closeAccount() {
    document.getElementById("accountWindow").style.display = "none";
}

function login() {
    const username = document.getElementById("username").value.trim();

    if (username === "") {
        document.getElementById("accountMessage").innerText =
            "Please enter a username.";

        return;
    }

    localStorage.setItem("gameHubUsername", username);

    document.getElementById("accountMessage").innerText =
        "Account saved! Welcome, " + username + "!";
}

function logout() {
    localStorage.removeItem("gameHubUsername");

    document.getElementById("username").value = "";

    document.getElementById("accountMessage").innerText =
        "You have been logged out.";
}
