import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ModalWrapper from "./ModalWrapper";

const EditVisitorSetupModal = ({ onclose, catId, setAdded, editType }) => {
  const themeColor = useSelector((state) => state.theme.color);
  const token = "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";
  const BASE_URL = "https://admin.vibecopilot.ai";

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(true);
  const [iconFile, setIconFile] = useState(null);
  const [currentIcon, setCurrentIcon] = useState(""); 
  const [iconPreview, setIconPreview] = useState(""); 
  const iconInputRef = useRef(null);

  useEffect(() => {
    if (!catId) return;

    const fetchDetails = async () => {
      try {
        let category;
        if (editType === "visitorCategory") {
          const res = await axios.get(`${BASE_URL}/visitor_categories.json?token=${token}`);
          category = res.data.find(item => item.id === catId);
          setName(category?.name || "");
          setCode(category?.code || "");
          setCurrentIcon(category?.icon ? (category.icon.startsWith("http") ? category.icon : `${BASE_URL}${category.icon}`) : "");
        } 
        else if (editType === "visitorSubCategory") {
          const res = await axios.get(`${BASE_URL}/visitor_sub_categories.json?token=${token}`);
          category = res.data.find(item => item.id === catId);
          setName(category?.name || "");
          setCurrentIcon(category?.iconv2 ? (category.iconv2.startsWith("http") ? category.iconv2 : `${BASE_URL}${category.iconv2}`) : "");
        } 
        else {
          const res = await axios.get(`${BASE_URL}/visitor_staff_categories.json?token=${token}`);
          category = res.data.staff_categories?.find(item => item.id === catId);
          setName(category?.name || "");
        }
        setActive(category?.active ?? true);
      } catch (error) {
        toast.error("Failed to load details");
      }
    };

    fetchDetails();
  }, [catId, editType]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Name is required");

    try {
      toast.loading("Updating...", { id: "edit-modal" });
      const formData = new FormData();

      if (editType === "visitorCategory") {
        formData.append("visitor_category[name]", name.trim());
        formData.append("visitor_category[code]", code.trim());
        formData.append("visitor_category[active]", active ? "1" : "0");
        if (iconFile) formData.append("visitor_category[icon_attributes][image]", iconFile);
        await axios.patch(`${BASE_URL}/visitor_categories/${catId}.json?token=${token}`, formData);
      } 
      else if (editType === "visitorSubCategory") {
        formData.append("visitor_sub_category[name]", name.trim());
        formData.append("visitor_sub_category[active]", active ? "1" : "0");
        if (iconFile) formData.append("visitor_sub_category[iconv2_attributes][image]", iconFile);
        await axios.put(`${BASE_URL}/visitor_sub_categories/${catId}.json?token=${token}`, formData);
      } 
      else {
        formData.append("visitor_staff_category[name]", name.trim());
        await axios.patch(`${BASE_URL}/visitor_staff_categories/${catId}.json?token=${token}`, formData);
      }

      toast.success("Updated successfully", { id: "edit-modal" });
      setAdded(true);
      onclose();
    } catch (error) {
      toast.error("Update failed", { id: "edit-modal" });
    }
  };

  return (
    <ModalWrapper onclose={onclose}>
      <div className="flex flex-col p-6 max-w-md mx-auto">
        <h2 className="border-b pb-4 text-center font-bold text-xl mb-4">Edit Category</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {editType === "visitorCategory" && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Code</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full p-2 border rounded-lg" />
          </div>
        )}

        {(editType === "visitorCategory" || editType === "visitorSubCategory") && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Icon</label>
            {(iconPreview || currentIcon) && (
              <img src={iconPreview || currentIcon} alt="Icon" className="w-20 h-20 mx-auto object-contain border rounded p-1 mb-2" />
            )}
            <input type="file" onChange={handleIconChange} className="text-xs w-full" />
          </div>
        )}

        <div className="flex items-center gap-2 mb-6">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} id="active" className="w-5 h-5" />
          <label htmlFor="active" className="text-sm font-semibold">Active Status</label>
        </div>

        <button onClick={handleSubmit} style={{ background: themeColor }} className="w-full text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
          Save Changes
        </button>
      </div>
    </ModalWrapper>
  );
};

