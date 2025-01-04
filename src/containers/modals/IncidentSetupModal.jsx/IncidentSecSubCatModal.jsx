import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import {
  editIncidentCatDetails,
  getIncidentCatDetails,
  getIncidentTags,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { BiEditAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const SecondarySubCategorySetupModal = ({
  onclose,
  catId,
  fetchIncidentCategory,
}) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategory: "",
  });
  const companyId = getItemInLocalStorage("COMPANYID");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const res = await getIncidentCatDetails(catId);
        setFormData({
          ...formData,
          categoryId: res.data.root_id,
          subCategory: res.data.name,
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
    fetchIncidentCategory();
    fetchCategoryDetails();
  }, []);
  const handleEditCategory = async () => {
    const payload = {
      name: formData.subCategory,
      active: true,
      parent_id: formData.categoryId,
      tag_type: "IncidentSecondarySubCategory",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
      // "comment": "Covers all types of plumbing problems."
    };
    try {
      const res = await editIncidentCatDetails(catId, payload);
      toast.success("IncidentSecondary Sub Category Updated successfully!");
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
      <div className="bg-white overflow-auto max-h-[70%] w-[30rem] p-4 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <BiEditAlt /> Edit Secondary Sub Category
          </h2>
          <div className="border-t-2 border-black grid grid-cols-2 gap-2 ">
            <div className="flex flex-col my-2 gap-1">
              <label htmlFor="" className="font-medium">
                Secondary Category
              </label>
              <select
                name="categoryId"
                id=""
                className="border p-2 border-gray-500 rounded-md w-full"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col my-2 gap-1">
              <label htmlFor="" className="font-medium">
                Secondary Sub Category
              </label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                id=""
                placeholder="Sub Category"
                className="border p-2 border-gray-500 rounded-md w-full"
              ></input>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-2 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button
              className="bg-green-500 flex items-center gap-2 text-white rounded-md px-4 p-2 "
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

export default SecondarySubCategorySetupModal;
