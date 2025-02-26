import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaRegCalendar,
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
  getSiteData,
} from "../../api";
import toast from "react-hot-toast";
import { IoSettingsOutline } from "react-icons/io5";
import {
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineAreaChart,
  AiOutlineUser,
} from "react-icons/ai";
import { RiPieChartFill } from "react-icons/ri";
import { FiBarChart2,FiAlertTriangle, FiBriefcase } from "react-icons/fi";
import { TbUsers } from "react-icons/tb";
import { FaRegCheckCircle } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
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
      type: assetChartType, // Ensure this is "pie", "column", etc.
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "{point.name}: <b>{point.y}</b>", // Updated tooltip format
      verticalAlign: "top",
    },
    xAxis:
      assetChartType === "column"
        ? {
            categories: ["In Use Asset", "Break Down"], // Add categories for column charts
            title: {
              text: null,
            },
          }
        : undefined, // No xAxis for pie charts
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}", // Updated data label format
        },
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
          {
            name: "Break Down",
            y: Number(breakCount) || 0,
            color: "#EF4444",
          },
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
      type: ppmChartType, // e.g., "column" or "pie"
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    xAxis:
      ppmChartType === "column"
        ? {
            categories: ["PPM Overdue", "PPM Complete"], // Labels for column chart
            title: {
              text: null, // No additional title needed for the x-axis
            },
          }
        : undefined, // Omit xAxis for pie charts
    yAxis:
      ppmChartType === "column"
        ? {
            title: {
              text: "Count", // Label for the y-axis in column charts
            },
          }
        : undefined, // Omit yAxis for pie charts
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}", // Show name and value for pie chart slices
        },
      },
    },
    series: [
      {
        name: "PPM",
        colorByPoint: true,
        data: [
          { name: "PPM Overdue", y: Number(ppmOverDue) || 0, color: "#EF4444" },
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
      type: routineChartType, // Use chartType state here (e.g., "column", "pie")
      backgroundColor: "transparent",
    },
    title: {
      text: null,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    xAxis:
      routineChartType === "column"
        ? {
            categories: ["Task Routine Overdue", "Task Routine Complete"], // Labels for column chart
            title: {
              text: null,
            },
          }
        : undefined, // No xAxis for pie charts
    yAxis:
      routineChartType === "column"
        ? {
            title: {
              text: "Count", // Label for the y-axis
            },
          }
        : undefined, // No yAxis for pie charts
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}", // Labels for pie chart
        },
      },
    },
    series: [
      {
        name: "Task Routine",
        colorByPoint: true,
        data:
          routineChartType === "column"
            ? [
                {
                  name: "Task Routine Overdue",
                  y: Number(routineOverdueCount) || 0,
                  color: "#EF4444",
                },
                {
                  name: "Task Routine Complete",
                  y: Number(routineCompleteCount) || 0,
                  color: "#10B981",
                },
              ]
            : [
                // Pie chart uses similar data structure, with names and values
                {
                  name: "Task Routine Overdue",
                  y: Number(routineOverdueCount) || 0,
                  color: "#EF4444",
                },
                {
                  name: "Task Routine Complete",
                  y: Number(routineCompleteCount) || 0,
                  color: "#10B981",
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
    // const fetchAssetTotalCount = async () => {
    //   try {
    //     const totalAsset = await getTotalAssetCount();
    //     setTotalAssetCount(totalAsset.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const fetchTotalBreakdownCount = async () => {
    //   try {
    //     const breakCount = await getBreakCount();
    //     setBreakCount(breakCount.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // const fetchInUseAssetBreakDownCount = async () => {
    //   try {
    //     const inUse = await getInUseAssetBreakDown(); // API call to fetch users
    //     setInUseCount(inUse.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const fetchPPMScheduleCount = async () => {
    //   try {
    //     const scheduleCount = await getPPMScheduleCount(); // API call to fetch users
    //     setPPMSchedule(scheduleCount.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const fetchPPMOverDueCount = async () => {
    //   try {
    //     const overDueCount = await getPPMOverDueCount(); // API call to fetch users
    //     setPPMOverDue(overDueCount.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const fetchPPMpendingCount = async () => {
    //   try {
    //     const pendingCount = await getPPMpendingCount(); // API call to fetch users
    //     setPPMPending(pendingCount.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const fetchPPMCompleteCount = async () => {
    //   try {
    //     const completeCount = await getPPMCompleteCount(); // API call to fetch users
    //     setPPMComplete(completeCount.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // // routine
    // const fetchRoutineScheduledCount = async () => {
    //   try {
    //     const routineSchedule = await getRoutineScheduledCount(); // API call to fetch users
    //     setRoutineScheduleCount(routineSchedule.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // const fetchRoutineOverdueCount = async () => {
    //   try {
    //     const routineOverdue = await getRoutineOverdueCount(); // API call to fetch users
    //     console.log(routineOverdue);
    //     setRoutineOverdueCount(routineOverdue.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const fetchRoutineCompleteCount = async () => {
    //   try {
    //     const routineComplete = await getRoutineCompleteCount(selectedSites); // API call to fetch users
    //     console.log(routineComplete);
    //     setRoutineCompleteCount(routineComplete.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // const fetchRoutinePendingCount = async () => {
    //   try {
    //     const routinePending = await getRoutinePendingCount(selectedSites); // API call to fetch users
    //     console.log(routinePending);
    //     setRoutinePendingCount(routinePending.data.count);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

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

  const fetchAssetTotalCount = async () => {
    try {
      const totalAsset = await getTotalAssetCount(selectedSites);
      setTotalAssetCount(totalAsset.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalBreakdownCount = async () => {
    try {
      const breakCount = await getBreakCount(selectedSites);
      setBreakCount(breakCount.data.count);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchInUseAssetBreakDownCount = async () => {
    try {
      const inUse = await getInUseAssetBreakDown(selectedSites); // API call to fetch users
      setInUseCount(inUse.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPPMScheduleCount = async () => {
    try {
      const scheduleCount = await getPPMScheduleCount(selectedSites); // API call to fetch users
      setPPMSchedule(scheduleCount.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPPMOverDueCount = async () => {
    try {
      const overDueCount = await getPPMOverDueCount(selectedSites); // API call to fetch users
      setPPMOverDue(overDueCount.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPPMpendingCount = async () => {
    try {
      const pendingCount = await getPPMpendingCount(selectedSites); // API call to fetch users
      setPPMPending(pendingCount.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPPMCompleteCount = async () => {
    try {
      const completeCount = await getPPMCompleteCount(selectedSites); // API call to fetch users
      setPPMComplete(completeCount.data.count);
    } catch (error) {
      console.log(error);
    }
  };
  // routine
  const fetchRoutineScheduledCount = async () => {
    try {
      const routineSchedule = await getRoutineScheduledCount(selectedSites); // API call to fetch users
      setRoutineScheduleCount(routineSchedule.data.count);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRoutineOverdueCount = async () => {
    try {
      const routineOverdue = await getRoutineOverdueCount(selectedSites); // API call to fetch users
      console.log(routineOverdue);
      setRoutineOverdueCount(routineOverdue.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoutineCompleteCount = async () => {
    try {
      const routineComplete = await getRoutineCompleteCount(selectedSites); // API call to fetch users
      console.log(routineComplete);
      setRoutineCompleteCount(routineComplete.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoutinePendingCount = async () => {
    try {
      const routinePending = await getRoutinePendingCount(selectedSites); // API call to fetch users
      console.log(routinePending);
      setRoutinePendingCount(routinePending.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const cardColor = (type) => {
    switch (type) {
      case "Total Asset":
        return { bg: "bg-blue-50", text: "text-blue-400" };
      case "Asset Breakdown":
        return { bg: "bg-green-50", text: "text-green-400" };
      case "In Use Asset":
        return { bg: "bg-yellow-50", text: "text-yellow-400" };
      case "PPM Scheduled":
        return { bg: "bg-blue-50", text: "text-blue-400" };
      case "PPM Overdue":
        return { bg: "bg-red-50", text: "text-red-400" };
      case "PPM Pending":
        return { bg: "bg-orange-50", text: "text-orange-400" };
      case "PPM Complete":
        return { bg: "bg-teal-50", text: "text-teal-400" };
      case "Routine Task Scheduled":
        return { bg: "bg-blue-50", text: "text-blue-400" };
      case "Routine Task Overdue":
        return { bg: "bg-pink-50", text: "text-pink-400" };
      case "Routine Task Pending":
        return { bg: "bg-yellow-50", text: "text-yellow-400" };
      case "Routine Task Complete":
        return { bg: "bg-green-50", text: "text-green-400" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-400" };
    }
  };

  const cardData = [
    {
      title: "Total Asset",
      count: totalAssetCount,
      downloadHandler: handleTotalAssetDownload,
      icon: <FiBriefcase className="w-4 h-4" />,
    },
    {
      title: "Asset Breakdown",
      count: breakCount,
      downloadHandler: handleTotalBreakdownDownload,
      icon: <FiBarChart2 className="w-4 h-4" />,
    },
    {
      title: "In Use Asset",
      count: inUseCount,
      downloadHandler: assetInUseDownload,
      icon: <TbUsers className="w-4 h-4" />,
    },
    {
      title: "PPM Scheduled",
      count: ppmSchedule,
      downloadHandler: handleScheduledDownload,
      icon: <FaRegCalendar className="w-4 h-4" />,
    },
    {
      title: "PPM Overdue",
      count: ppmOverDue,
      downloadHandler: handlePPMOverDueDownload,
      icon: <FiAlertTriangle className="w-4 h-4" />,
    },
    // {
    //   title: "PPM Pending",
    //   count: ppmPending,
    //   downloadHandler: handlePPMPendingDownload,
    //   icon : <BsClock className="w-4 h-4" />
    // },
    {
      title: "PPM Complete",
      count: ppmComplete,
      downloadHandler: handlePPMCompleteDownload,
      icon: <FaRegCheckCircle className="w-4 h-4" />,
    },
    {
      title: "Routine Task Scheduled",
      count: routineScheduleCount,
      downloadHandler: handleRoutineScheduledDownload,
      icon: <FaRegCalendar className="w-4 h-4" />,
    },
    {
      title: "Routine Task Overdue",
      count: routineOverdueCount,
      downloadHandler: handleRoutineOverDueDownload,
      icon: <FiAlertTriangle className="w-4 h-4" />,
    },
    // {
    //   title: "Routine Task Pending",
    //   count: routinePendingCount,
    //   downloadHandler: handleRoutinePendingDownload,
    //   icon : <BsClock className="w-4 h-4" />
    // },
    {
      title: "Routine Task Complete",
      count: routineCompleteCount,
      downloadHandler: handleRoutineCompleteDownload,
      icon: <FaRegCheckCircle className="w-4 h-4" />,
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

  const [site, setSite] = useState(false);
  const [siteData, setSiteData] = useState([]);
  const toggleSite = () => {
    setSite(!site);
  };

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await getSiteData();
        setSiteData(response.data.sites);
        console.log(response.data.sites);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSiteData();
  }, []);

  const [selectedSites, setSelectedSites] = useState([]);

  const handleSelectAll = () => {
    if (selectedSites.length === siteData.length) {
      setSelectedSites([]); // Unselect all
    } else {
      setSelectedSites(siteData.map((site) => site.id)); // Select all
    }
  };

  const handleSiteCheckbox = (id) => {
    setSelectedSites((prev) =>
      prev.includes(id) ? prev.filter((siteId) => siteId !== id) : [...prev, id]
    );
  };

  const applySelection = () => {
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
  };
  return (
    <div className="w-full overflow-hidden flex flex-col">
      {/* Dropdown for Card Filters */}
      <div className="flex justify-end gap-5">
        <div className="relative mb-5">
          <button
            onClick={toggleSite}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex justify-between gap-2 items-center w-60"
          >
            <span className="flex items-center gap-2">
              <FaBuilding /> select site
            </span>
            <div className="">
              {site
                ? React.createElement(FaChevronUp, { size: "15" })
                : React.createElement(FaChevronDown, { size: "15" })}
            </div>
          </button>
          {site && (
            <div className="absolute left-0 top-12 bg-white border-2 rounded shadow-md max-h-80 w-60 overflow-y-auto z-10 px-5 space-y-2 py-2">
              {/* Select All Option */}
              <div className="flex items-center space-x-2 px-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedSites.length === siteData.length}
                  onChange={handleSelectAll}
                />
                <label htmlFor="selectAll" className="cursor-pointer">
                  Select All
                </label>
              </div>

              {/* List of Sites */}
              {siteData.map((site) => (
                <div
                  key={site.id}
                  className="flex  items-center space-x-2 px-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedSites.includes(site.id)}
                    onChange={() => handleSiteCheckbox(site.id)}
                  />
                  <button
                    onClick={() => setSiteName(site.name_with_region)}
                    className="hover:text-gray-500 text-start"
                  >
                    {site.name_with_region}
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  applySelection();
                  setSite(false);
                }}
                className="w-full bg-gray-500 text-white py-1 mt-2 rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          )}
        </div>
        <div className="relative mb-5" ref={dropdownRef}>
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
            <div className="absolute top-12 right-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
      </div>
      <div className="grid md:grid-cols-4 gap-5 mx-3">
        {cardData.map(
          (card) =>
            selectedTitles.includes(card.title) && (
              <div
                key={card.title}
                className={`${cardColor(card.title).bg} ${
                  cardColor(card.title).text
                } shadow-custom-all-sides border py-2 px-3 rounded-md flex flex-col text-sm font-medium h-32`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-xl text-center">
                    {card.title}
                  </h2>
                  <div className="flex gap-1">
                    <span className={`${cardColor(card.title).text}`}>
                      {card.icon}
                    </span>
                    {card.loading ? (
                      <div className="flex gap-2">
                        <h2 className="text-sm">Downloading ...</h2>
                        <FaSpinner
                          className={`animate-spin ${
                            cardColor(card.title).text
                          }`}
                        />
                      </div>
                    ) : (
                      <button onClick={card.downloadHandler}>
                        <FaDownload
                          className={`${cardColor(card.title).text} h-4 w-4`}
                        />
                      </button>
                    )}
                  </div>
                </div>
                <div className="my-5 flex items-center justify-start">
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
