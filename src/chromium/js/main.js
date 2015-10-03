// Set the test title using i18n values
document.getElementById('extension-title').textContent = chrome.i18n.getMessage('extensionName');

// Set the test greeting using the CoreAPI
document.getElementById('extension-greeting').textContent = CoreAPI.getGreeting();