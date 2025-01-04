import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { BiEditAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import {
  editIncidentCatDetails,
  getIncidentCatDetails,
  getIncidentTags,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";

const SubCategorySetupModal = ({
  onclose,
  subCatId,
  fetchIncidentSubCategory,
}) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategory: "",
  });
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchIncidentCategory = async () => {
      try {
        const res = await getIncidentTags("IncidentCategory");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSubCatDetails = async () => {
      try {
        const res = await getIncidentCatDetails(subCatId);
        const data = res.data;
        setFormData({
          ...formData,
          categoryId: data.parent_id,
          subCategory: data.name,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubCatDetails();
    fetchIncidentCategory();
  }, []);

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const companyId = getItemInLocalStorage("COMPANYID");
  const handleEditSubCategory = async () => {
    const payload = {
      name: formData.subCategory,
      active: true,
      parent_id: formData.categoryId,
      tag_type: "incidentSubCategory",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
      // "comment": "Covers all types of plumbing problems."
    };
    try {
      const res = await editIncidentCatDetails(subCatId, payload);
      toast.success("Incident Sub Category Updated successfully!");
      console.log("tree called");
      onclose();
      fetchIncidentSubCategory();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%] md:w-auto min-w-96 p-4 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col w-full justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <BiEditAlt /> Edit Incident Sub Category
          </h2>
          <div className="border-t-2 border-black">
            <div className="grid grid-cols-2 gap-2 my-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Select Category
                </label>
                <select
                  name="categoryId"
                  id=""
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="border p-2 px-4 border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  id=""
                  placeholder="Sub Category"
                  className="border p-2 border-gray-500 rounded-md w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-2 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button
              className="bg-green-500 flex items-center gap-2 text-white rounded-md px-4 p-2 "
              onClick={handleEditSubCategory}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategorySetupModal;
