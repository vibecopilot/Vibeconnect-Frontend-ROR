import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { clearPublicAuth, setPublicAuth } from "../api/axiosInstance";
import ChecklistSubmissionForm from "../components/ChecklistSubmissionForm";
import {
  changeSiteForApp,
  getChecklistActivities,
  getChecklistGroups,
  getSiteAssets,
  getSiteData,
} from "../api";
import { MAX_PER_PAGE, fetchAllPages } from "../api/pagination";
import { updatePublicAuth, withPublicParams } from "../utils/publicAuth";

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.activities)) return value.activities;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const errorMessage = (error) => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(", ");
  if (data?.errors) {
    if (typeof data.errors === "string") return data.errors;
    return Object.entries(data.errors)
      .map(([field, messages]) => {
        const list = Array.isArray(messages) ? messages : [messages];
        return `${field}: ${list.join(", ")}`;
      })
      .join("; ");
  }
  if (data && typeof data === "object") {
    const details = Object.entries(data)
      .filter(([, messages]) => Array.isArray(messages) || typeof messages === "string")
      .map(([field, messages]) => {
        const list = Array.isArray(messages) ? messages : [messages];
        return `${field}: ${list.join(", ")}`;
      });
    if (details.length) return details.join("; ");
  }
  return data?.error || data?.message || error?.message || "Something went wrong.";
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Same frequency values used by the checklist configuration page.
const FREQUENCY_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "half_yearly", label: "Half Yearly" },
  { value: "yearly", label: "Yearly" },
];

const statusColor = (status) => {
  if (status === "pending") return "bg-amber-500";
  if (status === "overdue") return "bg-red-500";
  if (status === "complete") return "bg-emerald-500";
  return "bg-slate-500";
};

