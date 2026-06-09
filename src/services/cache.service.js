const store = new Map();

export const getCache = (key) => {
    const item = store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
        store.delete(key);
        return null;
    }
    return item.value;
};

export const setCache = (key, value, ttlMs = 30 * 60 * 1000) => {
    store.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
    });
};

export const clearCache = () => {
    store.clear();
    console.log("Caché limpiado");
};
