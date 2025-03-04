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
  deletePermitSubActivity,
  editPermitSubActivity,
  getPermitActivity,
  getPermitSubActivity,
  getPermitSubActivityDetails,
  getPermitType,
  postPermitSubActivity,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { FaTimes, FaTrash } from "react-icons/fa";

const PermitSubActivityTable = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");
  const [subactivityData, setSubActivityData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [update, setupdate] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (categoryId) => {
    setEditingCategoryId(categoryId);
    fetchCategoryDetails(categoryId);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [formData, setFormData] = useState({
    permit_type_id: "",
    permit_activity_setup_id: "",
    name: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const fetchCategoryDetails = async (categoryId) => {
    try {
      const categoryDetails = await getPermitSubActivityDetails(categoryId);
      setFormData({
        name: categoryDetails.data.name,
        permit_type_id: categoryDetails.data.permit_type_id,
        permit_activity_setup_id: categoryDetails.data.permit_activity_setup_id,
      });
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };
  const DeletePermitSubActivity = async (categoryId) => {
    try {
      const categoryDetails = await deletePermitSubActivity(categoryId);
      toast.success("Permit SubActivity Deleted Successfully");
      setupdate(true);
    } catch (error) {
      console.error("Error Not Deleted:", error);
    }
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
        const invResp = await getPermitSubActivity();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setSubActivityData(sortedInvData);
        setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, [update]);
  const column = [
    { name: "Permit Type", selector: (row) => row.permit_type, sortable: true },
    {
      name: "Permit Activity",
      selector: (row) => row.permit_activity_setup,
      sortable: true,
    },
    {
      name: "Permit Sub Activity",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => DeletePermitSubActivity(row.id)}>
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
    sendData.append(
      "permit_sub_activity[permit_type_id]",
      formData.permit_type_id
    );
    sendData.append(
      "permit_sub_activity[permit_activity_setup_id]",
      formData.permit_activity_setup_id
    );
    sendData.append("permit_sub_activity[name]", formData.name);
    sendData.append("permit_sub_activity[site_id]", siteId);

    try {
      const resp = await postPermitSubActivity(sendData);
      setupdate(true);
      toast.success("Permit SubActivity Created Successfully");
      setFormData({
        permit_type_id: "",
        permit_activity_setup_id: "",
        name: "",
      });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async () => {
    const sendData = new FormData();
    sendData.append(
      "permit_sub_activity[permit_type_id]",
      formData.permit_type_id
    );
    sendData.append(
      "permit_sub_activity[permit_activity_setup_id]",
      formData.permit_activity_setup_id
    );
    sendData.append("permit_sub_activity[name]", formData.name);
    sendData.append("permit_sub_activity[site_id]", siteId);

    try {
      const resp = await editPermitSubActivity(editingCategoryId, sendData);
      setupdate(true);
      setIsModalOpen(false);
      toast.success("Permit SubActivity Updated Successfully");

      setFormData({
        permit_type_id: "",
        permit_activity_setup_id: "",
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
          <div className="flex gap-2 items-center my-2">
            <select
              name="permit_type_id"
              id=""
              onChange={handleChange}
              value={formData.permit_type_id}
              className="border p-2 border-gray-300 rounded-md w-full"
            >
              <option value="">Select Permit Type</option>
              {filteredData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="permit_activity_setup_id"
              id="permit_activity_setup_id"
              onChange={handleChange}
              value={formData.permit_activity_setup_id}
              className="border p-2 border-gray-300 rounded-md w-full"
            >
              <option value="">Select Activity</option>
              {activityData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="name"
              placeholder="Enter Sub Activity "
              onChange={handleChange}
              value={formData.name}
              className="border p-2 border-gray-300 rounded-md w-full"
            />
            <button
              onClick={handleSubmit}
              className="bg-green-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
            >
              <PiPlusCircle size={20} />
              Submit
            </button>
            <button
              className="bg-red-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
              onClick={() => setShowAdd(false)}
            >
              <MdClose size={20} />
              Cancel
            </button>
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
          data={subactivityData}
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
              <h2 className="text-xl font-semibold mb-4">
                Edit Permit Sub Activity
              </h2>
              <div className="flex flex-col gap-4">
                <select
                  name="permit_type_id"
                  id=""
                  onChange={handleChange}
                  value={formData.permit_type_id}
                  className="border p-2 border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Permit Type</option>
                  {filteredData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select
                  name="permit_activity_setup_id"
                  id="permit_activity_setup_id"
                  onChange={handleChange}
                  value={formData.permit_activity_setup_id}
                  className="border p-2 border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Activity</option>
                  {activityData.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter Sub Activity "
                  onChange={handleChange}
                  value={formData.name}
                  className="border p-2 border-gray-300 rounded-md w-full"
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

export default PermitSubActivityTable;
