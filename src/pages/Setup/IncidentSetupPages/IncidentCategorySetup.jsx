import React, { useEffect, useState } from "react";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { RiDeleteBinLine } from "react-icons/ri";
import IncidentSetCategoryModal from "../../../containers/modals/IncidentSetupModal.jsx/IncidentSetupCatModal";
import { PiPlusCircle } from "react-icons/pi";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import {
  deleteIncidentTags,
  getIncidentTags,
  postIncidentTags,
} from "../../../api";
import toast from "react-hot-toast";

const IncidentCategorySetup = () => {
  const [modal, showModal] = useState(false);
  const column = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    {
      name: "action",

      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditModal(row.id)}
            className="text-blue-500"
          >
            <BiEdit size={15} />
          </button>

          <button
            className="text-red-500"
            onClick={() => handleDeleteCategory(row.id)}
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];
  const handleEditModal = async (id) => {
    setCatId(id);
    showModal(true);
  };
  const [CatId, setCatId] = useState("");
  const handleDeleteCategory = async (id) => {
    try {
      await deleteIncidentTags(id);
      toast.success("Category deleted successfully");
      fetchIncidentCategory();
    } catch (error) {
      console.log(error);
    }
  };

  const [addCategory, setAddCategory] = useState(false);
  const [cat, SetCat] = useState("");
  const companyId = getItemInLocalStorage("COMPANYID");
  const handleAddCategory = async () => {
    const payload = {
      name: cat,
      active: true,
      // "parent_id": null,
      tag_type: "IncidentCategory",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
      // "comment": "Covers all types of plumbing problems."
    };
    try {
      const res = await postIncidentTags(payload);
      toast.success("Incident Category Created successfully!");
      fetchIncidentCategory();
      SetCat("");
      setAddCategory(false);
    } catch (error) {
      console.log(error);
    }
  };
  const [categories, setCategories] = useState([]);
  const fetchIncidentCategory = async () => {
    try {
      const res = await getIncidentTags("IncidentCategory");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchIncidentCategory();
  }, []);
  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addCategory && (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Category"
                className="border p-2 w-full border-gray-300 rounded-lg"
                value={cat}
                onChange={(e) => SetCat(e.target.value)}
              />
              <button
                className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md"
                onClick={handleAddCategory}
              >
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                onClick={() => setAddCategory(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          )}
          {!addCategory && (
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddCategory(true)}
            >
              <PiPlusCircle /> Add
            </button>
          )}
        </div>
        <div>
          <Table columns={column} data={categories} isPagination={true} />
        </div>
      </div>
      {modal && (
        <IncidentSetCategoryModal
          onclose={() => showModal(false)}
          catId={CatId}
          fetchIncidentCategory={fetchIncidentCategory}
        />
      )}
    </section>
  );
};

export default IncidentCategorySetup;
