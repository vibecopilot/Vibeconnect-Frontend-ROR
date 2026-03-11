import React, { useState } from "react";
import { getAmenityExport } from "../../api";

const ExportBookingModal = ({ onclose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert("Please select start date and end date");
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be greater than end date");
      return;
    }

    try {
      setLoading(true);

      const response = await getAmenityExport(startDate, endDate, 47);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `amenity_bookings_${startDate}_to_${endDate}.xlsx`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
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

        <h2 className="text-lg font-semibold mb-4">
          Export Booking Data
        </h2>

        <div className="flex flex-col gap-3">

          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              className="border w-full p-2 rounded mt-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              className="border w-full p-2 rounded mt-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

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
    </div>
  );
};

export default ExportBookingModal;