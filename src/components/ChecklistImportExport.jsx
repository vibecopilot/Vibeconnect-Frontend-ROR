import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiDownload, FiUpload } from "react-icons/fi";
import { MdClose, MdFileDownload } from "react-icons/md";
import toast from "react-hot-toast";

import FileInputBox from "../containers/Inputs/FileInputBox";
import {
  ChecklistImport,
  downloadSampleChecklist,
  exportChecklist,
} from "../api";

/**
 * Backend-driven XLSX export + bulk upload for checklists.
 *
 * Both the Assets checklist and Soft Services checklist use this so the
 * buttons, template and generated workbook stay identical. `ctype` only
 * controls which checklist section is exported / imported into.
 */
const ChecklistImportExport = ({ ctype = "routine", onSuccess, themeColor }) => {
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [busy, setBusy] = useState(false);
  const [startDate, endDate] = dateRange;

  const handleDownloadTemplate = async () => {
    try {
      const response = await downloadSampleChecklist();
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "checklist_template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download checklist template:", error);
      toast.error("Failed to download checklist template");
    }
  };

  const handleImport = async () => {
    if (!selectedFiles.length) {
      setStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("file", file));
    formData.append("ctype", ctype);

    try {
      setBusy(true);
      const response = await ChecklistImport(formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Checklist bulk upload completed");
        setSelectedFiles([]);
        setStatus("");
        setShowImport(false);
        if (onSuccess) await onSuccess();
      } else {
        setStatus("Bulk upload failed. Please check the file format.");
      }
    } catch (error) {
      console.error("Checklist import failed:", error);
      setStatus("Bulk upload failed. Please check the file format.");
      toast.error("Bulk upload failed");
    } finally {
      setBusy(false);
    }
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start date and end date");
      return;
    }

    try {
      setBusy(true);
      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];

      const response = await exportChecklist(formattedStart, formattedEnd, ctype);
      if (!response.data || (Array.isArray(response.data) && !response.data.length)) {
        toast.error("No data found for the selected date range.");
        return;
      }

      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `checklist_${ctype}_${formattedStart}_to_${formattedEnd}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDateRange([null, null]);
      setShowExport(false);
    } catch (error) {
      console.error("Checklist export failed:", error);
      toast.error("Failed to export checklist");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowImport(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex justify-center items-center gap-2"
        style={themeColor ? { background: themeColor } : undefined}
      >
        <FiUpload size={15} /> Bulk Upload
      </button>
      <button
        type="button"
        onClick={() => setShowExport(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex justify-center items-center gap-2"
        style={themeColor ? { background: themeColor } : undefined}
      >
        <FiDownload size={15} /> Export
      </button>

      {showImport && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex z-50 justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Bulk Upload Checklist</h2>
              <button type="button" onClick={() => setShowImport(false)}>
                <MdClose size={22} />
              </button>
            </div>
            <FileInputBox
              handleChange={setSelectedFiles}
              fieldName="checklist"
              isMulti={true}
            />
            <div className="mt-4 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <MdFileDownload /> Download Sample Format
              </button>
              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={busy}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                {busy ? "Uploading..." : "Upload"}
              </button>
            </div>
            {status && <p className="mt-3 text-center text-sm">{status}</p>}
          </div>
        </div>
      )}

      {showExport && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex z-50 justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-center w-full">
                Export Checklist Report
              </h2>
              <button type="button" onClick={() => setShowExport(false)}>
                <MdClose size={22} />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setDateRange([date, endDate])}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="border p-2 rounded w-40"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setDateRange([startDate, date])}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  className="border p-2 rounded w-40"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExport(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={busy}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60"
              >
                <MdFileDownload /> {busy ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChecklistImportExport;
