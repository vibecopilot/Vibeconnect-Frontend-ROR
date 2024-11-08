import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { BiExport } from "react-icons/bi";
import { ImEye } from "react-icons/im";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Switch from "../../Buttons/Switch";
import Navbar from "../../components/Navbar";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";

const SetupBookingFacility = () => {
  const [searchText, setSearchText] = useState("");

  const setupColumn = [
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/bookings/booking-details/${row.id}`}>{row.action}</Link>
      ),
      sortable: true,
    },
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Name",
      selector: (row) => row.facility,
      sortable: true,
    },
    { name: "Type", selector: (row) => row.type, sortable: true },
    { name: "Department", selector: (row) => row.department, sortable: true },
    {
      name: "Book By",
      selector: (row) => row.bookBy,
      sortable: true,
    },
    {
      name: "Book Before",
      selector: (row) => row.bookBefore,
      sortable: true,
    },
    {
      name: "Advance Booking",
      selector: (row) => row.advBooking,
      sortable: true,
    },
    {
      name: "Created On",
      selector: (row) => row.createdOn,
      sortable: true,
    },
    // {
    //   name: "Created By",
    //   selector: (row) => row.createdBy,
    //   sortable: true,
    // },
    // {
    //   name: "Status",
    //   selector: (row) => row.status,
    //   sortable: true,
    // },
  ];

  const setupData = [
    {
      id: 1,
      action: <ImEye />,
      facility: "fac1",
      type: "Bookable",
      department: "Electrical",
      bookBy: "slot",
      bookBefore: "date/time",
      advBooking: "date/time",
      createdOn: "23/04/2024 - time",
      createdBy: "user",
      // status: <Switch checked={"checked"} />,
    },
    {
      id: 2,
      action: <ImEye />,
      facility: "Test",
      type: "Bookable",
      department: "Electrical",
      bookBy: "slot",
      bookBefore: "date/time",
      advBooking: "date/time",
      createdOn: "23/04/2024 - time",
      createdBy: "user",
      // status: <Switch />,
    },
  ];
  const [filteredData, setFilteredData] = useState(setupData);
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    const filteredResults = setupData.filter((item) =>
      item.facility.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  const customStyle = {
    headRow: {
      style: {
        backgroundColor: "black",
        color: "white",
        fontSize: "14px",
      },
    },
  };
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <div className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex gap-2 items-center w-full">
          <input
            type="text"
            placeholder="Search by name"
            className="border p-2 border-gray-300 rounded-md w-full"
            value={searchText}
            onChange={handleSearch}
          />
          <div className="flex gap-2 justify-end ">
            <Link
              style={{ background: themeColor }}
              to={"/setup/facility/setup-facility"}
              className="bg-black w-20 rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
            >
              <IoAddCircleOutline size={20} />
              Add
            </Link>
            <button
              style={{ background: themeColor }}
              className="bg-black rounded-lg flex font-semibold items-center gap-2 text-white p-2 my-2"
            >
              <BiExport size={20} />
              Export
            </button>
          </div>
        </div>
        <Table
          columns={setupColumn}
          data={filteredData}
          // customStyles={customStyle}
        />
      </div>
    </div>
  );
};

export default SetupBookingFacility;
