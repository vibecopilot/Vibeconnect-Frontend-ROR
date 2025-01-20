import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FileInputBox from "../../../containers/Inputs/FileInputBox";
import { Link, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaCheck, FaDownload, FaRegFileAlt } from "react-icons/fa";
import {
  domainPrefix,
  getComplianceListDetails,
  postComplianceEvidence,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";
import { dateFormatSTD, dateTimeFormat } from "../../../utils/dateUtils";

const ComplianceEvidence = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const { id } = useParams();
  const [allTasks, setAllTasks] = useState([]);
  const [complianceName, setComplianceName] = useState("");
  const [remarks, setRemarks] = useState({});
  const userID = getItemInLocalStorage("UserId");

  // useEffect(() => {
  //   const fetchComplianceTasks = async () => {
  //     try {
  //       const res = await getComplianceListDetails(id);
  //       setComplianceName(res?.data?.compliance_config_name);
  //       if (
  //         res.data &&
  //         Array.isArray(res.data.compliance_tracker_tags_by_category)
  //       ) {
  //         const tasks = res.data.compliance_tracker_tags_by_category.flatMap(
  //           (category) =>
  //             category.compliance_tracker_tags
  //               .filter((tag) => tag.task)
  //               .map((tag) => ({ ...tag.task, attachments: [] }))
  //         );
  //         setAllTasks(tasks);
  //       } else {
  //         console.error(
  //           "compliance_tracker_tags_by_category is not an array:",
  //           res.data
  //         );
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchComplianceTasks();
  // }, [id]);

  const fetchComplianceTasks = async () => {
    try {
      const res = await getComplianceListDetails(id);
      setComplianceName(res?.data?.compliance_config_name);

      if (
        res.data &&
        Array.isArray(res.data.compliance_tracker_tags_by_category)
      ) {
        const tasks = res.data.compliance_tracker_tags_by_category.flatMap(
          (category) =>
            category.compliance_tracker_tags
              .filter((tag) => tag.task) 
              .map((tag) => ({
                ...tag.task,
                evidence: tag.attachments || [], 
                comment: tag.comment || "",
                auditorObservation: tag.observation,
                auditorRecommendation: tag.recommendtion,
                submittedOn: tag.submitted_on,
              }))
        );
        console.log(tasks);
        setAllTasks(tasks); // Set the formatted tasks data
      } else {
        console.error(
          "compliance_tracker_tags_by_category is not an array:",
          res.data
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchComplianceTasks();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedTasks = [...allTasks];

    if (field === "attachments") {
      updatedTasks[index][field] = Array.from(value);
    } else {
      updatedTasks[index][field] = value;
    }

    setAllTasks(updatedTasks);
  };

  // const handleTaskSubmission = async () => {
  //   const formData = new FormData();

  //   allTasks.forEach((task, index) => {
  //     const remark = remarks[task.id] || "";
  //     const hasAttachments = task.evidence && task.evidence.length > 0;
  //     if (remark || hasAttachments) {
  //       formData.append(
  //         `compliance_tracker_tags[${index}][compliance_tracker_id]`,
  //         id
  //       );
  //       formData.append(
  //         `compliance_tracker_tags[${index}][submitted_by_id]`,
  //         userID
  //       );
  //       formData.append(
  //         `compliance_tracker_tags[${index}][compliance_tag_id]`,
  //         task.compliance_tag_id
  //       );
  //       formData.append(
  //         `compliance_tracker_tags[${index}][comment]`,
  //         remarks[task.id] || ""
  //       );
  //       formData.append(
  //         `compliance_tracker_tags[${index}][compliance_tag_task_id]`,
  //         task.id
  //       );
  //       // if (task.attachments && task.attachments.length > 0) {
  //       //   task.attachments.forEach((file, fileIndex) => {
  //       //     formData.append(`attachments[${task.id}][]`, file);
  //       //   });
  //       // }
  //       if (task.evidence && task.evidence.length > 0) {
  //         task.evidence.forEach((file, fileIndex) => {
  //           console.log(file)
  //           formData.append(
  //             `compliance_tracker_tags[${index}][attachments][${fileIndex}]`,
  //             file
  //           );
  //         });
  //       }
  //     }
  //   });

  //   try {
  //     const res = await postComplianceEvidence(formData);

  //     toast.success("Task Submitted");
  //     fetchComplianceTasks();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error submitting tasks.");
  //   }
  // };
  

  const handleTaskSubmission = async () => {
    const formData = new FormData();
  
    allTasks.forEach((task, index) => {
      // Check if the task has new attachments or remarks
      const hasNewAttachments =
        task.evidence &&
        task.evidence.length > 0 &&
        task.evidence.some((file) => file instanceof File); // Ensure evidence includes new files
      const hasNewRemarks = remarks[task.id] && remarks[task.id].trim() !== "";
  
      // Include only tasks with new attachments or new remarks
      if (hasNewAttachments || hasNewRemarks) {
        formData.append(
          `compliance_tracker_tags[${index}][compliance_tracker_id]`,
          id
        );
        formData.append(
          `compliance_tracker_tags[${index}][submitted_by_id]`,
          userID
        );
        formData.append(
          `compliance_tracker_tags[${index}][compliance_tag_id]`,
          task.compliance_tag_id
        );
        formData.append(
          `compliance_tracker_tags[${index}][comment]`,
          remarks[task.id] || ""
        );
        formData.append(
          `compliance_tracker_tags[${index}][compliance_tag_task_id]`,
          task.id
        );
  
        if (hasNewAttachments) {
          task.evidence.forEach((file, fileIndex) => {
            if (file instanceof File) {
              formData.append(
                `compliance_tracker_tags[${index}][attachments][${fileIndex}]`,
                file
              );
            }
          });
        }
      }
    });
  
    try {
      const res = await postComplianceEvidence(formData);
  
      toast.success("Task Submitted");
      fetchComplianceTasks();
    } catch (error) {
      console.error(error);
      toast.error("Error submitting tasks.");
    }
  };
  
  
  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };
  const getFileName = (filePath) => {
    return filePath.split("/").pop().split("?")[0];
  };
  return (
    <section className="mb-10">
      <div
        style={{ background: themeColor }}
        className="p-2 text-white font-medium text-lg flex justify-between items-center "
      >
        <p>{complianceName}</p>
      </div>
      {allTasks.map((task, index) => (
        <div
          className="m-2 flex flex-col gap-2 border rounded-md p-2"
          key={task.id}
        >
          <div className="border-b border-gray-500 grid grid-cols-4">
            <p className="font-medium ">{task?.name}</p>
            <p className="font-medium text-center">
              Weightage: {task?.weightage}%
            </p>
            <p className="font-medium text-right">
              Mandatory: {task?.mandatory ? "Yes" : "No"}
            </p>
            <div className="flex justify-end">
              <button className="p-1 rounded-md bg-green-400 text-white font-medium flex items-center gap-2 mb-1">
                <FaDownload /> Format
              </button>
            </div>
          </div>
         
          {task.comment === "" ? (
            <input
              type="text"
              name={`remark-${task.id}`}
              id={`remark-${task.id}`}
              className="border rounded-md p-2"
              placeholder="Enter Remark"
              value={remarks[task.id] || ""}
              onChange={(e) =>
                setRemarks((prev) => ({ ...prev, [task.id]: e.target.value }))
              }
            />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4 bg-violet-100 p-2 rounded-md">
                <p className="font-medium">Remark :</p>
                <p>{task.comment}</p>
              </div>
              <div className="flex items-center gap-4 bg-green-100 p-2 rounded-md">
                <p className="font-medium">Auditor Recommendation :</p>
                <p>{task?.auditorRecommendation}</p>
              </div>
              <div className="flex items-center gap-4 bg-green-100 p-2 rounded-md">
                <p className="font-medium">Auditor Observation :</p>
                <p>{task?.auditorRecommendation}</p>
              </div>
            </div>
          )}

          <div className="flex  gap-4 flex-wrap my-4 items-center  text-center">
            {task.evidence && task.evidence.length > 0 ? (
              task.evidence.map((other, index) => (
                <div key={other.id} className="">
                  {isImage(domainPrefix + other.image_url) ? (
                    <img
                      src={domainPrefix + other.image_url}
                      alt={`Attachment ${index + 1}`}
                      className="w-40 h-28 object-cover rounded-md"
                      onClick={() =>
                        window.open(domainPrefix + other.image_url, "_blank")
                      }
                    />
                  ) : (
                    <a
                      href={domainPrefix + other.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-link hover:text-blue-400 transition-all duration-300  text-center flex flex-col items-center  "
                    >
                      <FaRegFileAlt size={50} />
                      {/* {getFileName(other.image_url)} */}
                    </a>
                  )}
                </div>
              ))
            ) : (
              <FileInputBox
                handleChange={(files) =>
                  handleInputChange(index, "evidence", files)
                }
                fieldName={`evidence-${index}`}
                isMulti={true}
              />
             )} 
          </div>
          <div className="flex justify-end">
            <p>Submitted on : {dateTimeFormat(task.submittedOn)}</p>
          </div>
        </div>
      ))}
      <div className="border-t p-1 flex items-center justify-center gap-2">
        <Link
          to={"/compliance/vendor"}
          className="bg-red-400 text-white p-2 flex items-center gap-2 rounded-md"
        >
          <MdClose size={18} /> Cancel
        </Link>
        <button
          className="bg-green-400 text-white p-2 flex items-center gap-2 rounded-md"
          onClick={handleTaskSubmission}
        >
          <FaCheck /> Submit
        </button>
      </div>
    </section>
  );
};

export default ComplianceEvidence;
