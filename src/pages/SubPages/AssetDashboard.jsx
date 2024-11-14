import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaSpinner,
} from "react-icons/fa";
import {
  downloadAsset,
  getBreakdownDownload,
  getBreakCount,
  getInUseAssetBreakDown,
  getTotalAssetCount,
  getPPMOverDueCount,
  getPPMpendingCount,
  getPPMCompleteCount,
  getPPMOverDueDownload,
  getPPMPendingDownload,
  getPPMcompleteDownload,
  getScheduledDownload,
  getRoutineScheduledDownload,
  getRoutineScheduledCount,
  getRoutineOverdueCount,
  getRoutineCompleteCount,
  getPPMScheduleCount,
  getRoutineOverdueDownload,
  getRoutineCompleteDownload,
  getAssetInDownload,
  getRoutinePendingDownload,
  getRoutinePendingCount,
} from "../../api";
import toast from "react-hot-toast";
import { IoSettingsOutline } from "react-icons/io5";
import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineAreaChart,
} from "react-icons/ai";
import { RiPieChartFill } from "react-icons/ri";
function AssetDashboard() {
  const [breakCount, setBreakCount] = useState("");
  const [inUseCount, setInUseCount] = useState("");
  const [totalAssetCount, setTotalAssetCount] = useState("");
  const [ppmSchedule, setPPMSchedule] = useState("");
  const [ppmOverDue, setPPMOverDue] = useState("");
  const [ppmPending, setPPMPending] = useState("");
  const [ppmComplete, setPPMComplete] = useState("");
  const [routineScheduleCount, setRoutineScheduleCount] = useState("");
  const [routineOverdueCount, setRoutineOverdueCount] = useState("");
  const [routineCompleteCount, setRoutineCompleteCount] = useState("");
  const [routinePendingCount, setRoutinePendingCount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isAssetDropdown, setIsAssetDropdown] = useState(false);
  const [assetChartType, setAssetChartType] = useState("pie"); // State to store chart type

  const toggleAssetDropdown = () => setIsAssetDropdown(!isAssetDropdown);

  // Change chart type based on dropdown selection
  const handleAssetChartTypeChange = (type) => {
    setAssetChartType(type);
    setIsAssetDropdown(false); // Close the dropdown after selecting a chart type
  };
  const optionsPPMOverdue = {
    chart: {
      type: assetChartType,
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
      verticalAlign: "top",
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
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
      line: {
        dataLabels: {
          enabled: true,
        },
      },
      area: {
        stacking: "normal",
      },
    },
    series: [
      {
        name: "Asset",
        colorByPoint: true,
        data: [
          {
            name: "In Use Asset",
            y: Number(inUseCount) || 0,
            color: "#10B981",
          },
          { name: "Break Down", y: Number(breakCount) || 0, color: "#EF4444" },
        ],
      },
    ],
  };
  const [isPPMDropdown, setIsPPMDropdown] = useState(false);
  const [ppmChartType, setPPMChartType] = useState("pie"); // State to store chart type

  const togglePPMDropdown = () => setIsPPMDropdown(!isPPMDropdown);

  // Change chart type based on dropdown selection
  const handlePPMChartTypeChange = (type) => {
    setPPMChartType(type);
    setIsPPMDropdown(false); // Close the dropdown after selecting a chart type
  };

  const optionsPPMSchedule = {
    chart: {
      type: ppmChartType,
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
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
      line: {
        dataLabels: {
          enabled: true,
        },
      },
      area: {
        stacking: "normal",
      },
    },
    series: [
      {
        name: "PPM",
        colorByPoint: true,
        data: [
          { name: "PPM Overdue", y: Number(ppmOverDue) || 0, color: "#EF4444" },
          // { name: "PPM Pending", y: Number(ppmPending) || 0, color: "#10B981" },
          {
            name: "PPM Complete",
            y: Number(ppmComplete) || 0,
            color: "#10B981",
          },
        ],
      },
    ],
  };

  const [isRoutineDropdown, setIsRoutineDropdown] = useState(false);
  const [routineChartType, setRoutineChartType] = useState("pie"); // State to store chart type

  const toggleRoutineDropdown = () => setIsRoutineDropdown(!isRoutineDropdown);

  // Change chart type based on dropdown selection
  const handleRoutineChartTypeChange = (type) => {
    setRoutineChartType(type);
    setIsRoutineDropdown(false); // Close the dropdown after selecting a chart type
  };

  const getChartTypeIcon = (type) => {
    switch (type) {
      case "pie":
        return <RiPieChartFill className="mr-2" />;
      case "column":
        return <AiOutlineBarChart className="mr-2" />;
      case "line":
        return <AiOutlineLineChart className="mr-2" />;
      case "area":
        return <AiOutlineAreaChart className="mr-2" />;
      default:
        return null;
    }
  };

  const optionsRoutineSchedule = {
    chart: {
      type: routineChartType, // Use chartType state here
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
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
      line: {
        dataLabels: {
          enabled: true,
        },
      },
      area: {
        stacking: "normal",
      },
      bar: {
        stacking: "normal",
      },
    },
    series: [
      {
        name: "Task Routine",
        colorByPoint: true,
        data: [
          {
            name: "Task Routine Overdue",
            y: Number(routineOverdueCount) || 0,
            color: "#EF4444", // Example data
          },
          {
            name: "Task Routine Complete",
            y: Number(routineCompleteCount) || 0,
            color: "#10B981", // Example data
          },
        ],
      },
    ],
  };

  const handleTotalAssetDownload = async () => {
    toast.loading("Downloading Please Wait");
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
      link.setAttribute("download", "Total_Asset_file.xlsx"); // Name the file
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Asset downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Asset:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleTotalBreakdownDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getBreakdownDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BreakDown_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("BreakDown Asset downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading BreakDown Asset:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const assetInUseDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getAssetInDownload();

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inUse_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("In Use Asset downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading In Use Asset:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleScheduledDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getScheduledDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "scheduled_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PPM Scheduled downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PPM Scheduled:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMOverDueDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getPPMOverDueDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_Over_Due_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PPM Over Due downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PPM Over Due:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMPendingDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getPPMPendingDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_pending_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("PPM Pending downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PPM Pending:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handlePPMCompleteDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getPPMcompleteDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ppm_complete_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PPM Completed downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading PPM Completed:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  // task routine

  const handleRoutineScheduledDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getRoutineScheduledDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_scheduled_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Routine Scheduled downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Routine Scheduled:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleRoutineOverDueDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getRoutineOverdueDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_overdue_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Routine Overdue downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Routine Overdue:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleRoutinePendingDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getRoutinePendingDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_pending_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Routine Pending downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Routine Pending:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const handleRoutineCompleteDownload = async () => {
    toast.loading("downloading please wait");
    try {
      const response = await getRoutineCompleteDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "routine_complete_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success("Routine Complete downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Routine Complete:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  useEffect(() => {
    const fetchAssetTotalCount = async () => {
      try {
        const totalAsset = await getTotalAssetCount();
        setTotalAssetCount(totalAsset.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTotalBreakdownCount = async () => {
      try {
        const breakCount = await getBreakCount();
        setBreakCount(breakCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchInUseAssetBreakDownCount = async () => {
      try {
        const inUse = await getInUseAssetBreakDown(); // API call to fetch users
        setInUseCount(inUse.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPPMScheduleCount = async () => {
      try {
        const scheduleCount = await getPPMScheduleCount(); // API call to fetch users
        setPPMSchedule(scheduleCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPPMOverDueCount = async () => {
      try {
        const overDueCount = await getPPMOverDueCount(); // API call to fetch users
        setPPMOverDue(overDueCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPPMpendingCount = async () => {
      try {
        const pendingCount = await getPPMpendingCount(); // API call to fetch users
        setPPMPending(pendingCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPPMCompleteCount = async () => {
      try {
        const completeCount = await getPPMCompleteCount(); // API call to fetch users
        setPPMComplete(completeCount.data.count);
      } catch (error) {
        console.log(error);
      }
    };
    // routine
    const fetchRoutineScheduledCount = async () => {
      try {
        const routineSchedule = await getRoutineScheduledCount(); // API call to fetch users
        setRoutineScheduleCount(routineSchedule.data.count);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRoutineOverdueCount = async () => {
      try {
        const routineOverdue = await getRoutineOverdueCount(); // API call to fetch users
        console.log(routineOverdue);
        setRoutineOverdueCount(routineOverdue.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRoutineCompleteCount = async () => {
      try {
        const routineComplete = await getRoutineCompleteCount(); // API call to fetch users
        console.log(routineComplete);
        setRoutineCompleteCount(routineComplete.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRoutinePendingCount = async () => {
      try {
        const routinePending = await getRoutinePendingCount(); // API call to fetch users
        console.log(routinePending);
        setRoutinePendingCount(routinePending.data.count);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalBreakdownCount();
    fetchAssetTotalCount();
    fetchPPMOverDueCount();
    fetchPPMpendingCount();
    fetchPPMCompleteCount();
    fetchInUseAssetBreakDownCount();
    fetchRoutineScheduledCount();
    fetchRoutineOverdueCount();
    fetchRoutineCompleteCount();
    fetchPPMScheduleCount();
    fetchRoutinePendingCount();
  }, []);

  const cardData = [
    {
      title: "Total Asset",
      count: totalAssetCount,
      downloadHandler: handleTotalAssetDownload,
    },
    {
      title: "Asset Breakdown",
      count: breakCount,
      downloadHandler: handleTotalBreakdownDownload,
    },
    {
      title: "In Use Asset",
      count: inUseCount,
      downloadHandler: assetInUseDownload,
    },
    {
      title: "PPM Scheduled",
      count: ppmSchedule,
      downloadHandler: handleScheduledDownload,
    },
    {
      title: "PPM Overdue",
      count: ppmOverDue,
      downloadHandler: handlePPMOverDueDownload,
    },
    // {
    //   title: "PPM Pending",
    //   count: ppmPending,
    //   downloadHandler: handlePPMPendingDownload,
    // },
    {
      title: "PPM Complete",
      count: ppmComplete,
      downloadHandler: handlePPMCompleteDownload,
    },
    {
      title: "Task Routine Scheduled",
      count: routineScheduleCount,
      downloadHandler: handleRoutineScheduledDownload,
    },
    {
      title: "Task Routine Overdue",
      count: routineOverdueCount,
      downloadHandler: handleRoutineOverDueDownload,
    },
    // {
    //   title: "Task Routine Pending",
    //   count: routinePendingCount,
    //   downloadHandler: handleRoutinePendingDownload,
    // },
    {
      title: "Task Routine Complete",
      count: routineCompleteCount,
      downloadHandler: handleRoutineCompleteDownload,
    },
  ];
  const [selectedTitles, setSelectedTitles] = useState(
    cardData.map((card) => card.title)
  );

  const handleCheckboxChange = (title) => {
    setSelectedTitles((prevSelected) =>
      prevSelected.includes(title)
        ? prevSelected.filter((item) => item !== title)
        : [...prevSelected, title]
    );
  };
  return (
    <div className="w-full overflow-hidden flex flex-col">
      {/* Dropdown for Card Filters */}
      <div className="relative mb-5 flex justify-end" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex gap-2 items-center"
        >
          <IoSettingsOutline /> Assets
          {isDropdownOpen ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </button>
        {isDropdownOpen && (
          <div className="absolute mt-12 mr-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-2">
              {cardData.map((card) => (
                <label
                  key={card.title}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTitles.includes(card.title)}
                    onChange={() => handleCheckboxChange(card.title)}
                    className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-0"
                  />
                  <span className="ml-2 text-gray-700">{card.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-5 mx-3">
        {cardData.map(
          (card) =>
            selectedTitles.includes(card.title) && (
              <div
                key={card.title}
                className="bg-white shadow-custom-all-sides border py-2 px-5 rounded-md flex flex-col text-gray-500 text-sm font-medium h-32"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-xl text-center">
                    {card.title}
                  </h2>
                  <div>
                    {card.loading ? (
                      <div className="flex gap-2">
                        <h2 className="text-sm">Downloading ...</h2>
                        <FaSpinner className="animate-spin text-blue-500" />
                      </div>
                    ) : (
                      <button onClick={card.downloadHandler}>
                        <FaDownload />
                      </button>
                    )}
                  </div>
                </div>
                <div className="my-5 flex items-center justify-center">
                  <span className="text-3xl">{card.count}</span>
                </div>
              </div>
            )
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-5 my-5 mx-3">
        <div className="w-full">
          <div className="py-2 px-3 shadow-custom-all-sides rounded-lg border bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Asset
              </h2>
              <div>
                <button
                  className="rounded-md bg-gray-200 py-1 px-5"
                  onClick={handleTotalAssetDownload}
                >
                  <FaDownload />
                </button>
                <div className="relative inline-block text-left mx-1">
                  <button
                    onClick={toggleAssetDropdown}
                    className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
                  >
                    <span className="flex justify-center">
                      {getChartTypeIcon(assetChartType)}
                    </span>
                  </button>

                  {isAssetDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleAssetChartTypeChange("pie")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            assetChartType === "pie"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <RiPieChartFill className="mr-2" />
                            <span className="text-xs">Pie</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleAssetChartTypeChange("column")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            assetChartType === "column"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineBarChart className="mr-2" />
                            <span className="text-xs">Column</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleAssetChartTypeChange("line")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            assetChartType === "line"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineLineChart className="mr-2" />
                            <span className="text-xs">Line</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleAssetChartTypeChange("area")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            assetChartType === "area"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineAreaChart className="mr-2" />
                            <span className="text-xs">Area</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={optionsPPMOverdue}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="py-2 px-3 shadow-custom-all-sides rounded-lg border bg-white text-black">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Total PPM</h2>
              <div>
                <button
                  className="rounded-md bg-gray-200 py-1 px-5"
                  onClick={handleScheduledDownload}
                >
                  <FaDownload />
                </button>
                <div className="relative inline-block text-left mx-1">
                  <button
                    onClick={togglePPMDropdown}
                    className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
                  >
                    <span className="flex justify-center">
                      {getChartTypeIcon(ppmChartType)}
                    </span>
                  </button>

                  {isPPMDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handlePPMChartTypeChange("pie")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            ppmChartType === "pie"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <RiPieChartFill className="mr-2" />
                            <span className="text-xs">Pie</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handlePPMChartTypeChange("column")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            ppmChartType === "column"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineBarChart className="mr-2" />
                            <span className="text-xs">Column</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handlePPMChartTypeChange("line")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            ppmChartType === "line"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineLineChart className="mr-2" />
                            <span className="text-xs">Line</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handlePPMChartTypeChange("area")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            ppmChartType === "area"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineAreaChart className="mr-2" />
                            <span className="text-xs">Area</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={optionsPPMSchedule}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="py-2 px-3 shadow-custom-all-sides rounded-lg border bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Routine Task
              </h2>
              <div>
                <button
                  className="rounded-md bg-gray-200 py-1 px-5"
                  onClick={handleRoutineScheduledDownload}
                >
                  <FaDownload />
                </button>
                <div className="relative inline-block text-left mx-1">
                  <button
                    onClick={toggleRoutineDropdown}
                    className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
                  >
                    <span className="flex justify-center">
                      {getChartTypeIcon(routineChartType)}
                    </span>
                  </button>

                  {isRoutineDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleRoutineChartTypeChange("pie")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            routineChartType === "pie"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <RiPieChartFill className="mr-2" />
                            <span className="text-xs">Pie</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleRoutineChartTypeChange("column")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            routineChartType === "column"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineBarChart className="mr-2" />
                            <span className="text-xs">Column</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleRoutineChartTypeChange("line")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            routineChartType === "line"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineLineChart className="mr-2" />
                            <span className="text-xs">Line</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleRoutineChartTypeChange("area")}
                          className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                            routineChartType === "area"
                              ? "bg-gray-200 text-black"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <AiOutlineAreaChart className="mr-2" />
                            <span className="text-xs">Area</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10">
              <HighchartsReact
                highcharts={Highcharts}
                options={optionsRoutineSchedule}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDashboard;
