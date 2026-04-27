import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import MyDateTable from "../../../../containers/MyDateTable";
import { useSelector } from "react-redux";
import { exportAssetReadings, getAssetReadingDetails } from "../../../../api";
import Table from "../../../../components/table/Table";
import toast from "react-hot-toast";

const getDateArray = (start, end) => {
  let arr = [];
  let dt = new Date(start);
  while (dt <= new Date(end)) {
    arr.push(new Date(dt).toISOString().split("T")[0]);
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};
const tasks = [
  { name: "Consumption 1", start: "2024-06-01", end: "2024-06-05" },
  { name: "Consumption 2", start: "2024-06-03", end: "2024-06-08" },
  { name: "Consumption 3", start: "2024-06-07", end: "2024-06-15" },
];

const Readings = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [readings, setReadings] = useState([])
  const themeColor = useSelector((state) => state.theme.color);
  const [dates, setDates] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const handleExport = async () => {

    if (!exportStartDate || !exportEndDate) {
      toast.error("Please select date range");
      return;
    }

    const toastId = toast.loading(
      "Exporting..."
    );

    try {

      const response =
        await exportAssetReadings(
          id,
          exportStartDate,
          exportEndDate
        );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        `readings_${exportStartDate}_${exportEndDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.dismiss(toastId);
      toast.success(
        "Excel Downloaded"
      );

      setShowExportModal(false);

    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Export failed");
    }

  };

  // const dates =
  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      const newDates = getDateArray(startDate, endDate);
      setDates(newDates);
    }
  };
  const handleReset = () => {
    setDates([]);
  };
  const { id } = useParams()
  useEffect(() => {
    const fetchReading = async () => {
      toast.loading("Please wait");
      try {
        const readingResp = await getAssetReadingDetails(id);
        toast.dismiss();

        let data = readingResp.data || [];

        // ✅ Step 1: Sort ASC for correct calculation
        data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        // ✅ Step 2: Group by date
        const groupedByDate = {};

        data.forEach((item) => {
          const dateKey = item.created_at.split("T")[0];

          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = [];
          }

          groupedByDate[dateKey].push(item);
        });

        let finalData = [];
        let prevKwhClosing = null;

        // ✅ Step 3: Process data
        Object.keys(groupedByDate).forEach((date) => {
          const dayRecords = groupedByDate[date];

          dayRecords.forEach((item) => {
            if (item.asset_param_name === "KWH") {
              const closing = Number(item.value);

              const opening =
                prevKwhClosing !== null ? prevKwhClosing : closing;

              const consumption = closing - opening;

              prevKwhClosing = closing;

              finalData.push({
                ...item,
                opening: opening.toFixed(2),
                value: closing.toFixed(2),
                consumption: consumption.toFixed(2),
              });
            } else {
              finalData.push({
                ...item,
                opening: "-",
                consumption: "-",
              });
            }
          });
        });

        // ✅ Step 4: Reverse for latest first display
        finalData.reverse();

        setReadings(finalData);

        toast.success("Reading fetched successfully");
      } catch (error) {
        toast.dismiss();
        console.log(error);
        toast.error("Error fetching readings");
      }
    };

    fetchReading();
  }, []);
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short", // or 'long' for full month names
      year: "numeric",

    });
  };
  const TimeFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      // second: '2-digit'
      hour12: true,
    });
  };
  const column = [
    {
      name: "Date",
      selector: (row) => dateFormat(row.created_at),
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => TimeFormat(row.created_at),
      sortable: true,
    },
    {
      name: "Parameter",
      selector: (row) => row.asset_param_name,
      sortable: true,
    },
    {
      name: "Opening",
      selector: (row) => row.opening,
      sortable: true,
    },
    {
      name: "Closing",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Consumption",
      selector: (row) => row.consumption,
      sortable: true,
    },
    {
      name: "Submitted by",
      selector: (row) => row.user_name,
      sortable: true,
    },



  ]
  return (
    <div className="p-4">
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Export
        </button>
      </div>
      {/* <div className="flex md:flex-row flex-col gap-2 items-center my-2">
        <div>
          <label htmlFor="startDate" className="font-medium">
            From :{" "}
          </label>
          <input
            type="date"
            className="border border-gray-400 px-4 rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <span>-</span>
        <div>
          <label htmlFor="endDate" className="font-medium">
            To :{" "}
          </label>
          <input
            type="date"
            className="border border-gray-400 px-4 rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="px-4 border-2 border-black rounded-md"
          onClick={handleDateRangeSubmit}
        >
          Apply
        </button>
        <button
          className="px-4 border-2 border-black rounded-md"
          onClick={handleReset}
        >
          Reset
        </button>
      </div> */}
      {/* <div className="overflow-x-auto">
        <table className="min-w-full bg-white ">
          <thead className="">
            <tr style={{ background: themeColor }} className="text-white ">
              <th className="px-4 py-2 border min-w-96">Consumption</th>
              {readings.map((date) => (
                <th key={date} className="px-4 py-2 border min-w-40">
                  {dateFormat(date.created_at)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.name}>
                <td className="px-4 py-2 border">{task.name}</td>
                {dates.map((date) => {
                  const isActive = date >= task.start && date <= task.end;
                  return (
                    <td
                      key={date}
                      className={`px-4 py-2 border ${
                        isActive ? "bg-blue-500" : ""
                      }`}
                    ></td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      <Table columns={column} data={readings} />
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Export Data</h2>

            <div className="mb-3">
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <iframe src={`https://admin.vibecopilot.ai/show_readings?asset_id=${id}&wv=true&token=efe990d24b0379af8b5ba3d0a986ac802796bc2e0db15552`} width="100%" height="600px"></iframe> */}
    </div>
  );
};

export default Readings;