export default EditVisitorSetupModal;



// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import ModalWrapper from "./ModalWrapper";
// import { getItemInLocalStorage } from "../../utils/localStorage";

// const EditVisitorSetupModal = ({ onclose, catId, setAdded, editType }) => {
//   const themeColor = useSelector((state) => state.theme.color);
//   const token =
//     getItemInLocalStorage("TOKEN") ||
//     "140494b3f6c6431bc0964ee3458411ccaa10f7617b197b35";
//   const BASE_URL = "https://admin.vibecopilot.ai";

//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [active, setActive] = useState(true);

//   const [iconFile, setIconFile] = useState(null);
//   const [currentIcon, setCurrentIcon] = useState("");
//   const [iconPreview, setIconPreview] = useState("");

//   const iconInputRef = useRef(null);

//   /* ===============================
//      FETCH DETAILS
//   =============================== */
//   useEffect(() => {
//     if (!catId) return;

//     const fetchDetails = async () => {
//       try {
//         let category;

//         if (editType === "visitorCategory") {
//           const res = await axios.get(
//             `${BASE_URL}/visitor_categories.json?token=${token}`
//           );

//           category = res.data.find(
//             (item) => Number(item.id) === Number(catId)
//           );

//           setName(category?.name || "");
//           setCode(category?.code || "");
//           setActive(category?.active ?? true);

//           if (category?.icon) {
//             const normalizedPath = category.icon.startsWith('/') ? category.icon : `/${category.icon}`;
//             setCurrentIcon(
//               category.icon.startsWith("http")
//                 ? category.icon
//                 : `${BASE_URL}${normalizedPath}`
//             );
//           }
//         }

//         else if (editType === "visitorSubCategory") {
//           const res = await axios.get(
//             `${BASE_URL}/visitor_sub_categories.json?token=${token}`
//           );

//           category = res.data.find(
//             (item) => Number(item.id) === Number(catId)
//           );

//           setName(category?.name || "");
//           setActive(category?.active ?? true);

//           if (category?.iconv2) {
//             const normalizedPath = category.iconv2.startsWith('/') ? category.iconv2 : `/${category.iconv2}`;
//             setCurrentIcon(
//               category.iconv2.startsWith("http")
//                 ? category.iconv2
//                 : `${BASE_URL}${normalizedPath}`
//             );
//           }
//         }

//         else {
//           const res = await axios.get(
//             `${BASE_URL}/visitor_staff_categories.json?token=${token}`
//           );

//           category = res.data.staff_categories?.find(
//             (item) => Number(item.id) === Number(catId)
//           );

//           setName(category?.name || "");
//           setActive(category?.active ?? true);
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load details");
//       }
//     };

//     fetchDetails();
//   }, [catId, editType, token]);

//   /* ===============================
//      ICON CHANGE
//   =============================== */
//   const handleIconChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please upload an image file");
//       return;
//     }

//     // Validate file size (2MB limit)
//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image size must be under 2MB");
//       return;
//     }

//     setIconFile(file);

//     const preview = URL.createObjectURL(file);
//     setIconPreview(preview);
//   };

//   /* ===============================
//      SUBMIT
//   =============================== */
//   const handleSubmit = async () => {
//     if (!name.trim()) {
//       return toast.error("Name is required");
//     }

//     try {
//       toast.loading("Updating...", { id: "edit-modal" });

//       const formData = new FormData();

