import React, { useEffect, useRef, useState } from "react";
import { MdClose, MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import {
  IoDocumentAttach,
  IoDocumentAttachOutline,
  IoLocationSharp,
} from "react-icons/io5";
import { FaCheck, FaDownload, FaTasks } from "react-icons/fa";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";
import { getComplianceListDetails, getVendorComplianceList } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { error } from "highcharts";
const ComplianceVendor = () => {
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
  const column = [
    {
      name: "Actions",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Id", selector: (row) => row.id, sortable: true },
  ];

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File uploaded:", file.name);
      // Perform additional file handling here
    }
  };

  const generatePdf = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    const title = "Audit Report Summary";

    // Calculate width of the title and find the x position to center it
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;

    doc.text(title, titleX, 20);

    // Content
    doc.setFontSize(12);
    doc.text("SEAL - Audit for the Month of November - 2024", 20, 30);

    // Audit Details Table
    doc.autoTable({
      head: [
        [
          "Audit Conducted For",
          "Auditor Name",
          "Vendor",
          "Unit",
          "Date Of Audit",
          "Period Of Audit",
          "Closing Date",
        ],
      ],
      body: [
        [
          "STT Global Data Centres India Pvt Ltd",
          "Rathna",
          "Ocs Group India Pvt Ltd",
          "STTGDC-Delhi- Sarswati Vihar",
          "2024-12-05",
          "2024-11-01 To 2024-11-30",
          "2025-01-06",
        ],
      ],
      startY: 40, // Start position for the table
      theme: "grid",
      margin: { top: 10, bottom: 10 },
      styles: { cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
      },
    });

    // Compliance Summary
    doc.text(
      "Overall Compliance Score: 50%",
      20,
      doc.autoTable.previous.finalY + 20
    );
    doc.text("Compliances Cleared: 0", 20, doc.autoTable.previous.finalY + 30);
    doc.text(
      "Compliances Not Cleared: 20",
      20,
      doc.autoTable.previous.finalY + 40
    );
    doc.text(
      "Compliances Not Applicable: 30",
      20,
      doc.autoTable.previous.finalY + 50
    );

    // Table for Compliance Details
    doc.autoTable({
      head: [
        [
          "Internal Compliance",
          "Critical",
          "Risk",
          "Nature",
          "Weightage",
          "Status",
        ],
      ],
      body: [
        [
          "Child Labour Prohibition And Regulation Act 1986",
          "No",
          "High",
          "Rule",
          "10%",
          "Complied",
        ],
        ["Contractor Labour Act", "No", "High", "Register", "10%", "Complied"],
        [
          "Payment of Overtime Wages along with salaries",
          "No",
          "High",
          "Rule",
          "10%",
          "Not Applicable",
        ],
        ["Register Of Wages", "No", "High", "Register", "10%", "Complied"],
        [
          "Employee State Insurance Act",
          "No",
          "High",
          "Register",
          "10%",
          "Complied",
        ],
        ["Minimum Wages Act", "No", "High", "Rule", "10%", "Complied"],
        [
          "Payment Of Gratuity Act,1972",
          "No",
          "High",
          "Rule",
          "10%",
          "Not Applicable",
        ],
        [
          "Payment of Wages Act",
          "No",
          "High",
          "Returns",
          "10%",
          "Not Applicable",
        ],
        [
          "Professional Tax",
          "No",
          "Low",
          "Remittance",
          "10%",
          "Not Applicable",
        ],
        [
          "The Sexual Harassment Of Women At Workplace Act, 2013",
          "No",
          "High",
          "Returns",
          "10%",
          "Not Applicable",
        ],
      ],
      startY: doc.autoTable.previous.finalY + 20, // Start position for the table
      theme: "grid",
      margin: { top: 10, bottom: 10 },
      styles: { cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
      },
    });
    doc.save("Compliance_Certificate.pdf");
  };
  const handleSubmit = () => {
    toast.success("Files submitted successfully");
  };

  const [showTasks, setShowTasks] = useState(false);
  const userId = getItemInLocalStorage("UserId");
  const [complianceList, setComplianceList] = useState([]);
  const fetchComplianceTasks = async () => {
    try {
      const res = await getVendorComplianceList(userId);
      setComplianceList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplianceTasks();
  }, []);

  return (
    <section>
      <div
        style={{ background: themeColor }}
        className="p-2 text-white font-medium text-lg flex justify-between items-center "
      >
        <p>Vibe Connect Vendor Compliance</p>
        <button
          className="flex items-center gap-2 bg-red-400 rounded-md p-2"
          onClick={handleLogout}
        >
          <MdLogout /> Logout{" "}
        </button>
      </div>
      <div className="w-full p-4 mb-10">
        <h2 className="my-2 font-medium">Compliance List</h2>
        <div>
          <input
            type="text"
            name=""
            id=""
            className="border w-full p-2 rounded-md"
            placeholder="Search"
          />
          <div className="flex flex-col gap-2">
            {complianceList.map((list) => (
              <div className="border-2 rounded-xl my-2 p-2" key={list.id}>
                <div className="flex justify-between">
                  <h2 className="font-semibold px-2 text-lg">
                    {list.compliance_config_name}
                  </h2>
                  <div className="flex justify-end items-center mx-2">
                    <Link
                      className=" font-medium bg-green-400 rounded-md text-white flex items-center gap-2 p-1 px-4"
                      // onClick={() => setShowTasks(true)}
                      to={`/compliance/evidence/${list.id}`}
                    >
                      <FaTasks /> Perform
                    </Link>
                  </div>
                </div>
                {list?.compliance_tracker_tags_by_category?.map(
                  (category) => (
                    <div className="bg-blue-100 p-2 rounded-md my-1">
                      <div className="grid md:grid-cols-3 justify-center gap-4 border-b border-gray-400 font-medium">
                        <p className="font-medium">{category.name}</p>
                        <div className="grid grid-cols-3 gap-2">
                          <p className="text-center">Risk</p>
                          <p className="text-center">Critical</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3">
                        {/* <div className="flex flex-col gap-2">
                          <p className="flex items-center gap-1 text-gray-400">
                            <IoLocationSharp /> Mumbai (India)
                          </p>
                          <p className="flex items-center gap-1 text-gray-400">
                            STTGDC-Mumbai Time Square-OCS Group
                          </p>
                        </div> */}
                        <div className="font-medium grid items-center grid-cols-3 gap-2">
                          <p className="text-center text-yellow-400 rounded-full px-4">
                            {list?.risk}
                          </p>
                          <p className="text-center text-green-400 rounded-full px-4">
                            {list?.critical}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
            {/* <div className="border-2 rounded-xl my-2 p-2">
              <div className="flex justify-between">
                <h2 className="font-semibold px-2 text-lg">
                  Employee State Insurance Act, 1948
                </h2>
                <div className="flex items-center justify-end gap-2">
                  <p className="flex items-center gap-2 text-black font-medium">
                    <FaCheck /> Complied
                  </p>
                  <button
                    className="flex items-center gap-2 font-medium bg-green-500 p-1 rounded-md text-white px-2"
                    onClick={generatePdf}
                  >
                    <Download size={16} /> Certificate
                  </button>
                </div>
              </div>
              <div className="bg-blue-100 p-2 rounded-md my-1 ">
                <div className="grid grid-cols-3 justify-center gap-4 border-b border-gray-400 font-medium">
                  <p className="font-medium">
                    {" "}
                    Registration And Change In Family Information
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <p className="text-center">Risk</p>
                    <p className="text-center">Critical</p>
                    <p className="text-center">Weightage</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 mt-2">
                  <div className="flex flex-col gap-2">
                    <p className="flex items-center gap-1 text-gray-400">
                      <IoLocationSharp /> Delhi (India)
                    </p>
                    <p className="flex items-center gap-1 text-gray-400">
                      STTGDC-Mumbai Time Square-OCS Group
                    </p>
                  </div>
                  <div className="font-medium grid items-center grid-cols-3 gap-2">
                    <p className="text-center  text-red-400 rounded-full px-4">
                      High
                    </p>
                    <p className="text-center text-red-400 rounded-full px-4">
                      Yes
                    </p>
                    <p className="text-center  text-red-500 rounded-full px-4">
                      15%
                    </p>
                  </div>
                  <div className="flex items-center justify-end px-10">
                    <div className="flex items-center gap-2 justify-end ">
                      <button
                        className=" font-medium bg-green-400 rounded-md text-white flex items-center gap-2 p-1 px-4"
                        onClick={() => setShowTasks(true)}
                      >
                        <FaTasks /> Tasks
                      </button>
                      <button className=" font-medium bg-green-400 rounded-md text-white flex items-center gap-2 p-1 px-4">
                        <FaDownload /> Format
                      </button>
                      <div className="bg-green-400 rounded-md text-white flex items-center gap-2 p-1 font-medium px-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          hidden
                          onChange={handleFileChange}
                        />
                        <IoDocumentAttach
                          onClick={handleIconClick}
                          className="cursor-pointer "
                        />
                        Upload
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {showTasks && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
          <div className="max-h-screen bg-white p-2 px-3 w-[32rem] rounded-lg shadow-lg overflow-y-auto">
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b text-center">
                Tasks
              </h2>
              <div className="grid  gap-2 w-full">
                <div className="flex w-full gap-2 items-center">
                  <label className="block text-sm font-medium text-gray-700 w-full">
                    Affidavit in Form 26 <span className="text-red-500">*</span>
                  </label>
                  <select className="border rounded-md p-2 w-full">
                    <option value="">Select status </option>
                    <option value="">Completed </option>
                    <option value="">Not Completed </option>
                  </select>
                </div>
                <div className="flex w-full gap-2 items-center">
                  <label className="block text-sm font-medium text-gray-700 w-full">
                    Certified extract of electoral roll{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select className="border rounded-md p-2 w-full">
                    <option value="">Select status </option>
                    <option value="">Completed </option>
                    <option value="">Not Completed </option>
                  </select>
                </div>
              </div>
              <div className="flex my-2 justify-center gap-2 border-t p-1">
                <button
                  type="button"
                  className="border-2 border-red-400 rounded-full text-red-400 px-4 p-1 flex items-center gap-2"
                  onClick={() => setShowTasks(false)}
                >
                  <MdClose /> Cancel
                </button>
                <button
                  type="submit"
                  className=" bg-green-400 rounded-full p-1 px-4 text-white flex items-center gap-2"
                >
                  <FaCheck /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ComplianceVendor;
