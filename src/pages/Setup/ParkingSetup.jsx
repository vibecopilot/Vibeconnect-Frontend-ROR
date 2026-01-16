import React, { useState } from "react";
import ParkingTag from "./ParkingSetupPages/ParkingTag";
import ParkingCategoriesSetup from "./ParkingSetupPages/ParkingCategoriesSetup";
import ParkingSlotSetup from "./ParkingSetupPages/ParkingSlotSetup";
import ParkingConfigurationSetup from "./ParkingSetupPages/ParkingConfigurationSetup";
import SetupNavbar from "../../components/navbars/SetupNavbar";

const ParkingSetup = () => {
  const [page, setPage] = useState("Parking Configurations");

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full my-2 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex w-full">
          <div className="flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">

            <h2
              className={`p-1 ${
                page === "Parking Configurations"
                  ? "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                  : ""
              } rounded-t-md px-4 cursor-pointer transition-all duration-300`}
              onClick={() => setPage("Parking Configurations")}
            >
              Parking Configurations
            </h2>

            <h2
              className={`p-1 ${
                page === "Parking Slots"
                  ? "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                  : ""
              } rounded-t-md px-4 cursor-pointer transition-all duration-300`}
              onClick={() => setPage("Parking Slots")}
            >
              Parking Slots
            </h2>

          </div>
        </div>
        

        {/* Pages */}
        <div className="p-2">
          {page === "Tag" && <ParkingTag />}
          {page === "Parking Categories" && <ParkingCategoriesSetup />}
          {page === "Parking Configurations" && <ParkingConfigurationSetup />}
          {page === "Parking Slots" && <ParkingSlotSetup />}
        </div>
      </div>
    </div>
  );
};

export default ParkingSetup;
