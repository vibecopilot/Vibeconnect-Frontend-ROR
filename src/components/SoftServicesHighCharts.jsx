import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getServicesTaskList, getSoftServiceDownload} from "../api";
import { useSelector } from "react-redux";
import { CirclesWithBar, DNA, ThreeDots } from "react-loader-spinner";
import { FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { AiOutlineAreaChart, AiOutlineBarChart, AiOutlineLineChart } from "react-icons/ai";
import { RiPieChartFill } from "react-icons/ri";
import { PiChartBarHorizontal } from "react-icons/pi";


// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const SoftServiceHighCharts = () => {
  const [categoryData, setCategoryData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [ticketTypes, setTicketTypes] = useState({});
  const [floorTickets, setFloorTickets] = useState({});
  const [unitTickets, setUnitTickets] = useState({});
  const themeColor = useSelector((state) => state.theme.color);
  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        const ticketInfoResp = await getServicesTaskList();
        setStatusData(ticketInfoResp.data.by_status);
        setCategoryData(ticketInfoResp.data.by_building);


        // setTicketTypes(ticketInfoResp.data.by_type);
        setFloorTickets(ticketInfoResp.data.by_floor);
        setUnitTickets(ticketInfoResp.data.by_unit);
      } catch (error) {
        console.log("Error fetching ticket info:", error);
      }
    };


    fetchTicketInfo();
  }, []);


  // download api
  const handleSoftServiceDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getSoftServiceDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Soft_Service_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Soft Service downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Soft Service:", error);
      toast.error("Something went wrong, please try again");
    }
  };


  const sortData = (data, order = "ascending") => {
    const sortedEntries = Object.entries(data).sort(([, a], [, b]) =>
      order === "ascending" ? b - a : a - b
    );
    return Object.fromEntries(sortedEntries);
  };


  const getChartTypeIcon = (type) => {
    switch (type) {
      case "pie":
        return <RiPieChartFill className="mr-2" />;
      case "bar":
        return <PiChartBarHorizontal className="mr-2" />;
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


  const [isStatusDropdown, setIsStatusDropdown] = useState(false);
  const [statusChartType, setStatusChartType] = useState("pie"); // State to store chart type


  const toggleStatusDropdown = () =>
    setIsStatusDropdown(!isStatusDropdown);


  // Change chart type based on dropdown selection
  const handleStatusChartTypeChange = (type) => {
    setStatusChartType(type);
    setIsStatusDropdown(false); // Close the dropdown after selecting a chart type
  };
  const generatePieChartOptions = (title, data, chartType = statusChartType) => {
    const colors = {
      overdue: "#fbc02d", // Yellow
      complete: "#4caf50", // Green
      pending: "#f44336", // Red
    };
 
    return {
      chart: {
        type: chartType, // Dynamically set the chart type
        borderRadius: 30,
      },
      title: {
        text: title,
      },
      xAxis: chartType === "column" ? {
        categories: Object.keys(data), // Set the labels for column chart
        title: {
          text: "Status", // Optional: Label for x-axis
        },
      } : undefined, // No x-axis for pie chart
      yAxis: chartType === "column" ? {
        min: 0,
        title: {
          text: "Count", // Optional: Label for y-axis
        },
      } : undefined, // No y-axis for pie chart
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true, // Enable data labels for column charts
            format: "{point.y}", // Show only the value
          },
        },
        line: {
          dataLabels: {
            enabled: true, // Enable data labels for line charts
            format: "{point.y}", // Show only the value
          },
        },
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true, // Enable data labels for pie charts
            format: "{point.name}: {point.percentage:.1f}%", // Show name and percentage
          },
          showInLegend: true,
        },
        series: {
          dataLabels: {
            enabled: true, // Enable data labels for all chart types by default
          },
        },
      },
      series: [
        {
          name: title,
          colorByPoint: chartType === "pie", // Only color by point for pie charts
          data: chartType === "pie"
            ? Object.keys(data).map((key) => ({
                name: key,
                y: data[key],
                color: colors[key] || "#607d8b", // Default to grey if no color is defined
              }))
            : Object.values(data), // Use only values for column/line charts
        },
      ],
    };
  };
 
 


  // const generateBarChartOptions = (title, data,order) => {
  //   const sortedData = sortData(data, order);
  //   return {
  //     chart: {
  //       type: "bar",
  //       borderRadius: 30,
  //     },
  //     title: {
  //       text: title,
  //     },
  //     xAxis: {
  //       categories: Object.keys(sortedData),
  //       // categories: Object.keys(data),
  //       title: {
  //         text: null,
  //       },
  //     },
  //     yAxis: {
  //       min: 0,
  //       title: {
  //         text: "Tickets",
  //         // align: "high",
  //       },
  //       labels: {
  //         overflow: "justify",
  //       },
  //     },
  //     series: [
  //       {
  //         name: title,
  //         data: Object.values(sortedData),
  //         color: themeColor,
  //       },
  //     ],
  //   };
  // };




  const [isBuildingDropdown, setIsBuildingDropdown] = useState(false);
  const [buildingChartType, setBuildingChartType] = useState("bar"); // State to store chart type


  const toggleBuildingDropdown = () =>
    setIsBuildingDropdown(!isBuildingDropdown);


  // Change chart type based on dropdown selection
  const handleBuildingChartTypeChange = (type) => {
    setBuildingChartType(type);
    setIsBuildingDropdown(false); // Close the dropdown after selecting a chart type
  };
  const generateBarChartOptions = (title, data, order) => {
    const sortedData = sortData(data, order);
  
    // Prepare series data with labels
    const seriesData = Object.keys(sortedData).map((key) => ({
      name: key, // Label for the bar
      y: sortedData[key], // Value for the bar
    }));
  
    return {
      chart: {
        type: buildingChartType,
        borderRadius: 30,
      },
      title: {
        text: title,
      },
      xAxis: {
        categories: Object.keys(sortedData), // Use keys as categories
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Services",
        },
        labels: {
          overflow: "justify",
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              // Display series label (name) and value (y) for each bar
              return `${this.point.name}: ${this.y}`;
            },
            style: {
              textOutline: "none", // Remove text outline
              fontSize: "12px", // Adjust font size
            },
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
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: title, // Legend name
          data: seriesData, // Data with labels
          color: themeColor,
        },
      ],
    };
  };  
  const generateColumnChartOptions = (title, data, order = "ascending") => {
    const sortedData = sortData(data, order);
    const TicketsType = Object.keys(sortedData);
    const ticketValues = Object.values(sortedData);


    return {
      chart: {
        type: "column",
        borderRadius: 30,
      },
      title: {
        text: title,
      },
      xAxis: {
        categories: TicketsType,
        title: {
          text: "Building",
        },
        labels: {
          rotation: 0, // Ensures the text is straight (no rotation)
          style: {
            fontSize: "11px", // Adjust the font size for better readability
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Services",
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return this.y; // Display the y value (data value) on the bar
            },
            style: {
              textOutline: false, // Remove text outline (optional)
            },
          },
        },
        line: {
          dataLabels: {
            enabled: true,
          },
        },
        area: {
          stacking: "normal",
        },
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Soft Services by Building",
          data: ticketValues,
          color: themeColor,
        },
      ],
    };
  };


  const [isFloorDropdown, setIsFloorDropdown] = useState(false);
  const [floorChartType, setFloorChartType] = useState("column"); // State to store chart type


  const toggleFloorDropdown = () =>
    setIsFloorDropdown(!isFloorDropdown);


  // Change chart type based on dropdown selection
  const handleFloorChartTypeChange = (type) => {
    setFloorChartType(type);
    setIsFloorDropdown(false); // Close the dropdown after selecting a chart type
  };
  const generateFloorColumnChartOptions = (
    title,
    data,
    order = "ascending"
  ) => {
    const sortedData = sortData(data, order);
  
    // Prepare series data with labels
    const seriesData = Object.keys(sortedData).map((key) => ({
      name: key, // Label for the bar
      y: sortedData[key], // Value for the bar
    }));
  
    return {
      chart: {
        type: floorChartType,
        borderRadius: 30,
      },
      title: {
        text: title,
      },
      max: 10,
      scrollbar: {
        enabled: true,
      },
      xAxis: {
        categories: Object.keys(sortedData),
        title: {
          text: "Floors",
        },
        labels: {
          rotation: 0, // Ensures the text is straight (no rotation)
          style: {
            fontSize: "12px", // Adjust font size for better readability
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Services",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
          },
          showInLegend: true,
        },
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              // Display series label (name) and value (y) for each bar
              return `${this.point.name}: ${this.y}`;
            },
            style: {
              textOutline: false, // Remove text outline (optional)
              fontSize: "12px", // Adjust font size for better readability
            },
          },
        },
      },
      series: [
        {
          name: "Soft Services By Floor", // Legend name
          data: seriesData, // Data with labels
          color: themeColor,
        },
      ],
    };
  };  


  const [isUnitDropdown, setIsUnitDropdown] = useState(false);
  const [unitChartType, setUnitChartType] = useState("column"); // State to store chart type


  const toggleUnitDropdown = () =>
    setIsUnitDropdown(!isFloorDropdown);


  // Change chart type based on dropdown selection
  const handleUnitChartTypeChange = (type) => {
    setUnitChartType(type);
    setIsUnitDropdown(false); // Close the dropdown after selecting a chart type
  };
  const generateUnitColumnChartOptions = (title, data, order = "ascending") => {
    const sortedData = sortData(data, order); // Sort the data
    const unitTickets = Object.keys(sortedData);
    const ticketValues = Object.values(sortedData);
  
    // Prepare the data for series with labels
    const seriesData = unitTickets.map((unit, index) => ({
      name: unit, // Label for the bar (e.g., "Unit 1", "Unit 2")
      y: ticketValues[index], // Value for the bar
    }));
  
    return {
      chart: {
        type: unitChartType,
        borderRadius: 30,
        scrollablePlotArea: {
          minWidth: unitTickets.length * 100, // Dynamically adjust scrollable area based on number of units
          scrollPositionX: 0, // Start the scroll from the left
        },
      },
      title: {
        text: title,
      },
      xAxis: {
        categories: unitTickets,
        title: {
          text: "Units",
        },
        scrollbar: {
          enabled: unitTickets.length > 10, // Enable scrollbar if there are more than 10 units
        },
        labels: {
          rotation: 0, // Ensures the text is straight (no rotation)
          style: {
            fontSize: "12px", // Adjust the font size for better readability
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Services",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.percentage:.1f}%",
          },
          showInLegend: true,
        },
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              // Display both the label (name) and value (y) for each bar
              return `${this.point.name}: ${this.y}`;
            },
            style: {
              textOutline: false, // Remove text outline (optional)
              fontSize: "12px", // Adjust font size for better readability
            },
          },
        },
      },
      series: [
        {
          name: "Soft Services by Units", // Series label (name)
          data: seriesData, // Data with labels and values
          color: themeColor,
        },
      ],
    };
  };
  
  return (
    <div>
      <div className="grid md:grid-cols-2 mr-2  gap-2">
        <div className=" shadow-custom-all-sides rounded-md">
          <div className="flex justify-end p-3">
            <button
              className="rounded-md bg-gray-200 py-1 px-5"
              onClick={handleSoftServiceDownload}
            >
              <FaDownload />
            </button>
            <div className="relative inline-block text-left mx-1">
              <button
                onClick={toggleStatusDropdown}
                className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
              >
                <span className="flex justify-center">
                  {getChartTypeIcon(statusChartType)}
                </span>
              </button>


              {isStatusDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleStatusChartTypeChange("pie")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        statusChartType === "pie"
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
                      onClick={() => handleStatusChartTypeChange("column")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        statusChartType === "column"
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
                      onClick={() => handleStatusChartTypeChange("line")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        statusChartType === "line"
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
                      onClick={() => handleStatusChartTypeChange("area")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        statusChartType === "area"
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
          {statusData ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={generatePieChartOptions(
                "Soft Services by Status",
                statusData
              )}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <DNA
                visible={true}
                height="120"
                width="120"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          )}
        </div>


        <div className="bg-white shadow-custom-all-sides rounded-md">
          <div className="flex justify-end p-3">
            <button
              className="rounded-md bg-gray-200 py-1 px-5"
              onClick={handleSoftServiceDownload}
            >
              <FaDownload />
            </button>
            <div className="relative inline-block text-left mx-1">
              <button
                onClick={toggleBuildingDropdown}
                className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
              >
                <span className="flex justify-center">
                  {getChartTypeIcon(buildingChartType)}
                </span>
              </button>


              {isBuildingDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleBuildingChartTypeChange("bar")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        buildingChartType === "bar"
                          ? "bg-gray-200 text-black"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <PiChartBarHorizontal className="mr-2" />
                        <span className="text-xs">Bar</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleBuildingChartTypeChange("line")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        buildingChartType === "line"
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
                      onClick={() => handleBuildingChartTypeChange("column")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        buildingChartType === "column"
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
                      onClick={() => handleBuildingChartTypeChange("pie")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        buildingChartType === "pie"
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
                      onClick={() => handleBuildingChartTypeChange("area")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        buildingChartType === "area"
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
          {categoryData ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={generateBarChartOptions(
                "Soft Services by Building",
                categoryData
              )}
              order="descending"
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <DNA
                visible={true}
                height="120"
                width="120"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          )}
        </div>


        {/* <div className="bg-white shadow-custom-all-sides rounded-md">
          {ticketTypes ? <HighchartsReact
            highcharts={Highcharts}
            options={generateColumnChartOptions("Tickets by Type", ticketTypes)}
              order="ascending"


          /> : (
            <div className="flex justify-center items-center h-full">
              <DNA
                visible={true}
                height="120"
                width="120"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          )}
        </div> */}
      </div>
      {/* <div className="bg-white shadow-custom-all-sides rounded-md my-2 mr-2">
          {categoryData ? <HighchartsReact
            highcharts={Highcharts}
            options={generateColumnChartOptions("Soft Services by Building", categoryData)}
              order="ascending"


          /> : (
            <div className="flex justify-center items-center h-full">
              <DNA
                visible={true}
                height="120"
                width="120"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          )}
        </div> */}
      <div className="bg-white shadow-custom-all-sides rounded-md my-2 mr-2">
        <div className="flex justify-end p-3">
          <button
            className="rounded-md bg-gray-200 py-1 px-5"
            onClick={handleSoftServiceDownload}
          >
            <FaDownload />
          </button>
          <div className="relative inline-block text-left mx-1">
            <button
              onClick={toggleFloorDropdown}
              className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
            >
              <span className="flex justify-center">
                {getChartTypeIcon(floorChartType)}
              </span>
            </button>


            {isFloorDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleFloorChartTypeChange("column")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      floorChartType === "column"
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
                    onClick={() => handleFloorChartTypeChange("line")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      floorChartType === "line"
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
                    onClick={() => handleFloorChartTypeChange("pie")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      floorChartType === "pie"
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
                    onClick={() => handleFloorChartTypeChange("area")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      floorChartType === "area"
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
        {floorTickets ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={generateFloorColumnChartOptions(
              "Soft Services by Floor",
              floorTickets
            )}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <DNA
              visible={true}
              height="120"
              width="120"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        )}
      </div>
      <div className="bg-white shadow-custom-all-sides rounded-md my-2 mr-2">
      <div className="flex justify-end p-3">
        <button
          className="rounded-md bg-gray-200 py-1 px-5"
          onClick={handleSoftServiceDownload}
        >
          <FaDownload  />
        </button>
        <div className="relative inline-block text-left mx-1">
            <button
              onClick={toggleUnitDropdown}
              className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
            >
              <span className="flex justify-center">
                {getChartTypeIcon(unitChartType)}
              </span>
            </button>


            {isUnitDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleUnitChartTypeChange("column")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      unitChartType === "column"
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
                    onClick={() => handleUnitChartTypeChange("line")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      unitChartType === "line"
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
                    onClick={() => handleUnitChartTypeChange("pie")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      unitChartType === "pie"
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
                    onClick={() => handleUnitChartTypeChange("area")}
                    className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                      unitChartType === "area"
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
        {unitTickets ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={generateUnitColumnChartOptions(
              "Soft Services by Unit",
              unitTickets
            )}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <DNA
              visible={true}
              height="120"
              width="120"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        )}
      </div>
    </div>
  );
};


export default SoftServiceHighCharts;



