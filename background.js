const default_config = {
    maxGames: 5,
    username: 'kapi_szon420',
    blocked: true,
    losses: 9999,
    totalGames: 0
}

async function checkGamesPlayed() {
    // Get the maximum number of games and username from chrome.storage
    const items = await chrome.storage.sync.get({
        maxGames: 0,
        username: ''
    });
    let maxGames = items.maxGames;
    let username = items.username.toLowerCase();

    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let url = `https://api.chess.com/pub/player/${username}/games/${year}/${month}`;

    // Fetch data from the chess.com API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Data from chess.com API:', data);
            let losses = 0;
            let totalGames = 0;
            for (let game of data.games) {
                let dateOfGame = new Date(game.end_time * 1000);
                if (dateOfGame.getDate() === date.getDate() && dateOfGame.getMonth() === date.getMonth() && dateOfGame.getFullYear() === date.getFullYear()) {
                    if (game.white.username.toLowerCase() === username) {
                        if (game.black.result === 'win') {
                            losses++;
                        }
                    } else if (game.black.username.toLowerCase() === username) {
                        if (game.white.result === 'win') {
                            losses++;
                        }
                    }
                    totalGames++;
                }
            }

            // Update the number of losses in chrome.storage
            chrome.storage.sync.set({losses: losses, totalGames: totalGames});

            // Check if the user has exceeded the maximum number of losses allowed
            if (losses > maxGames) {
                chrome.storage.sync.set({blocked: true});
            } else {
                chrome.storage.sync.set({blocked: false});
            }
        });
}

// Check the number of games played every 5 minutes
setInterval(checkGamesPlayed, 300000);

// Run checkGamesPlayed when the extension is clicked
chrome.action.onClicked.addListener((tab) => {
    checkGamesPlayed();
});

// Run checkGamesPlayed when the current site is chess.com
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.includes("chess")) {
        checkGamesPlayed();
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'checkGamesPlayed') {
        checkGamesPlayed();
    }
});

// on install
chrome.runtime.onInstalled.addListener(function () {
    // set default values
    chrome.storage.sync.set(default_config);
    checkGamesPlayed();
});
