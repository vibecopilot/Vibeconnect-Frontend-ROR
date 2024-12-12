import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import SubSubSubCategorySetupModal from "../../../containers/modals/IncidentSetupModal.jsx/IncidentSetupSubSubSubCatModal";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import SecSubSubSubModal from "../../../containers/modals/IncidentSetupModal.jsx/SecSubSubSubModal";

const SecondarySubSubSubCat = () => {
  const [modal, showModal] = useState(false);
  const column = [
    { name: "Category", selector: (row) => row.Category, sortable: true },
    {
      name: "Sub Category",
      selector: (row) => row.SubCategory,
      sortable: true,
    },
    {
      name: "Sub Sub Category",
      selector: (row) => row.SubSubCategory,
      sortable: true,
    },
    {
      name: "Sub Sub Sub Category",
      selector: (row) => row.SubSubSubCategory,
      sortable: true,
    },
    {
      name: "action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => showModal(true)} className="text-blue-500">
            <BiEdit size={15} />
          </button>

          <button className="text-red-500">
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];
  const data = [
    {
      id: 1,
      Category: "Near Miss / Good Catch",
      SubCategory: "Near Miss / Good Catch",
      SubSubCategory: "Unsafe act",
      SubSubSubCategory: "Na",
      action: <BsEye />,
    },
  ];
  const [addSubSubSubCat, setAddSubSubSubCat] = useState(false);
  return (
    <section className="mx-2">
    <div className="w-full flex flex-col gap-2 overflow-hidden">
      <div className="flex justify-end">
          {addSubSubSubCat && (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-4 gap-2 w-full">
                <select
                  name=""
                  id=""
                  className="border p-2 px-4 border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Secondary Category</option>
                  <option value="">Health and Safety</option>
                  <option value="">Fire</option>
                  <option value="">Near Miss/Good Catch</option>
                </select>
                <select
                  name=""
                  id=""
                  className="border p-2 px-4 border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Secondary Sub Category</option>
                </select>
                <select
                  name=""
                  id=""
                  className="border p-2 px-4 border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Secondary Sub Sub Category</option>
                </select>
                <input
                  type="text"
                  placeholder="Secondary Sub Sub Sub Category"
                  className="border p-2 px-4 border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="flex justify-center gap-2">
                <button className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md">
                  <FaCheck /> Submit
                </button>
                <button
                  className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                  onClick={() => setAddSubSubSubCat(false)}
                >
                  <MdClose /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {!addSubSubSubCat && (
          <div className="flex justify-end w-full">
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddSubSubSubCat(true)}
            >
              <PiPlusCircle /> Add
            </button>
          </div>
        )}
        <div>
          <Table columns={column} data={data} isPagination={true} />
        </div>
        {modal && (
          <SecSubSubSubModal onclose={() => showModal(false)} />
        )}
      </div>
    </section>
  );
};

export default SecondarySubSubSubCat;