//       if (editType === "visitorCategory") {
//         formData.append("visitor_category[name]", name.trim());
//         formData.append("visitor_category[code]", code.trim().toUpperCase());
//         formData.append("visitor_category[active]", active ? "1" : "0");
//         if (iconFile) {
//           console.log("Updating visitor category icon:", iconFile, "Type:", iconFile.type, "Size:", iconFile.size);
//           formData.append("visitor_category[icon]", iconFile, iconFile.name);
//         }

//         // Debug: Log FormData contents
//         console.log("FormData entries:");
//         for (let pair of formData.entries()) {
//           console.log(pair[0] + ": ", pair[1]);
//         }

//         const response = await axios.patch(
//           `${BASE_URL}/visitor_categories/${catId}.json?token=${token}`,
//           formData
//         );
//         console.log("Update response:", response.data);
//       }

//       else if (editType === "visitorSubCategory") {
//         formData.append("visitor_sub_category[name]", name.trim());
//         formData.append("visitor_sub_category[active]", active ? "1" : "0");
//         if (iconFile) {
//           console.log("Updating visitor sub category icon:", iconFile, "Type:", iconFile.type, "Size:", iconFile.size);
//           formData.append("visitor_sub_category[iconv2]", iconFile, iconFile.name);
//         }

//         // Debug: Log FormData contents
//         console.log("FormData entries:");
//         for (let pair of formData.entries()) {
//           console.log(pair[0] + ": ", pair[1]);
//         }

//         const response = await axios.patch(
//           `${BASE_URL}/visitor_sub_categories/${catId}.json?token=${token}`,
//           formData
//         );
//         console.log("Update response:", response.data);
//       }

//       else {
//         formData.append("visitor_staff_category[name]", name.trim());
//         formData.append("visitor_staff_category[active]", active ? "1" : "0");

//         await axios.patch(
//           `${BASE_URL}/visitor_staff_categories/${catId}.json?token=${token}`,
//           formData
//         );
//       }

//       toast.success("Updated successfully", { id: "edit-modal" });
//       setAdded(true);
//       onclose();
//     } catch (error) {
//       console.error("Update error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.error || "Update failed", { id: "edit-modal" });
//     }
//   };
//   /* ===============================
//      UI
//   =============================== */
//   return (
//     <ModalWrapper onclose={onclose}>
//       <div className="flex flex-col p-6 max-w-md mx-auto">
//         <h2 className="border-b pb-4 text-center font-bold text-xl mb-4">
//           Edit Category
//         </h2>

//         <div className="mb-4">
//           <label className="block text-sm font-semibold mb-1">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2 border rounded-lg"
//           />
//         </div>

//         {editType === "visitorCategory" && (
//           <div className="mb-4">
//             <label className="block text-sm font-semibold mb-1">Code</label>
//             <input
//               value={code}
//               onChange={(e) => setCode(e.target.value.toUpperCase())}
//               className="w-full p-2 border rounded-lg uppercase"
//             />
//           </div>
//         )}

//         {(editType === "visitorCategory" ||
//           editType === "visitorSubCategory") && (
//           <div className="mb-4">
//             <label className="block text-sm font-semibold mb-1">Icon</label>

//             {(iconPreview || currentIcon) && (
//               <img
//                 src={iconPreview || currentIcon}
//                 alt="icon"
//                 className="w-20 h-20 mx-auto object-contain border rounded p-1 mb-2"
//               />
//             )}

//             <input
//               ref={iconInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleIconChange}
//               className="text-xs w-full"
//             />
//           </div>
//         )}

//         <div className="flex items-center gap-2 mb-6">
//           <input
//             type="checkbox"
//             checked={active}
//             onChange={(e) => setActive(e.target.checked)}
//             className="w-5 h-5"
//           />
//           <span className="text-sm font-semibold">Active</span>
//         </div>

//         <button
//           onClick={handleSubmit}
//           style={{ background: themeColor }}
//           className="w-full text-white py-3 rounded-xl font-bold"
//         >
//           Save Changes
//         </button>
//       </div>
//     </ModalWrapper>
//   );
// };

// export default EditVisitorSetupModal;