import React, { useState } from "react";
import Table from "../../../components/table/Table";
import { BiEdit, BiTrash } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { PiPlusCircle } from "react-icons/pi";

const ComplianceChecklist = () => {
  const [checklistName, setChecklistName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() === "") {
      alert("Task name cannot be empty");
      return;
    }
    setTasks([...tasks, newTask]);
    setNewTask("");
  };

  const handleRemoveTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const Column = [
    {
      name: "Sr. no.",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Checklist",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "No. Of Tasks",
      selector: (row) => row.tasks,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          {/* <button>
            <BiEdit size={15} />
          </button> */}
          <button>
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const Data = [
    {
      name: "Labour law - checklist",
      tasks: "5",
    },
  ];

  const [add, setAdd] = useState(false);

  return (
    <section className=" m-2">
      <div className="w-full flex mx-3 mb-5 flex-col overflow-hidden">
        {add && (
          <div className=" p-4 bg-gray-100 rounded shadow">
            <h1 className="text-xl font-bold mb-4 text-gray-700">
              Compliance Checklist
            </h1>
            <div className="grid grid-cols-3 gap-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Checklist Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter checklist name"
                  value={checklistName}
                  onChange={(e) => setChecklistName(e.target.value)}
                />
              </div>
              <div className="mb-4 ">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Task Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter task name"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <button
                    onClick={handleAddTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Task
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setAdd(false)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded "
                >
                  Cancel
                </button>
                <button
                  onClick={() => setAdd(false)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save Checklist
                </button>
              </div>
            </div>
            {tasks.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-600 mb-2">
                  Tasks
                </h2>
                <ul className="space-y-2">
                  {tasks.map((task, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 bg-white border rounded shadow-sm"
                    >
                      <span className="text-gray-700">{task}</span>
                      <button
                        onClick={() => handleRemoveTask(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end mr-5 my-2">
          {!add && (
            <button
              className="bg-green-400 font-medium text-white p-2 rounded-md flex items-center gap-2"
              onClick={() => setAdd(true)}
            >
              <PiPlusCircle /> Add
            </button>
          )}
        </div>

        <Table columns={Column} data={Data} isPagination={true} />
      </div>
    </section>
  );
};

export default ComplianceChecklist;
