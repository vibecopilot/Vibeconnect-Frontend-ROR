import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import OperationalAudit from "./SubPages/OperationalAudit";
import VendorAudit from "./SubPages/VendorAudit";


const Audit = () => {
  const [page, setPage] = useState("operational");
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://admin.vibecopilot.ai/audits.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f"
      );
      const data = await response.json();
      setAudits(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching audits:", err);
      setError("Failed to fetch audits");
    } finally {
      setLoading(false);
    }
  };

  // Filter audits by type
  const operationalAudits = audits.filter(
    (audit) =>
      audit.audit_for?.toLowerCase() === "asset" ||
      audit.audit_for?.toLowerCase() === "services" ||
      audit.audit_for?.toLowerCase() === "safety audit"
  );

  const vendorAudits = audits.filter(
    (audit) => audit.audit_for?.toLowerCase() === "vendor"
  );

  return (
    <section className="flex">
      <Navbar />
      <div className="p-2 w-full flex  overflow-hidden flex-col">
        <div className="flex justify-center w-full">
          <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-1 sm:rounded-full rounded-md bg-gray-200">
            <h2
              className={`p-1 ${
                page === "operational" &&
                "bg-white text-blue-500 shadow-custom-all-sides"
              } rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
              onClick={() => setPage("operational")}
            >
              Operational
            </h2>
            <h2
              className={`p-1 ${
                page === "vendor" &&
                "bg-white text-blue-500 shadow-custom-all-sides"
              } rounded-full px-4 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("vendor")}
            >
              Vendor
            </h2>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Loading audits...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {page === "operational" && (
              <div className="transition-all duration-300 ease-linear">
                <OperationalAudit audits={operationalAudits} />
              </div>
            )}
            {page === "vendor" && (
              <div className="transition-all duration-300 ease-linear">
                <VendorAudit audits={vendorAudits} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Audit;
