// Request-local work only: no bookmark database or restart/replay queue.
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id) return;
  if (message?.type === 'bulk-change') {
    if (!Array.isArray(message.operations) || !message.operations.every(operation =>
      operation && typeof operation.id === 'string' &&
      ((operation.kind === 'move' && typeof operation.parentId === 'string') ||
       (operation.kind === 'title' && typeof operation.title === 'string')))) {
      respond({ error: 'Invalid bulk request' });
      return;
    }
    void (async () => {
      let changed = 0;
      let failures = 0;
      for (const operation of message.operations) {
        try {
          if (operation.kind === 'move') await chrome.bookmarks.move(operation.id, { parentId: operation.parentId });
          else await chrome.bookmarks.update(operation.id, { title: operation.title });
          changed++;
        } catch { failures++; }
      }
      try { respond({ changed, failures }); } catch { /* Popup already dismissed; work is complete. */ }
    })();
    return true;
  }
  if (message?.type !== 'open-selected') return;
  if (!Array.isArray(message.urls) || !message.urls.length ||
      !message.urls.every(url => typeof url === 'string' && !/^javascript:/i.test(url.trim())) ||
      !['current', 'new'].includes(message.target) || !Number.isInteger(message.windowId) ||
      (message.target === 'current' && !Number.isInteger(message.tabId))) {
    respond({ failures: message?.urls?.length || 1 });
    return;
  }
  void (async () => {
    let failures = 0;
    let firstTabId;
    const start = message.target === 'current' ? 1 : 0;
    for (const [index, url] of message.urls.slice(start).entries()) {
      try {
        const tab = await chrome.tabs.create({ url, active: false, windowId: message.windowId });
        if (index === 0 && start === 0) firstTabId = tab?.id;
      }
      catch { failures++; }
    }
    if (!start && message.activate === true && firstTabId !== undefined) {
      try { await chrome.tabs.update(firstTabId, { active: true }); }
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
