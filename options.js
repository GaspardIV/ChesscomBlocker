// Save options to chrome.storage
function save_options() {
    let maxGames = document.getElementById('max-games').value;
    let username = document.getElementById('username').value;
    chrome.storage.sync.set({maxGames: maxGames, username: username});
}


function update_data() {
    chrome.storage.sync.get({maxGames: 5, username: '', losses: 999, totalGames: 0, blocked: false},
        function (items) {
            document.getElementById('max-games').value = items.maxGames;
            document.getElementById('username').value = items.username;
            document.getElementById('blocked').textContent = items.losses;
            document.getElementById('games-played').textContent = items.totalGames;
        });
}
// Load options from chrome.storage
function load_options() {
    update_data()
}

// Add an event listener to the chrome.storage.onChanged event
chrome.storage.onChanged.addListener(function (changes, namespace) {
    update_data()
});

document.getElementById('options-form').addEventListener('submit', function (event) {
    event.preventDefault();
    chrome.runtime.sendMessage({action: 'checkGamesPlayed'});
});

// Add event listeners
document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('options-form').addEventListener('submit', save_options);
