function openDB(name, ver) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, ver);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(name)) {
                db.createObjectStore(name);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveValue(key, value, name, ver) {
    const db = await openDB(name, ver);
    const tx = db.transaction(name, "readwrite");
    const store = tx.objectStore(name);

    store.put(value, key);

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    })
}

async function loadValue(key, name, ver) {
    const db = await openDB(name, ver);
    const tx = db.transaction(name, "readonly");
    const store = tx.objectStore(name);

    return new Promise((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result);
    })
}
export { openDB, saveValue, loadValue };



