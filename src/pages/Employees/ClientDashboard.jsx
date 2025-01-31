import React, { useState } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { RxExit } from "react-icons/rx"
import { FaRegUserCircle } from "react-icons/fa"
import { Calendar } from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { useSelector } from "react-redux"
 //import getTotalHRMSEmployeeCount from "../../api/index"
 const ClientDashboard =()=> {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedData, setSelectedData] = useState(null)
  const [isPieChart, setIsPieChart] = useState(true) // Add state to toggle chart types

  const handleSliceClick = (event) => {
    setSelectedData(event.point.name) // Set the name of the clicked slice
    setIsDropdownVisible(true) // Show the dropdown
  }

  const themeColor = useSelector((state) => state.theme.color)

  const pieOptions = {
    chart: { type: "pie" },
    title: { text: "Head Count Status" },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: { enabled: true },
        events: {
          click: handleSliceClick, // Handle click event
        },
      },
    },
    series: [
      {
        name: "Employees",
        data: [
          { name: "Head Count", y: 95.9, color: "#f97316" },
          { name: "Present", y: 10.3, color: "#10b981" },
          { name: "Absent", y: 5.8, color: "#3b82f6" },
        ],
      },
    ],
  }

  // Dynamic Bar Chart based on selected data
  const barChartOptions = {
    chart: { type: "column" }, // Ensures vertical bars (columns)
    title: { text: "Head Count Status" },
    xAxis: {
      categories: ["Head Count", "Present", "Absent"], // Categories for each column
      pointPadding: 0.1, // Reduce padding between bars
      groupPadding: 0.1, // Reduce the gap between groups of columns
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    plotOptions: {
      series: {
        cursor: "pointer", // Change cursor to pointer on hover
        events: {
          click: (event) => {
            // Handle the bar click and show dropdown
            setSelectedData(event.point.category) // Set the clicked column as selected data
            setIsDropdownVisible(true) // Show the dropdown
          },
        },
      },
    },
    series: [
      {
        name: "Count",
        data: [95.9, 3.2, 0.6], // The data for each category
        color: "#4f9c88", // General color for the bars
        pointWidth: 40, // Adjust the column width here (lower value makes them thinner)
      },
    ],
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
  }

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setIsCalendarVisible(false)
  }

  // Handle dropdown item click to switch charts
  const handleDropdownClick = (item) => {
    setSelectedData(item)
    setIsDropdownVisible(false)

    if (item === "Head Count" || item === "Present" || item === "Absent") {
      setIsPieChart(false) // Show Bar chart when "Head Count", "Present", or "Absent" is selected
    }
  }

  
  return (
    <div className="flex flex-col h-screen relative">
      {/* Top Navigation Bar */}
      <nav style={{ background: themeColor }} className=" text-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Dashboard</div>
        <div className="flex items-center space-x-4">
          <select className="text-black px-6 py-2">
            <option>Admin</option>
            <option>Selected all</option>
            <option>Site1</option>
            <option>Site2</option>
          </select>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          style={{ background: themeColor }}
          className="group  w-[4.5rem] hover:w-1/5 text-white flex flex-col items-center py-4 duration-500"
        >
          <div className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full">
              <FaRegUserCircle />
            </span>
            <span className="hidden text-xl group-hover:inline">User Name</span>
          </div>

          <nav className="space-y-4 text-lg">
            {[
              { icon: "🏠", label: "Dashboard" },
              { icon: <RxExit />, label: "Logout" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:text-gray-300 w-full justify-center group-hover:justify-start px-4"
              >
                <span>{item.icon}</span>
                <span className="hidden group-hover:inline">{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-6 bg-gray-100">
          {/* Three boxes above the chart */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            <div className="bg-white shadow-lg p-2 rounded-lg">
              <h3 className="font-semibold text-lg">Head Count</h3>
              <p>5</p>
            </div>
            <div className="bg-white shadow-lg p-2 rounded-lg">
              <h3 className="font-semibold text-lg">Present</h3>
              <p> 2</p>
            </div>
            <div className="bg-white shadow-lg p-2 rounded-lg">
              <h3 className="font-semibold text-lg">Absent</h3>
              <p> 3</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 relative">
            {/* Chart Container */}
            <div className="bg-white shadow-lg p-2 rounded-lg mt-4">
              <div className="text-end">
                {/* Replace h2 with a date input styled as text */}
                <input
                  type="text"
                  value={selectedDate.toLocaleDateString()}
                  readOnly
                  onClick={toggleCalendar}
                  className="cursor-pointer pl-2 bg-transparent text-lg font-semibold border border-gray-500 focus:outline-none"
                />
              </div>

              {/* Conditionally render the chart based on selectedData */}
              {isPieChart ? (
                <HighchartsReact highcharts={Highcharts} options={pieOptions} />
              ) : (
                <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
              )}
            </div>

            {/* Calendar Modal */}
            {isCalendarVisible && (
              <div className="absolute top-20 right-10 bg-white shadow-md rounded-lg p-4 border border-gray-200 z-50 w-[300px] h-[300px]">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="react-calendar p-0 w-full h-full overflow-y-auto"
                />
                <button onClick={toggleCalendar} className="mt-4 text-sm py-1 px-2 bg-red-500 rounded-lg text-white">
                  Close
                </button>
              </div>
            )}

            {/* Approve and Pending Boxes */}
            <div className="grid grid-cols-4 text-center gap-4 my-4">
              {/* Approve Box */}
              <div className="py-2 shadow-lg">
                <h3 className="font-semibold text-lg">Approve</h3>
                <p className="text-sm underline text-blue-700">VIEW</p> {/* Replace with dynamic data */}
              </div>

              {/* Pending Box */}
              <div className="py-2 shadow-lg">
                <h3 className="font-semibold text-lg">Pending</h3>
                <p className="text-sm underline text-blue-700">VIEW</p> {/* Replace with dynamic data */}
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownVisible && (
              <div className="absolute top-10 left-72 bg-white shadow-md rounded-lg p-3 w-40 border border-gray-200">
                <p className="font-bold mb-2 text-sm">{selectedData || "Options"}</p>
                <ul className="text-sm max-h-36 overflow-y-auto">
                  <li
                    className="hover:bg-gray-100 cursor-pointer p-1"
                    onClick={() => handleDropdownClick("Head Count")}
                  >
                    Sites
                  </li>
                  <li className="hover:bg-gray-100 cursor-pointer p-1" onClick={() => handleDropdownClick("Present")}>
                    Department
                  </li>
                  {/* <li
                    className="hover:bg-gray-100 cursor-pointer p-1"
                    onClick={() => handleDropdownClick("Absent")}
                  >
                    Absent
                  </li> */}
                </ul>
                <button
                  onClick={() => setIsDropdownVisible(false)}
                  className="mt-2 text-sm py-1 px-2 bg-red-500 rounded-lg text-white"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard