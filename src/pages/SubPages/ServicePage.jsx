import React, { useEffect, useState, useRef } from "react";
import { downloadSoftServiceSample, exportSoftServices, getSoftServices, importSoftServices, softServiceDownloadQrCode } from "../../api";
import { BiEdit } from "react-icons/bi";
import { IoAddCircleOutline } from "react-icons/io5";
import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import Services from "../Services";
import Navbar from "../../components/Navbar";
import * as XLSX from "xlsx";
import { DNA } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { FaDownload, FaUpload, FaTimes, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import SiteHeader from "../../components/SiteHeader";
import { getItemInLocalStorage } from "../../utils/localStorage";

const ServicePage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [servicess, setServices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // ── reactive site ID — updated by SiteHeader on site switch ──
  const [activeSiteId, setActiveSiteId] = useState(
    () => getItemInLocalStorage("SITEID")
  );

  const [showExportModal, setShowExportModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ===== BULK UPLOAD STATES ===== */
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const fileInputRef = useRef(null);

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filterByDate = async () => {
    if (!startDate || !endDate) {
      return toast.error("Select both dates");
    }

    const toastId = toast.loading("Exporting...");

    try {
      const response = await exportSoftServices(startDate, endDate);

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `soft_services_${startDate}_to_${endDate}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Export successful", { id: toastId });
      setShowExportModal(false);

    } catch (error) {
      console.error(error);
      toast.error("Export failed", { id: toastId });
    }
  };

  const column = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/services/service-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/services/edit-service/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Service Name", selector: (row) => row.name, sortable: true, width: "350px" },
    { name: "Building", selector: (row) => row.building_name, sortable: true },
    { name: "Floor", selector: (row) => row.floor_name, sortable: true },
    {
      name: "Unit",
      selector: (row) =>
        row?.units.map((unit) => (
          <span key={unit.id}>{unit.name}, </span>
        )),
    },
    { name: "Created by", selector: (row) => row.user_name, sortable: true },
    {
      name: "Created On",
      selector: (row) => dateFormat(row.created_at),
      sortable: true,
    },
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceResponse = await getSoftServices();
        const sortedServiceData = serviceResponse.data?.soft_services.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setFilteredData(sortedServiceData);
        setServices(sortedServiceData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchService();
  }, [activeSiteId]); // ✅ re-fetch when site changes

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    if (!searchValue.trim()) {
      setFilteredData(servicess);
    } else {
      setFilteredData(
        servicess.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  };



  const exportToExcel = (data) => {
    const formatted = data.map((item) => ({
      Name: item.name,
      Building: item.building_name,
      Floor: item.floor_name,
      User: item.user_name,
      Created_On: dateFormat(item.created_at),
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([buffer]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "service_data.xlsx";
    link.click();
  };


  const handleSelectedRows = (rows) => {
    setSelectedRows(rows.map((row) => row.id));
  };

  const handleQrDownload = async () => {
    if (!selectedRows.length) {
      return toast.error("Please select at least one service");
    }

    const toastId = toast.loading("Downloading QR...");

    try {
      // Call the new API
      const response = await softServiceDownloadQrCode(selectedRows);

      // Convert blob to URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "qr_codes.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download QR codes", { id: toastId });
    }
  };


  /* ===== IMPORT EXCEL ===== */
  const handleImportExcel = async () => {
    if (!importFile) {
      return toast.error("Please select file");
    }

    const toastId = toast.loading("Uploading...");

    try {
      await importSoftServices(importFile);

      toast.success("File Imported Successfully", { id: toastId });
      setShowImportModal(false);
      setImportFile(null);

      // 🔄 Refresh data after import
      const serviceResponse = await getSoftServices();
      const sortedServiceData = serviceResponse.data?.soft_services.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFilteredData(sortedServiceData);
      setServices(sortedServiceData);

    } catch (error) {
      console.error(error);
      toast.error("Import failed", { id: toastId });
    }
  };


  const themeColor = useSelector((state) => state.theme.color);

  return (
    <section className="flex">
      <Navbar />

      <div className=" w-full mx-3 flex flex-col">
        <SiteHeader
          onSiteChange={(id) => {
            setActiveSiteId(id); // triggers data useEffect
            setServices([]);
            setFilteredData([]);
          }}
        />
        <Services />

        <div className="flex justify-between my-2">
          <input
            type="text"
            placeholder="Search By Service name"
            className="border-2 p-2 w-96 rounded-lg"
            value={searchText}
            onChange={handleSearch}
          />

          <div className="flex gap-2">
            <Link
              to="/services/add-service"
              className="flex items-center gap-2 text-white px-4 py-2 rounded"
              style={{ background: themeColor }}
            >
              <IoAddCircleOutline /> Add
            </Link>

            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 text-white px-4 py-2 rounded"
              style={{ background: themeColor }}
            >
              <FaUpload /> Import
            </button>

            <button
              onClick={handleQrDownload}
              className="flex items-center gap-2 text-white px-4 py-2 rounded"
              style={{ background: themeColor }}
            >
              <FaDownload /> QR Code
            </button>


            <button
              onClick={() => setShowExportModal(true)}
              style={{ background: themeColor }}
              className="text-white px-4 py-2"
            >
              Export
            </button>
          </div>
        </div>

        {servicess.length ? (
          <Table
            columns={column}
            data={filteredData}
            selectableRow
            onSelectedRows={handleSelectedRows}
          />
        ) : (
          <DNA height={120} width={120} />
        )}
      </div>

      {/* ================= BULK UPLOAD MODAL ================= */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[420px] rounded-lg p-6 relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowImportModal(false)}
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FaPlus /> Bulk Upload
            </h2>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <p className="mb-2">Drag & Drop or</p>

              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => setImportFile(e.target.files[0])}
              />

              <button
                onClick={() => fileInputRef.current.click()}
                className="border px-4 py-1 rounded"
              >
                Choose File
              </button>

              <p className="text-sm mt-2">
                {importFile ? importFile.name : "No file chosen"}
              </p>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleImportExcel}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Import
              </button>

              <button
                onClick={async () => {
                  const toastId = toast.loading("Downloading sample...");

                  try {
                    const response = await downloadSoftServiceSample();

                    const blob = new Blob([response.data], {
                      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });

                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "soft_services_sample.xlsx";

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    window.URL.revokeObjectURL(url);

                    toast.success("Sample downloaded", { id: toastId });
                  } catch (error) {
                    console.error(error);
                    toast.error("Download failed", { id: toastId });
                  }
                }}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Download Sample Format
              </button>

            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-[350px] relative">

            {/* ✅ CLOSE ICON */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowExportModal(false)}
            >
              <FaTimes />
            </button>

            <h2 className="font-bold mb-4">Export By Date Range</h2>

            <label className="text-[14px]">
              <b>Start Date :</b>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 w-full mb-2 rounded-md"
            />

            <label className="text-[14px]">
              <b>End Date :</b>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={filterByDate}
                className="text-white px-4 py-2 rounded-lg"
                style={{ background: themeColor }}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicePage;
