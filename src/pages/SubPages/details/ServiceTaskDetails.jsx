import React, { useEffect, useState } from "react";
import { API_URL, getServicesTaskDetails } from "../../../api";
import ChecklistSubmissionForm from "../../../components/ChecklistSubmissionForm";
import { useParams } from "react-router-dom";

// Attachfile#document_url returns a signed absolute URL; only prefix legacy
// relative paths with the Rails host.
const attachmentUrl = (document) => {
  if (!document) return "";
  if (/^(https?:\/\/|data:)/i.test(document)) return document;
  return `${API_URL}${document.startsWith("/") ? "" : "/"}${document}`;
};

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
        <p>{dateFormat(created_at)}</p>
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

      <div className="w-full my-2">
        {taskDetails.length === 0 && (
          <p className="text-center text-gray-500">No details available</p>
        )}

        {taskDetails.map((task, index) => (
          <div key={task.id}>
            
              <>
              <div className="my-4 flex flex-col bg-gray-100 shadow-custom-all-sides p-2 rounded-md gap-2">

                <div className="flex gap-4 items-center">
                  <p className="font-medium">Question :</p>
                  <p>{task.question_name}</p>
                </div>
                <div className="flex gap-4 items-center bg-green-200 p-2 rounded-md">
                  <p className="font-medium">Answer :</p>
                  <p>{task.value}</p>
                </div>
                {task.comment && (
                  <div className="flex gap-4 items-center bg-yellow-100 p-2 rounded-md">
                    <p className="font-medium">Comment :</p>
                    <p>{task.comment}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
                  <p>
                    <span className="font-medium">Submitted by :</span>{" "}
                    {task.user_name || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Submitted at :</span>{" "}
                    {task.created_at ? dateFormat(task.created_at) : "—"}
                  </p>
                </div>

                {/* Question Attachments */}
                {task.question_attachments && task.question_attachments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Question Attachments:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {task.question_attachments.map((attachment, idx) => (
                        <div key={attachment.id || idx} className="relative">
                          <img
                            src={attachmentUrl(attachment.document)}
                            alt={`Question attachment ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                            onClick={() => window.open(attachmentUrl(attachment.document), '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submission Attachments */}
                {task.submission_attachments && task.submission_attachments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Submission Attachments:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {task.submission_attachments.map((attachment, idx) => (
                        <div key={attachment.id || idx} className="relative">
                          <img
                            src={attachmentUrl(attachment.document)}
                            alt={`Submission attachment ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                            onClick={() => window.open(attachmentUrl(attachment.document), '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </>
            
          </div>
        ))}
      </div>
    </div>
  );
};




export default ServiceTaskDetails
