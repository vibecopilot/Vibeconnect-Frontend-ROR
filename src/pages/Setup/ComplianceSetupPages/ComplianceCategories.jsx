import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import { complianceData } from "../../../utils/complianceStaticData";
import TreeNode from "../IncidentSetupPages/IncidentTree";

const ComplianceCategories = () => {
  const [addCategory, setAddCategory] = useState(false);
  const [addSubSubCat, setAddSubSubCat] = useState(false);
  const [addSubCat, setAddSubCat] = useState(false);
  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addCategory && (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Category"
                className="border p-2 w-full border-gray-300 rounded-lg"
                // value={cat}
                // onChange={(e) => SetCat(e.target.value)}
              />
              <button
                className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md"
                // onClick={handleAddCategory}
              >
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                onClick={() => setAddCategory(false)}
              >
                <MdClose /> Cancel
              </button>
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
          {!addSubCat && (
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
          )}
        </div>
        {/* <div>
          <Table columns={column} data={categories} isPagination={true} />
        </div> */}
      </div>

      <div className="p-4 rounded-xl my-2 mb-10">
        {complianceData?.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
};

export default ComplianceCategories;
