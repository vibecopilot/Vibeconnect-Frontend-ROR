import React, { useState, useEffect, useRef } from "react";
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
  const [iconFile, setIconFile] = useState(null);
  const [currentIcon, setCurrentIcon] = useState(""); // Current icon from API
  const [iconPreview, setIconPreview] = useState(""); // New file preview
  const iconInputRef = useRef(null);

  // ✅ FIXED: NESTED URL SUPPORT (profile_picture.url)
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
          
          // ✅ NESTED URL SUPPORT
          const iconUrl = getIconUrl(category);
          setCurrentIcon(iconUrl || "");
          
        } else if (editType === "visitorSubCategory") {
          const res = await getVisitorSubCategoryDetails(catId);
          category = res.data;
          setName(category?.name || "");
          setActive(category?.active ?? true);
          
          // ✅ NESTED URL SUPPORT
          const iconUrl = getIconUrl(category);
          setCurrentIcon(iconUrl || "");
          
        } else {
          // Staff categories
          const res = await axios.get(
            "https://admin.vibecopilot.ai/visitor_staff_categories.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f"
          );
          category = res.data.staff_categories?.find(
            (item) => Number(item.id) === Number(catId)
          );
          setName(category?.name || "");
          setActive(category?.active ?? true);
        }

        console.log("🔍 Loaded category:", category);
        console.log("🖼️  Current Icon URL:", currentIcon);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load category details");
      }
    };

    fetchDetails();
  }, [catId, editType]);

  // ✅ PERFECT ICON URL EXTRACTOR
  const getIconUrl = (category) => {
    // Direct fields
    const directFields = [
      category?.icon,
      category?.icon_url,
      category?.image,
      category?.image_url,
      category?.iconv2
    ];

    // Nested object fields (profile_picture.url pattern)
    const nestedFields = [
      category?.icon?.url,
      category?.image?.url,
      category?.iconv2?.url,
      category?.profile_picture?.url,  // ✅ YOUR EXAMPLE
      category?.icon_image?.url
    ];

    // With base URL
    const baseUrlFields = [
      `https://admin.vibecopilot.ai${category?.icon}`,
      `https://admin.vibecopilot.ai${category?.image}`,
      `https://admin.vibecopilot.ai${category?.iconv2}`
    ];

    const allPossibleUrls = [...directFields, ...nestedFields, ...baseUrlFields].filter(Boolean);
    
    console.log("🔍 All possible icon URLs:", allPossibleUrls);
    return allPossibleUrls[0]; // First valid URL
  };

  // ✅ NEW ICON FILE HANDLER
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file)); // ✅ NEW PREVIEW
      console.log("📁 New icon selected:", file.name);
    }
  };

  // ✅ REMOVE NEW ICON
  const removeNewIcon = () => {
    setIconFile(null);
    setIconPreview("");
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }
  };

  // ✅ FIXED SUBMIT - Correct field names
  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error("Please enter name");
    }

    if (editType === "visitorCategory" && !code.trim()) {
      return toast.error("Please enter code");
    }

    try {
      toast.loading("Saving changes...", { id: "edit-modal" });
      
      const baseUrl = "https://admin.vibecopilot.ai";
      const token = "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";
      
      if (editType === "visitorCategory") {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("code", code.trim());
        formData.append("active", active ? 1 : 0);
        
        if (iconFile) {
          formData.append("icon", iconFile); // ✅ Visitor Category ICON
        }
        
        await axios.patch(
          `${baseUrl}/visitor_categories/${catId}.json?token=${token}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
      } else if (editType === "visitorSubCategory") {
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("active", active ? 1 : 0);
        
        if (iconFile) {
          formData.append("iconv2", iconFile); // ✅ Sub Category ICONV2
        }
        
        await axios.patch(
          `${baseUrl}/visitor_sub_categories/${catId}.json?token=${token}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
      } else {
        // Staff categories
        const jsonPayload = {
          name: name.trim(),
          active: active ? 1 : 0
        };
        await editVisitorCategory(catId, jsonPayload);
      }
      
      toast.success(
        `${editType === "visitorCategory" ? "Visitor" : editType === "visitorSubCategory" ? "Sub" : "Staff"} Category updated successfully${iconFile ? " + new icon" : ""}`
      );
      setAdded(true);
      onclose();
    } catch (error) {
      console.error("Submit error:", error.response?.data || error);
      toast.error(`Update failed: ${error.response?.data?.error || "Check console"}`);
    } finally {
      toast.dismiss("edit-modal");
    }
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col p-6 max-w-md mx-auto">
        <h2 className="border-b pb-4 text-center font-bold text-xl mb-6 text-gray-800">
          Edit {editType === "visitorCategory" ? "Visitor" : editType === "visitorSubCategory" ? "Visitor Sub" : "Staff"} Category
        </h2>

        {/* NAME FIELD */}
        <div className="my-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            placeholder="Enter category name"
          />
        </div>

        {/* ✅ ICON FIELD - CURRENT + NEW PREVIEW */}
        {(editType === "visitorCategory" || editType === "visitorSubCategory") && (
          <div className="my-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {editType === "visitorCategory" ? "Icon Image" : "Icon Image (iconv2)"}
            </label>
            
            {/* ✅ CURRENT ICON FROM API */}
            {currentIcon && !iconPreview && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
                <p className="text-xs font-medium text-blue-700 mb-2 text-center">
                  🖼️ Current Icon:
                </p>
                <div className="flex justify-center">
                  <img 
                    src={currentIcon} 
                    alt="Current Icon" 
                    className="w-24 h-24 object-contain mx-auto rounded-xl shadow-lg ring-2 ring-blue-200 bg-white p-2"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs hidden">
                    No Icon
                  </div>
                </div>
              </div>
            )}

            {/* ✅ NEW ICON PREVIEW */}
            {iconPreview && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
                <p className="text-xs font-medium text-green-700 mb-2 text-center">
                  📸 New Image Preview:
                </p>
                <div className="flex justify-center items-center gap-3">
                  <img 
                    src={iconPreview} 
                    alt="New Preview" 
                    className="w-20 h-20 object-contain rounded-lg shadow-md bg-white p-2"
                  />
                  <div className="text-xs text-center">
                    <p className="font-mono text-gray-600 truncate max-w-[120px]">
                      {iconFile?.name}
                    </p>
                    <p className="text-gray-500">
                      {(iconFile?.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeNewIcon}
                  className="w-full text-xs bg-red-100 text-red-700 py-1 px-3 rounded-md hover:bg-red-200 transition-all mt-2 font-medium"
                >
                  ❌ Remove New Image
                </button>
              </div>
            )}

            {/* ✅ FILE INPUT */}
            <input
              type="file"
              ref={iconInputRef}
              onChange={handleIconChange}
              accept="image/*"
              className="block w-full text-sm text-slate-500 
                         file:mr-4 file:py-2.5 file:px-6 
                         file:rounded-full file:border-0 
                         file:text-sm file:font-semibold 
                         file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 
                         file:text-white hover:file:brightness-105
                         border border-gray-300 rounded-lg p-3 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-400
                         transition-all"
            />
            
            {/* ✅ HELP TEXT */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                📋 PNG, JPG, GIF (Max 2MB, Recommended: 100x100px)
              </p>
              {iconFile && (
                <p className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded mt-1">
                  ✅ Ready to replace: <span className="font-mono">{iconFile.name}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* CODE FIELD */}
        {editType === "visitorCategory" && (
          <div className="my-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Code *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Enter unique code"
            />
          </div>
        )}

        {/* ACTIVE TOGGLE */}
        <div className="my-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-6 h-6 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 shadow-sm"
            />
            <label htmlFor="active" className="text-sm font-semibold text-gray-800">
              ✅ Active Status
            </label>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSubmit}
          style={{ background: themeColor }}
          className="w-full text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-6 border-0"
        >
          💾 Save Changes
        </button>
      </div>
    </ModalWrapper>
  );
};

export default EditVisitorSetupModal;
