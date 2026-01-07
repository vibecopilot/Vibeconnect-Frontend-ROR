import React, { useEffect, useState, useRef } from "react";
import { getSoftServices, softServiceDownloadQrCode } from "../../api";
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

const ServicePage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [servicess, setServices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  /* ===== BULK UPLOAD STATES ===== */
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const fileInputRef = useRef(null);

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
    { name: "Service Name", selector: (row) => row.name, sortable: true },
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
  }, []);

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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "service_data.xlsx";
    link.click();
  };

  const handleSelectedRows = (rows) => {
    setSelectedRows(rows.map((row) => row.id));
  };

  const handleQrDownload = async () => {
    if (!selectedRows.length) return toast.error("Please select at least one data");

    toast.loading("Downloading QR...");
    try {
      const response = await softServiceDownloadQrCode(selectedRows);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "qr_codes.pdf";
      link.click();
      toast.dismiss();
      toast.success("Downloaded successfully");
    } catch {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  };

  /* ===== IMPORT EXCEL ===== */
  const handleImportExcel = () => {
    if (!importFile) return toast.error("Please select file");

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log("Imported Data:", jsonData);
      toast.success("Excel Imported Successfully");
      setShowImportModal(false);
    };
    reader.readAsBinaryString(importFile);
  };

  const themeColor = useSelector((state) => state.theme.color);

  return (
    <section className="flex">
      <Navbar />

      <div className="p-4 w-full mx-3 flex flex-col">
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
              onClick={exportToExcel}
              className="text-white px-4 py-2 rounded"
              style={{ background: themeColor }}
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

              <button className="bg-black text-white px-4 py-2 rounded">
                Download Sample Format
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicePage;
