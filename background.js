async function fetchAdBlockList() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/AdAway/adaway.github.io/master/hosts.txt');
    const text = await response.text();
    const adBlockList = text.split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.trim().replace('127.0.0.1 ', '').replace('0.0.0.0 ', ''));

    const rules = adBlockList.map((domain, index) => ({
      "id": index + 1,
      "priority": 1,
      "action": { "type": "block" },
      "condition": { "urlFilter": `*://${domain}/*`, "resourceTypes": ["main_frame", "sub_frame", "script", "image", "stylesheet"] }
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from(Array(rules.length).keys(), x => x + 1),
      addRules: rules
    });

  } catch (error) {
    console.error('Error fetching ad block list:', error);
  }
}

chrome.runtime.onInstalled.addListener(fetchAdBlockList);
chrome.runtime.onStartup.addListener(fetchAdBlockList);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "refreshAdBlockList") {
    fetchAdBlockList();
    sendResponse({ status: "updated" });
  }
  return true;
});
