// ==========================================
// GAME HUB COIN SYSTEM
// ==========================================

function getCoins() {

    return Number(
        localStorage.getItem(
            "gameHubCoins"
        ) || 0
    );

}


function saveCoins(
    amount
) {

    localStorage.setItem(
        "gameHubCoins",
        amount
    );

    updateCoinDisplay();

}


function addCoins(
    amount
) {

    if (
        amount <= 0
    ) {
        return;
    }

    const currentCoins =
        getCoins();

    saveCoins(
        currentCoins + amount
    );

}


function removeCoins(
    amount
) {

    if (
        amount <= 0
    ) {
        return;
    }

    const currentCoins =
        getCoins();

    const newAmount =
        Math.max(
            0,
            currentCoins - amount
        );

    saveCoins(
        newAmount
    );

}


function updateCoinDisplay() {

    const coinElement =
        document.getElementById(
            "coinBalance"
        );

    if (
        !coinElement
    ) {
        return;
    }

    coinElement.innerText =
        getCoins();

}


window.addEventListener(
    "load",
    updateCoinDisplay
);
