import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminHRMS from "./AdminHrms";
import { useNavigate, useParams } from "react-router-dom";
import { FaChevronRight, FaProjectDiagram, FaWrench } from "react-icons/fa";
import { getItemInLocalStorage } from "../../utils/localStorage";
import {
  getHrmsFixedDeduction,
  getHrmsFixedAllowance,
  getAvailableSites,
  getHrmsCtcTemplateonId,
  updateHrmsCtcTemplate
} from "../../api";
import toast from "react-hot-toast";
import Select from 'react-select';

const CTCGeneralSettingEdit = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const navigate = useNavigate();
  const { id } = useParams();
   
  const [availableSites, setAvailableSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);

  const stepsData = [
    { id: 0, title: "General Settings", icon: <FaWrench /> },
    { id: 1, title: "Tax and Statutory Setting", icon: <FaProjectDiagram /> },
  ];

  const [activePage, setActivePage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [template_name, setTemplateName] = useState("");

  // State for organized components and deductions
  const [fixedComponents, setFixedComponents] = useState([]);
  const [variableComponents, setVariableComponents] = useState([]);
  const [fixedDeductions, setFixedDeductions] = useState([]);
  const [variableDeductions, setVariableDeductions] = useState([]);

  // State for selected items
  const [selectedFixedComps, setSelectedFixedComps] = useState([]);
  const [selectedVariableComps, setSelectedVariableComps] = useState([]);
  const [selectedFixedDeds, setSelectedFixedDeds] = useState([]);
  const [selectedVariableDeds, setSelectedVariableDeds] = useState([]);

  // Derived state for submission
  const selectedComponents = [...selectedFixedComps, ...selectedVariableComps];
  const selectedDeductions = [...selectedFixedDeds, ...selectedVariableDeds];

  // Fetch template data on mount
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setIsLoading(true);
        const templateData = await getHrmsCtcTemplateonId(id);
        
        if (templateData) {
          setTemplateName(templateData.template_name);
          setSelectedSites(templateData.associated_sites.map(site => ({
            value: site.id,
            label: site.site_name
          })));
          
          // Set selected components and deductions
          setSelectedFixedComps(templateData.fixed_components.map(c => c.id));
          setSelectedVariableComps(templateData.variable_components.map(c => c.id));
          setSelectedFixedDeds(templateData.fixed_deductions.map(d => d.id));
          setSelectedVariableDeds(templateData.variable_deductions.map(d => d.id));
        }
      } catch (error) {
        console.error("Error fetching template data:", error);
        // toast.error("Failed to load template data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateData();
  }, [id]);

  // Fetch available sites
  useEffect(() => {
    const fetchAvailableSitesData = async () => {
      try {
        const sitesData = await getAvailableSites(hrmsOrgId);
        if (sitesData) {
          const formattedSites = sitesData.map(site => ({
            value: site.id,
            label: site.site_name
          }));
          setAvailableSites(formattedSites);
        }
      } catch (error) {
        console.error("Error fetching available sites:", error);
        toast.error("Failed to load available sites");
      }
    };

    fetchAvailableSitesData();
  }, [hrmsOrgId]);

  useEffect(() => {
    if (activePage === 1 && hrmsOrgId) {
      fetchComponentsAndDeductions();
    }
  }, [activePage, hrmsOrgId]);

  const fetchComponentsAndDeductions = async () => {
    try {
      setIsLoading(true);

      // Fetch and organize components
      const componentsRes = await getHrmsFixedAllowance(hrmsOrgId);
      const fixedComps = componentsRes.filter(comp => comp.component_type === "fixed");
      const variableComps = componentsRes.filter(comp => comp.component_type === "variable");
      setFixedComponents(fixedComps);
      setVariableComponents(variableComps);

      // Fetch and organize deductions
      const deductionsRes = await getHrmsFixedDeduction(hrmsOrgId);
      const fixedDeds = deductionsRes.filter(ded => ded.deduction_type === "fixed");
      const variableDeds = deductionsRes.filter(ded => ded.deduction_type === "variable");
      setFixedDeductions(fixedDeds);
      setVariableDeductions(variableDeds);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load components and deductions");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate("/admin/hrms/ctc/CTC-Template");
  };

  const handleAddTemplate = async () => {
    if (!template_name) {
      return toast.error("Please Enter Template Label");
    }
    handleNext();
  };

  const handleStepClick = (stepId) => {
    if (stepId === 1 && !template_name) {
      return toast.error("Please complete General Settings first");
    }
    setActivePage(stepId);
  };

  const handleBack = () => {
    setActivePage((prevPage) => Math.max(0, prevPage - 1));
  };

  const handleNext = () => {
    setActivePage((prevPage) => Math.min(stepsData.length - 1, prevPage + 1));
  };

  const handleUpdateTemplate = async () => {
    if (!template_name || (!selectedComponents.length && !selectedDeductions.length)) {
      return toast.error("Please fill all required fields");
    }

    try {
      setIsLoading(true);
      
      // Extract just the IDs from selected sites
      const associatedSiteIds = selectedSites.map(site => site.value);
      
      const postData = {
        template_name,
        organization: hrmsOrgId,
        associated: associatedSiteIds,
        components: selectedComponents.map(Number),
        deductions: selectedDeductions.map(Number)
      };

      const res = await updateHrmsCtcTemplate(id, postData);
      
      if (res && res.id) {
        toast.success("CTC template updated successfully");
        navigate("/admin/hrms/ctc/CTC-Template");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error(error.message || "Failed to update template");
    } finally {
      setIsLoading(false);
    }
  };

  const ComponentSelectionPanel = ({
    fixedComponents,
    variableComponents,
    fixedDeductions,
    variableDeductions,
    selectedFixedComps,
    selectedVariableComps,
    selectedFixedDeds,
    selectedVariableDeds,
    onFixedCompChange,
    onVariableCompChange,
    onFixedDedChange,
    onVariableDedChange
  }) => {

    const formatOptionLabel = ({value , label} ,{context}) =>{
      let item;
      if(context === 'fixedComp'){
        item = fixedComponents.find(c => c.id === value);
      }
      else if(context === 'variableComp'){
        item = variableComponents.find(c => c.id === value);
      }
      else if(context === 'fixedDed'){
        item = fixedDeductions.find
      }
    }
    // Function to handle selection changes with toggle behavior
    const handleSelectionChange = (e, currentSelection, setSelection) => {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      const clickedOption = selectedOptions[selectedOptions.length - 1];
      
      if (currentSelection.includes(clickedOption)) {
        // Remove if already selected
        setSelection(currentSelection.filter(item => item !== clickedOption));
      } else {
        // Add if not selected
        setSelection([...currentSelection, clickedOption]);
      }
    };

    // Function to remove selected item
    const handleRemoveItem = (id, setSelection) => {
      setSelection(prev => prev.filter(item => item !== id));
    };

    return (
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Fixed Components */}
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-700 mb-2">Fixed Allowance</h3>
            <select
              multiple
              className="w-full p-2 border rounded-md h-40"
              value={selectedFixedComps}
              onChange={(e) => handleSelectionChange(e, selectedFixedComps, onFixedCompChange)}
            >
              {fixedComponents.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {selectedFixedComps.length} selected (Click to toggle selection)
            </p>
          </div>

          {/* Variable Components */}
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-700 mb-2">Variable Allowance</h3>
            <select
              multiple
              className="w-full p-2 border rounded-md h-40"
              value={selectedVariableComps}
              onChange={(e) => handleSelectionChange(e, selectedVariableComps, onVariableCompChange)}
            >
              {variableComponents.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {selectedVariableComps.length} selected (Click to toggle selection)
            </p>
          </div>

          {/* Fixed Deductions */}
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-700 mb-2">Fixed Deductions</h3>
            <select
              multiple
              className="w-full p-2 border rounded-md h-40"
              value={selectedFixedDeds}
              onChange={(e) => handleSelectionChange(e, selectedFixedDeds, onFixedDedChange)}
            >
              {fixedDeductions.map((deduction) => (
                <option key={deduction.id} value={deduction.id}>
                  {deduction.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {selectedFixedDeds.length} selected (Click to toggle selection)
            </p>
          </div>

          {/* Variable Deductions */}
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-700 mb-2">Variable Deductions</h3>
            <select
              multiple
              className="w-full p-2 border rounded-md h-40"
              value={selectedVariableDeds}
              onChange={(e) => handleSelectionChange(e, selectedVariableDeds, onVariableDedChange)}
            >
              {variableDeductions.map((deduction) => (
                <option key={deduction.id} value={deduction.id}>
                  {deduction.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {selectedVariableDeds.length} selected (Click to toggle selection)
            </p>
          </div>
        </div>

        {/* Selected Items Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-2xl mb-3">Selected Items Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Components Summary */}
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Components ({selectedComponents.length})</h5>
              {selectedComponents.length > 0 ? (
                <ul className="space-y-1">
                  {selectedFixedComps.map(id => {
                    const comp = fixedComponents.find(c => c.id == id);
                    return (
                      <li key={`fixed-${id}`} className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">Fixed</span>
                        {comp?.name || `ID: ${id}`}
                        <button 
                          onClick={() => handleRemoveItem(id, onFixedCompChange)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                  {selectedVariableComps.map(id => {
                    const comp = variableComponents.find(c => c.id == id);
                    return (
                      <li key={`variable-${id}`} className="flex items-center">
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2">Variable</span>
                        {comp?.name || `ID: ${id}`}
                        <button 
                          onClick={() => handleRemoveItem(id, onVariableCompChange)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">No components selected</p>
              )}
            </div>

            {/* Deductions Summary */}
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Deductions ({selectedDeductions.length})</h5>
              {selectedDeductions.length > 0 ? (
                <ul className="space-y-1">
                  {selectedFixedDeds.map(id => {
                    const ded = fixedDeductions.find(d => d.id == id);
                    return (
                      <li key={`fixed-${id}`} className="flex items-center">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">Fixed</span>
                        {ded?.name || `ID: ${id}`}
                        <button 
                          onClick={() => handleRemoveItem(id, onFixedDedChange)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                  {selectedVariableDeds.map(id => {
                    const ded = variableDeductions.find(d => d.id == id);
                    return (
                      <li key={`variable-${id}`} className="flex items-center">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2">Variable</span>
                        {ded?.name || `ID: ${id}`}
                        <button 
                          onClick={() => handleRemoveItem(id, onVariableDedChange)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">No deductions selected</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-4"
            disabled={isLoading}
          >
            Back
          </button>
          <button
            onClick={handleUpdateTemplate}
            style={{ background: themeColor }}
            className="px-4 py-2 text-white rounded hover:opacity-90"
            disabled={isLoading || (!selectedComponents.length && !selectedDeductions.length)}
          >
            {isLoading ? "Updating..." : "Update Template"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex ml-20">
      <div className="flex">
        <AdminHRMS />
        <div className="mt-10 mx-2 border rounded-xl max-w-96 w-80 max-h-80 h-80">
          <div className="p-4">
            <h2 className="text-xl font-semibold flex items-center border-b">
              <FaChevronRight className="h-4 w-4 mr-2" />
              Steps
            </h2>
          </div>
          <div className="bg-white">
            {stepsData.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center p-4 ${
                  index !== stepsData.length - 1 ? "border-b" : ""
                } cursor-pointer hover:bg-gray-50`}
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

      <div className="flex flex-col w-full" style={{ minHeight: "calc(100vh - 80px)" }}>
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
                value={template_name}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-96">
              <label htmlFor="" className="font-medium">
                Associate Sites{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                options={availableSites}
                value={selectedSites}
                onChange={setSelectedSites}
                className="m-2 basic-multi-select"
                classNamePrefix="select"
                placeholder="Select sites..."
              />
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleCancel}
                className="bg-red-400 text-white hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTemplate}
                style={{ background: themeColor }}
                className="bg-black text-white hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
                disabled={isLoading || !template_name || selectedSites.length === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activePage === 1 && (
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading components and deductions...</p>
              </div>
            ) : (
              <ComponentSelectionPanel
                fixedComponents={fixedComponents}
                variableComponents={variableComponents}
                fixedDeductions={fixedDeductions}
                variableDeductions={variableDeductions}
                selectedFixedComps={selectedFixedComps}
                selectedVariableComps={selectedVariableComps}
                selectedFixedDeds={selectedFixedDeds}
                selectedVariableDeds={selectedVariableDeds}
                onFixedCompChange={setSelectedFixedComps}
                onVariableCompChange={setSelectedVariableComps}
                onFixedDedChange={setSelectedFixedDeds}
                onVariableDedChange={setSelectedVariableDeds}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CTCGeneralSettingEdit;