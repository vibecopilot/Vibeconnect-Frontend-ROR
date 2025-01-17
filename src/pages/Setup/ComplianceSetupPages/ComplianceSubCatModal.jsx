import { Switch } from "antd";
import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlus, PiPlusCircle } from "react-icons/pi";

const ComplianceSubCatModal = ({ onclose }) => {
  const [formData, setFormData] = useState({
    frequency: "",
    weightage: false,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                  Name
                </label>
                <input
                  type="text"
                  name=""
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
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select</option>
                  <option value="">Yes</option>
                  <option value="">No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium text-sm">
                  Risk
                </label>
                <select
                  name="critical"
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select Risk Level</option>
                  <option value="">High</option>
                  <option value="">Medium</option>
                  <option value="">Low</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium text-sm">
                  Nature
                </label>
                <select
                  name="critical"
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select Nature</option>
                  <option value="">Register</option>
                  <option value="">Remittance</option>
                  <option value="">Rule</option>
                  <option value="">Returns</option>
                </select>
              </div>
            </div>
            {formData.weightage && (
              <div className="flex flex-col gap-1 ">
                <label htmlFor="" className=" flex gap-2 font-medium text-sm">
                  Enter Weightage
                  <span className="text-gray-400 text-sm font-normal">
                    (in percentage) :
                  </span>
                </label>
                <input
                  type="number"
                  name=""
                  id=""
                  className="border border-gray-500 p-2 rounded-md"
                  placeholder="%"
                />
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-2 mt-2 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 font-medium text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button className="bg-green-500 flex items-center gap-2 font-medium text-white rounded-md px-4 p-2 ">
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceSubCatModal;
