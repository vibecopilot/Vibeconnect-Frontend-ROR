import React, { useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../../components/table/Table";
import { PiPlusCircle } from "react-icons/pi";

import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";

import ToggleSwitch from "../../../Buttons/ToggleSwitch";
import { FaTimes } from "react-icons/fa";
//import Modal from "../containers/modals/Modal";
const ParkingTag = () => {
  const [selectedColor, setSelectedColor] = useState("#eb5768");
  const handleInputChange = (e) => {
    setSelectedColor(e.target.value);
  };
  const handleChange = (e) => {
    setColor(e.target.value); // Update color state
  };
    const themeColor = useSelector((state)=> state.theme.color)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  const column = [
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">

          <button onClick={openModal}>
            <BiEdit size={15} />
          </button>
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
            <h2 className="text-xl text-black font-semibold mb-4">Edit Tag</h2>
            <div>
              <div className="flex flex-col gap-1 mb-2">
                <label className="block text-gray-700  " htmlFor="category-name">
                Company Tag Name*
                </label>
                <input
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  id="category-name"
                  type="text"
                  placeholder="Company Tag Name"
                />
              </div>
              <div className="flex flex-col gap-1 mb-2">
                <label                  
 htmlFor="subcategory">
                Tag Type*
                </label>
                <select
                  className="border p-1 px-4 border-gray-500 rounded-md"
                  id="subcategory"
                  type="text"
                  placeholder="SubCategory"
                >
                  <option value="">Select Tag Type</option>
                  <option value="product">Product</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
      <label htmlFor="color-picker" className="font-semibold">
        Tag Color
      </label>
      <div className="flex ">
      {/* <label className="block text-gray-700 text-sm font-bold">Pick a Color:</label> */}
    
      <input
        type="text"
        value={selectedColor}
        name="color" 
        id="color"        
        onChange={handleInputChange}
        className="border p-2 text-center border border-gray-700 rounded-md w-64"
        placeholder="Enter Hex Code"
      />
        <input
        type="color"
        value={selectedColor}
        onChange={handleInputChange}
        className="w-5 h-5 cursor-pointer rounded-full mt-2 ml-2"
        style={{ backgroundColor: selectedColor }}
      />
    </div>
    </div>
              <div className="my-4">
                <input type="checkbox" className="ml-2"/>
                <label htmlFor="" className="font-semibold ml-2">MOM</label>
                <input type="checkbox" className="ml-4"/>
                <label htmlFor="" className="font-semibold ml-2">Task</label>
            </div>
            <div>

            </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={closeModal}
                >
                  Update
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
    { name: "ID", selector: (row) => row.id, sortable: true },

    {
      name: "Active/Inactive",
      selector: (row) => (
        <input type="checkbox" checked={row.isActive} onChange={() => handleCheckboxChange(row)} />
      ),
      sortable: true,
    },
    
    { name: "Company Tag Name", selector: (row) => row.tname, sortable: true },
    { name: "Tag Type", selector: (row) => row.tag_type, sortable: true },
    { name: "MOM", selector: (row) => row.MOM, sortable: true },
    { name: "Task", selector: (row) => row.Task, sortable: true },
    { name: "Tag Colour", selector: (row) => row.color, sortable: true },

  ];
  const data = [
    {
      id: 1,
      
      tname:"Urgent",
      tag_type:"others",
      MOM:"Yes",
      Task:"Yes",
      color:"#fff",
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

        <div className="flex gap-2 my-2 ">
          <div className="flex gap-1 items-center flex-col">
            <label htmlFor="" className="font-semibold">Company Tag Name*</label>
            <input
              type="text"
              placeholder="Enter Company Tag Name"
              className="border p-2 px-4 border-gray-300 rounded-md"
            />
            </div>
            <div className="flex gap-1 items-center flex-col">
            <label htmlFor="" className="font-semibold">Tag Type*</label>
            <select
              type="text"
              placeholder="Enter Tag Type"
              className="border p-2 px-4 w-64 border-gray-300 rounded-md"
              >
                <option value="">Select Tag Type</option>
                <option value="product">Product</option>
                <option value="client">Client</option>
              </select>
            
            </div>
            <div className="flex flex-col gap-1">
      <label htmlFor="color-picker" className="font-semibold">
        Tag Color
      </label>
      <div className="flex ">
      {/* <label className="block text-gray-700 text-sm font-bold">Pick a Color:</label> */}
    
      <input
        type="text"
        value={selectedColor}
        name="color" 
        id="color"        
        onChange={handleInputChange}
        className="border p-2 text-center border border-gray-700 rounded-md w-64"
        placeholder="Enter Hex Code"
      />
        <input
        type="color"
        value={selectedColor}
        onChange={handleInputChange}
        className="w-5 h-5 cursor-pointer rounded-full mt-2 ml-2"
        style={{ backgroundColor: selectedColor }}
      />
    </div>
    </div>
            <div className="flex items-center">
                <input type="checkbox" className="ml-2"/>
                <label htmlFor="" className="font-semibold ml-2">MOM</label>
            </div>
            <div className="flex items-center">
                <input type="checkbox" className="ml-4"/>
                <label htmlFor="" className="font-semibold ml-2">Task</label>
            </div>
            <div className="flex items-center gap-2 justify-center mx-4">
            <button
      className="flex items-center justify-center gap-2 border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer"
    >
      <PiPlusCircle size={20} />
      <span>Add</span>
    </button>
            </div>
         



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

export default ParkingTag;