const SubmissionList = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [frequency, setFrequency] = useState("");
  const [assetId, setAssetId] = useState("");
  const [assetOptions, setAssetOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);
  const loadingMoreRef = useRef(false);
  const requestRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const response = await getChecklistGroups();
        const rows = asArray(response?.data ?? response);
        const options = rows
          .filter((row) => row?.info_type === "ChecklistGroup")
          .map((row) => ({ id: String(row.id), name: row.name }))
          .filter((option) => option.name)
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!cancelled) setCategoryOptions(options);
      } catch (categoryError) {
        console.error("Unable to load checklist categories:", categoryError);
      }
    };

    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchAssets = async () => {
      try {
        // site_id is injected by the public axios interceptor; load the whole
        // asset dropdown in 15-record pages.
        const rows = await fetchAllPages((page) =>
          getSiteAssets(undefined, page, MAX_PER_PAGE)
        );
        const options = rows
          .map((row) => ({ id: String(row.id), name: row.name }))
          .filter((option) => option.name)
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!cancelled) setAssetOptions(options);
      } catch (assetError) {
        console.error("Unable to load assets:", assetError);
      }
    };

    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, []);

  const buildParams = useCallback(
    (pageNumber) => ({
      page: pageNumber,
      perPage: 15,
      statuses: ["pending", "overdue"],
      categoryId: category || null,
      frequency: frequency || null,
      assetId: assetId || null,
      search: debouncedSearch,
      startDate: new Date().toISOString().split("T")[0],
    }),
    [assetId, category, debouncedSearch, frequency]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchFirstPage = async () => {
      const requestId = ++requestRef.current;
      try {
        setLoading(true);
        setError("");
        setTasks([]);
        setPage(1);
        setTotalPages(1);

        const response = await getChecklistActivities(buildParams(1));
        const data = response?.data ?? response;
        if (!cancelled && requestId === requestRef.current) {
          setTasks(asArray(data));
          setTotalPages(data?.total_pages || 1);
        }
      } catch (fetchError) {
        if (!cancelled && requestId === requestRef.current) {
          setError(errorMessage(fetchError));
        }
      } finally {
        if (!cancelled && requestId === requestRef.current) setLoading(false);
      }
    };

    fetchFirstPage();
    return () => {
      cancelled = true;
    };
  }, [buildParams]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMoreRef.current || page >= totalPages) return;

    const requestId = requestRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError("");

    try {
      const nextPage = page + 1;
      const response = await getChecklistActivities(buildParams(nextPage));
      const data = response?.data ?? response;

      if (requestId === requestRef.current) {
        setTasks((current) => [...current, ...asArray(data)]);
        setPage(nextPage);
        setTotalPages(data?.total_pages || totalPages);
      }
    } catch (moreError) {
      if (requestId === requestRef.current) setError(errorMessage(moreError));
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [buildParams, loading, page, totalPages]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || page >= totalPages) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "120px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loading, page, totalPages]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">My Checklists</h1>
          <p className="mt-1 text-sm text-slate-500">
            Open a pending checklist to answer and submit it.
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search checklist, asset or service"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />

            <select
              value={assetId}
              onChange={(event) => setAssetId(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value="">All assets</option>
              {assetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value="">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            <select
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            >
              <option value="">All frequencies</option>
              {FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(search || category || frequency || assetId) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setCategory("");
                setFrequency("");
                setAssetId("");
              }}
              className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-base font-medium text-slate-700">
              {search || category || frequency || assetId
                ? "No checklists match these filters"
                : "No pending checklists"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search || category || frequency || assetId
                ? "Try clearing a filter to see more results."
                : "You are all caught up for today."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                to={withPublicParams(`/apps/checklist/${task.id}`)}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-900">
                      {task.checklist_name || "Checklist"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.asset_name || task.soft_service_name || "Unassigned resource"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize text-white ${statusColor(
                      String(task.status || "").toLowerCase()
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                  <span>Due: {formatDateTime(task.start_time)}</span>
                  {task.assigned_to_name && <span>Assigned: {task.assigned_to_name}</span>}
                  {(task.checklist_category || task.checklist_group) && (
                    <span>Category: {task.checklist_category || task.checklist_group}</span>
                  )}
                  {task.checklist_frequency && <span>Frequency: {task.checklist_frequency}</span>}
                </div>
              </Link>
            ))}

            <div ref={sentinelRef} className="py-4 text-center text-xs text-slate-500">
              {loadingMore
                ? "Loading more checklists..."
                : page < totalPages
                  ? "Scroll down for more"
                  : "All checklists loaded"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Public checklist screens launched by the mobile app.
 *
 *   /apps/checklist?token=<token>&siteId=<id>          submission list
 *   /apps/checklist/:activityId?token=<token>&siteId=<id>  submission detail
 *
 * No protected-route wrapper and no app shell (navbar/sidebar) is used here.
 * The token from the URL seeds the shared axios auth before any child renders.
 */
const PublicChecklist = () => {
  const { activityId } = useParams();
  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token") ||
    searchParams.get("api_key") ||
    searchParams.get("apiKey") ||
    searchParams.get("auth_token");
  const siteIdParam =
    searchParams.get("siteId") || searchParams.get("site_id");
  const userIdParam =
    searchParams.get("userId") || searchParams.get("user_id");
  const vibeUserIdParam = searchParams.get("vibeUserId");

  const [resolvedSiteId, setResolvedSiteId] = useState(siteIdParam);
  const [ready, setReady] = useState(false);
  const effectiveSiteId = siteIdParam || resolvedSiteId;

  // Seeding during render guarantees children see the URL token on their very
  // first render (including state initialisers that read localStorage).
  setPublicAuth(token, effectiveSiteId, {
    userId: userIdParam,
    vibeUserId: vibeUserIdParam,
  });

  useEffect(() => {
    setResolvedSiteId(siteIdParam);
  }, [siteIdParam]);

  useEffect(() => {
    if (!token) {
      setReady(false);
      return undefined;
    }

    let cancelled = false;
    setReady(false);

    (async () => {
      try {
        if (siteIdParam) {
          try {
            await changeSiteForApp(siteIdParam);
          } catch (siteError) {
            console.error("Unable to select app site:", siteError);
          }
        } else {
          try {
            const response = await getSiteData();
            const sites = response?.data?.sites || [];
            const selected = sites[0];
            if (selected && !cancelled) {
              setResolvedSiteId(selected.id);
              try {
                await changeSiteForApp(selected.id);
              } catch (siteError) {
                console.error("Unable to select resolved site:", siteError);
              }
            }
          } catch (siteError) {
            console.error("Unable to resolve site from token:", siteError);
          }
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, siteIdParam]);

  // Drop the in-memory public credentials when leaving the public flow.
  useEffect(
    () => () => {
      if (!window.location.pathname.startsWith("/apps/checklist")) {
        clearPublicAuth();
      }
    },
    []
  );

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow">
          <h1 className="text-lg font-semibold text-gray-800">
            Missing access token
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Open this page from the app so the access token is included in the
            link.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const backLink = (
    <Link
      to={withPublicParams("/apps/checklist")}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
    >
      ← Back to checklists
    </Link>
  );

  if (activityId) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800">
        <div className="mx-auto w-full max-w-3xl">
          <ChecklistSubmissionForm
            key={activityId}
            activityId={activityId}
            backLink={backLink}
          />
        </div>
      </div>
    );
  }

  return <SubmissionList />;
};

export default PublicChecklist;
