import React, { useState } from "react";
<<<<<<< HEAD
import ModalWrapper from "./ModalWrapper";
import { IoAddCircle } from "react-icons/io5";
import * as XLSX from "xlsx";

const ExportBookingModal = ({ onclose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
  const handleExport = () => {
    const currentDate = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    const ISTDate = currentDate.toLocaleString("en-IN", options);
    const formattedISTDate = ISTDate.replace(/[/:]/g, "_");
    const fileName = `bookings_${formattedISTDate}.xlsx`;
    const data = [
      ["Site", "User Type", "Department", "Month"],
      ["Site 1", "Occupants", "Electrical", "Jan/2022"],
      ["Site 2", "Admin", "Help Desk", "Feb/2022"],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, fileName);
    onclose();
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col items-center justify-center">
        <h2 className="flex gap-4 items-center justify-center mb-5 font-bold text-lg">
          <IoAddCircle size={20} />
          Export Booking Report
        </h2>
        <div className="flex gap-10 my-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium">
              From :
            </label>
=======
import { getAmenityExport } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const ExportBookingModal = ({ onclose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const siteId = getItemInLocalStorage("SITEID");

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert("Please select start date and end date");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be greater than end date");
      return;
    }

    try {
      setLoading(true);

      const response = await getAmenityExport(startDate, endDate, siteId);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `amenity_bookings_${startDate}_to_${endDate}.xlsx`
      );

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      onclose();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Export Booking Data</h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium">Start Date</label>
>>>>>>> 6e2895ca2862289879c854c200b55d4d5d9a92f1
            <input
              type="date"
              name=""
              id=""
              value={startDate}
              onChange={(e) => setStartDate(e.value)}
              className="border border-gray-200 p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-medium">
              To :
            </label>
            <input
              type="date"
              name=""
              id=""
              value={endDate}
              onChange={(e) => setEndDate(e.value)}
              className="border border-gray-200 p-2 rounded-md"
            />
          </div>
<<<<<<< HEAD
        </div>

        <button className="bg-black p-2 px-4 text-white rounded-md my-5" onClick={handleExport}>
          Submit
        </button>
=======

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onclose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleExport}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>
>>>>>>> 6e2895ca2862289879c854c200b55d4d5d9a92f1
      </div>
    </ModalWrapper>
  );
};

export default ExportBookingModal;
