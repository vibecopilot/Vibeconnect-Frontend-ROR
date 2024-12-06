import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getTicketDashboard, getTicketStatusDownload } from "../api";
import { useSelector } from "react-redux";
import { CirclesWithBar, DNA, ThreeDots } from "react-loader-spinner";
import { FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import { RiPieChartFill } from "react-icons/ri";
import {
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineLineChart,
} from "react-icons/ai";
import { PiChartBarHorizontal } from "react-icons/pi";


// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
const TicketHighCharts = () => {
  const [categoryData, setCategoryData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [ticketTypes, setTicketTypes] = useState({});
  const [floorTickets, setFloorTickets] = useState({});
  const [unitTickets, setUnitTickets] = useState({});
  const themeColor = useSelector((state) => state.theme.color);
  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        const ticketInfoResp = await getTicketDashboard();
        setStatusData(ticketInfoResp.data.by_status);
        setCategoryData(ticketInfoResp.data.by_category);


        setTicketTypes(ticketInfoResp.data.by_type);
        setFloorTickets(ticketInfoResp.data.by_floor);
        setUnitTickets(ticketInfoResp.data.by_unit);
      } catch (error) {
        console.log("Error fetching ticket info:", error);
      }
    };


    fetchTicketInfo();
  }, []);


  // download section
  const handleTicketStatusDownload = async () => {
    toast.loading("Downloading Please Wait");
    try {
      const response = await getTicketStatusDownload();
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ticket_file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Ticket downloaded successfully");
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Ticket:", error);
      toast.error("Something went wrong, please try again");
    }
  };
  const sortData = (data, order = "ascending") => {
    const sortedEntries = Object.entries(data).sort(([, a], [, b]) =>
      order === "ascending" ? b - a : a - b
    );
    return Object.fromEntries(sortedEntries);
  };


  const [isStatusDropdown, setIsStatusDropdown] = useState(false);
  const [statusChartType, setStatusChartType] = useState("pie"); // State to store chart type


  const toggleStatusDropdown = () => setIsStatusDropdown(!isStatusDropdown);


  // Change chart type based on dropdown selection
  const handleStatusChartTypeChange = (type) => {
    setStatusChartType(type);
    setIsStatusDropdown(false); // Close the dropdown after selecting a chart type
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


  const generatePieChartOptions = (title, data) => {
    return {
      chart: {
        type: statusChartType,
        borderRadius: 30,
      },
      title: {
        text: title,
      },
      xAxis: {
        title: {
          text: null
           // Set the label for the x-axis
        },
        categories: Object.keys(data), // Optional, if you want categories on the x-axis
      },
      yAxis: {
        title: {
          text: null
        },
      },
      plotOptions: {
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
          name: title,
          colorByPoint: true,
          data: Object.keys(data).map((key) => ({
            name: key,
            y: data[key],
          })),
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


  const [isCategoryDropdown, setIsCategoryDropdown] = useState(false);
  const [categoryChartType, setCategoryChartType] = useState("bar"); // State to store chart type


  const toggleCategoryDropdown = () =>
    setIsCategoryDropdown(!isCategoryDropdown);


  // Change chart type based on dropdown selection
  const handleCategoryChartTypeChange = (type) => {
    setCategoryChartType(type);
    setIsCategoryDropdown(false); // Close the dropdown after selecting a chart type
  };
  const generateBarChartOptions = (title, data, order) => {
    const sortedData = sortData(data, order);
  
    // Prepare series data with labels
    const categoryData = Object.keys(sortedData).map((key) => ({
      name: key, // Label for the bar
      y: sortedData[key], // Value for the bar
    }));
  
    return {
      chart: {
        type: categoryChartType,
        borderRadius: 30,
      },
      title: {
        text: title,
      },
      xAxis: {
        categories: Object.keys(sortedData),
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Tickets",
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
              // Display label and value for each bar
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
          data: categoryData, // Data with labels
          color: themeColor,
        },
      ],
    };
  };
  


  const [isTicketTypeDropdown, setIsTicketTypeDropdown] = useState(false);
  const [ticketTypeChartType, setTicketTypeChartType] = useState("column"); // State to store chart type


  const toggleTicketTypeDropdown = () =>
    setIsTicketTypeDropdown(!isTicketTypeDropdown);


  // Change chart type based on dropdown selection
  const handleTicketTypeChartTypeChange = (type) => {
    setTicketTypeChartType(type);
    setIsTicketTypeDropdown(false); // Close the dropdown after selecting a chart type
  };


  const generateColumnChartOptions = (title, data, order = "ascending") => {
    const sortedData = sortData(data, order);
    const TicketsType = Object.keys(sortedData);
    const ticketValues = Object.values(sortedData);
  
    // Prepare the data with labels for each bar
    const TypeData = TicketsType.map((type, index) => ({
      name: type, // Label for the bar (Ticket Type)
      y: ticketValues[index], // Value for the bar (Ticket count)
    }));
  
    return {
      chart: {
        type: ticketTypeChartType,
        borderRadius: 30,
      },
      title: {
        text: title,
      },
      xAxis: {
        categories: TicketsType,
        title: {
          text: "Ticket Types",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Tickets",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f}%', // Show name and percentage
          },
          showInLegend: true, // Optional: show legend for pie chart
        },
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            formatter: function () {
              // Display both name (label) and value for each bar
              return `${this.point.name}: ${this.y}`;
            },
            style: {
              textOutline: "none", // Remove text outline
              fontSize: "12px", // Adjust font size
            },
          },
        },
      },
      series: [
        {
          name: "Tickets", // Legend name
          data: TypeData, // Data with labels
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
  const generateFloorColumnChartOptions = (title, data, order = "ascending") => {
    const sortedData = sortData(data, order);
    const floorTickets = Object.keys(sortedData);
    const ticketValues = Object.values(sortedData);
  
    // Prepare the data with labels for each bar
    const floorData = floorTickets.map((floor, index) => ({
      name: floor, // Label for the specific bar
      y: ticketValues[index], // Value for the bar
    }));
  
    return {
      chart: {
        type: floorChartType,
        borderRadius: 30,
        // scrollablePlotArea: {
        //   minWidth: 700,
        //   scrollPositionX: 1
        // }
      },
      title: {
        text: title,
      },
      max: 10,
      scrollbar: {
        enabled: true,
      },
      xAxis: {
        categories: floorTickets,
        title: {
          text: "Floors",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Tickets",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f}%', // Show name and percentage
          },
          showInLegend: true, // Optional: show legend for pie chart
        },
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              // Display the label (name) and the value (y) for each bar
              return `${this.point.name}: ${this.y}`;
            },
            style: {
              textOutline: false, // Remove text outline (optional)
              fontSize: "12px", // Adjust font size for labels
            },
          },
        },
      },
      series: [
        {
          name: "Tickets By Floor",
          data: floorData, // Include the data with labels
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
    const sortedData = sortData(data, order);
    const unitTickets = Object.keys(sortedData);
    const ticketValues = Object.values(sortedData);
  
    // Prepare the data with labels for each bar
    const unitData = unitTickets.map((unit, index) => ({
      name: unit, // Name for the specific bar
      y: ticketValues[index], // Value for the bar
    }));
  
    return {
      chart: {
        type: unitChartType,
        borderRadius: 30,
        scrollablePlotArea: {
          minWidth: 700,
          scrollPositionX: 1,
        },
      },
      title: {
        text: title,
      },
      max: 10,
      scrollbar: {
        enabled: true,
      },
      xAxis: {
        categories: unitTickets,
        title: {
          text: "Units",
          style: {
            color: "#333",
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: "#555",
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Tickets",
          style: {
            color: "#333",
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            color: "#555",
          },
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f}%', // Show name and percentage
          },
          showInLegend: true, // Optional: show legend for pie chart
        },
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              // Display the name of the series and the value
              return `${this.point.name}: ${this.y}`;
            },
            style: {
              textOutline: "none", // Remove text outline
              fontSize: "10px", // Adjust font size for labels
            },
          },
        },
      },
      series: [
        {
          name: "Tickets by Units",
          data: unitData, // Include the data with labels
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
              onClick={handleTicketStatusDownload}
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
              options={generatePieChartOptions("Tickets by Status", statusData)}
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
              onClick={handleTicketStatusDownload}
            >
              <FaDownload />
            </button>
            <div className="relative inline-block text-left mx-1">
              <button
                onClick={toggleCategoryDropdown}
                className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
              >
                <span className="flex justify-center">
                  {getChartTypeIcon(categoryChartType)}
                </span>
              </button>


              {isCategoryDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleCategoryChartTypeChange("bar")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        categoryChartType === "bar"
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
                      onClick={() => handleCategoryChartTypeChange("line")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        categoryChartType === "line"
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
                      onClick={() => handleCategoryChartTypeChange("pie")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        categoryChartType === "pie"
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
                      onClick={() => handleCategoryChartTypeChange("column")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        categoryChartType === "column"
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
                      onClick={() => handleCategoryChartTypeChange("area")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        categoryChartType === "area"
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
                "Tickets by Category",
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
        <div className="bg-white shadow-custom-all-sides rounded-md">
          <div className="flex justify-end p-3">
            <button
              className="rounded-md bg-gray-200 py-1 px-5"
              onClick={handleTicketStatusDownload}
            >
              <FaDownload />
            </button>
            <div className="relative inline-block text-left mx-1">
              <button
                onClick={toggleTicketTypeDropdown}
                className="bg-blue-200 text-blue-500 px-4 rounded-md py-1"
              >
                <span className="flex justify-center">
                  {getChartTypeIcon(ticketTypeChartType)}
                </span>
              </button>


              {isTicketTypeDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleTicketTypeChartTypeChange("column")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        ticketTypeChartType === "column"
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
                      onClick={() => handleTicketTypeChartTypeChange("line")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        ticketTypeChartType === "line"
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
                      onClick={() => handleTicketTypeChartTypeChange("pie")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        ticketTypeChartType === "pie"
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
                      onClick={() => handleTicketTypeChartTypeChange("area")}
                      className={`block px-4 py-2 text-gray-700 hover:bg-gray-200 hover:text-black w-full ${
                        ticketTypeChartType === "area"
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
          {ticketTypes ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={generateColumnChartOptions(
                "Tickets by Type",
                ticketTypes
              )}
              order="ascending"
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
              onClick={handleTicketStatusDownload}
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
                "Tickets by Floor",
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
      </div>
      <div className="bg-white shadow-custom-all-sides rounded-md my-2 mr-2">
        <div className="flex justify-end p-3">
          <button
            className="rounded-md bg-gray-200 py-1 px-5"
            onClick={handleTicketStatusDownload}
          >
            <FaDownload />
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
              "Tickets by Unit",
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


export default TicketHighCharts;



