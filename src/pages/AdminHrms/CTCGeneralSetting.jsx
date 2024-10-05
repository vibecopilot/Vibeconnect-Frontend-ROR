import React, { useState } from "react";
import CTCDetailsList from "./CTCDetailsList";
import { useSelector } from "react-redux";
import AdminHRMS from "./AdminHrms";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChevronRight,
  FaProjectDiagram,
  FaShoppingBasket,
  FaWrench,
} from "react-icons/fa";
import TemplateLabel from "./CTCTemplates/TemplateLabel";
import ComponentCTCTemplate from "./CTCTemplates/ComponentCTCTemplate";
import Restrictions from "./CTCTemplates/Restrictions";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { postCTCTemplate } from "../../api";
import toast from "react-hot-toast";

const CTCGeneralSetting = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedDeductions, setSelectedDeductions] = useState([]);
  const stepsData = [
    { id: 0, title: "General Settings", icon: <FaWrench /> },
    {
      id: 1,
      title: "Component & Hierarchy Selection",
      icon: <FaProjectDiagram />,
    },
    {
      id: 2,
      title: "Restrictions on CTC Basket and Amount Allocation",
      icon: <FaShoppingBasket />,
    },
  ];
  const [activePage, setActivePage] = useState(0);

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/admin/hrms/ctc/CTC-Template");
  };
  const [label, setLabel] = useState("");
  const [templateId, setTemplateId] = useState("");
  const handleAddTemplate = async () => {
    if (!label) {
      return toast.error("Please Enter Template Label");
    }

    const postData = new FormData();
    postData.append("label", label);
    const selectedAllowances = selectedOptions.map((items) => items);
    // postData.append("fixed_salary_allowance", selectedAllowances);
    selectedAllowances.forEach((allowance) => {
      postData.append("fixed_salary_allowance", allowance);
    });
    const selectedDeduction = selectedDeductions.map((items) => items);
    selectedDeduction.forEach((allowance) => {
      postData.append("fixed_salary_deductions", allowance);
    });
    // postData.append("fixed_salary_deductions", selectedDeduction);
    postData.append("organization", hrmsOrgId);
    try {
      const res = await postCTCTemplate(postData);
      setTemplateId(res.id);
      // setActivePage((prevPage) => Math.min(stepsData.length - 1, prevPage + 1));
      toast.success("CTC Template created successfully");
      navigate("/admin/hrms/ctc/CTC-Template");
    } catch (error) {
      console.log(error);
    }
  };

  const handleStepClick = (stepId) => {
    setActivePage(stepId);
  };
  const handleBack = () => {
    setActivePage((prevPage) => Math.max(0, prevPage - 1));
  };

  const handleNext = () => {
    setActivePage((prevPage) => Math.min(stepsData.length - 1, prevPage + 1));
  };

  return (
    <div className="flex ml-20">
      <div className="flex ">
        <AdminHRMS />
        <div className="mt-10 mx-2 border rounded-xl max-w-96 w-80 max-h-80 h-80">
          <div className=" p-4 ">
            <h2 className="text-xl font-semibold flex items-center border-b">
              <FaChevronRight className="h-4 w-4 mr-2" />
              Steps
            </h2>
          </div>
          <div className="bg-white ">
            {stepsData.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center p-4 ${
                  index !== stepsData.length - 1 ? "border-b" : ""
                } cursor-pointer`}
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={`rounded-full p-2 mr-4 ${
                    activePage === step.id ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {React.cloneElement(step.icon, {
                    className: `w-6 h-6 ${
                      activePage === step.id ? "text-blue-500" : "text-gray-400"
                    }`,
                  })}
                </div>
                <span
                  className={`${
                    activePage === step.id ? "text-black" : "text-gray-400"
                  } font-medium`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {activePage === 0 && (
          <div className="my-10 p-2 w-full">
            <p className="font-bold mb-4">General Settings</p>
            <div className="flex flex-col w-96">
              <label htmlFor="" className="font-medium">
                Please enter the label for the CTC Template{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="m-2 border p-2 border-gray-300 w-full rounded-md"
                placeholder="CTC Template Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          </div>
        )}
        {activePage === 1 && (
          <ComponentCTCTemplate
            onBack={handleBack}
            onNext={handleNext}
            tempId={templateId}
            selectedDeductions={selectedDeductions}
            selectedOptions={selectedOptions}
            setSelectedDeductions={setSelectedDeductions}
            setSelectedOptions={setSelectedOptions}
          />
        )}
        {activePage === 2 && <Restrictions tempId={templateId} />}
        <div className="flex justify-center m-4 gap-2">
          <button
            onClick={handleCancel}
            className="bg-red-400 text-white hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
          >
            Cancel
          </button>
          {activePage !== 0 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
          {activePage !== 2 ? (
            <button
              onClick={handleNext}
              style={{ background: themeColor }}
              className="bg-black text-white hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleAddTemplate}
              style={{ background: themeColor }}
              className="bg-black text-white hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
            >
              Proceed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTCGeneralSetting;
