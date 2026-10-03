import axios from "axios";
import { getItemInLocalStorage } from "../utils/localStorage";

const axiosInstance = axios.create({
  // baseURL: "http://13.215.74.38",
  baseURL: "https://admin.vibecopilot.ai",
  // baseURL:"https://7pxl2l44-3000.inc1.devtunnels.ms",
});

/**
 * Module-level public auth store.
 * Set by AppDashboard when token/siteId arrive via URL params.
 * These take priority over localStorage so the page works in incognito
 * without any localStorage read or write.
 */
let _publicToken = null;
let _publicSiteId = null;

export const setPublicAuth = (token, siteId) => {
  _publicToken = token || null;
  _publicSiteId = siteId || null;
};

export const clearPublicAuth = () => {
  _publicToken = null;
  _publicSiteId = null;
};

/** Returns the active token: URL-override first, then localStorage. */
export const getActiveToken = () =>
  _publicToken || getItemInLocalStorage("TOKEN") || null;

/** Returns the active siteId: URL-override first, then localStorage. */
export const getActiveSiteId = () =>
  _publicSiteId || getItemInLocalStorage("SITEID") || null;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getActiveToken();
    if (token) {
      // 1. Set Authorization header (works for APIs that check the header)
      config.headers["Authorization"] = `${token}`;

      // 2. Inject token into query params (works for APIs that check ?token=)
      config.params = config.params || {};
      if (!config.params.token) {
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
