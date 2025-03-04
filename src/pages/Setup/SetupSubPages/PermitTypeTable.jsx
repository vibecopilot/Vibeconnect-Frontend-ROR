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
import { FaTimes, FaTrash } from "react-icons/fa";
import {
  deletePermitType,
  editPermitType,
  getPermitType,
  getPermitTypeDetails,
  postPermitType,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";
//import Modal from "../containers/modals/Modal";

const PermitTypeTable = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const siteId = getItemInLocalStorage("SITEID");

  const [update, setupdate] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const openModal = (categoryId) => {
    setEditingCategoryId(categoryId);
    fetchCategoryDetails(categoryId);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [filteredData, setFilteredData] = useState([]);
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
  }, [update]);
  const fetchCategoryDetails = async (categoryId) => {
    try {
      const categoryDetails = await getPermitTypeDetails(categoryId);
      setFormData({
        name: categoryDetails.data.name,
      });
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };
  const DeletePermittype = async (categoryId) => {
    try {
      const categoryDetails = await deletePermitType(categoryId);
      toast.success("Permit Type Deleted Successfully");
      setupdate(true);
    } catch (error) {
      console.error("Error Not Deleted:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    const sendData = new FormData();
    sendData.append("permit_type[name]", formData.name);
    sendData.append("permit_type[site_id]", siteId);

    try {
      const resp = await postPermitType(sendData);
      setupdate(true);
      toast.success("Permit Type Created Successfully");
      setFormData({ name: "" });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async () => {
    const sendData = new FormData();
    sendData.append("permit_type[name]", formData.name);
    sendData.append("permit_type[site_id]", siteId);

    try {
      const resp = await editPermitType(editingCategoryId, sendData);
      setupdate(true);
      toast.success("Permit Type Update Successfully");
      setIsModalOpen(false);
      setFormData({ name: "" });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };
  const column = [
    { name: "Permit Type", selector: (row) => row.name, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => openModal(row.id)}>
            <BiEdit size={15} />
          </button>
          <button onClick={() => DeletePermittype(row.id)}>
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const customStyle = {
    headRow: {
      style: {
        backgroundColor: themeColor,
        color: "white",

        fontSize: "14px",
      },
    },
  };
  document.title = `Permit Setup - Vibe Connect`;
  
  return (
    <section className="flex ">
      {/* <Navbar /> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        {showAdd && (
          <div className="flex gap-2 items-center my-2">
            <input
              type="text"
              placeholder="Enter permit Type"
              name="name"
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
          data={filteredData}
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
              <h2 className="text-xl font-semibold mb-4">Edit Permit Type</h2>
              <div className="flex flex-col gap-4">
                <div>
                  {/* <label className="block text-gray-700 text-medium font-bold mb-2" htmlFor="category-name">
                        Cuisine
                        </label> */}
                  <input
                    id="category-name"
                    name="name"
                    className="border p-1 px-4 w-full border-gray-500 rounded-md"
                    onChange={handleChange}
                    value={formData.name}
                    type="text"
                    placeholder="Enter Permit Type"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <button
                    className="bg-green-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
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

export default PermitTypeTable;
