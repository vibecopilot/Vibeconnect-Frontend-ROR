import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import IncidentCategorySetup from "./IncidentCategorySetup";
import IncidentSubCategorySetup from "./IncidentSubCategorySetup";
import SubSubCategorysetup from "./IncidentSubSubCat";
import SubSubSubCategorySetup from "./IncidentSubSubSubCatSetup";
import IncidenceStatusSetup from "./IncidentStatusSetup";
import IncidenceLevelSetup from "./IncidentLevelSteup";
import IncidentEscalationSetup from "./IncidentEscalationSetup";
import IncidentApprovalSetup from "./IncidentApprovalSetup";
import IncidentSecondaryCategorySetup from "./IncidentSecCatSetup";
import SecondarySubCategorysetup from "./IncidentSecSubCatSetup";
import InjurySetup from "./InjurySetup";
import PropertyDamageCategorySetup from "./PropertyDamageCategory";
import RCACategorySetup from "./RCACategorySetup";
import SecondarySubCategorySetup from "./IncidentSecSubCatSetup";
import SecondarySubSubCategorySetup from "./SecondarySubSubCategorySetup";
import SecondarySubSubSubCat from "./SecondarySubSubSubCat";

const IncidentSetup = () => {
  const [page, setPage] = useState("category");
  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden h-full">
        <div className="grid grid-cols-12 h-full">
          <div className=" flex col-span-3 w-full gap-1 flex-col my-5 mx-1 h-full">
            <h2
              className={`p-1 border-b ${
                page === "category" &&
                "bg-blue-500 font-medium  text-white rounded-md"
              }   px-2 cursor-pointer  transition-all duration-300 ease-linear`}
              onClick={() => setPage("category")}
            >
              Category
            </h2>
            {/* <h2
              className={`p-1 border-b ${
                page === "subCategory1" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear w-full`}
              onClick={() => setPage("subCategory1")}
            >
              Sub Category
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "subCategory2" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }   px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("subCategory2")}
            >
              Sub Sub Category
            </h2> */}
            {/* <h2
              className={`p-1 border-b ${
                page === "subCategory3" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }   px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("subCategory3")}
            >
              Sub Sub Sub Category
            </h2> */}
            <h2
              className={`p-1 border-b ${
                page === "incidenceStatus" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("incidenceStatus")}
            >
              Incidence status
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "incidenceLevel" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("incidenceLevel")}
            >
              Incidence level
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "escalations" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }   px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("escalations")}
            >
              Escalations
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "approvalSetup" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("approvalSetup")}
            >
              Approval Setup
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "secondaryCategory" &&
                "bg-blue-500 font-medium  text-white  rounded-md"
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("secondaryCategory")}
            >
              Secondary Category
            </h2>

            {/* <h2
              className={`p-1 border-b ${
                page === "secondarySubCategory" &&
                "bg-blue-500 font-medium  text-white rounded-md"
              }   px-2 cursor-pointer  transition-all duration-300 ease-linear`}
              onClick={() => setPage("secondarySubCategory")}
            >
              Secondary Sub Category
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "secondarySubSubCategory" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("secondarySubSubCategory")}
            >
              Secondary Sub Sub Category
            </h2> */}
            {/* <h2
              className={`p-1 border-b ${
                page === "secondarySubSubSubCategory" &&
                "bg-blue-500 font-medium  text-white rounded-md"
              }   px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("secondarySubSubSubCategory")}
            >
              Secondary Sub Sub Sub Category
            </h2> */}

            <h2
              className={`p-1 border-b ${
                page === "injured" &&
                "bg-blue-500 font-medium  text-white rounded-md  "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("injured")}
            >
              Who got injured
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "damageCategory" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("damageCategory")}
            >
              Property Damage Category
            </h2>
            <h2
              className={`p-1 border-b ${
                page === "rcaCategory" &&
                "bg-blue-500 font-medium  text-white rounded-md "
              }  px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("rcaCategory")}
            >
              RCA Category
            </h2>
            {/* <h2
              className={`p-1 border-b ${
                page === "incidentDisclaimer" &&
                "bg-blue-500 font-medium  text-white rounded-md"
              }   px-2 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("incidentDisclaimer")}
            >
              Incident Disclaimer
            </h2> */}
          </div>
          <div className=" border-l border-gray-300 col-span-9 h-full m-2 w-full">
            {page === "category" && (
              <div>
                <IncidentCategorySetup />
              </div>
            )}
            {page === "subCategory1" && (
              <div>
                <IncidentSubCategorySetup />
              </div>
            )}
            {page === "subCategory2" && (
              <div>
                <SubSubCategorysetup />
              </div>
            )}
            {page === "subCategory3" && (
              <div>
                <SubSubSubCategorySetup />
              </div>
            )}
            {page === "incidenceStatus" && (
              <div>
                <IncidenceStatusSetup />
              </div>
            )}
            {page === "incidenceLevel" && (
              <div>
                <IncidenceLevelSetup />
              </div>
            )}
            {page === "escalations" && (
              <div>
                <IncidentEscalationSetup />
              </div>
            )}
            {page === "approvalSetup" && (
              <div>
                <IncidentApprovalSetup />
              </div>
            )}
            {page === "secondaryCategory" && (
              <div>
                <IncidentSecondaryCategorySetup />
              </div>
            )}
            {page === "secondarySubCategory" && (
              <div>
                <SecondarySubCategorySetup />
              </div>
            )}
            {page === "secondarySubSubCategory" && (
                <div>
                  <SecondarySubSubCategorySetup />
               </div>
            )}
             {page === "secondarySubSubSubCategory" && (
                 <div>
                  <SecondarySubSubSubCat />
               </div>
            )}
            {page === "injured" && (
              <div>
                <InjurySetup />
              </div>
            )}
            {page === "damageCategory" && (
              <div>
                <PropertyDamageCategorySetup />
              </div>
            )}
            {page === "rcaCategory" && (
              <div>
                <RCACategorySetup />
              </div>
            )}
            {/*
            {page === "incidentDisclaimer" && (
                <div>
                  <IncidentDisclaimerSetup />
               </div>
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IncidentSetup;
