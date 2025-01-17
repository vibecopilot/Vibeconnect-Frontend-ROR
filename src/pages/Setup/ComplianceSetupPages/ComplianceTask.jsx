import React, { useState } from "react";
import { FaCheck, FaTasks, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";

const ComplianceTask = ({ onClose }) => {
  const [tasks, setTasks] = useState([
    {
      question: "",
      answerType: "",
      Mandatory: false,
      weightage: "",
    },
  ]);

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
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white  rounded-xl ">
        <h2 className="text-lg border-b font-medium my-2 flex items-center gap-2 justify-center">
          <PiPlusCircle /> Tasks
        </h2>

        <div className="overflow-y-auto max-h-96 hide-scrollbar md:w-auto min-w-[40rem] p-4 flex flex-col gap-5">
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
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="mandatory" id="" />
                  <label htmlFor="mandatory">Mandatory</label>
                </div>
                <div className="flex justify-end items-end">
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
          <button className="bg-green-500 flex items-center gap-2 font-medium text-white rounded-md px-4 p-2 ">
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTask;
