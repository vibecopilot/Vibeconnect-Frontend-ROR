import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { getVibeCalendar } from "../api";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../utils/localStorage";
import "react-datepicker/dist/react-datepicker.css";

import HighchartsComponent from "../components/HighCharts";
import TicketDashboard from "./SubPages/TicketDashboard";
import CommunicationDashboard from "./SubPages/CommunicationDashboard";
import SoftServiceHighCharts from "../components/SoftServicesHighCharts";
import { getSiteData, siteChange } from "../api";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import AssetDashboard from "./SubPages/AssetDashboard";
import ComplianceDashboard from "./SubPages/ComplianceDashboard";
import ReadingDashboard from "./SubPages/ReadingDashboard";
import PPMCalendarDashboard from "./SubPages/PPMCalendarDashboard";

const Dashboard = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const vibeUserId = getItemInLocalStorage("VIBEUSERID");

  // ✅ make it an array always
  const [feat, setFeat] = useState([]);

  const [site, setSite] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const dropdownRef = useRef(null);
  const [siteName, setSiteName] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const calendarResponse = await getVibeCalendar(vibeUserId);
        console.log(calendarResponse);
      } catch (error) {
        console.log(error);
      }
    };

    getAllowedFeatures();
    fetchCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllowedFeatures = () => {
    let storedFeatures = getItemInLocalStorage("FEATURES");

    // ✅ if FEATURES is stored as JSON string
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
  };

  const toggleSite = () => setSite(!site);

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

  const site_name = getItemInLocalStorage("SITENAME");

  const handleSiteChange = async (id, site) => {
    try {
      await siteChange(id);
      setItemInLocalStorage("SITEID", id);
      setItemInLocalStorage("SITENAME", site);
      window.location.reload();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSite(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="flex" ref={contentRef}>
      <Navbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden mb-10">
        <header
          style={{ background: themeColor }}
          className="w-full h-10 rounded-md my-1 flex justify-between items-center"
        >
          <nav>
            <h1 className="text-white text-center text-xl ml-5">Vibe Connect</h1>
          </nav>

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={toggleSite}
              className="cursor-pointer flex items-center gap-2 font-medium p-2 text-white"
            >
              <FaBuilding />
              <h2>{site_name || siteName}</h2>
              <div>
                {site ? (
                  <MdExpandLess size={30} />
                ) : (
                  <MdExpandMore size={30} />
                )}
              </div>
            </div>

            {site && (
              <div className="absolute right-0 bg-white border-2 rounded shadow-md max-h-80 w-80 overflow-y-auto z-10 px-5 space-y-2 py-2">
                {siteData.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      handleSiteChange(s.id, s.name_with_region);
                      setSiteName(s.name_with_region);
                    }}
                    className="hover:text-gray-500 text-left w-full"
                  >
                    {s.name_with_region}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="w-full flex mx-3 flex-col p-2 mb-5">
          <h2 className="border-b-2 border-black font-medium">
            Reading Dashboard
          </h2>
          <ReadingDashboard />
        </div>

        <div className="m-5">
          <TicketDashboard />
        </div>

        {feat.includes("assets") && (
          <div className="w-full flex flex-col p-2">
            <h2 className="border-b-2 border-black font-medium mb-2">Asset</h2>
            <AssetDashboard />
          </div>
        )}

        {feat.includes("assets") && (
          <div className="w-full flex flex-col p-2">
            <h2 className="border-b-2 border-black font-medium mb-2">
              PPM Calendar
            </h2>
            <PPMCalendarDashboard />
          </div>
        )}

        <div className="w-full flex mx-3 flex-col p-2">
          <HighchartsComponent />
        </div>

        {feat.includes("compliance") && (
          <div className="w-full flex flex-col p-2">
            <h2 className="border-b-2 border-black font-medium mb-2">
              Compliance
            </h2>
            <ComplianceDashboard />
          </div>
        )}

        {feat.includes("soft_services") && (
          <div className="w-full flex mx-3 flex-col p-2">
            <h2 className="border-b-2 border-black font-medium mb-10">
              Soft Services
            </h2>
            <SoftServiceHighCharts />
          </div>
        )}

        {feat.includes("communication") && (
          <div className="w-full flex mx-3 flex-col p-2 mb-10">
            <h2 className="border-b-2 border-black font-medium">
              Communication
            </h2>
            <CommunicationDashboard />
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
