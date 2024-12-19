import React, { useEffect, useState } from "react";
import {
  getEmployeeDetails,
  getResignationsDetails,
  hrmsDomain,
} from "../../../api";
import { FaBan, FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const SeparationDetails = ({ empId, regId, onClose, page }) => {
  const [details, setDetails] = useState({});
  const [regDetails, setRegDetails] = useState({});
console.log(page)
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const res = await getEmployeeDetails(empId);
        setDetails(res);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSeparationDetails = async () => {
      try {
        const res = await getResignationsDetails(regId);
        setRegDetails(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployeeDetails();
    fetchSeparationDetails();
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="max-h-screen bg-white p-4 max-w-[60rem]  rounded-xl shadow-lg overflow-y-auto">
        <div className="flex justify-center">
          <img
            src={hrmsDomain + details.profile_photo}
            alt={details?.employee?.first_name}
            className="border-4 border-gray-300 rounded-full w-28 h-28 object-cover"
          />
        </div>
        <p className="font-medium border-b mb-1">Personal Details</p>
        <div className="grid md:grid-cols-2 gap-2 border bg-blue-50 rounded-md p-2">
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Name :{" "}
            </label>
            <p>
              {details.first_name} {details.last_name}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              DOB :{" "}
            </label>
            <p>{details.date_of_birth}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Gender :{" "}
            </label>
            <p>{details.gender}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Email :{" "}
            </label>
            <p>{details.email_id}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Mobile :{" "}
            </label>
            <p>{details.mobile}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Aadhar :{" "}
            </label>
            <p>{details.aadhar_number}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Pan :{" "}
            </label>
            <p>{details.pan}</p>
          </div>
        </div>
        <p className="font-medium border-b my-1">Separation Details</p>
        <div className="grid md:grid-cols-2 gap-2 border bg-red-50 rounded-md p-2">
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Resignation Date :{" "}
            </label>
            <p>{regDetails.resignation_application_date}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Separation Reason :{" "}
            </label>
            <p>{regDetails.separation_reason}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Last working day :{" "}
            </label>
            <p>{regDetails.requested_last_working_date}</p>
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
        </div>
        {regDetails.comments && (
          <div className="flex flex-col">
            <p className="font-medium">Comment</p>
            <p className="bg-blue-50 p-2 rounded-md">{regDetails.comments}</p>
          </div>
        )}
        {page==="completed" && (
             <div className="flex flex-col">
             <p className="font-medium">Approver Comment</p>
             <p className="bg-green-50 p-2 rounded-md">{regDetails.action_comments}</p>
           </div>
        )}
        <div className="flex justify-center gap-2 mt-1 border-t p-2">
          {/* <button
            className="flex items-center gap-2 bg-green-400 p-2 px-4 rounded-full text-white"
            // onClick={handleAddEmployment}
          >
            <FaCheck /> Approve
          </button>
          <button
            className="flex items-center gap-2 bg-red-500 p-2 px-4 rounded-full text-white"
            // onClick={handleAddEmployment}
          >
            <FaBan /> Reject
          </button> */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-red-400 p-2 rounded-full text-white px-4"
          >
            <MdClose /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeparationDetails;
