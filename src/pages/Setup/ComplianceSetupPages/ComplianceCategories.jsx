import React, { useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import { complianceData } from "../../../utils/complianceStaticData";
import TreeNode from "../IncidentSetupPages/IncidentTree";
import ComplianceTreeNode from "./ComplianceTreeNode";

const ComplianceCategories = () => {
  const [addCategory, setAddCategory] = useState(false);

  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addCategory && (
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                placeholder="Category"
                className="border p-2 w-full border-gray-300 rounded-lg col-span-2"
              />
              {/* <div className="flex gap-2 w-full"> */}
              <button className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md  font-medium justify-center">
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md  justify-center font-medium"
                onClick={() => setAddCategory(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
            // </div>
          )}
        </div>
        {/* sub Cat */}

        <div className="flex w-full gap-2 justify-end">
          {!addCategory && (
            <button
              className="bg-green-400 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddCategory(true)}
            >
              <PiPlusCircle /> Add Category
            </button>
          )}
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
