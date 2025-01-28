import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { BiEditAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import {
  editIncidentCatDetails,
  getIncidentCatDetails,
  getIncidentTags,
} from "../../../api";
import toast from "react-hot-toast";

const SecSubSubSubModal = ({ onclose, catId, fetchIncidentCategory }) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    subSubCategory: "",
  });
  const companyId = getItemInLocalStorage("COMPANYID");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const res = await getIncidentCatDetails(catId);
        setFormData({
          ...formData,
          categoryId: res.data.root_id,
          subCategoryId: res.data.parent_id,
          subSubCategory: res.data.name,
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentCategory = async () => {
      try {
        const res = await getIncidentTags("IncidentSecondaryCategory");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncidentSubCategory = async () => {
      try {
        const res = await getIncidentTags("IncidentSecondarySubCategory");
        setSubCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchIncidentSubCategory();
    fetchIncidentCategory();
    fetchCategoryDetails();
  }, []);
  const handleEditCategory = async () => {
    const payload = {
      name: formData.subSubCategory,
      active: true,
      parent_id: formData.subCategoryId,
      tag_type: "IncidentSecondarySubSubCategory",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
      // "comment": "Covers all types of plumbing problems."
    };
    try {
      const res = await editIncidentCatDetails(catId, payload);
      toast.success(
        "Incident Secondary Sub Sub Category Updated successfully!"
      );
      onclose();
      fetchIncidentCategory();
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%] md:w-auto min-w-96 p-4 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col w-full justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <BiEditAlt /> Edit Secondary Sub Sub Sub Category
          </h2>
          <div className="border-t-2 border-black">
            <div className="grid grid-cols-2 gap-2 my-2">
              <select
                name="categoryId"
                id=""
                className="border p-2 border-gray-500 rounded-md w-full"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select Secondary Category</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                name="subCategoryId"
                id=""
                className="border p-2 border-gray-500 rounded-md w-full"
                value={formData.subCategoryId}
                onChange={handleChange}
              >
                <option value="">Select Secondary Sub Category</option>
                {subCategories.map((subCategory) => (
                  <option value={subCategory.id} key={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="subSubCategory"
                onChange={handleChange}
                id=""
                value={formData.subSubCategory}
                placeholder="Secondary Sub Sub Sub Category"
                className="border p-2 border-gray-500 rounded-md w-full"
              ></input>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-2 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 font-medium text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button
              className="bg-green-500 flex items-center gap-2 font-medium text-white rounded-md px-4 p-2 "
              onClick={handleEditCategory}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecSubSubSubModal;
