import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getSiteData, siteChange } from "../api";
import { getItemInLocalStorage, setItemInLocalStorage } from "../utils/localStorage";
import "react-datepicker/dist/react-datepicker.css";

import HighchartsComponent from "../components/HighCharts";
import TicketDashboard from "./SubPages/TicketDashboard";
import SoftServiceHighCharts from "../components/SoftServicesHighCharts";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import AssetDashboard from "./SubPages/AssetDashboard";
import ComplianceDashboard from "./SubPages/ComplianceDashboard";
import PPMCalendarDashboard from "./SubPages/PPMCalendarDashboard";
import VisitorsAnalyticsDashboard from "./SubPages/VisitorsAnalyticsDashboard";
import StaffAnalyticsDashboard from "./SubPages/StaffAnalyticsDashboard";
import { useSearchParams } from "react-router-dom";

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

const AppDashboard = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [feat, setFeat] = useState([]);
  const [siteOpen, setSiteOpen] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [ready, setReady] = useState(false);

  const dropdownRef = useRef(null);
  const [searchParams] = useSearchParams();

  /**
   * ✅ STEP 1 — Seed localStorage from URL params so all API calls work
   *    without requiring the user to be logged in.
   *    Runs once on mount / whenever URL params change.
   */
  useEffect(() => {
    const urlSiteId = searchParams.get("siteId");
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setItemInLocalStorage("TOKEN", urlToken);
    }
    if (urlSiteId) {
      setItemInLocalStorage("SITEID", urlSiteId);
    }

    // Mark ready so child dashboards mount after localStorage is set
    setReady(true);
  }, [searchParams]);

  /** ✅ STEP 2 — Load features from localStorage (if any) */
  useEffect(() => {
    let storedFeatures = getItemInLocalStorage("FEATURES");
    if (typeof storedFeatures === "string") {
      try { storedFeatures = JSON.parse(storedFeatures); } catch { storedFeatures = []; }
    }
    if (Array.isArray(storedFeatures)) {
      setFeat(
        storedFeatures
          .map((f) => (f?.feature_name || "").toString().toLowerCase().trim())
          .filter(Boolean)
      );
    } else {
      setFeat([]);
    }
  }, []);

  /** ✅ STEP 3 — Fetch sites list (token is now in localStorage) */
  useEffect(() => {
    if (!ready) return;
    const fetchSiteData = async () => {
      try {
        const response = await getSiteData();
        const sites = response?.data?.sites || [];
        setSiteData(sites);

        // Resolve site name from URL siteId OR stored SITEID
        const urlSiteId = searchParams.get("siteId");
        const storedSiteId = getItemInLocalStorage("SITEID");
        const activeSiteId = urlSiteId || storedSiteId;
        if (activeSiteId) {
          const matched = sites.find((s) => String(s.id) === String(activeSiteId));
          if (matched) {
            setSiteName(matched.name);
            setItemInLocalStorage("SITENAME", matched.name);
          }
        } else {
          const storedName = getItemInLocalStorage("SITENAME");
          if (storedName) setSiteName(storedName);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
        // Still show stored name if API fails
        const storedName = getItemInLocalStorage("SITENAME");
        if (storedName) setSiteName(storedName);
      }
    };
    fetchSiteData();
  }, [ready]);

  const toggleSite = () => setSiteOpen((v) => !v);

  const handleSiteChange = async (id, name) => {
    try {
      await siteChange(id);
      setItemInLocalStorage("SITEID", id) || 1;
      setItemInLocalStorage("SITENAME", name);
      setSiteName(name);
      setSiteOpen(false);

      // ✅ keep (if your app depends on full reload)
      window.location.reload();
    } catch (error) {
      console.error("Error changing site:", error);
    }
  };

  /** ✅ close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSiteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fallback brand color when no redux theme is loaded (e.g. incognito/no login)
  const headerBg = themeColor || "#4F46E5";

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <div className="w-full flex flex-col overflow-hidden pb-10">
        {/* ✅ TOP HEADER — always visible, no auth required */}
        <header className="px-3 sm:px-5 pt-3 sticky top-0 z-30">
          <div
            style={{ background: headerBg }}
            className="w-full rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          >
            <h1 className="text-white font-semibold text-base sm:text-lg whitespace-nowrap">
              Vibe Connect
            </h1>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleSite}
                className="cursor-pointer flex items-center gap-2 font-medium px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-white text-sm"
              >
                <FaBuilding />
                <span className="max-w-[120px] sm:max-w-[220px] truncate">
                  {siteName || "Select Site"}
                </span>
                {siteOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
              </button>

              {siteOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-72 w-64 sm:w-80 overflow-y-auto z-50 p-2">
                  {siteData.length ? (
                    siteData.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => handleSiteChange(s.id, s.name)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-800 text-sm"
                      >
                        <span className="block truncate">{s.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No sites found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ✅ CONTENT — only mount after token is in localStorage */}
        {!ready ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <main className="px-3 sm:px-5 mt-4 space-y-4">
            {feat.includes("assets") && (
              <SectionCard title="Asset Analytics">
                <AssetDashboard />
              </SectionCard>
            )}

            {feat.includes("assets") && (
              <SectionCard title="PPM Calendar">
                <PPMCalendarDashboard />
              </SectionCard>
            )}

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

            {feat.includes("compliance") && (
              <SectionCard title="Compliance">
                <ComplianceDashboard />
              </SectionCard>
            )}

            {feat.includes("soft_services") && (
              <SectionCard title="Soft Service">
                <SoftServiceHighCharts />
              </SectionCard>
            )}
          </main>
        )}
      </div>
    </section>
  );
};

export default AppDashboard;

