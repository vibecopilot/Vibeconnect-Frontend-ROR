import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
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
    <ModalWrapper onclose={onclose}>
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Export Booking Data
        </h2>

        <div className="flex flex-col gap-4">
          {/* START DATE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 p-2 rounded-md w-full"
            />
          </div>

          {/* END DATE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 p-2 rounded-md w-full"
            />
          </div>

          {/* BUTTONS */}
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
      </div>
    </ModalWrapper>
  );
};

export default ExportBookingModal;