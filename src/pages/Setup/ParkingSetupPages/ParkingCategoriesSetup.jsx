import React, { useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../../components/table/Table";
import { ImEye } from "react-icons/im";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BiTrash } from 'react-icons/bi';
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import ToggleSwitch from "../../../Buttons/ToggleSwitch";
import { FaTimes } from "react-icons/fa";
//import Modal from "../containers/modals/Modal";
const ParkingCategoriesSetup = () => {
    const themeColor = useSelector((state)=> state.theme.color)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openModal1 = () => setIsModalOpen1(true);
    const closeModal1 = () => setIsModalOpen1(false);
  const column = [
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">

          <button onClick={openModal1}>
            <BiEdit size={15} />
          </button>

          {isModalOpen1 && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative z-10">
            <button
              className="absolute top-4 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal1}
            >
             <FaTimes size={20}/>
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="category-name">
                Category Name
                </label>
                <select
                  className="border p-1 px-4 w-full border-gray-500 rounded-md"
                  id="category-name"
                  type="text"
                  placeholder="Category Name"
                >
                  <option value="">Select Category</option>
                  <option value="">2 Wheeler</option>
                  <option value="">4 Wheeler</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategory">
                Category Image
                </label>
                <input
                  id="subcategory"
                  type="file"
                  placeholder="SubCategory"
                />
              </div>
           
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={closeModal1}
                >
                  Update
                </button>
                {/* <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={closeModal1}
                >
                  Cancel
                </button> */}
              </div>
            </form>
          </div>
        </div>
      )}


           {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative z-10">
            <button
              className="absolute top-4 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              <FaTimes size={20}/>
            </button>
            <h2 className="text-xl font-semibold mb-4">Create Category</h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category-name">
                Category Name
                </label>
                <select
                  className="border p-1 px-4 w-full border-gray-500 rounded-md"
                  id="category-name"
                  type="text"
                  placeholder="Category Name"
                >
                  <option value="">Select Category</option>
                  <option value="">2 Wheeler</option>
                  <option value="">4 Wheeler</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategory">
                Category Image
                </label>
                <input
                  id="subcategory"
                  type="file"
                  placeholder="SubCategory"
                />
              </div>
             
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={closeModal}
                >
                  Submit
                </button>
                {/* <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      ),

    },
    { name: "Name", selector: (row) => row.Name, sortable: true },

    {
      name: "Active/Inactive",
      selector: (row) => (
        <input type="checkbox" checked={row.isActive} onChange={() => handleCheckboxChange(row)} />
      ),
      sortable: true,
    },  
      { name: "Created On", selector: (row) => row.create, sortable: true },


  ];
  const data = [
    {
      name: "M",
      // active:<ToggleSwitch/>,
      create:"23/04/2024",
    },


  ];

  const customStyle = {
    headRow: {
      style: {
        backgroundColor: themeColor,
        color: "white",

        fontSize: "14px",
      },
    },
  };
  document.title = `Permit - Vibe Connect`;
  return (
    <section className="flex ">
      {/* <Navbar /> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden">

    
          <div className="flex justify-end my-2">
         <button
                
                className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
                
                onClick={openModal}
            >
                <PiPlusCircle size={20} />
                Add
            </button>
            </div>
          <Table
              columns={column}
              data={data}
              // customStyles={customStyle}
              responsive

              fixedHeader
              fixedHeaderScrollHeight="500px"
              pagination
              selectableRowsHighlight
              highlightOnHover
              omitColumn={column}
            />
      </div>

    </section>
  );
};

export default ParkingCategoriesSetup;