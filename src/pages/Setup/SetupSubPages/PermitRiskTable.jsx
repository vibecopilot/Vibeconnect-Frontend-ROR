import React, { useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../../components/table/Table";
import { ImEye } from "react-icons/im";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";


const PermitRiskTable = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [editingRowId, setEditingRowId] = useState(null); // Track which row is being edited
  const [editedActivity, setEditedActivity] = useState(""); // Track the edited activity name

  
  const handleEditClick = (row) => {
    setEditingRowId(row.id);
    setEditedActivity(row.type);
  };
  const handleSaveClick = (row) => {
    // Save the edited activity (you can add your logic here)
    console.log("Saved:", editedActivity);
    setEditingRowId(null); // Exit edit mode
  };
  const handleCancelClick = () => {
    setEditingRowId(null); // Exit edit mode
  };

   const columns = [
    {
      name: "Permit Type",
      selector: (row) =>
        editingRowId === row.id ? (
         <select  className="border w-40 p-2 border-gray-300 mr-2 rounded-md">
           <option value="">Select Activity Type</option>
         </select>
        ) : (
          row.type
        ),
      sortable: true,
    },
    
    {
      name: "Permit Activity",
      selector: (row) =>
        editingRowId === row.id ? (
         <select  className="border w-40  p-2 border-gray-300 mr-2 rounded-md">
           <option value="">Select Permit Activity Type</option>
         </select>
        ) : (
          row.type
        ),
      sortable: true,
    },
    
    {
      name: "Permit Sub Activity Type",
      selector: (row) =>
        editingRowId === row.id ? (
         <select  className="border w-40 p-2 border-gray-300 mr-2 rounded-md">
           <option value="">Select Permit Hazard Type</option>
         </select>
        ) : (
          row.type
        ),
      sortable: true,
    },
    
    {
      name: "Permit Hazard Type",
      selector: (row) =>
        editingRowId === row.id ? (
         <select  className="border w-40 p-2 border-gray-300 mr-2 rounded-md">
           <option value="">Select Permit Hazard Type</option>
         </select>
        ) : (
          row.type
        ),
      sortable: true,
    },
    
    {
      name: "Permit Risk Type",
      selector: (row) =>
        editingRowId === row.id ? (
          <input
            type="text"
            value={editedActivity}
            onChange={(e) => setEditedActivity(e.target.value)}
            className="border w-40 p-2  border-gray-300 rounded-md"
          />
        ) : (
          row.type
        ),
      sortable: true,
    },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-4">
            {editingRowId !== row.id && (
          <button>
            <BiTrash size={15} />
          </button>
        )}
            {editingRowId === row.id ? (
              <>
                <button onClick={() => handleSaveClick(row)}>
                  <FaCheck size={15} />
                </button>
                <button onClick={handleCancelClick}>
                  <MdClose size={15} />
                </button>
              </>
            ) : (
              <button onClick={() => handleEditClick(row)}>
                <BiEdit size={15} />
              </button>
            )}
          </div>
        ),
      },
    ];


  const data = [
    {
      id: 1,

      type: "Loading, Unloading Hazardous Material Work",
    },
    {
      id: 2,

      type: "Radiology Work",
    },
    {
      id: 3,

      type: "Hot Work",
    },
    {
      id: 4,

      type: "Height Work",
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
  document.title = `Permit Setup - Vibe Connect`;
  
  return (
    <section className="flex ">
      {/* <Navbar /> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden">
      {showAdd && (
  <div className="grid grid-cols-2 gap-2 items-center my-2">
    <select
      name=""
      id=""
      className="border p-2 border-gray-300 rounded-md w-full"
    >
      <option value="">Select Permit Type</option>
    </select>
    <select
      name=""
      id=""
      className="border p-2 border-gray-300 rounded-md w-full"
    >
      <option value="">Select PermitActivity Type</option>
    </select>
    <select
      name=""
      id=""
      className="border p-2 border-gray-300 rounded-md w-full"
    >
      <option value="">Select SubPermit Type</option>
    </select>
    <select
      name=""
      id=""
      className="border p-2 border-gray-300 rounded-md w-full"
    >
      <option value="">Select Hazard Type</option>
    </select>
    <input
      type="text"
      placeholder="Enter permit Activity "
      className="border p-2 border-gray-300 rounded-md w-full"
    />
    
    
    <div className="flex gap-2">
      <button className="bg-green-400 text-white rounded-md flex items-end gap-2 p-2 font-medium">
        <PiPlusCircle size={20} />
        Submit
      </button>
      <button
        className="bg-red-400 text-white rounded-md flex items-end gap-2 p-2 font-medium"
        onClick={() => setShowAdd(false)}
      >
        <MdClose size={20} />
        Cancel
      </button>
    </div>
  </div>
)}
        {!showAdd && (
          <div className="flex justify-end my-2">
            <button
              className="bg-green-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
              onClick={() => setShowAdd(true)}
            >
              <PiPlusCircle size={20} />
              Add
            </button>
          </div>
        )}
        <Table
          columns={columns}
          data={data}
          // customStyles={customStyle}
          responsive
          fixedHeader
          fixedHeaderScrollHeight="500px"
          pagination
          selectableRowsHighlight
          highlightOnHover
          omitColumn={columns}
        />
      </div>
     
    </section>
  );
};

export default PermitRiskTable;
