let adBlockEnabled = true;
let blockedAdsCount = 0;

chrome.runtime.onInstalled.addListener(() => {
  updateAdBlockRules();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleAdBlock") {
    adBlockEnabled = !adBlockEnabled;
    updateAdBlockRules();
    sendResponse({ adBlockEnabled });
  } else if (message.action === "getBlockedAdsCount") {
    chrome.storage.local.get('blockedAdsCount', (data) => {
      sendResponse({ blockedAdsCount: data.blockedAdsCount || 0 });
    });
  }
  return true;
});

function updateAdBlockRules() {
  if (adBlockEnabled) {
    chrome.webRequest.onBeforeRequest.addListener(
      blockRequest,
      { urls: ["*://*.doubleclick.net/*", "*://*.googlesyndication.com/*"] },
      ["blocking"]
    );
  } else {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
  }
}

function blockRequest(details) {
  blockedAdsCount++;
  chrome.storage.local.set({ blockedAdsCount });
  return { cancel: true };
}
