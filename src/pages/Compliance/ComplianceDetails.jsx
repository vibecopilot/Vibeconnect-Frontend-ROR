import React, { useEffect, useState } from "react";
import { FaCheck, FaRegFileAlt } from "react-icons/fa";
import { IoDocumentAttach } from "react-icons/io5";
import { LuStamp } from "react-icons/lu";
import { MdClose, MdOutlinePendingActions } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ComplianceAudit from "./ComplianceAudit";
import { GrCertificate } from "react-icons/gr";
import {
  domainPrefix,
  getComplianceConfigurationDetails,
  getReviewerAssignments,
} from "../../api";
import {
  dateFormat,
  dateFormatSTD,
  dateTimeFormat,
} from "../../utils/dateUtils";
import { getItemInLocalStorage } from "../../utils/localStorage";

const ComplianceDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const userId = getItemInLocalStorage("UserId");
  const [details, setDetails] = useState({});
  const [assignments, setAssignments] = useState([]);
  useEffect(() => {
    const fetchComplianceDetails = async () => {
      try {
        const res = await getComplianceConfigurationDetails(id);
        setDetails(res?.data);
        setAssignments(res?.data?.compliance_trackers);
      } catch (error) {
        console.log(error);
      }
    };
    // const fetchReviewerAssignments = async () => {
    //   try {
    //     const res = await getReviewerAssignments(userId);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // fetchReviewerAssignments();
    fetchComplianceDetails();
  }, []);
  console.log(assignments);
  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };
  const getFileName = (filePath) => {
    return filePath.split("/").pop().split("?")[0];
  };
  const [complianceTrackerId, setComplianceTrackerId] = useState("");
  const [complianceTagId, setComplianceTagId] = useState("");
  const [complianceTagTaskId, setComplianceTagTaskId] = useState("");

  const handleComplianceAuditModal = (trackerId, TagId, TagTaskId) => {
    console.log("tracker: ", trackerId, "Tag :", TagId, "task:", TagTaskId);
    setModal(true);
    setComplianceTrackerId(trackerId);
    setComplianceTagId(TagId);
    setComplianceTagTaskId(TagTaskId);
  };

  return (
    <section className="mb-10">
      <div
        style={{ background: themeColor }}
        className="fixed w-full top-0 p-2 text-white font-medium text-lg grid grid-cols-3 items-center "
      >
        <p className="">{details.name}</p>
        <p className="text-center">{details.site_name}</p>
        <div className="flex justify-end">
          <div className="text-right  p-2 rounded-md text-green-500">
            <span className="bg-white p-2 rounded-md">100% Completed</span>
          </div>
          <button className="flex items-center gap-2 bg-violet-400 text-white p-2 rounded-md">
            <GrCertificate /> Generate Certificate
          </button>
        </div>
      </div>
      <div className="border rounded-xl p-2 m-2 bg-gray-50 mt-20">
        <h2 className="font-medium text-lg border-b border-black mb-2">
          Basic Details
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Auditor :</p>
            <p>{details?.reviewer_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Vendor :</p>
            <p>{details?.assign_to_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Frequency :</p>
            <p>{details?.frequency}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Start Date :</p>
            <p>{dateFormatSTD(details?.start_date)}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">End Date :</p>
            <p>{dateFormatSTD(details?.end_date)}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Target Days :</p>
            <p>{details?.due_in_days} days</p>
          </div>

          <div className="grid grid-cols-2 gap-1">
            <p className="font-medium">Priority :</p>
            <p>{details?.priority}</p>
          </div>
        </div>
        <h2 className="font-medium text-lg border-b border-black my-2">
          Compliance for
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {details?.compliance_config_tags?.map((category) => (
            <div className="grid grid-cols-2 gap-2">
              <p className="font-medium">Category :</p>
              <p>{category.compliance_tag_name}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="border-b border-black px-2 font-medium text-lg ">
          Tasks
        </h2>
      </div>
      <div className="border p-2 rounded-xl m-2 flex flex-col gap-2">
        {assignments?.map((assignment) =>
          assignment?.compliance_tracker_tags_by_category?.map((category) =>
            category?.compliance_tracker_tags?.map((tags) => (
              <div
                className="bg-gray-50 rounded-xl p-2"
                key={category?.id || category?.name}
              >
                <div className="grid grid-cols-4 border-b">
                  <h2 className="font-medium text-green-500">
                    {category?.name}
                  </h2>
                  <p className="text-center font-medium">
                    Weightage : {tags?.task?.weightage}%
                  </p>
                  <p className="text-right font-medium">
                    Mandatory : {tags?.task?.mandatory ? "Yes" : "No"}
                  </p>
                  <div className="flex justify-end gap-2">
                    <p
                      className={`flex justify-end font-medium gap-2 items-center text-right ${
                        assignment?.status === "pending"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {assignment?.status === "pending" ? (
                        <MdOutlinePendingActions />
                      ) : (
                        <FaCheck />
                      )}
                      {assignment?.status &&
                        assignment?.status.charAt(0).toUpperCase() +
                          assignment?.status.slice(1)}
                    </p>
                    <button
                      className="bg-white shadow-custom-all-sides hover:bg-gray-50 rounded-full text-green-400 flex items-center gap-2 font-medium px-4 "
                      onClick={() =>
                        handleComplianceAuditModal(
                          tags.compliance_tracker_id,
                          tags.compliance_tag_id,
                          tags.compliance_tag_task_id
                        )
                      }
                    >
                      <LuStamp /> Verify
                    </button>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 m-1">
                  <h2 className="font-medium border-b mb-1">Answer</h2>
                  <p className="bg-violet-100 p-2 rounded-md text-black">
                    Remark: {tags?.comment}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex  gap-4 flex-wrap my-4 items-center  text-center">
                      {tags?.attachments?.map((other, index) => (
                        <div key={other.id} className="">
                          {isImage(domainPrefix + other.image_url) ? (
                            <img
                              src={domainPrefix + other.image_url}
                              alt={`Attachment ${index + 1}`}
                              className="w-40 h-28 object-cover rounded-md"
                              onClick={() =>
                                window.open(
                                  domainPrefix + other.image_url,
                                  "_blank"
                                )
                              }
                            />
                          ) : (
                            <a
                              href={domainPrefix + other.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="attachment-link hover:text-blue-400 transition-all duration-300  text-center flex flex-col items-center  "
                            >
                              <IoDocumentAttach
                                size={40}
                                className="text-yellow-400"
                              />
                              {getFileName(other.image_url)}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Submitted by : </p>
                      <p>{tags?.submitted_by_name}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium">Submitted on : </p>
                      <p>{dateTimeFormat(tags?.submitted_on)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {modal && (
        <ComplianceAudit
          onClose={() => setModal(false)}
          tagId={complianceTagId}
          taskId={complianceTagTaskId}
          trackerId={complianceTrackerId}
        />
      )}
    </section>
  );
};

export default ComplianceDetails;
