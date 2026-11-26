
import React, { useCallback, useEffect, useState } from "react";
import Account from "./Account";
import { PiPlusCircle } from "react-icons/pi";
import { BiEdit } from "react-icons/bi";
import { FiUpload, FiDownload, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Table from "../../components/table/Table";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import * as XLSX from "xlsx";
import SiteHeader from "../../components/SiteHeader";
import {
  BuildingImport,
  getBuildings,
  postBuilding,
  updateBuilding,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const Building = () => {
  const [buildings, setBuildings] = useState([]);
  const [name, setName] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  // Import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const themeColor = useSelector((state) => state.theme.color);

  // FETCH BUILDINGS
  const fetchBuildings = useCallback(async () => {
    try {
      const resp = await getBuildings();

      const siteBuildings = resp.data.filter(
        (item) => String(item.site_id) === String(activeSiteId)
      );

      setBuildings(siteBuildings);
    } catch (error) {
      console.log(error);
    }
  }, [activeSiteId]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings, refresh]);

  // DOWNLOAD BUILDING SAMPLE EXCEL
  const handleSampleDownload = () => {
    const sampleData = [
      ["BuildingName", "SiteName"],
      ["VC Building-A", "VC - Demo"],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Building Import"
    );

    XLSX.writeFile(workbook, "building_import.xlsx");
  };


  // IMPORT FILE
  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select an Excel file");
      return;
    }

    setImportLoading(true);

    try {
      // Read the selected Excel file
      const arrayBuffer = await importFile.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, {
        type: "array",
      });

      // Normalize SiteName values
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        rows.forEach((row, index) => {
          if (index === 0) return;

          // SiteName is the second column
          if (row[1]) {
            row[1] = String(row[1])
              .trim()
              .replace(/[–—−]/g, "-");
          }
        });

        workbook.Sheets[sheetName] =
          XLSX.utils.aoa_to_sheet(rows);
      });

      // Generate corrected Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const correctedFile = new File(
        [excelBuffer],
        importFile.name.replace(/\.(xls|xlsx)$/i, ".xlsx"),
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const formData = new FormData();
      formData.append("file", correctedFile);

      await BuildingImport(formData);

      toast.success("Buildings imported successfully");

      setImportFile(null);
      setShowImportModal(false);
      setRefresh((prev) => !prev);

    } catch (error) {
      console.error("Building Import Error:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to import buildings"
      );
    } finally {
      setImportLoading(false);
    }
  };


  // CREATE BUILDING
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter building name");
      return;
    }

    const formData = new FormData();
    formData.append("building[name]", name.trim());
    formData.append("building[site_id]", activeSiteId);

    try {
      await postBuilding(formData);

      toast.success("Building created successfully");

      setName("");
      setShowFields(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create building");
    }
  };

  // EDIT BUILDING
  const openEdit = (row) => {
    setEditId(row.id);
    setEditName(row.name || "");
  };

  const closeEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      toast.error("Please enter building name");
      return;
    }

    const formData = new FormData();
    formData.append("building[name]", editName.trim());

    try {
      await updateBuilding(editId, formData);

      toast.success("Building updated successfully");

      closeEdit();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update building");
    }
  };

  // TABLE COLUMNS
  const buildingColumns = [
    {
      name: "Site",
      selector: (row) => row.site_name,
      sortable: true,
    },
    {
      name: "Building",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => openEdit(row)}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex">
      <SetupNavbar />

      <div className="w-full flex lg:mx-3 flex-col overflow-hidden">

        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id);
            setName("");
            setBuildings([]);
            closeEdit();
          }}
        />

        <Account />

        <div className="flex flex-col m-2 gap-2">

          {/* TOP BAR */}
          <div className="flex justify-end items-center  gap-3">

            {/* LEFT SIDE - IMPORT */}
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:opacity-90"
              style={{ background: themeColor }}
            >
              <FiUpload size={18} />
              Import
            </button>

            {/* RIGHT SIDE - ADD BUILDING */}
            <h2
              className="font-semibold hover:text-white duration-150 transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2"
              onClick={() => setShowFields(!showFields)}
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add Building
            </h2>

          </div>

          {/* ADD BUILDING FORM */}
          {showFields && (
            <div className="flex gap-3 md:flex-row flex-col">
              <input
                type="text"
                placeholder="Enter Building Name"
                className="border border-gray-500 rounded-md p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  setName("");
                }}
                className="bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          )}

          {/* BUILDING TABLE */}
          <div className="flex justify-center items-center">
            <div className="w-screen">
              <Table
                columns={buildingColumns}
                data={buildings}
              />
            </div>
          </div>
        </div>

        {/* IMPORT MODAL */}
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">

              {/* MODAL HEADER */}
              <div
                className="flex justify-between items-center p-4 border-b"
              >
                <h2 className="text-lg font-semibold">
                  Import Buildings
                </h2>

                <button
                  onClick={() => {
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
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
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

        {/* EDIT MODAL */}
        {editId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md p-5 w-full max-w-sm">

              <h2 className="font-semibold text-lg mb-4">
                Edit Building
              </h2>

              <input
                type="text"
                placeholder="Enter Building Name"
                className="border border-gray-500 rounded-md p-2 w-full"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-4">

                <button
                  onClick={closeEdit}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Building;
