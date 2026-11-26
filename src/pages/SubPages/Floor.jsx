
import React, { useEffect, useState, useCallback } from "react";
import Account from "./Account";
import { PiPlusCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { FiUpload, FiDownload, FiX } from "react-icons/fi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

import Table from "../../components/table/Table";
import {
  getAllFloors,
  getBuildings,
  postNewFloor,
  FloorImport,
} from "../../api";

import { getItemInLocalStorage } from "../../utils/localStorage";
import EditFloorModal from "../../containers/modals/EditFloorModal";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import SiteHeader from "../../components/SiteHeader";

const Floor = () => {
  const [building, setBuilding] = useState("");
  const [floors, setFloors] = useState([]);
  const [floor, setFloor] = useState("");
  const [floorAdded, setFloorAdded] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [id, setId] = useState("");

  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  // Import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const themeColor = useSelector((state) => state.theme.color);

  /* FETCH FLOORS */
  const fetchAllFloors = useCallback(async () => {
    try {
      const floorsResp = await getAllFloors();

      const filteredFloors = floorsResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      const sortedFloor = filteredFloors.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setFloors(sortedFloor);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch floors");
    }
  }, [activeSiteId]);

  /* FETCH BUILDINGS */
  const fetchBuilding = useCallback(async () => {
    try {
      const buildingResp = await getBuildings();

      const filteredBuildings = buildingResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      setBuildings(filteredBuildings);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch buildings");
    }
  }, [activeSiteId]);

  useEffect(() => {
    fetchAllFloors();
    fetchBuilding();
  }, [fetchAllFloors, fetchBuilding, floorAdded]);

  // DOWNLOAD FLOOR SAMPLE EXCEL
  const handleSampleDownload = () => {
    const sampleData = [
      ["FloorName", "BuildingName", "SiteName"],
      ["Floor One", "VC Building-A", "VC - Demo"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Floor Import"
    );

    XLSX.writeFile(workbook, "floor_import.xlsx");
  };

  /* IMPORT FLOOR EXCEL */
  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select an Excel file");
      return;
    }

    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = importFile.name
      .substring(importFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error("Please select a valid Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    setImportLoading(true);

    try {
      const response = await FloorImport(formData);

      toast.success(
        response?.data?.message || "Floors imported successfully"
      );

      setImportFile(null);
      setShowImportModal(false);
      setFloorAdded((prev) => !prev);
    } catch (error) {
      console.log("Floor import error:", error);

      const errorData = error?.response?.data;

      let errorMessage = "Failed to import floors";

      if (Array.isArray(errorData)) {
        errorMessage = errorData
          .map((item) =>
            `Row ${item.row_number}: ${item.error}`
          )
          .join("\n");
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }

      toast.error(errorMessage, {
        duration: 6000,
      });
    } finally {
      setImportLoading(false);
    }
  };

  /* EDIT FLOOR */
  const handleEditClick = (floorId) => {
    setEditModal(true);
    setId(floorId);
  };

  /* TABLE COLUMNS */
  const floorColumns = [
    {
      name: "Site",
      selector: (row) => row.site_name,
      sortable: true,
    },
    {
      name: "Building",
      selector: (row) => row.building_name,
      sortable: true,
    },
    {
      name: "Floors",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleEditClick(row.id)}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
  ];

  /* CREATE FLOOR */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!building || !floor.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();

    formData.append("floor[name]", floor.trim());
    formData.append("floor[site_id]", activeSiteId);
    formData.append("floor[building_id]", building);

    try {
      await postNewFloor(formData);

      toast.success("Floor created successfully");

      setFloor("");
      setBuilding("");
      setShowFields(false);

      setFloorAdded((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create floor");
    }
  };

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">

        <SiteHeader
          onSiteChange={(siteId) => {
            setActiveSiteId(siteId);
            setBuilding("");
            setFloor("");
            setFloors([]);
            setBuildings([]);
            setEditModal(false);
          }}
        />

        <Account />

        <div className="flex flex-col m-2 gap-2">

          {/* TOP BAR */}
          <div className="flex justify-end items-center gap-3">

            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:opacity-90"
              style={{ background: themeColor }}
            >
              <FiUpload size={18} />
              Import
            </button>

            <h2
              className="font-semibold hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2"
              onClick={() => setShowFields(!showFields)}
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add Floor
            </h2>

          </div>

          {/* ADD FLOOR FORM */}
          {showFields && (
            <div className="flex gap-3 md:flex-row flex-col">

              <select
                name="building"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="border border-gray-500 rounded-md p-2 md:w-48"
              >
                <option value="">Select Building</option>

                {buildings.map((build) => (
                  <option value={build.id} key={build.id}>
                    {build.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Enter Floor"
                className="border border-gray-500 rounded-md p-2"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />

              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>

              <button
                onClick={() => {
                  setShowFields(false);
                  setFloor("");
                  setBuilding("");
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>

            </div>
          )}

          {/* FLOOR TABLE */}
          <div className="flex justify-center items-center">
            <div className="w-screen">
              <Table columns={floorColumns} data={floors} />
            </div>
          </div>

        </div>

        {/* IMPORT MODAL */}
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">

              {/* MODAL HEADER */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">
                  Import Floors
                </h2>

                <button
                  onClick={() => {
                    if (importLoading) return;
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="text-gray-500 hover:text-red-500"
                  disabled={importLoading}
                >
                  <FiX size={22} />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-5 flex flex-col gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Excel File
                  </label>

                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) =>
                      setImportFile(e.target.files?.[0] || null)
                    }
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="flex justify-end gap-3 p-4 border-t">

                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  disabled={importLoading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  style={{ background: themeColor }}
                  type="button"
                  onClick={handleSampleDownload}
                  className="flex items-center gap-2 text-white px-3 py-2 rounded-md text-sm"
                >
                  <FiDownload size={16} />
                  Download Sample
                </button>

                <button
                  style={{ background: themeColor }}
                  onClick={handleImport}
                  disabled={importLoading || !importFile}
                  className="disabled:opacity-50 text-white px-5 py-2 rounded-md flex items-center gap-2"
                >
                  <FiUpload size={16} />
                  {importLoading ? "Importing..." : "Import"}
                </button>

              </div>

            </div>
          </div>
        )}

        {/* EDIT FLOOR MODAL */}
        {editModal && (
          <EditFloorModal
            id={id}
            onclose={() => {
              setEditModal(false);
              setFloorAdded((prev) => !prev);
            }}
          />
        )}

      </div>
    </div>
  );
};

export default Floor;
