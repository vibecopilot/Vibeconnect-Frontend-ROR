import React, { useEffect, useState } from "react";
import { domainPrefix, getRoutineTaskDetails } from "../../../api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AssetRoutineDetails = () => {
  const { assetId, activityId } = useParams();
  const [taskDetails, setTaskDetails] = useState([]);

  useEffect(() => {
    toast.loading("Please wait");
    const fetchTaskDetails = async () => {
      const detailsResp = await getRoutineTaskDetails(assetId, activityId);
      toast.dismiss();
      toast.success("Schedule Details fetched successfully");
      console.log(detailsResp.data);
      setTaskDetails(detailsResp.data);
    };
    fetchTaskDetails();
  }, [assetId, activityId]);

  if (taskDetails.length === 0) {
    return (
      <div className="flex  justify-center items-center w-full h-screen p-2">
        <p>No details available</p>
      </div>
    );
  }

  const { asset_name, checklist_name, created_at, user_name } = taskDetails[0];
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
          <p className="font-medium">Asset Name :</p>
          <p>{asset_name}</p>
        </div>
        <p>{dateFormat(created_at)}</p>
        <div className="grid grid-cols-2">
          <p className="font-medium">Checklist Name :</p>
          <p>{checklist_name}</p>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <p className="font-medium">Updated By : </p>
          <p>{user_name}</p>
        </div>
      </div>
      <div className="w-full my-2">
        {taskDetails.map((task, index) => (
          <div key={task.id}>
            {/* {index === 0 ? null : ( */}
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
                <span className="font-medium text-gray-500">Attachments :</span>
                <div className="flex gap-4 flex-wrap my-4 items-center text-center">
                  {task.question_attachments?.length > 0 ? (
                    task.question_attachments.map((attachment, i) => (
                      <img
                        key={i}
                        src={domainPrefix + attachment.document}
                        alt={`Attachment ${i + 1}`}
                        className="w-40 h-28 object-cover rounded-md"
                        onClick={() =>
                          window.open(
                            domainPrefix + attachment.document,
                            "_blank"
                          )
                        }
                      />
                    ))
                  ) : (
                    <p>No Attachments</p>
                  )}
                </div>
              </div>
            </>
            {/* )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetRoutineDetails;
