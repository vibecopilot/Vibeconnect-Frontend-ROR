import React, { useState, useRef } from "react";
import axios from "axios";
import ModalWrapper from "./ModalWrapper";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { postVisitorCategory } from "../../api";

const AddVisitorSetupModal = ({ onclose, setAdded, type, visitorCategories = [] }) => {
  const themeColor = useSelector((state) => state.theme.color);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const iconInputRef = useRef(null);
  const API_TOKEN = "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";
  const BASE_URL = "https://admin.vibecopilot.ai";

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image size must be under 2MB");

    setIcon(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Please enter name");
    if (type === "visitorCategory" && !code.trim()) return toast.error("Please enter code");
    if (type === "visitorSubCategory" && !selectedCategoryId) return toast.error("Please select a parent category");

    try {
      setLoading(true);
      toast.loading("Processing...", { id: "add-category" });

      const formData = new FormData();

      if (type === "visitorCategory") {
        formData.append("visitor_category[name]", name.trim());
        formData.append("visitor_category[code]", code.trim().toUpperCase());
        formData.append("visitor_category[active]", active ? "1" : "0");
        if (icon) {
          console.log('Uploading visitor category icon:', icon);
          // Correct key for visitor category icon
          formData.append("visitor_category[icon_attributes][image]", icon);
        } else {
          console.log('No icon selected for visitor category');
        }

        console.log('Posting to:', `${BASE_URL}/visitor_categories.json?token=${API_TOKEN}`);
        await axios.post(`${BASE_URL}/visitor_categories.json?token=${API_TOKEN}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } 
      else if (type === "visitorSubCategory") {
        formData.append("visitor_sub_category[name]", name.trim());
        formData.append("visitor_sub_category[visitor_category_id]", selectedCategoryId);
        formData.append("visitor_sub_category[active]", active ? "1" : "0");
        if (icon) {
          console.log('Uploading visitor sub category icon:', icon);
          // Sub-category uses iconv2 usually, or icon based on your API
          formData.append("visitor_sub_category[iconv2]", icon);
        } else {
          console.log('No icon selected for visitor sub category');
        }

        console.log('Posting to:', `${BASE_URL}/visitor_sub_categories.json?token=${API_TOKEN}`);
        await axios.post(`${BASE_URL}/visitor_sub_categories.json?token=${API_TOKEN}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } 
      else if (type === "staffCategory") {
        // Fallback or specific API call for staff
        await postVisitorCategory({ name: name.trim() });
      }

      toast.success("Added successfully", { id: "add-category" });
      setAdded?.(true);
      onclose();
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to add category", { id: "add-category" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col p-6 max-w-md mx-auto bg-white rounded-lg">
        <h2 className="border-b pb-4 text-center font-bold text-xl mb-4">
          {type === "visitorCategory" ? "Add Visitor Category" : type === "visitorSubCategory" ? "Add Sub Category" : "Add Staff Category"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Enter name"
          />
        </div>

        {type === "visitorSubCategory" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Parent Category</label>
            <select 
              value={selectedCategoryId} 
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              {visitorCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}

        {type === "visitorCategory" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Code</label>
            <input 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase())} 
              className="w-full px-4 py-2 border rounded-lg uppercase outline-none" 
              placeholder="e.g. GST"
            />
          </div>
        )}

        {(type === "visitorCategory" || type === "visitorSubCategory") && (
          <div className="mb-4 text-center">
            <label className="block text-sm font-medium mb-1 text-left">Icon</label>
            {iconPreview ? (
              <img src={iconPreview} alt="preview" className="w-20 h-20 mb-2 border rounded mx-auto object-contain bg-gray-50" />
            ) : (
               <div className="w-20 h-20 mb-2 border rounded mx-auto bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">No Preview</div>
            )}
            <input type="file" ref={iconInputRef} accept="image/*" onChange={handleIconChange} className="text-xs w-full" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ backgroundColor: themeColor }}
          className="mt-4 py-3 text-white rounded-lg font-bold hover:brightness-90 transition-all shadow-md"
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddVisitorSetupModal;




// import React, { useRef, useState } from "react";
// import ModalWrapper from "./ModalWrapper";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { getItemInLocalStorage } from "../../utils/localStorage";

// const AddVisitorSetupModal = ({
//   onclose,
//   setAdded,
//   type,
//   visitorCategories = [],
// }) => {
//   const themeColor = useSelector((state) => state.theme.color);
//   const token =
//     getItemInLocalStorage("TOKEN") ||
//     "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";

//   const BASE_URL = "https://admin.vibecopilot.ai";

//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [active, setActive] = useState(true);
//   const [icon, setIcon] = useState(null);
//   const [iconPreview, setIconPreview] = useState(null);
//   const [visitorCategoryId, setVisitorCategoryId] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fileRef = useRef(null);

//   const iconInputRef = useRef(null);


//   /* ===============================
//      HANDLE ICON CHANGE
//   =============================== */
//   const handleIconChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) return toast.error("Please upload an image file");
//     // if (file.size > 2 * 1024 * 1024) return toast.error("Image size must be under 2MB");
//     setIcon(file);
//     setIconPreview(URL.createObjectURL(file));
//   };

//   /* ===============================
//      HANDLE SUBMIT
//   =============================== */
//   const handleSubmit = async () => {
//     if (!name.trim()) {
//       return toast.error("Name is required");
//     }

//     if (type === "visitorCategory" && !code.trim()) {
//       return toast.error("Code is required");
//     }

//     if (type === "visitorSubCategory" && !visitorCategoryId) {
//       return toast.error("Parent category is required");
//     }

//     const formData = new FormData();

//     if (type === "staffCategory") {
//       formData.append("visitor_staff_category[name]", name.trim());
//       formData.append("visitor_staff_category[active]", active ? "1" : "0");
//     }

//     if (type === "visitorCategory") {
//       formData.append("visitor_category[name]", name.trim());
//       formData.append("visitor_category[code]", code.trim().toUpperCase());
//       formData.append("visitor_category[active]", active ? "1" : "0");

//       if (icon) {
//         console.log("Uploading visitor category icon:", icon);
//         formData.append("visitor_category[icon]", icon);
//       }
//     }

//     if (type === "visitorSubCategory") {
//       formData.append("visitor_sub_category[name]", name.trim());
//       formData.append("visitor_sub_category[visitor_category_id]", visitorCategoryId);
//       formData.append("visitor_sub_category[active]", active ? "1" : "0");

//       if (icon) {
//         console.log("Uploading visitor sub category icon:", icon);
//         formData.append("visitor_sub_category[iconv2]", icon);
//       }
//     }

//     try {
//       setLoading(true);
//       toast.loading("Processing...", { id: "add-category" });

//       let url = "";
//       if (type === "staffCategory")
//         url = `${BASE_URL}/visitor_staff_categories.json?token=${token}`;
//       if (type === "visitorCategory")
//         url = `${BASE_URL}/visitor_categories.json?token=${token}`;
//       if (type === "visitorSubCategory")
//         url = `${BASE_URL}/visitor_sub_categories.json?token=${token}`;

//       console.log("Posting to:", url);

//       const response = await axios.post(url, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("Response:", response.data);

//       toast.success("Added successfully", { id: "add-category" });
//       setAdded();
//       onclose();
//     } catch (err) {
//       console.error("Error details:", err.response?.data || err.message);
//       toast.error(err.response?.data?.error || "Failed to add", { id: "add-category" });
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <ModalWrapper onclose={onclose} title="Add Category">
//       <div className="space-y-4">
//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           className="border p-2 rounded w-full"
//         />

//         {type === "visitorCategory" && (
//           <input
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             placeholder="Code"
//             className="border p-2 rounded w-full"
//           />
//         )}

//         {type === "visitorSubCategory" && (
//           <select
//             value={visitorCategoryId}
//             onChange={(e) => setVisitorCategoryId(e.target.value)}
//             className="border p-2 rounded w-full"
//           >
//             <option value="">Select Parent Category</option>
//             {visitorCategories.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         )}
//         {(type === "visitorCategory" ||
//           type === "visitorSubCategory") && (
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Icon</label>
//             {iconPreview && (
//               <img
//                 src={iconPreview}
//                 alt="preview"
//                 className="w-20 h-20 mb-2 border rounded mx-auto object-contain bg-gray-50"
//               />
//             )}
//             <input
//               ref={fileRef}
//               type="file"
//               accept="image/*"
//               onChange={handleIconChange}
//               className="border p-2 rounded w-full"
//             />
//           </div>
//         )}

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           style={{ background: themeColor }}
//           className="text-white px-4 py-2 rounded w-full"
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </ModalWrapper>
//   );
// };

// export default AddVisitorSetupModal;
