import { getPublicStorageValue } from "./publicAuth";

export const setItemInLocalStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getItemInLocalStorage = (key) => {
  // While a public app-launched page is open, values supplied in its URL
  // take precedence over anything stored in the browser.
  const publicValue = getPublicStorageValue(key);
  if (publicValue !== undefined) return publicValue;

  try {
    const item = localStorage.getItem(key);
    if (item == null) return null;
    return JSON.parse(item);
  } catch {
    // Handle non-JSON values (e.g. plain strings from raw localStorage.setItem)
    return localStorage.getItem(key);
  }
};
