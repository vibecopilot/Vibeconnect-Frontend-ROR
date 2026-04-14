import React, { useEffect, useState } from "react";
import { domainPrefix, getRoutineTaskDetails } from "../../../api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AssetRoutineDetails = () => {
  const { assetId, activityId } = useParams();

  const [taskDetails, setTaskDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        if (!assetId || !activityId) return;

        setLoading(true);
        toast.loading("Fetching Schedule Details...");

        const response = await getRoutineTaskDetails(
          assetId,
          activityId
        );

        toast.dismiss();

        console.log("Details API Response:", response);

        // ✅ Flexible response handling
        let detailsArray = [];

        if (Array.isArray(response?.data)) {
          detailsArray = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          detailsArray = response.data.data;
        } else if (Array.isArray(response?.data?.activity_details)) {
          detailsArray = response.data.activity_details;
        }

        if (detailsArray.length > 0) {
          setTaskDetails(detailsArray);
          toast.success("Schedule Details fetched successfully");
        } else {
          setTaskDetails([]);
          toast.error("No details found");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to fetch schedule details");
        console.error("Error fetching details:", error);
        setTaskDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [assetId, activityId]);

  const dateFormat = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!taskDetails || taskDetails.length === 0) {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <p className="text-gray-400 text-xl font-semibold">
          No Submission Done Yet!
        </p>
      </div>
    </div>
  );
}


  const {
    asset_name,
    checklist_name,
    created_at,
    user_name,
  } = taskDetails[0];

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center bg-blue-600 text-white rounded-xl p-4 shadow-lg">
        <div>
          <p className="text-sm opacity-80">Asset Name</p>
          <p className="font-semibold text-lg">{asset_name}</p>
        </div>

        <div>
          <p className="text-sm opacity-80">Checklist</p>
          <p className="font-semibold text-lg">{checklist_name}</p>
        </div>

        <div>
          <p className="text-sm opacity-80">Updated By</p>
          <p className="font-semibold text-lg">{user_name}</p>
        </div>

        <div>
          <p className="text-sm opacity-80">Updated At</p>
          <p className="font-semibold text-lg">
            {dateFormat(created_at)}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="mt-6 space-y-5">
        {taskDetails.map((task, index) => (
          <div
            key={task.id || index}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
          >
            <div className="mb-3">
              <p className="text-gray-500 text-sm">Question</p>
              <p className="font-medium text-gray-800">
                {task.question_name || "-"}
              </p>
            </div>

            <div className="mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-gray-500 text-sm">Answer</p>
              <p className="font-semibold text-green-700">
                {task.value || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Attachments</p>

              <div className="flex gap-4 flex-wrap">
                {task.question_attachments?.length > 0 ? (
                  task.question_attachments.map((attachment, i) => (
                    <img
                      key={i}
                      src={domainPrefix + attachment.document}
                      alt={`Attachment ${i + 1}`}
                      className="w-40 h-28 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                      onClick={() =>
                        window.open(
                          domainPrefix + attachment.document,
                          "_blank"
                        )
                      }
                    />
                  ))
                ) : (
                  <p className="text-gray-400">No Attachments</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetRoutineDetails;
