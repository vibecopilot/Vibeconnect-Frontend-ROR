import React, { useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../../components/table/Table";
import { ImEye } from "react-icons/im";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";

import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
//import Modal from "../containers/modals/Modal";
const PermitTypeTable = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const column = [
    
    { name: "Permit Type", selector: (row) => row.type, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link>
            <BiTrash size={15} />
          </Link>
          <Link>
            <BiEdit size={15} />
          </Link>
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

  document.title = `Permit Setup - Vibe Connect`;
  const [showAdd, setShowAdd] = useState(false);
  return (
    <section className="flex ">
      <div className="w-full flex mx-3 flex-col overflow-hidden">
       {showAdd && <div className="flex gap-2 items-center my-2">
          <input
            type="text"
            placeholder="Enter permit Type"
            className="border p-2 border-gray-300 rounded-md w-full"
          />
          <button className="bg-green-400 text-white rounded-md flex items-center gap-2 p-2 font-medium">
            <PiPlusCircle size={20} />
            Submit
          </button>
          <button
            className="bg-red-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
            onClick={() => setShowAdd(false)}
          >
            <MdClose size={20} />
            Cancel
          </button>
        </div>}
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

export default PermitTypeTable;
