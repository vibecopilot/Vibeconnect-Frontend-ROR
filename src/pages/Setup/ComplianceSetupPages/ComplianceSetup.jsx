import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import ComplianceCategories from "./ComplianceCategories";
import ComplianceChecklist from "./ComplianceChecklist";

const ComplianceSetup = () => {
  const [page, setPage] = useState("category");

  return (
    <section className="flex min-h-screen">
      {/* Sidebar Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="w-full mx-3 flex flex-col overflow-hidden">
        {/* Mobile Tabs */}
        <div className="md:hidden flex gap-2 p-2">
          <button
            className={`px-4 py-2 rounded-md border ${
              page === "category" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => setPage("category")}
          >
            Categories
          </button>
          <button
            className={`px-4 py-2 rounded-md border ${
              page === "checklist" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => setPage("checklist")}
          >
            Checklists
          </button>
        </div>

        <div className="grid grid-cols-12 h-full">
          {/* Left menu (Desktop) */}
          <div className="hidden md:flex col-span-2 w-full gap-2 flex-col my-5 mx-1 h-full border-r p-2">
            <button
              className={`p-2 text-left rounded-md border ${
                page === "category" ? "bg-blue-500 text-white font-medium" : ""
              }`}
              onClick={() => setPage("category")}
            >
              Categories
            </button>

            <button
              className={`p-2 text-left rounded-md border ${
                page === "checklist" ? "bg-blue-500 text-white font-medium" : ""
              }`}
              onClick={() => setPage("checklist")}
            >
              Checklists
            </button>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-10 h-full m-2 w-full overflow-auto">
            {page === "category" ? <ComplianceCategories /> : <ComplianceChecklist />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSetup;
