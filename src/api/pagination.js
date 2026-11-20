// Shared pagination guard for all frontend API calls.
// No request is allowed to ask the server for more than MAX_PER_PAGE records.

export const MAX_PER_PAGE = 15;

export const clampPerPage = (perPage) => {
  const value = Number(perPage);
  if (!Number.isFinite(value) || value < 1) return MAX_PER_PAGE;
  return Math.min(Math.floor(value), MAX_PER_PAGE);
};

const RECORD_KEYS = [
  "activities",
  "site_assets",
  "staffs",
  "visitors",
  "approval_history",
  "submissions",
  "hsns",
  "survey",
  "service_bookings",
  "buildings",
  "checklists",
  "incidents",
  "audits",
  "amenities",
  "amenity_bookings",
  "visitor_categories",
  "visitor_sub_categories",
  "konstruct_updates",
  "complaints",
  "pets",
  "cam_bills",
];

const toPositiveInt = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.ceil(number) : null;
};

// Accept both an axios response and the already-unwrapped response body.
const unwrap = (response) => {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    return response;
  }
  const hasEnvelope = "data" in response && !("total_pages" in response) && !("total_count" in response);
  return hasEnvelope ? response.data : response;
};

const extractRecords = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const key = RECORD_KEYS.find((candidate) => Array.isArray(payload[candidate]));
  if (key) return payload[key];

  const firstArray = Object.values(payload).find(Array.isArray);
  return firstArray || [];
};

const extractTotalPages = (payload, recordCount) => {
  if (!payload || typeof payload !== "object") return null;
  const meta = payload.meta && typeof payload.meta === "object" ? payload.meta : {};

  const totalPages = toPositiveInt(payload.total_pages ?? payload.totalPages ?? meta.total_pages);
  if (totalPages) return totalPages;

  const totalCount = toPositiveInt(
    payload.total_count ?? payload.totalCount ?? payload.count ?? meta.total_count
  );
  if (totalCount) return Math.ceil(totalCount / MAX_PER_PAGE);

  // Endpoints that return a bare array give us no metadata; keep going while
  // full pages are returned and stop on the first short page.
  return recordCount >= MAX_PER_PAGE ? null : 1;
};

/**
 * Fetch an entire list using pages of at most MAX_PER_PAGE records.
 *
 * @param {(page: number) => Promise<any>} requestPage called with 1-based page numbers
 * @param {{maxPages?: number, concurrency?: number}} options
 * @returns {Promise<any[]>} flattened records from every page
 */
export const fetchAllPages = async (requestPage, { maxPages = 1000, concurrency = 5 } = {}) => {
  const firstPayload = unwrap(await requestPage(1));
  const firstRecords = extractRecords(firstPayload);
  const records = [...firstRecords];

  const totalPages = extractTotalPages(firstPayload, firstRecords.length);
  if (totalPages === null) {
    // No pagination metadata: discover pages one at a time.
    for (let page = 2; page <= maxPages; page += 1) {
      const payload = unwrap(await requestPage(page));
      const pageRecords = extractRecords(payload);
      records.push(...pageRecords);

      const discovered = extractTotalPages(payload, pageRecords.length);
      if (discovered !== null && page >= discovered) break;
      if (discovered === null && pageRecords.length < MAX_PER_PAGE) break;
    }
    return records;
  }

  // Page count is known: fetch the remaining pages in small concurrent batches.
  const lastPage = Math.min(totalPages, maxPages);
  for (let start = 2; start <= lastPage; start += concurrency) {
    const end = Math.min(start + concurrency, lastPage + 1);
    const pageNumbers = Array.from({ length: end - start }, (_, index) => start + index);
    const payloads = await Promise.all(
      pageNumbers.map((page) => Promise.resolve(requestPage(page)).then(unwrap))
    );
    payloads.forEach((payload) => records.push(...extractRecords(payload)));
  }

  return records;
};
