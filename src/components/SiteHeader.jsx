import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaBuilding } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { getSiteData, siteChange } from "../api";
import { getItemInLocalStorage, setItemInLocalStorage } from "../utils/localStorage";
import CompanyLogo from "./CompanyLogo";

/**
 * SiteHeader — shared branded header with a site-switcher dropdown.
 * Drop this in at the top of any Passes sub-page that needs site switching.
 *
 * Props:
 *   onSiteChange(id, name) — optional callback fired after a site is switched.
 */
const SiteHeader = ({ onSiteChange }) => {
  const themeColor = useSelector((state) => state.theme.color);

  const [activeSiteId, setActiveSiteId] = useState(() =>
    getItemInLocalStorage("SITEID")
  );
  const [siteName, setSiteName] = useState(() =>
    getItemInLocalStorage("SITENAME") || ""
  );
  const [siteData, setSiteData] = useState([]);
  const [siteOpen, setSiteOpen] = useState(false);
  const siteDropdownRef = useRef(null);

  // Fetch available sites once
  useEffect(() => {
    getSiteData()
      .then((res) => setSiteData(res?.data?.sites || []))
      .catch(console.error);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        siteDropdownRef.current &&
        !siteDropdownRef.current.contains(e.target)
      )
        setSiteOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

 
const handleSiteChange = async (id, name) => {
  try {
    // Call site-change API
    const response = await siteChange(id);

    // Support Axios response and direct response formats
    const data = response?.data ?? response;

    if (!data) {
      throw new Error("Invalid site change API response");
    }

    // Get selected site details
    const selectedSiteId = data?.site?.id ?? data?.siteid ?? id;
    const selectedSiteName = data?.site?.name ?? name;

    // Get site-specific features
    const features = Array.isArray(data?.features)
      ? data.features
      : [];

    // Update localStorage
    setItemInLocalStorage("SITEID", selectedSiteId);
    setItemInLocalStorage("SITENAME", selectedSiteName);
    setItemInLocalStorage("FEATURES", features);

    // Update SiteHeader state
    setSiteName(selectedSiteName);
    setActiveSiteId(selectedSiteId);
    setSiteOpen(false);

    // Notify Navbar and other components
    window.dispatchEvent(
      new CustomEvent("site-change", {
        detail: {
          siteId: selectedSiteId,
          siteName: selectedSiteName,
          features,
        },
      })
    );

    // Optional callback
    if (onSiteChange) {
      onSiteChange(selectedSiteId, selectedSiteName);
    }
  } catch (err) {
    console.error("Site change error:", err);
  }
};


  return (
    <header className="px-3 pt-3 mb-3">
      <div
        style={{ background: themeColor }}
        className="w-full rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
      >
        <CompanyLogo
          className="h-9 w-9 object-contain bg-white rounded-md p-1 shrink-0"
          showName
          nameClassName="text-white font-semibold text-base sm:text-lg truncate"
        />

        <div className="relative" ref={siteDropdownRef}>
          <button
            type="button"
            onClick={() => setSiteOpen((v) => !v)}
            className="cursor-pointer flex items-center gap-2 font-medium px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 transition text-white"
          >
            <FaBuilding />
            <span className="max-w-[160px] sm:max-w-[260px] truncate">
              {siteName || "Select Site"}
            </span>
            {siteOpen ? (
              <MdExpandLess size={22} />
            ) : (
              <MdExpandMore size={22} />
            )}
          </button>

          {siteOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-80 w-80 overflow-y-auto z-20 p-2">
              {siteData.length ? (
                siteData.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => handleSiteChange(s.id, s.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-800 ${
                      String(s.id) === String(activeSiteId)
                        ? "font-semibold bg-gray-50"
                        : ""
                    }`}
                  >
                    <span className="block truncate">{s.name}</span>
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
  );
};

export default SiteHeader;
