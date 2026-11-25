// Request-local work only: no bookmark database or restart/replay queue.
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id || message?.type !== 'open-selected') return;
  if (!Array.isArray(message.urls) || !message.urls.length ||
      !message.urls.every(url => typeof url === 'string' && !/^javascript:/i.test(url.trim())) ||
      !['current', 'new'].includes(message.target) || !Number.isInteger(message.windowId) ||
      (message.target === 'current' && !Number.isInteger(message.tabId))) {
    respond({ failures: message?.urls?.length || 1 });
    return;
  }
  void (async () => {
    let failures = 0;
    const start = message.target === 'current' ? 1 : 0;
    for (const url of message.urls.slice(start)) {
      try { await chrome.tabs.create({ url, active: false, windowId: message.windowId }); }
      catch { failures++; }
    }
    if (start) {
      try { await chrome.tabs.update(message.tabId, { url: message.urls[0] }); }
      catch { failures++; }
    }
    // Disconnecting the popup does not cancel the work above.
    try { respond({ failures }); } catch { /* Popup already dismissed. */ }
  })();
  return true;
});
