import React, { useState, useRef } from "react";
import axios from "axios";
import ModalWrapper from "./ModalWrapper";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  postVisitorCategoryType,
  postVisitorCategory,
  postVisitorSubCategory,
} from "../../api";

const AddVisitorSetupModal = ({ onclose, setAdded, type }) => {
  const themeColor = useSelector((state) => state.theme.color);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const iconInputRef = useRef(null);

  const API_TOKEN = "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";
  const BASE_URL = "https://admin.vibecopilot.ai";

  /* ================= ICON HANDLERS ================= */

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIcon(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const removeIcon = () => {
    setIcon(null);
    setIconPreview(null);
    if (iconInputRef.current) iconInputRef.current.value = "";
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Please enter name");
    if (type === "visitorCategory" && !code.trim())
      return toast.error("Please enter code");

    try {
      setLoading(true);

      /* ========= VISITOR CATEGORY ========= */
      if (type === "visitorCategory") {
        const formData = new FormData();
        formData.append("visitor_category[name]", name.trim());
        formData.append("visitor_category[code]", code.trim());
        formData.append("visitor_category[active]", active ? 1 : 0);

        if (icon) {
          formData.append("visitor_category[icon]", icon); // ✅ CORRECT PATH
        }

        await axios.post(
          `${BASE_URL}/visitor_categories.json`,
          formData,
          {
            params: { token: API_TOKEN },
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      /* ========= VISITOR SUB CATEGORY ========= */
      else if (type === "visitorSubCategory") {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("active", active ? 1 : 0);

        if (icon) {
          formData.append("iconv2", icon); // ✅ BACKEND EXPECTS iconv2
        }

        await axios.post(
          `${BASE_URL}/visitor_sub_categories.json`,
          formData,
          {
            params: { token: API_TOKEN },
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      /* ========= STAFF CATEGORY ========= */
      else {
        await postVisitorCategory({ name: name.trim() });
      }

      toast.success("Category added successfully");
      setAdded?.(true);
      onclose();

      /* ========= RESET ========= */
      setName("");
      setCode("");
      setIcon(null);
      setIconPreview(null);
      setActive(true);
      if (iconInputRef.current) iconInputRef.current.value = "";

    } catch (error) {
      console.error(error);

      if (error?.response?.status === 422)
        toast.error("Validation error");
      else if (error?.response?.status === 401)
        toast.error("Unauthorized");
      else toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col p-6 max-w-md mx-auto">
        <h2 className="border-b pb-4 text-center font-semibold text-xl mb-6">
          {type === "visitorCategory"
            ? "Add Visitor Category"
            : type === "visitorSubCategory"
            ? "Add Visitor Sub Category"
            : "Add Staff Category"}
        </h2>

        {/* NAME */}
        <div className="my-4">
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Guest"
          />
        </div>

        {/* CODE */}
        {type === "visitorCategory" && (
          <div className="my-4">
            <label className="block text-sm font-medium mb-2">Code *</label>
            <input
              value={code}
              maxLength={10}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().slice(0, 10))
              }
              disabled={loading}
              className="w-full px-4 py-3 border rounded-lg uppercase"
              placeholder="GST"
            />
          </div>
        )}

        {/* ICON */}
        {(type === "visitorCategory" || type === "visitorSubCategory") && (
          <div className="my-4">
            <label className="block font-medium mb-2">Icon</label>

            {iconPreview && (
              <div className="mb-3 text-center">
                <img
                  src={iconPreview}
                  className="w-20 h-20 mx-auto object-contain"
                  alt="preview"
                />
                <button
                  onClick={removeIcon}
                  className="text-red-600 text-xs mt-1"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={iconInputRef}
              onChange={handleIconChange}
              disabled={loading}
            />
          </div>
        )}

        {/* ACTIVE */}
        {(type === "visitorSubCategory" || type === "staffCategory") && (
          <div className="my-4 flex items-center justify-between">
            <span>Active</span>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: themeColor }}
          className="mt-6 py-3 rounded-lg text-white font-semibold"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddVisitorSetupModal;
