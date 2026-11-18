import axios from "axios";
import { getItemInLocalStorage } from "../utils/localStorage";
import {
  clearPublicAuth as clearPublicSession,
  getPublicSiteId,
  getPublicToken,
  isPublicMode,
  setPublicAuth as setPublicSession,
} from "../utils/publicAuth";

const axiosInstance = axios.create({
  // baseURL: "http://13.215.74.38",
  baseURL: "https://admin.vibecopilot.ai",
  // baseURL: "http://localhost:3000",
  // baseURL:"https://7pxl2l44-3000.inc1.devtunnels.ms",
});

/**
 * Public auth is seeded by app-launched pages from their URL query params.
 * Kept in src/utils/publicAuth.js so localStorage helpers can read the same
 * values without creating a circular import.
 */
export const setPublicAuth = (token, siteId, options) =>
  setPublicSession(token, siteId, options);

export const clearPublicAuth = () => clearPublicSession();

/** Returns the active token: URL-override first, then localStorage. */
export const getActiveToken = () =>
  getPublicToken() || getItemInLocalStorage("TOKEN") || null;

/** Returns the active siteId: URL-override first, then localStorage. */
export const getActiveSiteId = () =>
  getPublicSiteId() || getItemInLocalStorage("SITEID") || null;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getActiveToken();
    if (token) {
      // 1. Set Authorization header (works for APIs that check the header)
      config.headers["Authorization"] = `${token}`;

      // 2. Inject token into query params (works for APIs that check ?token=)
      config.params = config.params || {};
      if (isPublicMode()) {
        // API helpers bake a module-level token into params. On app-launched
        // pages that value is stale/missing, so the URL token must win.
        config.params.token = token;
      } else if (!config.params.token) {
        config.params.token = token;
      }
    }

    // 3. Inject site_id for public dashboard requests (if not already set)
    const siteId = getActiveSiteId();
    if (siteId && config.params && !config.params.site_id) {
      config.params.site_id = siteId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
