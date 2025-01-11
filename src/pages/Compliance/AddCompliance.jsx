import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { Link } from "react-router-dom";

const AddCompliance = () => {
  const [checklist, setChecklist] = useState([""]);
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

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="p-6">
          <h1
            style={{ background: themeColor }}
            className="text-white text-center font-medium p-2 rounded-md"
          >
            Add Compliance
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
                <label className="block text-gray-700 font-medium">
                  Category
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                    setSelectedSubSubcategory("");
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCategory && (
                <div>
                  <label className="block text-gray-700 font-medium">
                    Subcategory
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setSelectedSubSubcategory("");
                    }}
                  >
                    <option value="">Select Subcategory</option>
                    {categories
                      .find((cat) => cat.name === selectedCategory)
                      .subcategories.map((subcategory, index) => (
                        <option key={index} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {selectedSubcategory && (
                <div>
                  <label className="block text-gray-700 font-medium">
                    Sub-Subcategory
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={selectedSubSubcategory}
                    onChange={(e) => setSelectedSubSubcategory(e.target.value)}
                  >
                    <option value="">Select Sub-Subcategory</option>
                    {categories
                      .find((cat) => cat.name === selectedCategory)
                      .subcategories.find(
                        (sub) => sub.name === selectedSubcategory
                      )
                      .subSubcategories.map((subSub, index) => (
                        <option key={index} value={subSub}>
                          {subSub}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-gray-700 font-medium"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  // value={formData.dueDate}
                  // onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
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
                  Assigned To
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2">
                  <option value="">Select Assigned To</option>
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
              <div>
                <label className="block text-gray-700 font-medium">
                  Select Checklist
                </label>
                <select
                  id="checklist"
                  name="checklist"
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select Checklist</option>
                  <option value="safety">Safety Checklist</option>
                  <option value="employee-safety">Employee Safety</option>
                  <option value="workplace-safety">Workplace Safety</option>
                  <option value="legal">Legal Compliance</option>
                  <option value="fire-safety">Fire Safety</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
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
