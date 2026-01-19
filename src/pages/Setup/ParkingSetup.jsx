import React, { useState } from "react";
import ParkingSlotSetup from "./ParkingSetupPages/ParkingSlotSetup.jsx";
import VehicleSetup from "./ParkingSetupPages/VehicelSetup.jsx";
import ParkingConfigurationSetup from "./ParkingSetupPages/ParkingConfigurationSetup.jsx";

import SetupNavbar from "../../components/navbars/SetupNavbar";


const ParkingSetup = () => {
  const [page, setPage] = useState("Parking Configuration");
  return (
    <div className="flex">
        <SetupNavbar />
      <div className=" w-full my-2 flex  overflow-hidden flex-col">
        <div className="flex w-full">
          <div className=" flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
            <h2
              className={`p-1 ${
                page === "Vehicle Configuration" &&
                `bg-white font-medium text-blue-500 shadow-custom-all-sides`
              } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
              onClick={() => setPage("Vehicle Configuration")}
            >
              Vehicle Configuration
            </h2>
            <h2
              className={`p-1 ${
                page === "Parking Configuration" &&
                `bg-white font-medium text-blue-500 shadow-custom-all-sides`
              } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
              onClick={() => setPage("Parking Configuration")}
            >
              Parking Configuration Setup
            </h2>
            <h2
              className={`p-1 ${
                page === "Parking Slots" &&
                "bg-white font-medium text-blue-500 shadow-custom-all-sides"
              } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
              onClick={() => setPage("Parking Slots")}
            >
              Parking Slots
            </h2>
          </div>
        </div>
        <div>
          {page === "Parking Configuration" && (
            <div>
              <ParkingConfigurationSetup />
            </div>
          )}
          {page === "Vehicle Configuration" && (
            <div>
              <VehicleSetup />
            </div>
          )}
          {page === "Parking Slots" && (
            <div>
              <ParkingSlotSetup />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingSetup;
