import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ModalWrapper from "./ModalWrapper";
import {
  getVisitorCategories,
  editVisitorCategoryType,
  editVisitorCategory,
  getVisitorSubCategoryDetails,
  editVisitorSubCategory,
} from "../../api";

const EditVisitorSetupModal = ({ onclose, catId, setAdded, editType }) => {
  const themeColor = useSelector((state) => state.theme.color);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(true);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (!catId) return;

    const fetchDetails = async () => {
      try {
        let category;
        if (editType === "visitorCategory") {
          const res = await getVisitorCategories();
          category = res.data.find(
            (item) => Number(item.id) === Number(catId)
          );
          setName(category?.name || "");
          setCode(category?.code || "");
          setActive(category?.active ?? true);
        } else if (editType === "visitorSubCategory") {
          const res = await getVisitorSubCategoryDetails(catId);
          category = res.data;
          setName(category?.name || "");
          setActive(category?.active ?? true);
          setIcon(category?.iconv2 || null);
        } else {
          // For staff categories
          const res = await axios.get(
            "https://admin.vibecopilot.ai/visitor_staff_categories.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f"
          );
          category = res.data.staff_categories?.find(
            (item) => Number(item.id) === Number(catId)
          );
          setName(category?.name || "");
          setActive(category?.active ?? true);
        }

        if (!category) {
          return toast.error(`${editType === "visitorCategory" ? "Visitor" : editType === "visitorSubCategory" ? "Sub" : "Staff"} category not found`);
        }
      } catch (error) {
        console.error(error);
        // toast.error("Failed to load category");
      }
    };

    fetchDetails();
  }, [catId, editType]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error("Please enter name");
    }

    if (editType === "visitorCategory" && !code.trim()) {
      return toast.error("Please enter code");
    }

    const jsonPayload = {
      name: name.trim(),
      ...(editType === "visitorCategory" && { code: code.trim() }),
      active: active ? 1 : 0
    };

    try {
      if (editType === "visitorCategory") {
        await editVisitorCategoryType(catId, jsonPayload);
      } else if (editType === "visitorSubCategory") {
        if (icon && typeof icon === 'object') {
          // New file uploaded
          const formData = new FormData();
          formData.append("name", name.trim());
          formData.append("active", active ? 1 : 0);
          formData.append("iconv2", icon);
          await axios.patch(`https://admin.vibecopilot.ai/visitor_sub_categories/${catId}.json`, formData, {
            params: { token: "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35" },
            headers: { "Content-Type": "multipart/form-data" }
          });
        } else {
          await editVisitorSubCategory(catId, { name: name.trim(), active: active ? 1 : 0 });
        }
      } else {
        // For staff categories, use the staff API
        // Assuming there's editVisitorCategory for staff
        await editVisitorCategory(catId, jsonPayload);
      }
      toast.success(`${editType === "visitorCategory" ? "Visitor" : editType === "visitorSubCategory" ? "Sub" : "Staff"} Category updated successfully`);
      setAdded(true);
      onclose();
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col">
        <h2 className="border-b pb-2 text-center font-semibold text-xl">
          Edit {editType === "visitorCategory" ? "Visitor" : editType === "visitorSubCategory" ? "Visitor Sub" : "Staff"} Category
        </h2>

        {/* NAME */}
        <div className="my-3">
          <label className="block text-sm font-medium text-gray-600">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md w-full p-2"
          />
        </div>

        {/* ICON - only for visitor sub categories */}
        {editType === "visitorSubCategory" && (
          <div className="my-3">
            <label className="block text-sm font-medium text-gray-600">
              Icon
            </label>
            {icon && typeof icon === 'string' && (
              <img src={icon} className="w-16 h-16 object-contain mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIcon(e.target.files[0] || null)}
              className="border rounded-md w-full p-2"
            />
          </div>
        )}

        {/* CODE - only for visitor categories */}
        {editType === "visitorCategory" && (
          <div className="my-3">
            <label className="block text-sm font-medium text-gray-600">
              Code *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border rounded-md w-full p-2"
            />
          </div>
        )}

        {/* ACTIVE */}
        <div className="my-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          <label className="text-sm font-medium text-gray-600">
            Active
          </label>
        </div>

        <button
          onClick={handleSubmit}
          style={{ background: themeColor }}
          className="text-white py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </ModalWrapper>
  );
};

export default EditVisitorSetupModal;
