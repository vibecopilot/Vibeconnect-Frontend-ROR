// ✅ BusinessSetup.jsx (FIXED FULL CODE)
// - SubCategory table now shows CATEGORY NAME (not ID)
// - SubCategory list filters to only "contact" categories
// - Optional filter by selected category (dropdown)
// - Removed window.location.reload() (no more hard reload)
// - Added validations + safer error handling
// - Removed unused imports

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import Table from "../../components/table/Table";
import SetupNavbar from "../../components/navbars/SetupNavbar";
import ContactSetupModal from "../../containers/modals/ContactSetupModal";
import {
  getGenericCategory,
  getGenericSubCategory,
  postGenericCategory,
  postGenericSubCategory,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";

const BusinessSetup = () => {
  const [selectedFiled, setSelectedField] = useState("category");

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [selectedCatId, setSelectedCatId] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);

  const [catModal, setCatModal] = useState(false);
  const [catId, setCatId] = useState("");

  const themeColor = useSelector((state) => state.theme.color);

  const companyID = getItemInLocalStorage("COMPANYID");
  const siteId = getItemInLocalStorage("SITEID");

  // ✅ Load categories + subcategories
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [categoryResp, subResp] = await Promise.all([
          getGenericCategory(),
          getGenericSubCategory(),
        ]);

        const filteredCategory = (categoryResp?.data || []).filter(
          (item) => item?.info_type === "contact"
        );

        setCategories(filteredCategory);
        setSubCategories(subResp?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load setup data");
      }
    };

    fetchAll();
  }, [catModal]); // when modal closes/opens, refresh is fine

  // ✅ Map: categoryId -> categoryName
  const categoryNameById = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[String(c.id)] = c?.name || "-";
    });
    return map;
  }, [categories]);

  // ✅ Detect subcategory "category id" key safely (API may differ)
  const getSubCatCategoryId = (sc) => {
    // common rails keys:
    // sc.generic_info_id
    // sc.generic_info?.id
    // sc.generic_info
    const direct = sc?.generic_info_id ?? sc?.generic_info;
    if (direct != null && typeof direct !== "object") return String(direct);
    if (sc?.generic_info?.id != null) return String(sc.generic_info.id);
    return "";
  };

  // ✅ SubCategory list:
  // - only subcats whose category is in "contact" categories
  // - if selectedCatId chosen, filter to that category
  // - inject generic_info_name so table shows name not id
  const visibleSubCategories = useMemo(() => {
    const contactCatIds = new Set(categories.map((c) => String(c.id)));

    const onlyContact = (subCategories || []).filter((sc) => {
      const cid = getSubCatCategoryId(sc);
      return cid && contactCatIds.has(cid);
    });

    const onlySelected = selectedCatId
      ? onlyContact.filter(
          (sc) => getSubCatCategoryId(sc) === String(selectedCatId)
        )
      : onlyContact;

    return onlySelected.map((sc) => {
      const cid = getSubCatCategoryId(sc);
      return {
        ...sc,
        generic_info_name:
          sc?.generic_info_name || categoryNameById[cid] || "-",
      };
    });
  }, [subCategories, categories, selectedCatId, categoryNameById]);

  // ✅ Add Category
  const HandleAddCategory = async () => {
    if (!category.trim()) return toast.error("Please Enter a Category");
    if (!companyID || !siteId) return toast.error("Company/Site not found");

    const formData = new FormData();
    formData.append("generic_info[name]", category.trim());
    formData.append("generic_info[company_id]", companyID);
    formData.append("generic_info[site_id]", siteId);
    formData.append("generic_info[info_type]", "contact");

    try {
      await postGenericCategory(formData);
      toast.success("Category Added Successfully");
      setCategory("");

      // ✅ refresh categories
      const categoryResp = await getGenericCategory();
      const filteredCategory = (categoryResp?.data || []).filter(
        (item) => item?.info_type === "contact"
      );
      setCategories(filteredCategory);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category");
    }
  };

  // ✅ Add Sub Category
  const HandleAddSubCategory = async () => {
    if (!selectedCatId) return toast.error("Please Select a Category");
    if (!subCategory.trim()) return toast.error("Please Enter a Sub Category");

    const formData = new FormData();
    formData.append("generic_sub_info[generic_info_id]", selectedCatId);
    formData.append("generic_sub_info[name]", subCategory.trim());

    try {
      await postGenericSubCategory(formData);
      toast.success("Sub Category Added Successfully");
      setSubCategory("");

      // ✅ refresh subcategories
      const subResp = await getGenericSubCategory();
      setSubCategories(subResp?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add sub category");
    }
  };

  // ✅ Edit Modal
  const handleCatModal = (id) => {
    setCatModal(true);
    setCatId(id);
  };

  // ✅ Tables
  const categoryColumn = [
    { name: "Sr. no.", selector: (row, index) => index + 1, sortable: true },
    { name: "Category", selector: (row) => row?.name || "-", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => handleCatModal(row.id)} title="Edit">
          <BiEdit size={15} />
        </button>
      ),
      sortable: true,
    },
  ];

  const subColumn = [
    { name: "Sr. no.", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Category",
      selector: (row) => row?.generic_info_name || "-",
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row?.name || "-",
      sortable: true,
    },
  ];

  return (
    <section className="flex">
      <SetupNavbar />

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-center gap-5 flex-col w-full">
          <h2
            style={{ background: themeColor }}
            className="p-2 text-white text-center rounded-md font-semibold text-lg my-2"
          >
            Setup Categories
          </h2>

          <div className="flex justify-center">
            <div className="gap-5 bg-gray-100 flex p-2 items-center text-lg rounded-full">
              <h2
                className={`${
                  selectedFiled === "category"
                    ? "bg-white text-blue-500 shadow-custom-all-sides"
                    : ""
                } px-3 rounded-full cursor-pointer font-medium text-black`}
                onClick={() => setSelectedField("category")}
              >
                Category
              </h2>

              <h2
                className={`${
                  selectedFiled === "subCategory"
                    ? "bg-white text-blue-500 shadow-custom-all-sides"
                    : ""
                } px-3 rounded-full cursor-pointer font-medium text-black`}
                onClick={() => setSelectedField("subCategory")}
              >
                Sub Category
              </h2>
            </div>
          </div>

          {/* ✅ CATEGORY TAB */}
          {selectedFiled === "category" && (
            <div className="flex flex-col justify-center mx-10 gap-2">
              <div className="flex justify-center gap-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter Category"
                  className="border border-black rounded-md p-1"
                />
                <button
                  style={{ background: themeColor }}
                  className="text-white px-2 rounded-md"
                  onClick={HandleAddCategory}
                >
                  Add Category
                </button>
              </div>

              <div className="mt-4 w-full">
                <Table columns={categoryColumn} data={categories} />
              </div>
            </div>
          )}

          {/* ✅ SUBCATEGORY TAB */}
          {selectedFiled === "subCategory" && (
            <div className="flex flex-col justify-center md:mx-10 gap-2">
              <div className="flex md:flex-row flex-col justify-center gap-2">
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="border border-black rounded-md p-1"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option value={cat.id} key={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="Enter Sub Category"
                  className="border border-black rounded-md p-1"
                />

                <button
                  style={{ background: themeColor }}
                  className="text-white px-2 rounded-md"
                  onClick={HandleAddSubCategory}
                >
                  Add Sub Category
                </button>
              </div>

              <div className="mt-4 w-full">
                <Table columns={subColumn} data={visibleSubCategories} />
              </div>
            </div>
          )}
        </div>
      </div>

      {catModal && (
        <ContactSetupModal id={catId} onClose={() => setCatModal(false)} />
      )}
    </section>
  );
};

export default BusinessSetup;
