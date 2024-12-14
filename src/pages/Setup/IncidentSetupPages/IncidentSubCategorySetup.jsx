import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import SubCategorySetupModal from "../../../containers/modals/IncidentSetupModal.jsx/IncidentSetupSubCatModal";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import { PiPlusCircle } from "react-icons/pi";
import { getIncidentTags } from "../../../api";

const IncidentSubCategorySetup = () => {
  const [modal, showModal] = useState(false);
  const column = [
    { name: "Category", selector: (row) => row.Category, sortable: true },
    {
      name: "Sub Category",
      selector: (row) => row.SubCategory,
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
      action: <BsEye />,
    },
  ];

  const [addSubCat, setAddSubCat] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchIncidentCategory = async () => {
      try {
        const res = await getIncidentTags();
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchIncidentCategory();
  }, []);

  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addSubCat && (
            <div className="flex items-center gap-2 w-full">
              <select
                name=""
                id=""
                className="border p-2 px-4 border-gray-300 rounded-md w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="SubCategory"
                className="border p-2 w-full border-gray-300 rounded-lg"
              />
              <button className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md">
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                onClick={() => setAddSubCat(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          )}
          {!addSubCat && (
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddSubCat(true)}
            >
              <PiPlusCircle /> Add
            </button>
          )}
        </div>
        <div className="">
          <Table columns={column} data={data} isPagination={true} />
        </div>
      </div>
      {modal && <SubCategorySetupModal onclose={() => showModal(false)} />}
    </section>
  );
};

export default IncidentSubCategorySetup;
