
export async function getFromChromeStorage(key: string) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key])
    })
  })
}

export async function setToChromeStorage(key: string, value: any) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve(true)
    })
  })
}

export async function addToLocalStorageList(key: string, site: string) {
  try {
    const result = await chrome.storage.local.get(key);
    const stored = result[key] || [];
    if (!stored.includes(site)) {
      stored.push(site);
      await chrome.storage.local.set({ [key]: stored });
    }
  } catch (error) {
    console.error('Error adding to storage:', error);
  }
}

export async function removeFromLocalStorageList(key: string, site: string) {
  try {
    const result = await chrome.storage.local.get(['addedSites', 'removedSites']);
    const addedSites = result.addedSites || [];
    const removedSites = result.removedSites || [];

    if (addedSites.includes(site)) {
      // Remove from added sites
      const newAddedSites = addedSites.filter((s:any) => s !== site);
      await chrome.storage.local.set({ 'addedSites': newAddedSites });
    } else {
      // Add to removed sites
      if (!removedSites.includes(site)) {
        removedSites.push(site);
        await chrome.storage.local.set({ 'removedSites': removedSites });
      }
    }
  } catch (error) {
    console.error('Error removing from storage:', error);
  }
}