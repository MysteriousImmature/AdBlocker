document.addEventListener('DOMContentLoaded', () => {
  const blockedAdsCountElem = document.getElementById('blockedAdsCount');
  const toggleButton = document.getElementById('toggleButton');

  let adBlockEnabled = true;

  chrome.runtime.sendMessage({ action: 'getBlockedAdsCount' }, (response) => {
    blockedAdsCountElem.textContent = response.blockedAdsCount;
  });

  toggleButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'toggleAdBlock' }, (response) => {
      adBlockEnabled = response.adBlockEnabled;
      updateToggleButton();
    });
  });

  function updateToggleButton() {
    toggleButton.textContent = adBlockEnabled ? 'Turn Off' : 'Turn On';
  }
});
