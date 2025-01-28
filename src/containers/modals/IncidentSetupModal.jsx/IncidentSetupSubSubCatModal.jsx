import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { BiEditAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import {
  editIncidentCatDetails,
  getIncidentCatDetails,
  getIncidentSubTags,
  getIncidentTags,
} from "../../../api";
import toast from "react-hot-toast";

const SubSubCategorySetupModal = ({
  onclose,
  subSubCatId,
  fetchIncidentSubSubCategoryTree,
}) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    subCategoryId: "",
    subSubCategory: "",
  });
  console.log(typeof fetchIncidentSubSubCategoryTree);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const fetchIncidentSubCategory = async (parentId) => {
    try {
      const res = await getIncidentSubTags("IncidentSubCategory", parentId);
      setSubCategories(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  // const fetchFloor = async (floorID) => {
  //       try {
  //         const build = await getFloors(floorID);
  //         setFloors(build.data.map((item) => ({ name: item.name, id: item.id })));
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };
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
        const res = await getIncidentCatDetails(subSubCatId);
        const data = res.data;
        setFormData({
          ...formData,
          categoryId: data.root_id,
          subCategoryId: data.parent_id,
          subSubCategory: data.name,
        });
        fetchIncidentSubCategory(data.root_id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubCatDetails();
    fetchIncidentCategory();
    fetchIncidentSubCategory();
  }, []);
  console.log(formData);
  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const companyId = getItemInLocalStorage("COMPANYID");
  const handleEditSubCategory = async () => {
    const payload = {
      name: formData.subSubCategory,
      active: true,
      parent_id: formData.subCategoryId,
      tag_type: "incidentSubSubCategory",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
      // "comment": "Covers all types of plumbing problems."
    };
    try {
      const res = await editIncidentCatDetails(subSubCatId, payload);
      toast.success("Incident Sub Sub Category Updated successfully!");
     
      onclose();
      fetchIncidentSubSubCategoryTree();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%] md:w-auto min-w-96 p-4 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col w-full justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <BiEditAlt /> Edit Incident Sub Sub Category
          </h2>
          <div className="border-t-2 border-black">
            <div className="grid grid-cols-3 gap-2 my-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Select Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Select Sub Category
                </label>
                <select
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={handleChange}
                  id=""
                  className="border p-2 border-gray-500 rounded-md w-full"
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((subCat) => (
                    <option value={subCat.id} key={subCat.id}>
                      {subCat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Sub Sub Category
                </label>
                <input
                  type="text"
                  name="subSubCategory"
                  value={formData.subSubCategory}
                  onChange={handleChange}
                  id=""
                  placeholder="Sub Sub Category"
                  className="border p-2 border-gray-500 rounded-md w-full"
                ></input>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mt-2 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 font-medium text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button className="bg-green-500 flex items-center gap-2 font-medium text-white rounded-md px-4 p-2 " onClick={handleEditSubCategory}>
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSubCategorySetupModal;
