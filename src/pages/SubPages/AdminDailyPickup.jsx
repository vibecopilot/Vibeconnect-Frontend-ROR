import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BsEye } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { MdApproval, MdCancel, MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import { Link } from "react-router-dom";
import Table from "../../components/table/Table";
import { getTransportation } from "../../api";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";

const AdminDailyPickup = () => {
  const [details, setDetails] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const siteDetailsResp = await getTransportation("Daily_Pickup");

        setDetails(siteDetailsResp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, []);

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/pickup-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/transportation/edit-pickup/${row.id}`}>
            <BiEdit size={15} />
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
      name: "Booked For/by",
      selector: (row) => (row?.user_full_name? row?.user_full_name: "Self"),
      sortable: true,
    },
    // {
    //   name: "Department",
    //   selector: (row) => row.department,
    //   sortable: true,
    // },
    {
      name: "Pickup Location",
      selector: (row) => row.pickup_location,
      sortable: true,
    },
    {
      name: "Drop-off Location",
      selector: (row) => row.dropoff_location,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Pickup Time",
      selector: (row) => {
        const date = new Date(row.time); // Ensure `row.time` is a valid date object or timestamp
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      sortable: true,
    },

    {
      name: "Passengers",
      selector: (row) => row.no_of_passengers,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Approval",
      selector: (row) => (
        <div className="flex gap-2">
          <button className="bg-green-400 text-white p-2 rounded-full">
            <FaCheck />
          </button>
          <button className="bg-red-400 text-white p-2 rounded-full">
            <MdClose />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];
  document.title = "Transportation";
  return (
    <section className="my-5">
      <div className="flex md:flex-row flex-col justify-between gap-2 my-2">
        <input
          type="text"
          placeholder="Search by Pick up location or Drop Off location"
          className="border border-gray-400 md:w-96 placeholder:text-xs rounded-lg p-2"
          //   value={searchText}
          //   onChange={handleSearch}
        />
        <div className="flex gap-4">
          <Link
            to={"/admin/transportation/book-pickup"}
            style={{ background: themeColor }}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-300 transition-all  p-2 rounded-md text-white cursor-pointer text-center flex items-center  gap-2 justify-center"
            // onClick={() => setShowCountry(!showCountry)}
          >
            <PiPlusCircle size={20} />
            Book
          </Link>
          {/* <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // onClick={exportToExcel}
          >
            Export
          </button> */}
        </div>
      </div>
      <Table
        responsive
        columns={columns}
        data={details}
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

export default AdminDailyPickup;
