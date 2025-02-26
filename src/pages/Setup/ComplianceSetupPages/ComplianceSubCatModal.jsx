import { Switch } from "antd";
import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlus, PiPlusCircle } from "react-icons/pi";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { getComplianceTagDetails, postComplianceTags } from "../../../api";
import toast from "react-hot-toast";

const ComplianceSubCatModal = ({ onclose, parentId, fetchComplianceTree }) => {
  const [formData, setFormData] = useState({
    frequency: "",
    weightage: false,
    subCategory: "",
    risk: "",
    nature: "",
    critical: false,
  });
  
  const [parentTagType, setParentTagType] = useState("");
  useEffect(() => {
    const fetchComplianceCatDetails = async () => {
      try {
        const res = await getComplianceTagDetails(parentId);
        setParentTagType(res?.data?.tag_type);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComplianceCatDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const companyId = getItemInLocalStorage("COMPANYID");

  const handleAddChildCategory = async () => {
    if (!formData.subCategory) {
      return toast.error("Please enter a sub-category");
    }

    let tagType;
    if (parentTagType === "complianceCategory") {
      tagType = "complianceCatlevel1";
    } else {
      const match = parentTagType.match(/complianceCatlevel(\d+)/);
      if (match) {
        const level = parseInt(match[1], 10);
        tagType = `complianceCatlevel${level + 1}`;
      } else {
        return toast.error("Invalid parent tag type.");
      }
    }

    const sendData = new FormData();
    sendData.append("compliance_tag[name]", formData.subCategory);
    sendData.append("compliance_tag[parent_id]", parentId);
    sendData.append("compliance_tag[resource_id]", companyId);
    sendData.append("compliance_tag[resource_type]", "Pms::CompanySetup");
    sendData.append("compliance_tag[company_id]", companyId);
    sendData.append("compliance_tag[tag_type]", tagType);

    try {
      const res = await postComplianceTags(sendData);
      toast.success("Compliance Sub-Category added successfully");
      onclose();
      fetchComplianceTree()
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the sub-category.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[75%] md:w-auto min-w-[40rem] p-4 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col w-full justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <PiPlusCircle /> Add Sub category
          </h2>
          <div className="border-t-2 border-black">
            <div className="grid grid-cols-2 gap-2 my-2">
              <div className="flex flex-col gap-1 col-span-2">
                <label htmlFor="" className="font-medium text-sm">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subCategory}
                  onChange={handleChange}
                  name="subCategory"
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                  placeholder="Enter name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium text-sm">
                  Critical
                </label>
                <select
                  name="critical"
                  value={formData.critical}
                  onChange={handleChange}
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium text-sm">
                  Risk
                </label>
                <select
                  name="critical"
                  value={formData.risk}
                  onChange={handleChange}
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select Risk Level</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium text-sm">
                  Nature
                </label>
                <select
                  name="nature"
                  value={formData.nature}
                  onChange={handleChange}
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select Nature</option>
                  <option value="Register">Register</option>
                  <option value="Remittance">Remittance</option>
                  <option value="Rule">Rule</option>
                  <option value="Returns">Returns</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-2 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 font-medium text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button
              className="bg-green-500 flex items-center gap-2 font-medium text-white rounded-md px-4 p-2 "
              onClick={handleAddChildCategory}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceSubCatModal;
