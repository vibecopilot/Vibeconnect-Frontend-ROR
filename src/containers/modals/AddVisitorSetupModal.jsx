import React, { useState, useRef } from "react";
import axios from "axios";
import ModalWrapper from "./ModalWrapper";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { postVisitorCategory } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";


// const token = getItemInLocalStorage("TOKEN");

const AddVisitorSetupModal = ({ onclose, setAdded, type, visitorCategories = [] }) => {
  const themeColor = useSelector((state) => state.theme.color);
  const token = getItemInLocalStorage("TOKEN");
  // const siteId = getItemInLocalStorage("SITE_ID"); 
  // const siteId = useSelector((state) => state.auth.site_id);



  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
   const siteId = getItemInLocalStorage("SITEID");
   console.log("SITEID",siteId)

  const iconInputRef = useRef(null);
  // const API_TOKEN = "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";
  const BASE_URL = "https://admin.vibecopilot.ai";

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image size must be under 2MB");

    setIcon(file);
    setIconPreview(URL.createObjectURL(file));
  };

  // const handleSubmit = async () => {
  //   if (!name.trim()) return toast.error("Please enter name");
  //   if (type === "visitorCategory" && !code.trim()) return toast.error("Please enter code");
  //   if (type === "visitorSubCategory" && !selectedCategoryId) return toast.error("Please select a parent category");

  //   try {
  //     setLoading(true);
  //     toast.loading("Processing...", { id: "add-category" });

  //     const formData = new FormData();

  //     if (type === "visitorCategory") {
  //       formData.append("visitor_category[name]", name.trim());
  //       formData.append("visitor_category[code]", code.trim().toUpperCase());
  //       formData.append("visitor_category[active]", active ? "1" : "0");
        
  //       if (icon) {
  //         console.log('Uploading visitor category icon:', icon);
  //         formData.append("visitor_category[icon_attributes][image]", icon);

  //       } else {
  //         console.log('No icon selected for visitor category');
  //       }

  //       console.log('FormData entries:');
  //       for (let pair of formData.entries()) {
  //         console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
  //       }

  //       console.log('Posting to:', `${BASE_URL}/visitor_categories.json?token=${API_TOKEN}`);
  //       await postVisitorCategory(formData);

        
  //       console.log('Success response:', response.data);
  //     } 
  //     else if (type === "visitorSubCategory") {
  //       formData.append("visitor_sub_category[name]", name.trim());
  //       formData.append("visitor_sub_category[visitor_category_id]", selectedCategoryId);
  //       formData.append("visitor_sub_category[active]", active ? "1" : "0");
  //       if (icon) {
  //         console.log('Uploading visitor sub category icon:', icon);
  //         formData.append("visitor_sub_category[iconv2_attributes][image]", icon);
  //       } else {
  //         console.log('No icon selected for visitor sub category');
  //       }

  //       console.log('Posting to:', `${BASE_URL}/visitor_sub_categories.json?token=${API_TOKEN}`);
  //       await axios.post(`${BASE_URL}/visitor_sub_categories.json?token=${API_TOKEN}`, formData, {
  //         headers: { "Content-Type": "multipart/form-data" }
  //       });
  //     } 
  //     else if (type === "staffCategory") {
  //       await postVisitorCategory({ name: name.trim() });
  //     }

  //     toast.success("Added successfully", { id: "add-category" });
  //     setAdded?.(true);
  //     onclose();
  //   } catch (error) {
  //     console.error("Submission Error:", error);
  //     console.error("Error Response:", error.response?.data);
  //     console.error("Error Status:", error.response?.status);
      
  //     const errorMessage = error.response?.data?.error || 
  //                         error.response?.data?.message || 
  //                         (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) ||
  //                         "Failed to add category";
      
  //     toast.error(errorMessage, { id: "add-category", duration: 5000 });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
 const handleSubmit = async () => {
  if (!name.trim()) return toast.error("Please enter name");

  try {
    setLoading(true);
    toast.loading("Processing...", { id: "add-category" });

    const formData = new FormData();

   if (type === "visitorCategory") {
  if (!code.trim()) return toast.error("Please enter code");

  formData.append("visitor_category[name]", name.trim());
  formData.append("visitor_category[code]", code.trim().toUpperCase());
  formData.append("visitor_category[active]", active ? "1" : "0");

  // const siteId = getItemInLocalStorage("SITEID");
  formData.append("visitor_category[site_id]", siteId);

  if (icon) {
    formData.append(
      "visitor_category[icon_attributes][image]",
      icon
    );
  }

  await postVisitorCategory(formData);
}


    else if (type === "visitorSubCategory") {
      if (!selectedCategoryId)
        return toast.error("Please select parent category");

      formData.append("visitor_sub_category[name]", name.trim());
      formData.append(
        "visitor_sub_category[visitor_category_id]",
        selectedCategoryId
      );
      formData.append(
        "visitor_sub_category[active]",
        active ? "1" : "0"
      );

      if (icon) {
        formData.append(
          "visitor_sub_category[iconv2_attributes][image]",
          icon
        );
      }

      await axios.post(
        `https://admin.vibecopilot.ai/visitor_sub_categories.json`,
        formData,
        {
          params: { token: token },
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }

    else if (type === "staffCategory") {
      const data = new FormData();
      data.append("visitor_staff_category[name]", name.trim());

      await axios.post(
        `https://admin.vibecopilot.ai/visitor_staff_categories.json`,
        data,
        {
          params: { token: token },
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }

    toast.success("Added successfully", { id: "add-category" });

    setAdded();   // 🔁 THIS TRIGGERS RELOAD
    onclose();

  } catch (error) {
    toast.error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Failed to add category",
      { id: "add-category" }
    );
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
          className="mt-4 py-3 text-black rounded-lg font-bold hover:brightness-90 transition-all shadow-md"
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddVisitorSetupModal;



// import React, { useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { postVisitorCategory } from "../../api";
// import ModalWrapper from "./ModalWrapper";

// const AddVisitorSetupModal = ({ onclose, setAdded, type }) => {
//   const themeColor = useSelector((state) => state.theme.color);
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [icon, setIcon] = useState(null);
//   const [iconPreview, setIconPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const iconInputRef = useRef(null);

//   const handleIconChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) return toast.error("Upload image only");
//     if (file.size > 2 * 1024 * 1024) return toast.error("Max 2MB size");

//     setIcon(file);
//     setIconPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async () => {
//     if (!name.trim()) return toast.error("Please enter name");
//     if (!code.trim()) return toast.error("Please enter code");

//     try {
//       setLoading(true);
//       toast.loading("Adding...", { id: "add-category" });

//       const formData = new FormData();
//       formData.append("visitor_category[name]", name.trim());
//       formData.append("visitor_category[code]", code.trim().toUpperCase());
//       if (icon) formData.append("visitor_category[icon_attributes][image]", icon);

//       await postVisitorCategory(formData);

//       toast.success("Added successfully", { id: "add-category" });
//       setAdded?.(true); // refresh list
//       onclose();
//     } catch (error) {
//       console.error(error);
//       const errorMessage =
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         "Failed to add category";
//       toast.error(errorMessage, { id: "add-category" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ModalWrapper onclose={onclose}>
//       <div className="flex flex-col p-6 max-w-md mx-auto bg-white rounded-lg">
//         <h2 className="border-b pb-4 text-center font-bold text-xl mb-4">
//           Add Visitor Category
//         </h2>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg outline-none"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Code</label>
//           <input
//             value={code}
//             onChange={(e) => setCode(e.target.value.toUpperCase())}
//             className="w-full px-4 py-2 border rounded-lg uppercase outline-none"
//           />
//         </div>

//         <div className="mb-4 text-center">
//           <label className="block text-sm font-medium mb-1">Icon</label>
//           {iconPreview ? (
//             <img
//               src={iconPreview}
//               alt="preview"
//               className="w-20 h-20 mb-2 border rounded mx-auto object-contain bg-gray-50"
//             />
//           ) : (
//             <div className="w-20 h-20 mb-2 border rounded mx-auto bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
//               No Preview
//             </div>
//           )}
//           <input
//             type="file"
//             ref={iconInputRef}
//             accept="image/*"
//             onChange={handleIconChange}
//             className="text-xs w-full"
//           />
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           style={{ backgroundColor: themeColor }}
//           className="mt-4 py-3 text-black rounded-lg font-bold hover:brightness-90 transition-all shadow-md"
//         >
//           {loading ? "Adding..." : "Submit"}
//         </button>
//       </div>
//     </ModalWrapper>
//   );
// };

// export default AddVisitorSetupModal;
