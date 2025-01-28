import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import SubSubCategorySetupModal from "../../../containers/modals/IncidentSetupModal.jsx/IncidentSetupSubSubCatModal";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
import {
  getIncidentSubTags,
  getIncidentTags,
  postIncidentTags,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";
const SubSubCategorysetup = () => {
  const [modal, showModal] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    SubCategoryId: "",
    subSubCategory: "",
  });
  const column = [
    { name: "Category", selector: (row) => row.Category, sortable: true },
    {
      name: "Sub Category",
      selector: (row) => row.SubCategory,
      sortable: true,
    },
    {
      name: "Sub Sub Category",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => showModal(true)} className="text-blue-500">
            <BiEdit size={15} />
          </button>

          <button className="text-red-500">
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const [addSubSubCat, setAddSubSubCat] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    const fetchIncidentCategory = async () => {
      try {
        const res = await getIncidentTags("IncidentCategory");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchIncidentCategory();
  }, []);
  const handleChange = async (e) => {
    const fetchIncidentSubCategory = async (parentId) => {
      try {
        const res = await getIncidentSubTags("IncidentSubCategory", parentId);
        setSubCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (e.target.type === "select-one" && e.target.name === "categoryId") {
      const catId = Number(e.target.value);
      await fetchIncidentSubCategory(catId);
      setFormData({ ...formData, categoryId: catId });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const companyId = getItemInLocalStorage("COMPANYID");
  const handleAddSubSubCategory = async () => {
    const payload = {
      name: formData.subSubCategory,
      active: true,
      parent_id: formData.SubCategoryId,
      tag_type: "IncidentSubSubCategory",
      resource_id: companyId,
      resource_type: "Pms::CompanySetup",
    };
    try {
      const res = await postIncidentTags(payload);
      toast.success("Incident Sub Sub Category Created successfully!");
      // fetchIncidentCategory();
      setFormData({
        ...formData,
        categoryId: "",
        SubCategoryId: "",
        subSubCategory: "",
      });
      setAddSubSubCat(false);
    } catch (error) {
      console.log(error);
    }
  };
  const [subSubCategories, setSubSubCategories] = useState([]);
  const fetchIncidentSubCategory = async () => {
    try {
      const res = await getIncidentTags("IncidentSubSubCategory");
      setSubSubCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchIncidentSubCategory();
  }, []);
  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addSubSubCat && (
            <div className="flex items-center gap-2 w-full">
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
              <select
                name="SubCategoryId"
                value={formData.SubCategoryId}
                id=""
                className="border p-2 w-full border-gray-300 rounded-lg"
                onChange={handleChange}
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((subCategory) => (
                  <option value={subCategory.id} key={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Sub Sub Category"
                className="border p-2 w-full border-gray-300 rounded-lg"
                value={formData.subSubCategory}
                onChange={handleChange}
                name="subSubCategory"
              />

              <button
                className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md"
                onClick={handleAddSubSubCategory}
              >
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                onClick={() => setAddSubSubCat(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          )}
          {!addSubSubCat && (
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddSubSubCat(true)}
            >
              <PiPlusCircle /> Add
            </button>
          )}
        </div>
        <div>
          <Table columns={column} data={subSubCategories} isPagination={true} />
        </div>
      </div>
      {modal && <SubSubCategorySetupModal onclose={() => showModal(false)} />}
    </section>
  );
};

export default SubSubCategorysetup;
