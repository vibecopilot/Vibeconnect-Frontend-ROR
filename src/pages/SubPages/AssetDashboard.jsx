import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FaDownload } from "react-icons/fa";
import {
  downloadAsset,
  getBreakdownDownload,
  getBreakCount,
  getTotalAssetCount,
  getPPMOverDueCount,
  getPPMpendingCount,
  getCompleteCount,
  getPPMOverDueDownload,
  getPPMPendingDownload,
  getPPMcompleteDownload,
} from "../../api";
import toast from "react-hot-toast";

function AssetDashboard() {
  const [breakCount, setBreakCount] = useState("");
  const [totalAssetCount, setTotalAssetCount] = useState("");
  const [ppmOverDue, setPPMOverDue] = useState("");
  const [ppmPending, setPPMPending] = useState("");
  const [ppmComplete, setPPMComplete] = useState("");
  const optionsPPMOverdue = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: null,
      // Updated title text
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Asset", // Updated series name
        colorByPoint: true,
        data: [
          { name: "Total Asset", y: Number(totalAssetCount) || 0, color: "#EF4444" },
          { name: "Break Down", y: Number(breakCount) || 0, color: "#10B981" },
        ],
      },
    ],
  };
  const optionsPPMSchedule = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
        },
      },
    },
    series: [
      {
        name: "PPM",
        colorByPoint: true,
        data: [
          { name: "PPM Overdue", y: Number(ppmOverDue) || 0, color: "#EF4444" },
          { name: "PPM Pending", y: Number(ppmPending) || 0, color: "#10B981" },
          { name: "PPM Complete", y: Number(ppmComplete) || 0, color: "#3B82F6" },
        ],
      },
    ],
  };
  

  const handleTotalAssetDownload = async () => {
    try {
      const response = await downloadAsset();

      // Check if the response headers contain the correct content type
      console.log(response.headers["content-type"]);

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"], // Explicitly set the content type
        })
      );

      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_file.xlsx"); // Name the file
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Asset downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Asset:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleTotalBreakdownDownload = async () => {
    try {
      const response = await getBreakdownDownload();

      // Check if the response headers contain the correct content type
      console.log(response.headers["content-type"]);

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"], // Explicitly set the content type
        })
      );

      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_file.xlsx"); // Name the file
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Asset downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Asset:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMOverDueDownload = async () => {
    try {
      const response = await getPPMOverDueDownload();

      // Check if the response headers contain the correct content type
      console.log(response.headers["content-type"]);

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"], // Explicitly set the content type
        })
      );

      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_Over_Due_file.xlsx"); // Name the file
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PPM Over Due downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PPM Over Due:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMPendingDownload = async () => {
    try {
      const response = await getPPMPendingDownload();

      // Check if the response headers contain the correct content type
      console.log(response.headers["content-type"]);

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"], // Explicitly set the content type
        })
      );

      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_pending_file.xlsx"); // Name the file
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PPM Pending downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PPM Pending:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMCompleteDownload = async () => {
    try {
      const response = await getPPMcompleteDownload();

      // Check if the response headers contain the correct content type
      console.log(response.headers["content-type"]);

      // Create a URL for the blob data
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"], // Explicitly set the content type
        })
      );

      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_complete_file.xlsx"); // Name the file
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PPM Completed downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PPM Completed:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  useEffect(() => {
    const handleAssetTotalCount = async () => {
      try {
        const totalAsset = await getTotalAssetCount(); // API call to fetch users
        setTotalAssetCount(totalAsset.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const handleTotalBreakdownCount = async () => {
      try {
        const breakCount = await getBreakCount(); // API call to fetch users
        setBreakCount(breakCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const handlePPMOverDueCount = async () => {
      try {
        const overDueCount = await getPPMOverDueCount(); // API call to fetch users
        setPPMOverDue(overDueCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const handlePPMpendingCount = async () => {
      try {
        const pendingCount = await getPPMpendingCount(); // API call to fetch users
        setPPMPending(pendingCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const handlePPMCompleteCount = async () => {
      try {
        const completeCount = await getCompleteCount(); // API call to fetch users
        setPPMComplete(completeCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    handleTotalBreakdownCount();
    handleAssetTotalCount();
    handlePPMOverDueCount();
    handlePPMpendingCount();
    handlePPMCompleteCount();
  }, []);
  return (
    <div className="w-full overflow-hidden flex flex-col">
      <div className="grid md:grid-cols-4 gap-5 mx-3">
        <div className="bg-white shadow-custom-all-sides border py-2 px-5 rounded-md flex flex-col  text-gray-500 text-sm font-medium h-32">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl text-center">
              Total Number of Asset
            </h2>
            <button onClick={handleTotalAssetDownload}>
              <FaDownload />
            </button>
          </div>
          <div className="my-5 flex items-center justify-center">
            <span className="text-3xl">{totalAssetCount}</span>
          </div>
        </div>
        <div className="bg-white shadow-custom-all-sides border py-2 px-5 rounded-md flex flex-col text-gray-500 text-sm font-medium h-32">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl text-center">
              Total Number of Breakdown
            </h2>
            <button onClick={handleTotalBreakdownDownload}>
              <FaDownload />
            </button>
          </div>
          <div className="my-5 flex items-center justify-center">
            <span className="text-3xl">{breakCount}</span>
          </div>
        </div>
        <div className="bg-white shadow-custom-all-sides border py-2 px-5 rounded-md flex flex-col text-gray-500 text-sm font-medium h-32">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl text-center">ppm overdue</h2>
            <button 
            onClick={handlePPMOverDueDownload}
            >
              <FaDownload />
            </button>
          </div>
          <div className="my-5 flex items-center justify-center">
            <span className="text-3xl">{ppmOverDue}</span>
          </div>
        </div>
        <div className="bg-white shadow-custom-all-sides border py-2 px-5 rounded-md flex flex-col text-gray-500 text-sm font-medium h-32">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl text-center">PPM Pending</h2>
            <button 
            onClick={handlePPMPendingDownload}
            >
              <FaDownload />
            </button>
          </div>
          <div className="my-5 flex items-center justify-center">
            <span className="text-3xl">{ppmPending}</span>
          </div>
        </div>
        <div className="bg-white shadow-custom-all-sides border py-2 px-5 rounded-md flex flex-col text-gray-500 text-sm font-medium h-32">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl text-center">PPM Complete</h2>
            <button 
            onClick={handlePPMCompleteDownload}
            >
              <FaDownload />
            </button>
          </div>
          <div className="my-5 flex items-center justify-center">
            <span className="text-3xl">{ppmComplete}</span>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-5 my-5 mx-3">
        <div className="w-full">
          <div className="py-2 px-3 shadow-custom-all-sides rounded-lg border bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Asset
              </h2>
              <button className="rounded-md bg-gray-200 py-1 px-5">
                <FaDownload />
              </button>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={optionsPPMOverdue}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="py-2 px-3 shadow-custom-all-sides rounded-lg border bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                PPM 
              </h2>
              <button className="rounded-md bg-gray-200 py-1 px-5">
                <FaDownload />
              </button>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={optionsPPMSchedule}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDashboard;
