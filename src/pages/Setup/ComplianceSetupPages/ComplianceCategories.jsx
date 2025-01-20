import React, { useEffect, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import { complianceData } from "../../../utils/complianceStaticData";
import TreeNode from "../IncidentSetupPages/IncidentTree";
import ComplianceTreeNode from "./ComplianceTreeNode";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { getComplianceTree, postComplianceTags } from "../../../api";

const ComplianceCategories = () => {
  const [addCategory, setAddCategory] = useState(false);
  const companyId = getItemInLocalStorage("COMPANYID");
  const [category, setCategory] = useState("");
  const handleAddCategory = async () => {
    if (!category) {
      return toast.error("Please enter category");
    }
    const formData = new FormData();
    formData.append("compliance_tag[name]", category);
    // formData.append("compliance_tag[parent_id]", null);
    formData.append("compliance_tag[resource_id]", companyId);
    formData.append("compliance_tag[resource_type]", "Pms::CompanySetup");
    formData.append("compliance_tag[company_id]", companyId);
    formData.append("compliance_tag[tag_type]", "complianceCategory");
    try {
      const res = await postComplianceTags(formData);
      toast.success("Compliance Category added successfully");
      fetchComplianceTree();
      setAddCategory(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [complianceCatData, setComplianceCatData] = useState([]);
  const fetchComplianceTree = async () => {
    try {
      const res = await getComplianceTree();
      setComplianceCatData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchComplianceTree();
  }, []);

  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addCategory && (
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 w-full border-gray-300 rounded-lg col-span-2"
              />

              <button
                className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md  font-medium justify-center"
                onClick={handleAddCategory}
              >
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md  justify-center font-medium"
                onClick={() => setAddCategory(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
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

      {complianceCatData.length !== 0 ? (
        <div className=" rounded-xl my-2 mb-10">
          {complianceCatData?.map((node) => (
            <ComplianceTreeNode
              key={node.id}
              node={node}
              fetchComplianceTree={fetchComplianceTree}
            />
          ))}
        </div>
      ) : (
        <p className="text-center my-5">No Categories Available</p>
      )}
    </section>
  );
};

export default ComplianceCategories;
