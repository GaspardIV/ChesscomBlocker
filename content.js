function setPageBlocked(document) {
// Create elegant overlay
    const overlay = document.createElement('div');
    overlay.id = 'chess-blocker-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(102, 0, 153, 0.9); z-index: 99999; cursor: not-allowed; ;'
    overlay.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        alert('Clicking is not allowed.');
    });
    overlay.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        event.stopPropagation();
        alert('Right-clicking is not allowed.');
    });

// Disable scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';

// Add overlay to page
    document.body.appendChild(overlay);

// Create message
    const message = document.createElement('div');
    message.id = 'chess-blocker-message';
    message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-family: Arial, Helvetica, sans-serif; font-size: 24px; text-align: center; width: 100%; z-index: 99999;'
    message.innerHTML = 'You have exceeded the maximum number of losses allowed.';
    overlay.appendChild(message);
}

function checkAndSetPageBlocked(document) {
    chrome.storage.sync.get({ blocked: false }, function (items) {
        if (items.blocked === true && window.location.href.includes('chess')) {
            setPageBlocked(document);
        }
    });
}

function handleStorageChanges(changes, namespace) {
    if (changes.blocked && changes.blocked.newValue === true && window.location.href.includes('chess')) {
        setPageBlocked(document);
    }
}

// Check if page should be blocked on initial load
checkAndSetPageBlocked(document);

// Listen for storage changes to determine if page should be blocked
chrome.storage.onChanged.addListener(handleStorageChanges);
