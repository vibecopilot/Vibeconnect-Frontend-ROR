import React, { useEffect, useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../../components/table/Table";
import { ImEye } from "react-icons/im";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import {
  getPermitType,
  getPermitActivity,
  getPermitSubActivity,
  getHazardCategory,
  getHazardCategoryDetails,
  editHazardCategory,
  deleteHazardCategory,
  postPermitRisks,
  getPermitRisks,
  getPermitRisksDetails,
  editPermitRisks,
  deletePermitRisks,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { FaTimes, FaTrash } from "react-icons/fa";

const PermitRiskTable = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");
  const [showAdd, setShowAdd] = useState(false);

  const [update, setupdate] = useState(false);
  const [subactivityData, setSubActivityData] = useState([]);
  const [hazardData, setHazardData] = useState([]);
  const [riskData, setRiskData] = useState([]);

  const [activityData, setActivityData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const openModal = (categoryId) => {
    setEditingCategoryId(categoryId);
    fetchCategoryDetails(categoryId);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [formData, setFormData] = useState({
    permit_type_id: "",
    activity_id: "",
    sub_activity_id: "",
    hazard_category_id: "",
    name: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getPermitType();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setFilteredData(sortedInvData);
        setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, []);

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getPermitActivity();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setActivityData(sortedInvData);
        // setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, []);
  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getPermitSubActivity();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setSubActivityData(sortedInvData);
        //  setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, []);
  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getHazardCategory();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setHazardData(sortedInvData);
        setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, []);
  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getPermitRisks();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setRiskData(sortedInvData);
        setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, [update]);
  const fetchCategoryDetails = async (categoryId) => {
    try {
      const categoryDetails = await getPermitRisksDetails(categoryId);
      setFormData({
        permit_type_id: categoryDetails.data.permit_type_id,
        activity_id: categoryDetails.data.activity_id,
        hazard_category_id: categoryDetails.data.hazard_category_id,
        sub_activity_id: categoryDetails.data.sub_activity_id,
        name: categoryDetails.data.risk_name,
      });
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };
  const DeletePermitRisks = async (categoryId) => {
    try {
      const categoryDetails = await deletePermitRisks(categoryId);
      toast.success("Permit Hazard Category Deleted Successfully");
      setupdate(true);
    } catch (error) {
      console.error("Error Not Deleted:", error);
    }
  };
  const column = [
    {
      name: "Permit Type",
      selector: (row) => row.permit_type_name,
      sortable: true,
    },
    {
      name: "Permit Activity",
      selector: (row) => row.activity_name,
      sortable: true,
    },
    {
      name: "Permit Sub Activity",
      selector: (row) => row.sub_activity_name,
      sortable: true,
    },

    {
      name: "Permit Hazard Category",
      selector: (row) => row.hazard_category_name,
      sortable: true,
    },
    {
      name: "Permit Risk",
      selector: (row) => row.risk_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => DeletePermitRisks(row.id)}>
            <FaTrash size={15} />
          </button>
          <button onClick={() => openModal(row.id)}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = async () => {
    const sendData = new FormData();
    sendData.append("permit_risk[permit_type_id]", formData.permit_type_id);
    sendData.append("permit_risk[activity_id]", formData.activity_id);
    sendData.append("permit_risk[sub_activity_id]", formData.sub_activity_id);
    sendData.append(
      "permit_risk[hazard_category_id]",
      formData.hazard_category_id
    );

    sendData.append("permit_risk[risk_name]", formData.name);
    sendData.append("permit_risk[site_id]", siteId);

    try {
      const resp = await postPermitRisks(sendData);
      setupdate(true);
      toast.success("Permit Risk Created Successfully");
      setFormData({
        permit_type_id: "",
        activity_id: "",
        sub_activity_id: "",
        name: "",
      });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async () => {
    const sendData = new FormData();
    sendData.append("permit_risk[permit_type_id]", formData.permit_type_id);
    sendData.append("permit_risk[activity_id]", formData.activity_id);
    sendData.append("permit_risk[sub_activity_id]", formData.sub_activity_id);
    sendData.append(
      "permit_risk[hazard_category_id]",
      formData.hazard_category_id
    );

    sendData.append("permit_risk[risk_name]", formData.name);
    sendData.append("permit_risk[site_id]", siteId);

    try {
      const resp = await editPermitRisks(editingCategoryId, sendData);
      setupdate(true);
      setIsModalOpen(false);
      toast.success("Permit Risks Updated Successfully");
      setFormData({
        permit_type_id: "",
        activity_id: "",
        sub_activity_id: "",
        hazard_category_id: "",
        name: "",
      });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  document.title = `Permit Setup - Vibe Connect`;

  return (
    <section className="flex ">
      {/* <Navbar /> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {showAdd && (
          <div className="grid grid-cols-4 gap-2 items-center my-2">
            <select
              name="permit_type_id"
              id=""
              className="border p-2 border-gray-300 rounded-md w-full"
              onChange={handleChange}
              value={formData.permit_type_id}
            >
              <option value="">Select Permit Type</option>
              {filteredData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="activity_id"
              id=""
              className="border p-2 border-gray-300 rounded-md w-full"
              onChange={handleChange}
              value={formData.activity_id}
            >
              <option value="">Select Activity</option>
              {activityData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="sub_activity_id"
              id=""
              className="border p-2 border-gray-300 rounded-md w-full"
              onChange={handleChange}
              value={formData.sub_activity_id}
            >
              <option value="">Select Sub Activity</option>
              {subactivityData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="hazard_category_id"
              id=""
              className="border p-2 border-gray-300 rounded-md w-full"
              onChange={handleChange}
              value={formData.hazard_category_id}
            >
              <option value="">Select Hazard Category</option>
              {hazardData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="name"
              placeholder="Enter Permit Risk "
              className="border p-2 border-gray-300 rounded-md w-full"
              onChange={handleChange}
              value={formData.name}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                className="bg-green-400 text-white rounded-md flex items-center justify-center gap-2 p-2 font-medium w-full"
              >
                <PiPlusCircle size={20} />
                Submit
              </button>
              <button
                className="bg-red-400 text-white rounded-md flex items-center justify-center gap-2 p-2 font-medium w-full"
                onClick={() => setShowAdd(false)}
              >
                <MdClose size={20} />
                Cancel
              </button>
            </div>
          </div>
        )}
        {!showAdd && (
          <div className="flex justify-end my-2">
            <button
              className="bg-green-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
              onClick={() => setShowAdd(true)}
            >
              <PiPlusCircle size={20} />
              Add
            </button>
          </div>
        )}
        <Table
          columns={column}
          data={riskData}
          // customStyles={customStyle}
          responsive
          fixedHeader
          fixedHeaderScrollHeight="500px"
          pagination
          selectableRowsHighlight
          highlightOnHover
          omitColumn={column}
        />
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black bg-opacity-90"
              onClick={closeModal}
            ></div>
            <div className="bg-white w-96  rounded-lg shadow-lg p-4 relative z-10">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-semibold mb-4">Edit Permit Risk</h2>
              <div className="flex flex-col gap-4">
                <select
                  name="permit_type_id"
                  id=""
                  className="border p-2 border-gray-300 rounded-md w-full"
                  onChange={handleChange}
                  value={formData.permit_type_id}
                >
                  <option value="">Select Permit Type</option>
                  {filteredData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  name="activity_id"
                  id=""
                  className="border p-2 border-gray-300 rounded-md w-full"
                  onChange={handleChange}
                  value={formData.activity_id}
                >
                  <option value="">Select Activity</option>
                  {activityData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  name="sub_activity_id"
                  id=""
                  className="border p-2 border-gray-300 rounded-md w-full"
                  onChange={handleChange}
                  value={formData.sub_activity_id}
                >
                  <option value="">Select Sub Activity</option>
                  {subactivityData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  name="hazard_category_id"
                  id=""
                  className="border p-2 border-gray-300 rounded-md w-full"
                  onChange={handleChange}
                  value={formData.hazard_category_id}
                >
                  <option value="">Select Hazard Category</option>
                  {hazardData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Permit Risks "
                  className="border p-2 border-gray-300 rounded-md w-full"
                  onChange={handleChange}
                  value={formData.name}
                />

                <div className="flex items-center justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md "
                    type="button"
                    style={{ background: themeColor }}
                    onClick={handleEdit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PermitRiskTable;
