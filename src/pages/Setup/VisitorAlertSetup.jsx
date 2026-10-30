import React, { useState } from "react";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import VisitorAlertSettings from "../../components/VisitorAlertSettings";
import { Link } from "react-router-dom";
import SiteHeader from "../../components/SiteHeader";
import { getItemInLocalStorage } from "../../utils/localStorage";

const VisitorAlertSetup = () => {
  // ── reactive site ID — updated by SiteHeader on site switch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  return (
    <section className="flex">
      <SetupNavbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">

        {/* ── Site Switcher — re-fetches alert settings on site change ── */}
        <SiteHeader
          onSiteChange={(id) => setActiveSiteId(id)}
        />

        <div className="flex gap-2 my-2">
          <Link className="font-medium text-gray-600" to="/setup">
            Setup
          </Link>
          <p className="font-medium text-gray-600">{">"}</p>
          <span className="font-medium text-gray-600">Visitor Alerts</span>
        </div>

        {/* Pass activeSiteId so VisitorAlertSettings can fetch site-specific data */}
        <VisitorAlertSettings activeSiteId={activeSiteId} />
      </div>
    </section>
  );
};

export default VisitorAlertSetup;
