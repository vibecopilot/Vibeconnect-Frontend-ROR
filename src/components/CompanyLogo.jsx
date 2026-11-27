import React, { useEffect, useState } from "react";
import { getCurrentCompanyLogo } from "../api";
import { getItemInLocalStorage } from "../utils/localStorage";
import defaultLogo from "../pages/SVG/VCLogo.svg";

/**
 * CompanyLogo — shows the logo uploaded for the current company in Setup.
 * Falls back to the default Vibe Connect logo when no logo has been uploaded
 * (or when the signed URL can no longer be loaded).
 *
 * Props:
 *   className      — classes for the <img> element
 *   showName       — also render the company name next to the logo
 *   nameClassName  — classes for the company name
 */
const CompanyLogo = ({
  className = "h-9 w-9 object-contain",
  showName = false,
  nameClassName = "text-white text-sm font-semibold truncate",
}) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    let active = true;

    const loadLogo = async () => {
      const companyId = getItemInLocalStorage("COMPANYID");
      try {
        const res = await getCurrentCompanyLogo(companyId);
        const data = res?.data ?? res;
        if (!active) return;
        setLogoUrl(data?.logo_url || null);
        setCompanyName(data?.company_name || "");
      } catch {
        if (active) {
          setLogoUrl(null);
          setCompanyName("");
        }
      }
    };

    loadLogo();

    // Refresh when the logo is changed on the Setup page, when the user
    // changes company/site, or when another tab updates localStorage.
    window.addEventListener("company-logo-updated", loadLogo);
    window.addEventListener("site-change", loadLogo);
    window.addEventListener("storage", loadLogo);

    return () => {
      active = false;
      window.removeEventListener("company-logo-updated", loadLogo);
      window.removeEventListener("site-change", loadLogo);
      window.removeEventListener("storage", loadLogo);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 min-w-0">
      <img
        key={logoUrl || "default"}
        src={logoUrl || defaultLogo}
        alt={companyName ? `${companyName} logo` : "Vibe Connect logo"}
        className={className}
        onError={() => setLogoUrl(null)}
      />
      {showName && (
        <span className={nameClassName} title={companyName || "Vibe Connect"}>
          {companyName || "Vibe Connect"}
        </span>
      )}
    </div>
  );
};

export default CompanyLogo;
