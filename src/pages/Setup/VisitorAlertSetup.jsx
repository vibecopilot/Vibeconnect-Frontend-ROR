import React from "react";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import VisitorAlertSettings from "../../components/VisitorAlertSettings";
import { Link } from "react-router-dom";

const VisitorAlertSetup = () => {
  return (
    <section className="flex">
      <SetupNavbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex gap-2 my-2">
          <Link className="font-medium text-gray-600" to="/setup">
            Setup
          </Link>
          <p className="font-medium text-gray-600">{">"}</p>
          <span className="font-medium text-gray-600">Visitor Alerts</span>
        </div>
        <VisitorAlertSettings />
      </div>
    </section>
  );
};

export default VisitorAlertSetup;
