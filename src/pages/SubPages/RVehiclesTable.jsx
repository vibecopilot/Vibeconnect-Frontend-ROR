// import React, { useEffect, useState } from "react";
// import { PiPlusCircle } from "react-icons/pi";
// import { Link } from "react-router-dom";
// //import Navbar from "../../../components/Navbar";
// import DataTable from "react-data-table-component";
// import { BsEye } from "react-icons/bs";
// import { BiEdit } from "react-icons/bi";
// import { TiTick } from "react-icons/ti";
// import { IoClose } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import Table from "../../components/table/Table";
// import qr from "/QR.png"
// import { getRegisteredVehicle } from "../../api";
// const RVehiclesTable = () => {
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const themeColor = useSelector((state) => state.theme.color);
//   const [registeredVehicles, setRegisteredVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
 
//   useEffect(() => {
//     const fetchRegisteredVehicle = async () => {
//       try {
//         const historyResp = await getRegisteredVehicle();
//         const sortedVisitor = historyResp.data.sort((a, b) => {
//           return new Date(b.created_at) - new Date(a.created_at);
//         });
//         setRegisteredVehicles(sortedVisitor);
//         setFilteredVehicles(sortedVisitor);
//         console.log(sortedVisitor);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchRegisteredVehicle();
//   }, []);
//   const columns = [
//     {
//       name: "Action",
//       cell: (row) => (
//         <div className="flex items-center gap-4">
//           <Link to={`/admin/rvehicles-details/${row.id}`}>
//             <BsEye size={15} />
//           </Link>
//           <Link to={`/admin/edit-rvehicles/${row.id}`}>
//             <BiEdit size={15} />
//           </Link>
//         </div>
//       ),
//     },
//     {
//       name: "Vehicle Number",
//       selector: (row) => row.vehicle_number,
//       sortable: true,
//     },
//     {
//       name: "Category",
//       selector: (row) => row.category,
//       sortable: true,
//     },
//     {
//       name: "Parking Slot",
//       selector: (row) => row.slot_name,
//       sortable: true,
//     },
//     {
//       name: "Vehicle Category",
//       selector: (row) => row.vehicle_category,
//       sortable: true,
//     },

//     {
//       name: "Vehicle Type",
//       selector: (row) => row.vehicle_type,
//       sortable: true,
//     },

//     {
//       name: "Sticker Number",
//       selector: (row) => row.sticker_number,
//       sortable: true,
//     },
//     // {
//     //   name: "Category",
//     //   selector: (row) => row.Category,
//     //   sortable: true,
//     // },
//     {
//       name: "Registration Number",
//       selector: (row) => row.registration_number,
//       sortable: true,
//     },
//     {
//       name: "Insurance Number",
//       selector: (row) => row.insurance_number,
//       sortable: true,
//     },
//     // {
//     //   name: "Active/Inactive",
//     //   selector: (row) => row.ActiveInactive,
//     //   sortable: true,
//     // },
//     // {
//     //   name: "Insurance Number",
//     //   selector: (row) => row.Insurance_Number,
//     //   sortable: true,
//     // },

//     // {
//     //   name: "Insurance Valid Till",
//     //   selector: (row) => row.Insurance_Valid_Till,
//     //   sortable: true,
//     // },
//     // {
//     //   name: "Staff Name",
//     //   selector: (row) => row.Staff_Name,
//     //   sortable: true,
//     // },
//     // {
//     //   name: "Status",
//     //   selector: (row) => row.status,
//     //   sortable: true,
//     // },
//     // {
//     //   name: "Qr Code",
//     //   selector: (row) => <img src={qr} alt="" width={40} />,
//     //   sortable: true,
//     // },

//     // {
//     //   name: "Cancellation",
//     //   selector: (row) =>
//     //     row.status === "Upcoming" && (
//     //       <button className="text-red-400 font-medium">Cancel</button>
//     //     ),
//     //   sortable: true,
//     // },
//     // {
//     //   name: "Approval",
//     //   selector: (row) =>
//     //     row.status === "Upcoming" && (
//     //       <div className="flex justify-center gap-2">
//     //         <button className="text-green-400 font-medium hover:bg-green-400 hover:text-white transition-all duration-200 p-1 rounded-full">
//     //           <TiTick size={20} />
//     //         </button>
//     //         <button className="text-red-400 font-medium hover:bg-red-400 hover:text-white transition-all duration-200 p-1 rounded-full">
//     //           <IoClose size={20} />
//     //         </button>
//     //       </div>
//     //     ),
//     //   sortable: true,
//     // },
//   ];
// const [searchText, setSearchText] = useState("")
// const handleSearch = (e)=>{
//   const searchValue = e.target.value
//   setSearchText(searchValue)

