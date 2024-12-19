import React, { useEffect, useState } from "react";
import { getResignationsDetails, ResignationApproval } from "../../../api";
import { FaBan, FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";

const SeparationAction = ({ regId, action, onClose, fetchResignations }) => {
  const [regDetails, setRegDetails] = useState({});
  useEffect(() => {
    const fetchSeparationDetails = async () => {
      try {
        const res = await getResignationsDetails(regId);
        setRegDetails(res);
        setLastWorkingDate(res.requested_last_working_date);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSeparationDetails();
  }, []);

  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [actionComment, setActionComment] = useState("");
  const handleResignationApproval = async (decision) => {
    const postData = new FormData();
    postData.append("status", decision);
    postData.append("requested_last_working_date", lastWorkingDate);
    postData.append("action_comments", actionComment);
    try {
      const res = await ResignationApproval(regId, postData);
      onClose();
      toast.success(`Resignation Request ${decision} successfully`);
      fetchResignations();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="max-h-screen bg-white p-4 max-w-[60rem]  rounded-xl shadow-lg overflow-y-auto">
        <div>
          <h2 className="font-medium text-center border-b mb-1">
            Separation Details
          </h2>
          <div className="grid md:grid-cols-2 gap-2 border bg-red-50 rounded-md p-2">
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="" className="font-medium">
                Employee Name :{" "}
              </label>
              <p>{regDetails.employee_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="" className="font-medium">
                Resignation Date :{" "}
              </label>
              <p>{regDetails.resignation_application_date}</p>
            </div>
            {action === "reject" &&<div className="grid grid-cols-2 items-center gap-2">
              <label htmlFor="" className="font-medium">
                Requested Last working day :{" "}
              </label>
              <p>{regDetails.requested_last_working_date}</p>
            </div>}
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="" className="font-medium">
                Separation Reason :{" "}
              </label>
              <p>{regDetails.separation_reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="" className="font-medium">
                FNF Settlement Month :{" "}
              </label>
              <p>{regDetails.fnf_settlement_month}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label htmlFor="" className="font-medium">
                Status :{" "}
              </label>
              <p className="font-medium">{regDetails.status}</p>
            </div>
            
           {action === "approve" && <div className="grid col-span-2 items-center gap-2">
              <label htmlFor="" className="font-medium">
                Requested Last working day : <span className="text-gray-400 text-xs">(Portal access will be removed on this date)</span>
              </label>
              <input
                type="date"
                name=""
                id=""
                value={lastWorkingDate}
                onChange={(e) => setLastWorkingDate(e.target.value)}
                className="border-2 p-2 bg-red-50 border-white rounded-md"
              />
            </div>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="font-medium">
              Comment
            </label>
            <textarea
              name=""
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
              id=""
              rows={3}
              placeholder="Enter Comment"
              className="border rounded-md p-1 border-gray-300"
            ></textarea>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          {action === "approve" && (
            <button
              className="flex items-center gap-2 p-2 px-4 text-white rounded-full bg-green-400"
              onClick={() => handleResignationApproval("Approved")}
            >
              <FaCheck /> Approve
            </button>
          )}
          {action === "reject" && (
            <button
              className="flex items-center gap-2 p-2 px-4 text-white rounded-full bg-red-500"
              onClick={() => handleResignationApproval("Rejected")}
            >
              <FaBan /> Reject
            </button>
          )}
          <button
            className="flex items-center gap-2 p-2 px-4 text-white rounded-full bg-red-400"
            onClick={onClose}
          >
            <MdClose /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeparationAction;
