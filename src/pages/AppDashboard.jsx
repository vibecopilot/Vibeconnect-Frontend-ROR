import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";

import { setPublicAuth, clearPublicAuth } from "../api/axiosInstance";
import { getSiteData, siteChange } from "../api";

import HighchartsComponent from "../components/HighCharts";
import TicketDashboard from "./SubPages/TicketDashboard";
import SoftServiceHighCharts from "../components/SoftServicesHighCharts";
import AssetDashboard from "./SubPages/AssetDashboard";
import ComplianceDashboard from "./SubPages/ComplianceDashboard";
import PPMCalendarDashboard from "./SubPages/PPMCalendarDashboard";
import VisitorsAnalyticsDashboard from "./SubPages/VisitorsAnalyticsDashboard";
import StaffAnalyticsDashboard from "./SubPages/StaffAnalyticsDashboard";

/* ─────────────────────────────────────────────────────────────────────────────
   Public Dashboard Context
   Children (TicketDashboard, etc.) can consume { siteId, token } from here
   instead of reading localStorage.
────────────────────────────────────────────────────────────────────────────── */
export const PublicDashboardContext = createContext({ siteId: null, token: null });
export const usePublicDashboard = () => useContext(PublicDashboardContext);

/* ─────────────────────────────────────────────────────────────────────────────
   SectionCard
────────────────────────────────────────────────────────────────────────────── */
const SectionCard = ({ title, subtitle = "Analytics & overview", children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-xs sm:text-sm text-gray-500 truncate">{subtitle}</p>
        ) : null}
      </div>
    </div>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   AppDashboard — publicly accessible via:
   /apps/dashboard?siteId=47&token=<token>
   No localStorage read or write.
────────────────────────────────────────────────────────────────────────────── */
const BRAND_COLOR = "#4F46E5"; // indigo fallback (no redux in incognito)

const AppDashboard = () => {
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [siteName, setSiteName] = useState("");
  const [siteData, setSiteData] = useState([]);
  const [siteOpen, setSiteOpen] = useState(false);
  const [ready, setReady] = useState(false); // true after auth is set

  const dropdownRef = useRef(null);

  /* ── Step 1: Read URL params, set module-level auth (no localStorage) ── */
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const urlSiteId = searchParams.get("siteId");

    if (urlToken) setToken(urlToken);
    if (urlSiteId) setSiteId(urlSiteId);

    // Inject into axiosInstance interceptor — all child API calls will
    // automatically include token (header + ?token=) and site_id param.
    setPublicAuth(urlToken, urlSiteId);
    setReady(true);

    // Clean up when user leaves the page so regular auth is restored.
    return () => clearPublicAuth();
  }, [searchParams]);

  /* ── Step 2: Fetch site list & resolve site name from siteId ── */
  useEffect(() => {
    if (!ready || !token) return;

    const fetchSites = async () => {
      try {
        const res = await getSiteData();
        const sites = res?.data?.sites || [];
        setSiteData(sites);

        if (siteId) {
          const match = sites.find((s) => String(s.id) === String(siteId));
          if (match) setSiteName(match.name);
        }
      } catch (err) {
        console.error("Error fetching sites:", err);
      }
    };
    fetchSites();
  }, [ready, token, siteId]);

  /* ── Site switcher ── */
  const toggleSite = () => setSiteOpen((v) => !v);

  const handleSiteChange = async (id, name) => {
    try {
      await siteChange(id);
      // Update module-level override with new siteId (no localStorage)
      setPublicAuth(token, id);
      setSiteId(String(id));
      setSiteName(name);
      setSiteOpen(false);
      // Reload so all child dashboards re-fetch with the new siteId
      window.location.href =
        `/apps/dashboard?siteId=${id}&token=${token}`;
    } catch (err) {
      console.error("Error changing site:", err);
    }
  };

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSiteOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Render ── */
  return (
    <PublicDashboardContext.Provider value={{ siteId, token }}>
      <section className="flex bg-gray-50 min-h-screen w-full">
        <div className="w-full flex flex-col overflow-x-hidden pb-12">

          {/* ── TOP HEADER (always visible, no login needed) ── */}
          <header className="px-3 sm:px-5 pt-3 sticky top-0 z-30 bg-gray-50">
            <div
              style={{ background: BRAND_COLOR }}
              className="w-full rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(79,70,229,0.25)]"
            >
              {/* Logo */}
              <h1 className="text-white font-bold text-base sm:text-lg whitespace-nowrap tracking-tight">
                Vibe Connect
              </h1>

              {/* Site selector */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={toggleSite}
                  className="flex items-center gap-1.5 font-medium px-3 py-2 rounded-xl
                             bg-white/15 hover:bg-white/25 active:bg-white/30
                             transition text-white text-sm max-w-[55vw] sm:max-w-xs"
                >
                  <FaBuilding className="shrink-0" />
                  <span className="truncate">{siteName || "Select Site"}</span>
                  {siteOpen
                    ? <MdExpandLess size={18} className="shrink-0" />
                    : <MdExpandMore size={18} className="shrink-0" />}
                </button>

                {siteOpen && (
                  <div
                    className="absolute right-0 mt-2 bg-white border border-gray-200
                               rounded-2xl shadow-xl max-h-64 w-60 sm:w-72
                               overflow-y-auto z-50 p-1.5"
                  >
                    {siteData.length ? (
                      siteData.map((s) => (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => handleSiteChange(s.id, s.name)}
                          className="w-full text-left px-3 py-2 rounded-xl
                                     hover:bg-indigo-50 text-gray-800 text-sm transition"
                        >
                          <span className="block truncate">{s.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-gray-400 text-center">
                        No sites found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ── CONTENT ── */}
          {!ready ? (
            /* Loading spinner while auth is being seeded */
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-4
                              border-indigo-500 border-t-transparent" />
            </div>
          ) : (
            <main className="px-3 sm:px-5 mt-4 space-y-4">
              <SectionCard title="Asset Analytics">
                <AssetDashboard />
              </SectionCard>
              <SectionCard title="PPM Calendar">
                <PPMCalendarDashboard />
              </SectionCard>
              <SectionCard title="Ticket">
                <TicketDashboard />
              </SectionCard>

              <SectionCard title="Highcharts Overview">
                <HighchartsComponent />
              </SectionCard>

              <SectionCard title="Visitors Dashboard">
                <VisitorsAnalyticsDashboard />
              </SectionCard>

              <SectionCard title="Staff Dashboard">
                <StaffAnalyticsDashboard />
              </SectionCard>

              <SectionCard title="Compliance">
                <ComplianceDashboard />
              </SectionCard>

              <SectionCard title="Soft Service">
                <SoftServiceHighCharts />
              </SectionCard>

            </main>
          )}
        </div>
      </section>
    </PublicDashboardContext.Provider>
  );
};

export default AppDashboard;
