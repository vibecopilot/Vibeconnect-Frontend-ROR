import React, { useEffect, useState } from "react";
import { getServicesTaskDetails } from "../../../api";
import ChecklistSubmissionForm from "../../../components/ChecklistSubmissionForm";
import { useParams } from "react-router-dom";

const ServiceTaskDetails = () => {
  const { serviceId, activityId } = useParams();
  const [taskDetails, setTaskDetails] = useState([]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const detailsResp = await getServicesTaskDetails(serviceId, activityId);
      console.log(detailsResp.data);
      setTaskDetails(detailsResp.data);
    };
    fetchTaskDetails();
  }, [serviceId, activityId]);

  const { soft_service_name, checklist_name, created_at } = taskDetails[0] || {};
  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short", // or 'long' for full month names
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      // second: '2-digit'
      hour12: true,
    });
  };
  return (
    <div className="flex flex-col justify-center items-center p-2">
      <div className="flex justify-between bg-gray-400 rounded p-2 w-full mx-20 text-white">
        <div className="grid grid-cols-2">
          <p className="font-medium">Service Name :</p>
          <p>{soft_service_name}</p>
        </div>
        <p>{created_at ? dateFormat(created_at) : ""}</p>
        <div className="grid grid-cols-2">
          <p className="font-medium">Checklist Name :</p>
          <p>{checklist_name}</p>
        </div>
      </div>
      {/* Submission form — same form used by the public and asset task flows */}
      <section className="w-full my-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Submit checklist
          </h2>
          <p className="text-xs text-slate-500">
            Answer pending questions and submit this soft-service task.
          </p>
        </div>
        <ChecklistSubmissionForm activityId={activityId} />
      </section>

    </div>
  );
};




export default ServiceTaskDetails
