import React from "react";
import { MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { persistor } from "../../store/store";
const ComplianceVendorDashboard = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const navigate = useNavigate();
   const handleLogout = () => {
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("COMPANYID");
      localStorage.removeItem("HRMSORGID");
      localStorage.removeItem("board_id");
      localStorage.removeItem("menuState");
      localStorage.removeItem("Name");
      localStorage.removeItem("LASTNAME");
      localStorage.removeItem("USERTYPE");
      localStorage.removeItem("user");
      localStorage.removeItem("UNITID");
      localStorage.removeItem("Building");
      localStorage.removeItem("categories");
      localStorage.removeItem("SITEID");
      localStorage.removeItem("STATUS");
      localStorage.removeItem("complaint");
      localStorage.removeItem("UserId");
      localStorage.removeItem("VIBETOKEN");
      localStorage.removeItem("VIBEUSERID");
      localStorage.removeItem("VIBEORGID");
      localStorage.removeItem("FEATURES");
      localStorage.removeItem("HRMSORGID");
      localStorage.removeItem("HRMS_EMPLOYEE_ID");
      persistor.purge(["board"]).then(() => {
        navigate("/login");
        // window.location.reload();
      });
      // navigate("/login");
      // window.location.reload();
    };
  return (
    <section>
      <div
        style={{ background: themeColor }}
        className="p-2 text-white font-medium text-lg flex justify-between items-center "
      >
        <p>Vibe Connect Vendor Compliance</p>
        <button className="flex items-center gap-2 bg-red-400 rounded-md p-2" onClick={handleLogout}>
          <MdLogout /> Logout
        </button>
      </div>
      <h2 className="font-medium border-b p-2">Compliances Domain</h2>
      <div className="flex items-center gap-2 p-4">
        <Link to={"/compliance/vendor"} className="border rounded-md border-gray-400 p-2 w-40 text-center bg-gray-400 bg-opacity-15">
          Labour
        </Link>
        <Link className="border rounded-md border-gray-400 p-2 w-40 text-center bg-gray-400 bg-opacity-15">
          IT
        </Link>
      </div>
    </section>
  );
};

export default ComplianceVendorDashboard;
