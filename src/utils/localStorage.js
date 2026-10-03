export const setItemInLocalStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getItemInLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item == null) return null;
    return JSON.parse(item);
  } catch {
    // Handle non-JSON values (e.g. plain strings from raw localStorage.setItem)
    return localStorage.getItem(key);
  }
};