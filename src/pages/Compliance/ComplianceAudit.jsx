import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaStamp } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { postComplianceEvidence } from "../../api";

const ComplianceAudit = ({ onClose, trackerId, tagId, taskId }) => {
  const [formData, setFormData] = useState({
    status: "",
    observation: "",
    recommendation: "",
    objective: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const userId = getItemInLocalStorage("UserId");
  const handleAuditSubmission = async () => {
    if (!formData.status) {
      return toast.error("Please select status");
    }

    const formDataToSend = new FormData();

    formDataToSend.append(
      "compliance_tracker_tags[][compliance_tracker_id]",
      trackerId
    );

    formDataToSend.append("compliance_tracker_tags[][submitted_by_id]", userId);
    formDataToSend.append(
      "compliance_tracker_tags[][compliance_tag_id]",
      tagId
    );
    formDataToSend.append(
      "compliance_tracker_tags[][observation]",
      formData.observation
    );
    formDataToSend.append(
      "compliance_tracker_tags[][recommendation]",
      formData.recommendation
    );
    formDataToSend.append(
      "compliance_tracker_tags[][objective]",
      formData.objective
    );
    formDataToSend.append("compliance_tracker_tags[][status]", formData.status);

    formDataToSend.append(
      "compliance_tracker_tags[][compliance_tag_task_id]",
      taskId
    );

    try {
      const response = await postComplianceEvidence(formDataToSend);
      toast.success("Audit submitted successfully!");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

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
              name="status"
              value={formData.status}
              onChange={handleChange}
              id=""
              className="border border-gray-400 rounded-md p-2 "
            >
              <option value="">Select Status</option>
              <option value="complied">Complied</option>
              <option value="not_valid">Not Valid</option>
              <option value="document_missing">Document Missing</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-medium">
              Observation
            </label>
            <textarea
              name="observation"
              value={formData.observation}
              onChange={handleChange}
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
              name="recommendation"
              value={formData.recommendation}
              onChange={handleChange}
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
              name="objective"
              value={formData.objective}
              onChange={handleChange}
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
          <button
            className="bg-green-400 text-white rounded-md p-2 flex items-center gap-2"
            onClick={handleAuditSubmission}
          >
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAudit;
