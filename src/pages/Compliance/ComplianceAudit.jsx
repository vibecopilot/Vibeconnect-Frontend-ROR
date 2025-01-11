import React from "react";
import { FaCheck, FaStamp } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const ComplianceAudit = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
      <div className="bg-white p-5 rounded-xl shadow-md w-[40rem]">
        <h2 className="flex items-center gap-2 justify-center font-medium border-b ">
          <FaStamp /> Compliance Audit
        </h2>
        <div className="grid gap-2 max-h-96 hide-scrollbar overflow-y-auto">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-medium">
              Compliance Status
            </label>
            <select
              name=""
              id=""
              className="border border-gray-400 rounded-md p-2 "
            >
              <option value="">Select Status</option>
              <option value="">Complied</option>
              <option value="">Not Valid</option>
              <option value="">Document Missing</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-medium">
              Observation
            </label>
            <textarea
              name=""
              id=""
              cols={10}
              rows={3}
              className="p-2 rounded-md border border-gray-400"
              placeholder="Enter Observation"
            ></textarea>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-medium">
              Recommendation
            </label>
            <textarea
              name=""
              id=""
              cols={10}
              rows={3}
              className="p-2 rounded-md border border-gray-400"
              placeholder="Enter Recommendation"
            ></textarea>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-medium">
              Objectives Of The Audit
            </label>
            <textarea
              name=""
              id=""
              cols={10}
              rows={3}
              className="p-2 rounded-md border border-gray-400"
              placeholder="Enter Objectives Of The Audit"
            ></textarea>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 border-t mt-1 p-2">
          <button
            className="bg-red-400 text-white rounded-md p-2 flex items-center gap-2"
            onClick={onClose}
          >
            <MdClose /> Cancel
          </button>
          <button className="bg-green-400 text-white rounded-md p-2 flex items-center gap-2">
            <FaCheck /> Submit
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default ComplianceAudit;
