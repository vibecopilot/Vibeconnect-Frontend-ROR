import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import ComplianceCategories from "./ComplianceCategories";
import ComplianceChecklist from "./ComplianceChecklist";

const ComplianceSetup = () => {
  const [page, setPage] = useState("category");
  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden h-full">
        <div className="grid grid-cols-12 h-full">
          {/* <div className=" flex col-span-2 w-full gap-1 flex-col my-5 mx-1 h-screen border-r p-1">
            <h2
              className={`p-1 border-b ${
                page === "category" &&
                "bg-blue-500 font-medium text-white rounded-md"
              }   px-2 cursor-pointer  transition-all duration-300 ease-linear`}
              onClick={() => setPage("category")}
            >
              Categories
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "checklist" &&
                "bg-blue-500 font-medium text-white rounded-md"
              }   px-2 cursor-pointer  transition-all duration-300 ease-linear`}
              onClick={() => setPage("checklist")}
            >
              Checklists
            </h2>
          </div> */}
          <div className="  border-gray-300 col-span-10 h-full m-2 w-full">
            {page === "checklist" && (
              <div>
                <ComplianceChecklist />
              </div>
            )}
          </div>
        </div>
        {page === "category" && (
          <div>
            <ComplianceCategories />
          </div>
        )}
      </div>
    </section>
  );
};

export default ComplianceSetup;
