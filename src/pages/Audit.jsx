import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import OperationalAudit from "./SubPages/OperationalAudit";
import VendorAudit from "./SubPages/VendorAudit";

const normalizeAudits = (payload) => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.audits)) return payload.audits;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

const Audit = () => {
  const [page, setPage] = useState("operational");
  const [audits, setAudits] = useState([]); // ✅ always array
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const list = normalizeAudits(data);

      // 🔍 Debug logging
      console.log("Full API Response:", data);
      console.log("Normalized Audits:", list);
      console.log("Audit Types:", list.map(a => ({ id: a.id, audit_for: a.audit_for, status: a.status })));

      setAudits(list);
      setError(null);
    } catch (err) {
      console.error("Error fetching audits:", err);
      setError("Failed to fetch audits");
      setAudits([]); // ✅ prevent filter crash
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe filtering (memoized)
  const operationalAudits = useMemo(() => {
    return audits.filter((audit) => {
      const t = (audit?.audit_for || "").toLowerCase();
      return t === "asset" || t === "services" || t === "safety audit";
    });
  }, [audits]);

  const vendorAudits = useMemo(() => {
    return audits.filter((audit) => {
      const auditFor = (audit?.audit_for || "").toLowerCase();
      return auditFor === "vendor" || auditFor === "vendor audit";
    });
  }, [audits]);

  return (
    <section className="flex">
      <Navbar />

      <div className="p-2 w-full flex overflow-hidden flex-col">
        <div className="flex justify-center w-full">
          <div className="sm:flex grid grid-cols-2 sm:flex-row gap-5 font-medium p-1 sm:rounded-full rounded-md bg-gray-200">
            <h2
              className={`p-1 ${page === "operational" &&
                "bg-white text-blue-500 shadow-custom-all-sides"
                } rounded-full px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
              onClick={() => setPage("operational")}
            >
              Operational
            </h2>

            <h2
              className={`p-1 ${page === "vendor" &&
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

        {!loading && error && (
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

            {/* Optional empty state */}
            {page === "operational" && operationalAudits.length === 0 && (
              <div className="flex items-center justify-center h-48 text-gray-500">
                No operational audits found.
              </div>
            )}
            {page === "vendor" && vendorAudits.length === 0 && (
              <div className="flex items-center justify-center h-48 text-gray-500">
                No vendor audits found.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Audit;
