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
              return this.y; // Display the y value (data value) on the bar
            },
            style: {
              textOutline: false, // Remove text outline (optional)
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
          name: title,
          data: Object.values(sortedData),
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
      },
      series: [
        {
          name: "Tickets",
          data: ticketValues,
          color: themeColor,
        },
      ],
    };
  };
  const generateFloorColumnChartOptions = (
    title,
    data,
    order = "ascending"
  ) => {
    const sortedData = sortData(data, order);
    const floorTickets = Object.keys(sortedData);
    const ticketValues = Object.values(sortedData);

    return {
      chart: {
        type: "column",
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
      },
      series: [
        {
          name: "Tickets By Floor",
          data: ticketValues,
          color: themeColor,
        },
      ],
    };
  };
  const generateUnitColumnChartOptions = (title, data, order = "ascending") => {
    const sortedData = sortData(data, order);
    const unitTickets = Object.keys(sortedData);
    const ticketValues = Object.values(sortedData);

    return {
      chart: {
        type: "column",
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
          text: " Units",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Tickets",
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
      },
      series: [
        {
          name: "Tickets by Units",
          data: ticketValues,
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
                        <span className="text-xs">Area</span>
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
