/**
 * Public (app-launched) session state.
 *
 * The mobile app opens checklist pages with a token in the URL, e.g.
 *   /apps/checklist?token=<token>&siteId=<id>
 *
 * This module keeps those values in memory (never writes them to storage) and
 * exposes them to the axios interceptor and to `getItemInLocalStorage`, so all
 * existing pages/API helpers work unchanged while a public page is open.
 */

let publicSession = {
  token: null,
  siteId: null,
  userId: null,
  vibeUserId: null,
};

const clean = (value) =>
  value === undefined || value === null || value === "" ? null : String(value);

export const setPublicAuth = (token, siteId, options = {}) => {
  publicSession = {
    token: clean(token),
    siteId: clean(siteId ?? options.siteId),
    userId: clean(options.userId),
    vibeUserId: clean(options.vibeUserId),
  };
};

export const updatePublicAuth = (patch = {}) => {
  publicSession = {
    token: clean(patch.token ?? publicSession.token),
    siteId: clean(patch.siteId ?? publicSession.siteId),
    userId: clean(patch.userId ?? publicSession.userId),
    vibeUserId: clean(patch.vibeUserId ?? publicSession.vibeUserId),
  };
};

export const clearPublicAuth = () => {
  publicSession = { token: null, siteId: null, userId: null, vibeUserId: null };
};

export const getPublicToken = () => publicSession.token;
export const getPublicSiteId = () => publicSession.siteId;
export const isPublicMode = () => Boolean(publicSession.token);

/**
 * Values exposed through getItemInLocalStorage while a public page is open.
 * Returning `undefined` means "no override" so the caller falls back to
 * whatever is actually in localStorage.
 */
export const getPublicStorageValue = (key) => {
  if (!isPublicMode()) return undefined;

  switch (key) {
    case "TOKEN":
      return publicSession.token ?? undefined;
    case "SITEID":
      return publicSession.siteId ?? undefined;
    case "UserId":
      return publicSession.userId ?? undefined;
    case "VIBEUSERID":
      return publicSession.vibeUserId ?? undefined;
    default:
      return undefined;
  }
};

/** Query string forwarded between the public checklist screens. */
export const getPublicQueryString = () => {
  if (typeof window === "undefined") return "";

  const current = new URLSearchParams(window.location.search);
  const forward = new URLSearchParams();
  [
    "token",
    "api_key",
    "apiKey",
    "auth_token",
    "siteId",
    "site_id",
    "userId",
    "user_id",
    "vibeUserId",
  ].forEach((key) => {
    const value = current.get(key);
    if (value) forward.set(key, value);
  });

  const query = forward.toString();
  return query ? `?${query}` : "";
};

/** Append the app-provided auth params to an internal navigation target. */
export const withPublicParams = (path) => {
  if (!isPublicMode()) return path;
  const query = getPublicQueryString();
  if (!query) return path;
  return `${path}${path.includes("?") ? "&" : "?"}${query.slice(1)}`;
};

/** Destination used by every "back to checklist" action. */
export const checklistListPath = () =>
  isPublicMode() ? withPublicParams("/apps/checklist") : "/assets/checklist";
