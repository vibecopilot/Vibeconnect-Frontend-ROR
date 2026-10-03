import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import SiteHeader from "../../components/SiteHeader";
import { getItemInLocalStorage } from "../../utils/localStorage";

import DocumentPro from "./DocumentPro";
import DocumentCommon from "./DocumentCommon";
import SharedwithMe from "./SharedwithMe";

const DocumentMain = () => {
  const [page, setPage] = useState("Personal");

  // ── reactive site ID — SiteHeader updates this, all children re-fetch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">

        {/* ── Site Switcher — single point of truth for all 3 document tabs ── */}
        <SiteHeader
          onSiteChange={(id) => setActiveSiteId(id)}
        />

        {/* ── Tab bar ── */}
        <div className="flex justify-center my-2 w-full">
          <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-1 sm:rounded-full rounded-md bg-gray-200">
            <h2
              className={`p-1 ${
                page === "Personal" &&
                "bg-white text-blue-500 shadow-custom-all-sides"
              } rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
              onClick={() => setPage("Personal")}
            >
              Personal
            </h2>
            <h2
              className={`p-1 ${
                page === "Common" &&
                "bg-white text-blue-500 shadow-custom-all-sides"
              } rounded-full px-4 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("Common")}
            >
              Common
            </h2>
            <h2
              className={`p-1 ${
                page === "share" &&
                "bg-white text-blue-500 shadow-custom-all-sides"
              } rounded-full px-4 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("share")}
            >
              Shared with me
            </h2>
          </div>
        </div>

        {/* ── Tab content — each gets activeSiteId so they can re-fetch on switch ── */}
        {page === "Personal" && <DocumentPro activeSiteId={activeSiteId} />}
        {page === "Common"   && <DocumentCommon activeSiteId={activeSiteId} />}
        {page === "share"    && <SharedwithMe activeSiteId={activeSiteId} />}
      </div>
    </section>
  );
};

export default DocumentMain;