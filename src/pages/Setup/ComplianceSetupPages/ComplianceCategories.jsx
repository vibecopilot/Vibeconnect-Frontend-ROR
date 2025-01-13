import React, { useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import { complianceData } from "../../../utils/complianceStaticData";
import TreeNode from "../IncidentSetupPages/IncidentTree";
import ComplianceTreeNode from "./ComplianceTreeNode";

const ComplianceCategories = () => {
  const [addCategory, setAddCategory] = useState(false);
  const [addSubSubCat, setAddSubSubCat] = useState(false);
  const [addSubCat, setAddSubCat] = useState(false);
  const [options, setOptions] = useState([{ department: "", person: "" }]);

  const handleAddOption = () => {
    setOptions([...options, { department: "", person: "" }]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };
  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addCategory && (
            <div className="w-full grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Category"
                className="border p-2 w-full border-gray-300 rounded-lg"
              />
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 w-full">
                  <select
                    value={option.department}
                    onChange={(e) => {
                      const updatedOptions = [...options];
                      updatedOptions[index].department = e.target.value;
                      setOptions(updatedOptions);
                    }}
                    className="border p-2 w-full border-gray-300 rounded-lg"
                  >
                    <option value="">Select Department</option>
                    <option value="Audit">Audit</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                  <select
                    value={option.person}
                    onChange={(e) => {
                      const updatedOptions = [...options];
                      updatedOptions[index].person = e.target.value;
                      setOptions(updatedOptions);
                    }}
                    className="border p-2 w-full border-gray-300 rounded-lg"
                  >
                    <option value="">Select Person</option>
                    <option value="Aniket Parkar">Aniket Parkar</option>
                    <option value="Mohit Yadav">Mohit Yadav</option>
                    <option value="Ravindar Sahani">Ravindar Sahani</option>
                    <option value="Vishal Yadav">Vishal Yadav</option>
                    <option value="Aman Raturi">Aman Raturi</option>
                  </select>
                  <button
                    className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 w-full">
                <button
                  className="bg-green-500 bg-opacity-10 text-green-500 font-medium border-2 rounded-md p-2 border-green-500 w-full flex items-center justify-center gap-2"
                  onClick={handleAddOption}
                >
                  <PiPlusCircle size={20} /> Add
                </button>
                <button className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md w-full font-medium justify-center">
                  <FaCheck /> Submit
                </button>
                <button
                  className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md w-full justify-center font-medium"
                  onClick={() => setAddCategory(false)}
                >
                  <MdClose /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {/* sub Cat */}
        <div className="flex justify-end">
          {addSubCat && (
            <div className="flex items-center gap-2 w-full">
              <select
                name="categoryId"
                id=""
                // value={formData.categoryId}
                // onChange={handleChange}
                className="border p-2 px-4 border-gray-300 rounded-md w-full"
              >
                <option value="">Select Category</option>
              </select>
              <input
                type="text"
                placeholder="SubCategory"
                className="border p-2 w-full border-gray-300 rounded-lg"
                name="SubCategory"
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
        </div>
        {/* subsubcat */}
        <div className="flex justify-end">
          {addSubSubCat && (
            <div className="flex items-center gap-2 w-full">
              <select
                name="categoryId"
                id=""
                className="border p-2 px-4 border-gray-300 rounded-md w-full"
              >
                <option value="">Select Category</option>
              </select>
              <select
                name="SubCategoryId"
                id=""
                className="border p-2 w-full border-gray-300 rounded-lg"
              >
                <option value="">Select Sub Category</option>
              </select>
              <input
                type="text"
                placeholder="Sub Sub Category"
                className="border p-2 w-full border-gray-300 rounded-lg"
                name="subSubCategory"
              />

              <button className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md">
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                onClick={() => setAddSubSubCat(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          {!addCategory && (
            <button
              className="bg-green-400 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddCategory(true)}
            >
              <PiPlusCircle /> Add Category
            </button>
          )}
          {/* {!addSubCat && (
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddSubCat(true)}
            >
              <PiPlusCircle /> Add Sub Category
            </button>
          )}
          {!addSubSubCat && (
            <button
              className="bg-green-600 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddSubSubCat(true)}
            >
              <PiPlusCircle /> Add Sub Sub Category
            </button>
          )} */}
        </div>
        {/* <div>
          <Table columns={column} data={categories} isPagination={true} />
        </div> */}
      </div>

      <div className=" rounded-xl my-2 mb-10">
        {complianceData?.map((node) => (
          <ComplianceTreeNode key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
};

export default ComplianceCategories;
