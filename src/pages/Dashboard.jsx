import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { getVibeCalendar, getSiteData, siteChange } from "../api";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../utils/localStorage";
import "react-datepicker/dist/react-datepicker.css";

import HighchartsComponent from "../components/HighCharts";
import TicketDashboard from "./SubPages/TicketDashboard";
import SoftServiceHighCharts from "../components/SoftServicesHighCharts";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import AssetDashboard from "./SubPages/AssetDashboard";
import ComplianceDashboard from "./SubPages/ComplianceDashboard";
import ReadingDashboard from "./SubPages/ReadingDashboard";
import PPMCalendarDashboard from "./SubPages/PPMCalendarDashboard";

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 truncate">
          Analytics & overview
        </p>
      </div>
    </div>
    {children}
  </div>
);

const Dashboard = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const vibeUserId = getItemInLocalStorage("VIBEUSERID");

  const [feat, setFeat] = useState([]);
  const [siteOpen, setSiteOpen] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const [siteName, setSiteName] = useState("");

  const dropdownRef = useRef(null);

  // ✅ always keep current sitename in state
  useEffect(() => {
    const storedName = getItemInLocalStorage("SITENAME");
    if (storedName) setSiteName(storedName);
  }, []);

  // ✅ features
  useEffect(() => {
    let storedFeatures = getItemInLocalStorage("FEATURES");

    if (typeof storedFeatures === "string") {
      try {
        storedFeatures = JSON.parse(storedFeatures);
      } catch {
        storedFeatures = [];
      }
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

  // ✅ calendar (safe)
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        if (!vibeUserId) return;
        await getVibeCalendar(vibeUserId);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCalendar();
  }, [vibeUserId]);

  // ✅ sites list
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await getSiteData();
        setSiteData(response?.data?.sites || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSiteData();
  }, []);

  const toggleSite = () => setSiteOpen((v) => !v);

  const handleSiteChange = async (id, nameWithRegion) => {
    try {
      await siteChange(id);
      setItemInLocalStorage("SITEID", id);
      setItemInLocalStorage("SITENAME", nameWithRegion);
      setSiteName(nameWithRegion);
      setSiteOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error changing site:", error);
    }
  };

  // ✅ close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSiteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="flex bg-gray-50 min-h-screen">
      <Navbar />

      <div className="w-full flex flex-col overflow-hidden pb-10">
        {/* ✅ TOP HEADER (sticky like modern UI) */}
        <header className="px-3 sm:px-5 pt-3">
          <div
            style={{ background: themeColor }}
            className="w-full rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
          >
            <h1 className="text-white font-semibold text-base sm:text-lg">
              Vibe Connect
            </h1>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleSite}
                className="cursor-pointer flex items-center gap-2 font-medium px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-white"
              >
                <FaBuilding />
                <span className="max-w-[160px] sm:max-w-[260px] truncate">
                  {siteName || "Select Site"}
                </span>
                {siteOpen ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
              </button>

              {siteOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-80 w-80 overflow-y-auto z-20 p-2">
                  {siteData.length ? (
                    siteData.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSiteChange(s.id, s.name_with_region)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-800"
                      >
                        <span className="block truncate">{s.name_with_region}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No sites found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ✅ CONTENT */}
        <main className="px-3 sm:px-5 mt-4 space-y-4">
          {/* <SectionCard title="Reading Analytics">
            <ReadingDashboard />
          </SectionCard> */}

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

          {/* Communication hidden (as in your code) */}
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
