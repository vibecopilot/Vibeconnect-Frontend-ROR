import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { Link } from "react-router-dom";
import { BsEye, BsFilter } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { MdAdd } from "react-icons/md";



const Mom = () => {
  const column = [
    // {
    //   name: "view",

    //   cell: (row) => (
    //     <div className="flex items-center gap-4">
    //       <Link to={`/admin/edit-mom/${row.id}`}>
    //         <BsEye size={15} />
    //       </Link>
    //       <Link to={`/admin/edit-mom/${row.id}`}>
    //         <BiEdit size={15} />
    //       </Link>
    //     </div>
    //   ),
    // },

    { name: "ID", selector: (row) => row.id, sortable: true },

    { name: "Title ", selector: (row) => row.Tower, sortable: true },

    {
      name: "Date of Meeting",
      selector: (row) => row.incident_level,
      sortable: true,
    },
    { name: "Tag", selector: (row) => row.Category, sortable: true },
    {
      name: " Tasks",
      selector: (row) => row.SubCategory,
      sortable: true,
    },
    {
      name: " Raised by",
      selector: (row) => row.SupportRequired,
      sortable: true,
    },
    { name: "Atendees ", selector: (row) => row.AssignedTo, sortable: true },
  ];
  const data = [
    {
      id: 1,
      Tower: "tower",
    },
    { id: 2, Tower: "tower2" },
    { id: 3, Tower: "towerzz" },
    { id: 4, Tower: "tower2" },
    { id: 5, Tower: "tower2" },
  ];
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const themeColor = useSelector((state) => state.theme.color);
  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };
  return (

    <section className="flex  ">
        <Navbar/>
    <div className="overflow-hidden w-full" >
    
        {/* <Navbar /> */}
      <h2 className="text-2xl font-semibold pt-6 pl-[2%]">MOM LIST</h2>

      <div className="flex justify-end gap-8 p-4">
        <div>
            <Link to="/admin/new-mom">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded">
            {/* <MdAdd size={20} className="mr-2" /> */}
           + Add
          </button>
          </Link> 
        </div>
        <div>
        <button
      className="bg-blue-500 hover:bg-blue-700 flex text-white font-bold py-2 px-5 rounded"
      onClick={() => setIsFilterModalOpen(true)}
    >
      <BsFilter size={20} className="mt-1 " />
      Filter
    </button>
        </div>
      </div>
      
      <Table columns={column} data={data} isPagination={true} />

      {isFilterModalOpen && (
  <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg p-4 w-1/2">
      <h2 className="text-2xl font-semibold mb-4">Filter</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            type="tel"
            placeholder="Enter phone number"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            type="submit"
          >
            Apply
          </button>
          <button
          onClick={() => setIsFilterModalOpen(false)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
            type="reset"
          >
            Reset
          </button>
          {/* <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
            onClick={() => setIsFilterModalOpen(false)}
          >
            Close
          </button> */}
        </div>
      </form>
    </div>
  </div>
)}
    </div>

    </section>

  );
};

export default Mom;
