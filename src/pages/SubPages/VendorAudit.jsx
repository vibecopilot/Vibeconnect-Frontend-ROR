import React, { useState, useMemo } from 'react'
import ScheduledVendorAudit from './AuditSubPages/ScheduledVendorAudit';
import ConductedVendorAudit from './AuditSubPages/ConductedVendorAudit';

const VendorAudit = ({ audits = [] }) => {
    const [page, setPage] = useState("scheduled");

    // Separate scheduled vs conducted vendor audits based on status/created_at
    const scheduledAudits = useMemo(() => {
      return audits.filter((audit) => {
        // Assuming "scheduled" audits have no created_at or status !== 'conducted'
        const status = (audit?.status || "").toLowerCase();
        return status !== "conducted" && status !== "completed";
      });
    }, [audits]);

    const conductedAudits = useMemo(() => {
      return audits.filter((audit) => {
        const status = (audit?.status || "").toLowerCase();
        return status === "conducted" || status === "completed";
      });
    }, [audits]);

  return (
    <div className=" w-full my-2 flex  overflow-hidden flex-col">
       <div className="flex w-full">
        <div className=" flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
          <h2
            className={`p-1 ${
              page === "scheduled" &&
              "bg-white font-medium text-blue-500 shadow-custom-all-sides"
            } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
            onClick={() => setPage("scheduled")}
          >
            Scheduled
          </h2>
          <h2
            className={`p-1 ${
              page === "conducted" &&
              "bg-white font-medium text-blue-500 shadow-custom-all-sides"
            } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
            onClick={() => setPage("conducted")}
          >
            Conducted
          </h2>
          
        </div>
      </div>
      <div>
        {page === "scheduled" && <ScheduledVendorAudit audits={scheduledAudits} />}
        {page === "conducted" && <ConductedVendorAudit audits={conductedAudits} />}
        
      </div>
    </div>
  )
}

export default VendorAudit
