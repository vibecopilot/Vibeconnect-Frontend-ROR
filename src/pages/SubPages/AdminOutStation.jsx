import React from "react";
import DataTable from "react-data-table-component";
import { BsEye } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { PiPlusCircle } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";

const AdminOutStation = () => {
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/outstation-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Booking ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Employee",
      selector: (row) => row.employee,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (row) => row.destination,
      sortable: true,
    },
    {
      name: "Departure Date",
      selector: (row) => row.departure_date,
      sortable: true,
    },
    {
      name: "Return Date",
      selector: (row) => row.return_date,
      sortable: true,
    },
    {
      name: "Passengers",
      selector: (row) => row.passengers,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row.status,
    //   sortable: true,
    // },
    // {
    //   name: "Approval",
    //   selector: (row) => (
    //     <div className="flex gap-4">
    //       <button className="text-green-400 font-medium">
    //         <TiTick size={25} />
    //       </button>
    //       <button className="text-red-400 font-medium">
    //         <ImCross />
    //       </button>
    //     </div>
    //   ),
    //   sortable: true,
    // },
  ];

  const filteredData = [
    {
      id: 1,
      destination: "Mumbai",
      employee: "Employee 1",
      department: "IT",
      departure_date: "20/05/2024",
      return_date: "23/05/2024",
      passengers: 2,
      status: "Upcoming",
    },
    {
      id: 2,
      destination: "Delhi",
      employee: "Employee 2",
      department: "Finance",
      departure_date: "10/05/2024",
      return_date: "13/05/2024",
      passengers: 2,
      status: "Completed",
    },
  ];

  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section className="my-5">
      <div className="flex md:flex-row flex-col justify-between gap-2 my-2">
        <input
          type="text"
          placeholder="Search by Destination or Status"
          className="border border-gray-400 md:w-96 placeholder:text-xs rounded-lg p-2"
          //   value={searchText}
          //   onChange={handleSearch}
        />
        <div className="flex gap-4">
          <Link
            to={"/admin/book-outstation"}
            style={{ background: themeColor }}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-300 transition-all  p-2 rounded-md text-white cursor-pointer text-center flex items-center  gap-2 justify-center"
            // onClick={() => setShowCountry(!showCountry)}
          >
            <PiPlusCircle size={20} />
            Book
          </Link>
        </div>
      </div>
      <Table
        responsive
        // selectableRows
        columns={columns}
        data={filteredData}
        // customStyles={customStyle}
        // pagination
        // fixedHeader
        // // fixedHeaderScrollHeight="420px"
        // selectableRowsHighlight
        // highlightOnHover
      />
    </section>
  );
};

export default AdminOutStation;
