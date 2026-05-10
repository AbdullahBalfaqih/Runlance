// Background service worker for Career AI extension
importScripts('config.js');

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default storage values
  chrome.storage.local.set({
    apiBaseUrl: CONFIG.BASE_URL + CONFIG.API_PATH,
    personaId: 'demo-user',
    apiToken: 'demo-token',
  });

  // Context menu for quick analysis
  chrome.contextMenus.create({
    id: 'analyzeSelection',
    title: 'Analyze with Career AI',
    contexts: ['selection'],
  });

  // Background sync for saving analyses
  chrome.alarms.create('syncAnalyses', { periodInMinutes: 5 });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStoredData') {
    chrome.storage.local.get(null, (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (request.action === 'setStoredData') {
    chrome.storage.local.set(request.data, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Background sync listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncAnalyses') {
    syncPendingAnalyses();
  }
});

async function syncPendingAnalyses() {
  chrome.storage.local.get(['pendingAnalyses'], (data) => {
    if (data.pendingAnalyses && data.pendingAnalyses.length > 0) {
      console.log('Syncing analyses:', data.pendingAnalyses);
    }
  });
}

// Context menu listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeSelection') {
    const selectedText = info.selectionText;
    chrome.tabs.sendMessage(tab.id, {
      action: 'analyzeText',
      text: selectedText,
    });
  }
});
