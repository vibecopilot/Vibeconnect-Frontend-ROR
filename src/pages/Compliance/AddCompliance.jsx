import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";

const AddCompliance = () => {
  const [checklist, setChecklist] = useState([""]);
  const [complianceFor, setComplianceFor] = useState([
    {
      category: "",
      subLevel2: "",
      subLevel3: "",
      subLevel4: "",
      subLevel5: "",
    },
  ]);
  const [tasks, setTasks] = useState([
    {
      question: "",
      answerType: "",
      Mandatory: false,
      weightage: "",
    },
  ]);
  const [categories] = useState([
    {
      name: "Labor Law",
      subcategories: [
        {
          name: "Minimum Wages Act",
          subSubcategories: ["Minimum Wage", "Overtime Wage"],
        },
        {
          name: "Factories Act",
          subSubcategories: ["Work Hours", "Safety Standards"],
        },
      ],
    },
    {
      name: "Tax Compliance",
      subcategories: [
        {
          name: "Direct Taxes",
          subSubcategories: ["Income Tax", "Corporate Tax"],
        },
        {
          name: "Indirect Taxes",
          subSubcategories: ["GST", "VAT"],
        },
      ],
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState("");

  const handleChecklistChange = (index, value) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index] = value;
    setChecklist(updatedChecklist);
  };

  const addChecklistItem = () => setChecklist([...checklist, ""]);

  const removeChecklistItem = (index) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(updatedChecklist);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", {
      selectedCategory,
      selectedSubcategory,
      selectedSubSubcategory,
      checklist,
    });
  };

  const themeColor = useSelector((state) => state.theme.color);

  const handleAddComplianceFor = () => {
    setComplianceFor([
      ...complianceFor,
      {
        category: "",
        subLevel2: "",
        subLevel3: "",
        subLevel4: "",
        subLevel5: "",
      },
    ]);
  };

  const handleDeleteComplianceFor = (indexToRemove) => {
    setComplianceFor(
      complianceFor.filter((_, index) => index !== indexToRemove)
    );
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

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="p-6">
          <h1
            style={{ background: themeColor }}
            className="text-white text-center font-medium p-2 rounded-md"
          >
            Compliance Configuration
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 my-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-700 font-medium">
                  Compliance Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-gray-700 font-medium"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  // value={formData.dueDate}
                  // onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-gray-700 font-medium"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  // value={formData.dueDate}
                  // onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="targetDates"
                  className="block text-gray-700 font-medium"
                >
                  Target Days{" "}
                  <span className="text-sm font-normal text-gray-400">
                    (no. of days)
                  </span>
                </label>
                <input
                  type="text"
                  id="targetDates"
                  name="targetDates"
                  placeholder="1 day"
                  // value={formData.dueDate}
                  // onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium text-sm">
                  Select Frequency
                </label>
                <select
                  name="frequency"
                  id=""
                  // value={formData.frequency}
                  // onChange={handleChange}
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select Frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="riskLevel"
                  className="block text-gray-700 font-medium"
                >
                  Risk Level
                </label>
                <select
                  id="riskLevel"
                  name="riskLevel"
                  //value={formData.riskLevel}
                  //onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md w-full"
                >
                  <option value="">Select risk level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Assigned To Auditor
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="">Select Auditor</option>
                  <option>Aniket Parkar</option>
                  <option>Vishal Yadav</option>
                  <option>Ravindar Sahani</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Assigned To Vendor
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="">Select Vendor</option>
                  <option>Aniket Parkar</option>
                  <option>Vishal Yadav</option>
                  <option>Ravindar Sahani</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Priority
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <h2 className="border-b font-medium border-black">
              Compliance For
            </h2>
            <div className="border rounded-md p-2">
              {complianceFor.map((compliance, index) => (
                <div
                  className="grid grid-cols-3 gap-2 border-b border-black my-1 p-2"
                  key={index}
                >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium">
                      Select Category
                    </label>
                    <select
                      name=""
                      id=""
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Category</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="font-medium">
                      Select Sub Category
                    </label>
                    <select
                      name=""
                      id=""
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Select Sub Category</option>
                    </select>
                  </div>

                  <div className="flex items-end justify-end text-red-500">
                    <button
                      type="button"
                      onClick={() => handleDeleteComplianceFor(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  className="bg-green-400 p-2 rounded-md text-white flex items-center gap-2"
                  onClick={handleAddComplianceFor}
                >
                  <PiPlusCircle /> Add More
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Description"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="documents"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Documents
              </label>
              <FileInputBox />
            </div>
            <div className="flex justify-center my-2 gap-2">
              <Link
                to={"/compliance"}
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <MdClose /> Cancel
              </Link>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaCheck /> Save Compliance
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddCompliance;
