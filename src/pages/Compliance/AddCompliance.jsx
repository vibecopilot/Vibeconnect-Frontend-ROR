import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { Link, useNavigate } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import {
  getComplianceTags,
  getFilteredUsers,
  postComplianceCategoryConfiguration,
  postComplianceConfiguration,
} from "../../api";
import Select from "react-select";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
const AddCompliance = () => {
  const [complianceFor, setComplianceFor] = useState([
    {
      category: {},
    },
  ]);
  const [formData, setFormData] = useState({
    complianceName: "",
    startDate: "",
    endDate: "",
    targetDays: "",
    frequency: "",
    riskLevel: "",
    auditorId: "",
    vendorId: "",
    priority: "",
    description: "",
    attachments: [],
  });

  const themeColor = useSelector((state) => state.theme.color);

  const handleAddComplianceFor = () => {
    setComplianceFor([
      ...complianceFor,
      {
        category: {},
      },
    ]);
  };

  const handleDeleteComplianceFor = (indexToRemove) => {
    setComplianceFor(
      complianceFor.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const siteId = getItemInLocalStorage("SITEID");

  const navigate = useNavigate()
  const handleCreateCompliance = async (e) => {
    e.preventDefault();
    const sendData = new FormData();
    sendData.append("compliance_config[name]", formData.complianceName);
    sendData.append("compliance_config[frequency]", formData.frequency);
    sendData.append("compliance_config[due_in_days]", formData.targetDays);
    sendData.append("compliance_config[priority]", formData.priority);
    sendData.append("compliance_config[description]", formData.description);
    sendData.append("compliance_config[start_date]", formData.startDate);
    sendData.append("compliance_config[end_date]", formData.endDate);
    sendData.append("compliance_config[site_id]", siteId);
    sendData.append("compliance_config[assign_to_id]", selectedVendor.value);
    sendData.append("compliance_config[reviewer_id]", selectedAuditor.value);
    formData.attachments.forEach((file, index) => {
      sendData.append("attachments[]", file);
    });
    try {
      const res = await postComplianceConfiguration(sendData);
      const payload = {
        compliance_config_tags: complianceFor.map((compliance) => ({
          compliance_tag_id: compliance.category,
          compliance_config_id: res?.data.id,
        })),
      };

      try {
        const res = await postComplianceCategoryConfiguration(payload);
      } catch (error) {
        console.log(error);
      }
      toast.success("Compliance configured successfully");
      navigate("/compliance")
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = (option, index) => {
    setComplianceFor((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, category: option.value } : item
      )
    );
  };
  const [categories, setCategories] = useState([]);
  const fetchComplianceCat = async () => {
    try {
      const res = await getComplianceTags("complianceCategory");
      const allCategories = res?.data?.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      setCategories(allCategories);
    } catch (error) {
      console.log(error);
    }
  };
  const [vendors, setVendors] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const fetchVendors = async () => {
    try {
      const res = await getFilteredUsers("vendor");
      const filteredUsers = res?.data?.filter(
        (user) => user.user_type === "vendor"
      );
      const allVendors = filteredUsers?.map((vendor) => ({
        label: `${vendor.firstname} ${vendor.lastname}`,
        value: vendor.id,
      }));
      setVendors(allVendors);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAuditors = async () => {
    try {
      const res = await getFilteredUsers("auditor");
      const filteredUsers = res?.data?.filter(
        (user) => user.user_type === "auditor"
      );
      const allAuditors = filteredUsers?.map((auditor) => ({
        label: `${auditor.firstname} ${auditor.lastname}`,
        value: auditor.id
      }));
      setAuditors(allAuditors);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchVendors();
    fetchAuditors();
    fetchComplianceCat();
  }, []);

  const handleFileChange = (files, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    });
    console.log(fieldName);
  };
  const [selectedAuditor, setSelectedAuditor] = useState({});
  const [selectedVendor, setSelectedVendor] = useState({});
  const handleAuditorChange = (option) => {
    console.log(option)
    setSelectedAuditor(option);
  };
  const handleVendorChange = (option) => {
    setSelectedVendor(option);
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
          <form onSubmit={handleCreateCompliance} className="space-y-4 my-4">
            <div className="grid md:grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-700 font-medium">
                  Compliance Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Enter name"
                  required
                  value={formData.complianceName}
                  onChange={handleChange}
                  name="complianceName"
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
                  value={formData.startDate}
                  onChange={handleChange}
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
                  value={formData.endDate}
                  onChange={handleChange}
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
                  name="targetDays"
                  placeholder="1 day"
                  value={formData.targetDays}
                  onChange={handleChange}
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
                  value={formData.frequency}
                  onChange={handleChange}
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select Frequency</option>
                  {/* <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option> */}
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half_yearly">Half Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              {/* <div>
                <label
                  htmlFor="riskLevel"
                  className="block text-gray-700 font-medium"
                >
                  Risk Level
                </label>
                <select
                  id="riskLevel"
                  name="riskLevel"
                  value={formData.riskLevel}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md w-full"
                >
                  <option value="">Select risk level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div> */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Assigned To Auditor
                </label>
                <Select
                  options={auditors}
                  onChange={handleAuditorChange}
                  noOptionsMessage={() => "No Auditors available"}
                  placeholder="Select Auditors"
                  maxMenuHeight={300}
                  className="z-50 w-full text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Assigned To Vendor
                </label>
                <Select
                  options={vendors}
                  onChange={handleVendorChange}
                  noOptionsMessage={() => "No vendor available"}
                  placeholder="Select Vendor"
                  maxMenuHeight={200}
                  className="z-20 w-full text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Priority
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.priority}
                  onChange={handleChange}
                  name="priority"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
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
                  <div className="col-span-2 z-10">
                    <Select
                      options={categories}
                      onChange={(option) => handleCategoryChange(option, index)}
                      // value={
                      //   categories.find(
                      //     (cat) => cat.value === compliance.category
                      //   ) || null
                      // }
                      noOptionsMessage={() => "No Categories available"}
                      placeholder="Select Category"
                      maxMenuHeight={300}
                      className="z-10 w-full text-black"
                    />
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
                value={formData.description}
                onChange={handleChange}
                name="description"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="documents"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Documents
              </label>
              <FileInputBox
                handleChange={(files) => handleFileChange(files, "attachments")}
                fieldName={"attachments"}
                isMulti={true}
              />
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
