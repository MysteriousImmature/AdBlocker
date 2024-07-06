document.addEventListener('DOMContentLoaded', function() {
  // Fetch the number of blocked requests from declarativeNetRequest (not directly supported yet)
  // This is a placeholder for the actual blocked count logic
  document.getElementById('blockedCount').textContent = "N/A";

  document.getElementById('refreshButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: "refreshAdBlockList" }, function(response) {
      console.log('Ad block list refreshed:', response.status);
    });
  });
});
