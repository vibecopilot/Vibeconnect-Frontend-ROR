import React, { useEffect, useState } from "react";
import { FaCheck, FaTasks, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import { getComplianceTagDetails, postComplianceTasks } from "../../../api";
import toast from "react-hot-toast";
import FileInputBox from "../../../containers/Inputs/FileInputBox";

const ComplianceTask = ({ onClose, nodeId, fetchComplianceTree }) => {
  const [tasks, setTasks] = useState([
    {
      question: "",
      answerType: "",
      Mandatory: false,
      weightage: "",
    },
  ]);
  const [catName, setCatName] = useState("");
  useEffect(() => {
    const fetchComplianceCatDetails = async () => {
      try {
        const res = await getComplianceTagDetails(nodeId);
        setCatName(res?.data?.name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComplianceCatDetails();
  }, []);

  // const handleInputChange = (index, field, value) => {
  //   const updatedTasks = [...tasks];
  //   updatedTasks[index][field] =
  //     field === "Mandatory" ? value.target.checked : value;
  //   setTasks(updatedTasks);
  // };

  const handleInputChange = (index, field, value) => {
    const updatedTasks = [...tasks];

    if (field === "Mandatory") {
      updatedTasks[index][field] = value.target.checked;
    } else if (field === "attachments") {
      updatedTasks[index][field] = Array.from(value); // Store files as an array
    } else {
      updatedTasks[index][field] = value;
    }

    setTasks(updatedTasks);
  };

  const handleAddTasks = () => {
    setTasks([
      ...tasks,
      {
        answerType: "",
        Mandatory: false,
        question: "",
        weightage: "",
      },
    ]);
  };

  const handleDeleteTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  // const handleCreateTask = async () => {
  //   const payload = {
  //     compliance_tag_tasks: tasks.map((task) => ({
  //       name: task.question,
  //       weightage: task.weightage,
  //       compliance_tag_id: nodeId,
  //       mandatory: task.Mandatory,
  //     })),
  //   };

  //   try {
  //     const res = await postComplianceTasks(payload);
  //     toast.success("Task added successfully");
  //     onClose();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleCreateTask = async () => {
    const tasksPayload = tasks.map((task) => ({
      name: task.question,
      weightage: task.weightage,
      mandatory: task.Mandatory,
      compliance_tag_id: nodeId,
    }));

    const formData = new FormData();
    tasksPayload.forEach((task, index) => {
      Object.entries(task).forEach(([key, value]) => {
        formData.append(`compliance_tag_task[${index}][${key}]`, value);
      });

      if (tasks[index].attachments) {
        tasks[index].attachments.forEach((file) => {
          formData.append(`compliance_tag_task[${index}][attachments][]`, file);
        });
      }
    });

    try {
      const response = await postComplianceTasks(formData);
      toast.success("Tasks created successfully");
      onClose();
    } catch (error) {
      console.error("Error creating tasks:", error);
      toast.error("Failed to create tasks");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white  rounded-xl ">
        <h2 className="text-lg border-b font-medium my-2 flex items-center gap-2 justify-center">
          <PiPlusCircle /> Tasks for "{catName}"
        </h2>

        <div className="overflow-y-auto max-h-96 hide-scrollbar md:w-auto min-w-[40rem] p-2 flex flex-col gap-5">
          <div className="border rounded-xl p-2">
            {tasks.map((task, index) => (
              <div
                className="grid grid-cols-2 gap-2 border-b border-black my-1 p-2 items-end"
                key={index}
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Question
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={task.question}
                    onChange={(e) =>
                      handleInputChange(index, "question", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Enter question"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Weightage
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="%"
                    value={task.weightage}
                    onChange={(e) =>
                      handleInputChange(index, "weightage", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="mandatory"
                    id=""
                    checked={task.Mandatory}
                    onChange={(e) => handleInputChange(index, "Mandatory", e)}
                  />
                  <label htmlFor="mandatory">Mandatory</label>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <h2 className="border-b font-medium border-black">
                    Upload format
                  </h2>
                  <FileInputBox
                    handleChange={(files) =>
                      handleInputChange(index, "attachments", files)
                    }
                    fieldName={`attachments-${index}`}
                  />
                </div>
                <div className="flex justify-end items-end col-span-2">
                  <button
                    type="button"
                    className="text-red-400"
                    onClick={() => handleDeleteTask(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="flex items-center gap-2 p-2 bg-green-400 rounded-md text-white"
                onClick={handleAddTasks}
              >
                <PiPlusCircle size={18} />
                Add Task
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 my-2 border-t p-1">
          <button
            className="bg-red-500 flex items-center gap-2 font-medium text-white rounded-md p-2 px-4 "
            onClick={onClose}
          >
            <MdClose /> Cancel
          </button>
          <button
            className="bg-green-500 flex items-center gap-2 font-medium text-white rounded-md px-4 p-2 "
            onClick={handleCreateTask}
          >
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTask;
