import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { postVisitorCategoryType, postVisitorCategory, postVisitorSubCategory } from "../../api";

const AddVisitorSetupModal = ({ onclose, setAdded, type }) => {
  const themeColor = useSelector((state) => state.theme.color);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [icon, setIcon] = useState(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_TOKEN = "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";
  const BASE_URL = "https://admin.vibecopilot.ai";

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error("Please enter name");
    }

    if (type === "visitorCategory" && !code.trim()) {
      return toast.error("Please enter code");
    }

    try {
      setLoading(true);

      if (type === "visitorCategory") {
        const jsonPayload = {
          name: name.trim(),
          code: code.trim(),
          active: active ? 1 : 0
        };
        await postVisitorCategoryType(jsonPayload);
      } else if (type === "visitorSubCategory") {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("active", active ? 1 : 0);
        if (icon) {
          formData.append("iconv2", icon);
        }
        await axios.post(`${BASE_URL}/visitor_sub_categories.json`, formData, {
          params: { token: API_TOKEN },
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        const jsonPayload = { name: name.trim() };
        await postVisitorCategory(jsonPayload);
      }

      toast.success("Category added successfully!");
      setAdded?.(true);
      onclose();

      // RESET FORM
      setName("");
      setCode("");
      setIcon(null);
      setActive(true);
    } catch (error) {
      console.error("API ERROR:", error);
      
      // Better error messages
      if (error?.response?.status === 422) {
        toast.error(`Validation Error: ${error.message}`);
      } else if (error?.response?.status === 400) {
        toast.error("Bad Request - Check name/code format");
      } else if (error?.response?.status === 401) {
        toast.error("Unauthorized - Token expired");
      } else {
        toast.error(`${error.message || "Failed to add category"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col p-6 max-w-md mx-auto">
        <h2 className="border-b pb-4 text-center font-semibold text-xl mb-6">
          {type === "visitorCategory" ? "Add Visitor Category" : type === "visitorSubCategory" ? "Add Visitor Sub Category" : "Add Staff Category"}
        </h2>

        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
            placeholder="Guest"
            disabled={loading}
          />
        </div>
        {type === "visitorCategory" && (
          <>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code * (3 letters)
              </label>
              <input
                type="text"
                value={code}
                maxLength={10}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 10))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase disabled:bg-gray-100"
                placeholder="GST"
                disabled={loading}
              />
            </div>

            
        {type === "visitorCategory" && (
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <input
              type="file"
              accept="@/home/akkie/Pictures/Screenshots/Screenshot from 2025-12-10 15-50-53.png"
              onChange={(e) => setIcon(e.target.files[0])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
              disabled={loading}
            />
          </div>
        )} 

            <div className="my-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>
          </>
        )}

        {(type === "visitorSubCategory" || type === "staffCategory") && (
          <div className="my-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Active
              </label>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                disabled={loading}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !name.trim() || (type === "visitorCategory" && !code.trim())}
          style={{ backgroundColor: themeColor }}
          className="w-full py-3 px-6 rounded-lg font-semibold text-black hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-6 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : (
            "Add Category"
          )}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddVisitorSetupModal;