//   if (searchValue.trim() === "") {
//     setFilteredVehicles(registeredVehicles)
//   }else{
//     const filteredResult = registeredVehicles.filter((item)=> item.vehicle_number.toLowerCase().includes(searchValue.toLowerCase()) || item.slot_name && item.slot_name.toLowerCase().includes(searchValue.toLowerCase()) || item.sticker_number && item.sticker_number.toLowerCase().includes(searchValue.toLowerCase()))
//     setFilteredVehicles(filteredResult)
//   }
// }


//   return (
//     <section className="flex">
//       <div className=" w-full flex mx-3 flex-col overflow-hidden">
//         <div className="flex md:flex-row flex-col gap-5 justify-between  my-2">
//         <input
//             type="text"
//             value={searchText}
//             onChange={handleSearch}
//             id=""
//             className="border-gray-300 border rounded-md p-2 w-full placeholder:text-sm"
//             placeholder="Search by parking slot, sticker number, vehicle number"
//           />
//           <span className="flex gap-4">
//             <Link
//               to={"/admin/add-rvehicles"}
              
//               className="border-2 font-semibold hover:bg-black hover:text-white transition-all  p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
//               style={{background: themeColor }}
//             >
//               <PiPlusCircle size={20} />
//               Add
//             </Link>
          
//           </span>
//         </div>
//         <Table
//           responsive
//           //   selectableRows
//           columns={columns}
//           data={filteredVehicles}
//           isPagination={true}
//         />
//       </div>
//     </section>
//   );
// };

// export default RVehiclesTable;


import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import qr from "/QR.png";
import { getRegisteredVehicle } from "../../api";

const RVehiclesTable = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const themeColor = useSelector((state) => state.theme.color);

  const [registeredVehicles, setRegisteredVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated vehicles
  useEffect(() => {
    const fetchRegisteredVehicle = async () => {
      try {
        const response = await getRegisteredVehicle({
          page: currentPageNum,
          per_page: 10,
        });

        const data = response?.data || {};
        const list = data.registered_vehicles || [];

        // sort newest first
        const sortedData = list.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setRegisteredVehicles(sortedData);
        setFilteredVehicles(sortedData);

        setTotalPages(data.total_pages || 1);

        console.log("Fetched Vehicles:", sortedData);
      } catch (error) {
        console.log("Error fetching:", error);
      }
    };

    fetchRegisteredVehicle();
  }, [currentPageNum]);

  // Table Columns
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/rvehicles-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-rvehicles/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Vehicle Number",
      selector: (row) => row.vehicle_number,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Parking Slot",
      selector: (row) => row.slot_name,
      sortable: true,
    },
    {
      name: "Vehicle Category",
      selector: (row) => row.vehicle_category,
      sortable: true,
    },
    {
      name: "Vehicle Type",
      selector: (row) => row.vehicle_type,
      sortable: true,
    },
    {
      name: "Sticker Number",
      selector: (row) => row.sticker_number,
      sortable: true,
    },
    {
      name: "Registration Number",
      selector: (row) => row.registration_number,
      sortable: true,
    },
    {
      name: "Insurance Number",
      selector: (row) => row.insurance_number,
      sortable: true,
    },
  ];

  // Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() === "") {
      setFilteredVehicles(registeredVehicles);
    } else {
      const filtered = registeredVehicles.filter(
        (item) =>
          item.vehicle_number?.toLowerCase().includes(value.toLowerCase()) ||
          item.slot_name?.toLowerCase().includes(value.toLowerCase()) ||
          item.sticker_number?.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredVehicles(filtered);
    }
  };

  // Pagination next/prev
  const handleNext = () => {
    if (currentPageNum < totalPages) setCurrentPageNum(currentPageNum + 1);
  };

  const handlePrev = () => {
    if (currentPageNum > 1) setCurrentPageNum(currentPageNum - 1);
  };

  return (
    <section className="flex">
      <div className="w-full flex mx-3 flex-col overflow-hidden">

        {/* Search + Add Button */}
        <div className="flex md:flex-row flex-col gap-5 justify-between my-2">
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            className="border-gray-300 border rounded-md p-2 w-full placeholder:text-sm"
            placeholder="Search by parking slot, sticker number, vehicle number"
          />

          <span className="flex gap-4">
            <Link
              to={"/admin/add-rvehicles"}
              className="border-2 font-semibold hover:bg-black hover:text-white transition-all p-2 rounded-md text-white cursor-pointer flex items-center gap-2 justify-center"
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </span>
        </div>

        {/* Table */}
        <Table
          responsive
          columns={columns}
          data={filteredVehicles}
          isPagination={false} // we will handle pagination manually
        />

        {/* Pagination UI */}
        {/* <div className="flex justify-between items-center mt-4 px-2">
          <button
            onClick={handlePrev}
            disabled={currentPageNum === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <p>
            Page {currentPageNum} of {totalPages}
          </p>

          <button
            onClick={handleNext}
            disabled={currentPageNum === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default RVehiclesTable;
