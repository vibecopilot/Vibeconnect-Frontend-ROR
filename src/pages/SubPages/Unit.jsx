
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Account from "./Account";
import { PiPlusCircle } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import { FiUpload, FiDownload, FiX } from "react-icons/fi";
import * as XLSX from "xlsx";

import {
  getAllUnits,
  getBuildings,
  getFloors,
  postNewUnit,
  UnitImport,
} from "../../api";

import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import EditUnitModal from "../../containers/modals/EditUnitModal";
import SiteHeader from "../../components/SiteHeader";
import SetupNavbar from "../../components/navbars/SetupNavbar";

const Unit = () => {
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [unitAdded, setUnitAdded] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [id, setId] = useState("");

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const themeColor = useSelector((state) => state.theme.color);

  /* FETCH BUILDINGS */
  const fetchBuildings = useCallback(async () => {
    try {
      const buildingResp = await getBuildings();

      const filteredBuildings = buildingResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      setBuildings(filteredBuildings);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  /* FETCH UNITS */
  const fetchAllUnits = useCallback(async () => {
    try {
      const unitsResp = await getAllUnits();

      const filteredUnits = unitsResp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      const sortedUnits = filteredUnits.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setUnits(sortedUnits);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  /* USE EFFECT */
  useEffect(() => {
    fetchBuildings();
    fetchAllUnits();
  }, [fetchBuildings, fetchAllUnits, unitAdded]);

  /* SEARCH DEBOUNCE */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  /* SEARCH FILTER */
  const filteredUnits = useMemo(() => {
    if (!debouncedSearch.trim()) return units;

    return units.filter((row) => {
      const searchString = [
        row?.building_name || "",
        row?.floor_name || "",
        row?.name || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchString.includes(debouncedSearch.toLowerCase());
    });
  }, [debouncedSearch, units]);

  /* BUILDING CHANGE */
  const handleBuildingChange = async (e) => {
    const buildID = Number(e.target.value);

    setBuilding(buildID);
    setFloor("");
    setFloors([]);

    if (!buildID) return;

    try {
      const build = await getFloors(buildID);

      const filteredFloors = build.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      setFloors(
        filteredFloors.map((item) => ({
          name: item.name,
          id: item.id,
        }))
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch floors");
    }
  };

  // DOWNLOAD UNIT SAMPLE EXCEL
  const handleSampleDownload = () => {
    const sampleData = [
      ["UnitName", "SiteName", "BuildingName", "FloorName"],
      ["Unit 108", "VC - Demo", "VC Building-A", "Floor One"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Unit Import"
    );

    XLSX.writeFile(workbook, "unit_import.xlsx");
  };

  /* IMPORT UNIT EXCEL */
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
      const response = await UnitImport(formData);

      toast.success(
        response?.data?.message || "Units imported successfully"
      );

      setImportFile(null);
      setShowImportModal(false);

      setUnitAdded((prev) => !prev);
    } catch (error) {
      console.log("Unit import error:", error);

      const errorData = error?.response?.data;

      let errorMessage = "Failed to import units";

      if (Array.isArray(errorData)) {
        errorMessage = errorData
          .map((item) => `Row ${item.row_number}: ${item.error}`)
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

  /* EDIT */
  const handleEditClick = (unitId) => {
    setEditModal(true);
    setId(unitId);
  };

  /* TABLE COLUMNS */
  const unitColumns = [
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
      selector: (row) => row.floor_name,
      sortable: true,
    },
    {
      name: "Units",
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

  /* CREATE UNIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!building || !floor || !unit.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();

    formData.append("unit[site_id]", activeSiteId);
    formData.append("unit[building_id]", building);
    formData.append("unit[floor_id]", floor);
    formData.append("unit[name]", unit.trim());

    try {
      await postNewUnit(formData);

      toast.success("Unit created successfully");

      setBuilding("");
      setFloor("");
      setUnit("");
      setFloors([]);
      setShowFields(false);

      setUnitAdded((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create unit");
    }
  };

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">

        {/* SITE HEADER */}
        <SiteHeader
          onSiteChange={(siteId) => {
            setActiveSiteId(siteId);

            setBuilding("");
            setFloor("");
            setUnit("");
            setFloors([]);
            setUnits([]);
            setEditModal(false);
          }}
        />

        <Account />

        <div className="flex flex-col m-2 gap-2">

          {/* TOP BAR */}
          <div className="flex justify-between items-center flex-wrap gap-3">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search by Building, Floor, Unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-400 rounded-md p-2 w-[500px]"
            />

            {/* IMPORT AND ADD UNIT */}
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
                Add Unit
              </h2>

            </div>
          </div>

          {/* ADD UNIT FORM */}
          {showFields && (
            <div className="flex gap-3 md:flex-row flex-col">

              {/* BUILDING */}
              <select
                name="building"
                value={building}
                onChange={handleBuildingChange}
                className="border border-gray-500 rounded-md p-2 md:w-48"
              >
                <option value="">Select Building</option>

                {buildings.map((build) => (
                  <option value={build.id} key={build.id}>
                    {build.name}
                  </option>
                ))}
              </select>

              {/* FLOOR */}
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="border border-gray-500 rounded-md p-2 md:w-48"
              >
                <option value="">Select Floor</option>

                {floors.map((fl) => (
                  <option value={fl.id} key={fl.id}>
                    {fl.name}
                  </option>
                ))}
              </select>

              {/* UNIT */}
              <input
                type="text"
                placeholder="Enter Unit Name"
                className="border border-gray-500 rounded-md p-2"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />

              {/* BUTTONS */}
              <div className="flex gap-2">

                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>

                <button
                  onClick={() => {
                    setShowFields(false);
                    setBuilding("");
                    setFloor("");
                    setUnit("");
                    setFloors([]);
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>

              </div>
            </div>
          )}

          {/* UNIT TABLE */}
          <div className="flex justify-center items-center">
            <div className="w-screen">
              <Table columns={unitColumns} data={filteredUnits} />
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
                  Import Units
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
                    if (importLoading) return;
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  disabled={importLoading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  style={{ background: themeColor }}
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

        {/* EDIT UNIT MODAL */}
        {editModal && (
          <EditUnitModal
            onclose={() => {
              setEditModal(false);
              setUnitAdded((prev) => !prev);
            }}
            id={id}
          />
        )}

      </div>
    </div>
  );
};

export default Unit;
