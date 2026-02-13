// import React, { useState } from "react";
// import SetupNavbar from "../../../components/navbars/SetupNavbar";
// import { useSelector } from "react-redux";
// import { FaCamera } from "react-icons/fa";
// import { createPet } from "../../../api"; 

// const PetsAdd = () => {
//   const themeColor = useSelector((state) => state.theme.color);
  


//   const [formData, setFormData] = useState({
//     pet_name: "",
//     owner_mobile_no: "",
//     pet_breed: "",
//     gender: "",
//     colour: "",
//     age: "",
//     dob: "",
//     is_transferred: false,
//     brought: false,
//     stray_adopted: false,
//     brought_from_city: false,
//     born_to_owner: false,
//     building: "",
//     floor: "",
//     unit: "",
//     user: "",
//     attachments: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       attachments: e.target.files,
//     });
//   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log("Form Data:", formData);
// //   };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await createPet(formData);

//     console.log("Pet Created:", response.data);

//     alert("Pet Created Successfully ✅");

//     // optional redirect
//     navigate("/setup/pets");

//   } catch (error) {
//     console.error("Create failed:", error);
//     alert("Something went wrong ❌");
//   }
// };


//   return (
//     <div className="flex bg-gray-100 min-h-screen">
//       <SetupNavbar />

//       <div className="w-full p-8">
//         <div className="bg-white rounded-2xl shadow-md p-6">

//           {/* Header */}
//           <div
//             className="text-white text-center py-3 rounded-xl font-semibold text-lg mb-6"
//             style={{ background: themeColor }}
//           >
//             Add Pet
//           </div>

//           <form onSubmit={handleSubmit}>

//             {/* Top Section */}
//             <div className="flex gap-6">

//               {/* Profile Image */}
//               <div className="flex flex-col items-center gap-3">
//                 <div className="w-28 h-28 rounded-full border-4 border-purple-400 flex items-center justify-center bg-gray-200">
//                   <div className="w-20 h-20 rounded-full bg-gray-300"></div>
//                 </div>
//                 <FaCamera className="text-gray-500 cursor-pointer" size={20} />
//               </div>

//               {/* Form Fields */}
//               <div className="flex-1">

//                 {/* Row 1 */}
//                 <div className="grid grid-cols-3 gap-4 mb-4">
//                   <Input label="Pet Name *" name="pet_name" value={formData.pet_name} onChange={handleChange} />
//                   <Input label="Owner Mobile *" name="owner_mobile_no" value={formData.owner_mobile_no} onChange={handleChange} />
//                   <Input label="Pet Breed" name="pet_breed" value={formData.pet_breed} onChange={handleChange} />
//                 </div>

//                 {/* Row 2 */}
//                 <div className="grid grid-cols-3 gap-4 mb-4">
//                   <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
//                     <option value="">Select Gender</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                   </Select>

//                   <Input label="Colour" name="colour" value={formData.colour} onChange={handleChange} />
//                   <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="e.g., 1 year" />
//                 </div>

//                 {/* DOB */}
//                 <div className="mb-6">
//                   <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//                 </div>

//               </div>
//             </div>

//             <hr className="my-6" />

//             {/* Additional Info */}
//             <h3 className="font-semibold mb-4">Additional Information</h3>

//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <Checkbox label="Is Pet Transferred" name="is_transferred" checked={formData.is_transferred} onChange={handleChange} />
//               <Checkbox label="Brought" name="brought" checked={formData.brought} onChange={handleChange} />
//               <Checkbox label="Stray Pet Adopted" name="stray_adopted" checked={formData.stray_adopted} onChange={handleChange} />
//               <Checkbox label="Brought from Current City" name="brought_from_city" checked={formData.brought_from_city} onChange={handleChange} />
//               <Checkbox label="Pet Born to Owner's Dog" name="born_to_owner" checked={formData.born_to_owner} onChange={handleChange} />
//             </div>

//             {/* Dropdown Section */}
//             <div className="grid grid-cols-4 gap-4 mb-6">
//               <Select label="Select Building" name="building" value={formData.building} onChange={handleChange}>
//                 <option>Select Building</option>
//               </Select>
//               <Select label="Select Floor" name="floor" value={formData.floor} onChange={handleChange}>
//                 <option>Select Floor</option>
//               </Select>
//               <Select label="Select Unit" name="unit" value={formData.unit} onChange={handleChange}>
//                 <option>Select Unit</option>
//               </Select>
//               <Select label="Select User" name="user" value={formData.user} onChange={handleChange}>
//                 <option>Select User</option>
//               </Select>
//             </div>

//             {/* Attachment */}
//             <div className="mb-6">
//               <label className="block font-medium mb-2">Pet Attachment</label>
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="w-full border rounded-md p-2 bg-gray-50"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 className="px-6 py-2 bg-gray-200 rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="px-6 py-2 text-white rounded-lg"
//                 style={{
//                   background: "linear-gradient(90deg, #7b2ff7 0%, #9b4dff 100%)",
//                 }}
//               >
//                 Create Pet
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* Reusable Components */

// const Input = ({ label, ...props }) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <input
//       {...props}
//       className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//     />
//   </div>
// );

// const Select = ({ label, children, ...props }) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <select
//       {...props}
//       className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//     >
//       {children}
//     </select>
//   </div>
// );

// const Checkbox = ({ label, ...props }) => (
//   <label className="flex items-center gap-2 text-sm">
//     <input type="checkbox" {...props} />
//     {label}
//   </label>
// );

// export default PetsAdd;



// import React, { useState } from "react";
// import SetupNavbar from "../../../components/navbars/SetupNavbar";
// import { useSelector } from "react-redux";
// import { FaCamera } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { createPet } from "../../../api";

// const PetsAdd = () => {
//   const themeColor = useSelector((state) => state.theme.color);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     pet_name: "",
//     owner_mobile_no: "",
//     pet_breed: "",
//     gender: "",
//     colour: "",
//     age: "",
//     dob: "",
//     is_transferred: false,
//     brought: false,
//     stray_adopted: false,
//     brought_from_city: false,
//     born_to_owner: false,
//     building: "",
//     floor: "",
//     unit: "",
//     user: "",
//     attachments: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       attachments: e.target.files,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();

//       Object.keys(formData).forEach((key) => {
//         if (key !== "attachments") {
//           data.append(`pet[${key}]`, formData[key]);
//         }
//       });

//       if (formData.attachments) {
//         for (let i = 0; i < formData.attachments.length; i++) {
//           data.append("pet[pet_images][]", formData.attachments[i]);
//         }
//       }

//       await createPet(data);

//       alert("Pet Created Successfully ✅");

//       navigate("/setup/pets");
//     } catch (error) {
//       console.error("Create failed:", error);
//       alert("Something went wrong ❌");
//     }
//   };

//   return (
//     <div className="flex bg-gray-100 min-h-screen">
//       <SetupNavbar />

//       <div className="w-full p-8">
//         <div className="bg-white rounded-2xl shadow-md p-6">

//           {/* Header */}
//           <div
//             className="text-white text-center py-3 rounded-xl font-semibold text-lg mb-6"
//             style={{ background: themeColor }}
//           >
//             Add Pet
//           </div>

//           <form onSubmit={handleSubmit}>

//             {/* Top Section */}
//             <div className="flex gap-6">

//               {/* Profile Image */}
//               <div className="flex flex-col items-center gap-3">
//                 <div className="w-28 h-28 rounded-full border-4 border-purple-400 flex items-center justify-center bg-gray-200">
//                   <div className="w-20 h-20 rounded-full bg-gray-300"></div>
//                 </div>
//                 <FaCamera className="text-gray-500 cursor-pointer" size={20} />
//               </div>

//               {/* Form Fields */}
//               <div className="flex-1">

//                 {/* Row 1 */}
//                 <div className="grid grid-cols-3 gap-4 mb-4">
//                   <Input label="Pet Name *" name="pet_name" value={formData.pet_name} onChange={handleChange} />
//                   <Input label="Owner Mobile *" name="owner_mobile_no" value={formData.owner_mobile_no} onChange={handleChange} />
//                   <Input label="Pet Breed" name="pet_breed" value={formData.pet_breed} onChange={handleChange} />
//                 </div>

//                 {/* Row 2 */}
//                 <div className="grid grid-cols-3 gap-4 mb-4">
//                   <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                   </Select>

//                   <Input label="Colour" name="colour" value={formData.colour} onChange={handleChange} />
//                   <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="e.g., 1 year" />
//                 </div>

//                 {/* DOB */}
//                 <div className="mb-6">
//                   <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//                 </div>

//               </div>
//             </div>

//             <hr className="my-6" />

//             {/* Additional Info */}
//             <h3 className="font-semibold mb-4">Additional Information</h3>

//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <Checkbox label="Is Pet Transferred" name="is_transferred" checked={formData.is_transferred} onChange={handleChange} />
//               <Checkbox label="Brought" name="brought" checked={formData.brought} onChange={handleChange} />
//               <Checkbox label="Stray Pet Adopted" name="stray_adopted" checked={formData.stray_adopted} onChange={handleChange} />
//               <Checkbox label="Brought from Current City" name="brought_from_city" checked={formData.brought_from_city} onChange={handleChange} />
//               <Checkbox label="Pet Born to Owner's Dog" name="born_to_owner" checked={formData.born_to_owner} onChange={handleChange} />
//             </div>

//             {/* Dropdown Section */}
//             <div className="grid grid-cols-4 gap-4 mb-6">
//               <Select label="Select Building" name="building" value={formData.building} onChange={handleChange}>
//                 <option value="">Select Building</option>
//               </Select>
//               <Select label="Select Floor" name="floor" value={formData.floor} onChange={handleChange}>
//                 <option value="">Select Floor</option>
//               </Select>
//               <Select label="Select Unit" name="unit" value={formData.unit} onChange={handleChange}>
//                 <option value="">Select Unit</option>
//               </Select>
//               <Select label="Select User" name="user" value={formData.user} onChange={handleChange}>
//                 <option value="">Select User</option>
//               </Select>
//             </div>

//             {/* Attachment */}
//             <div className="mb-6">
//               <label className="block font-medium mb-2">Pet Attachment</label>
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="w-full border rounded-md p-2 bg-gray-50"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 onClick={() => navigate("/setup/pets")}
//                 className="px-6 py-2 bg-gray-200 rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="px-6 py-2 text-white rounded-lg"
//                 style={{
//                   background: "linear-gradient(90deg, #7b2ff7 0%, #9b4dff 100%)",
//                 }}
//               >
//                 Create Pet
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* Reusable Components */

// const Input = ({ label, ...props }) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <input
//       {...props}
//       className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//     />
//   </div>
// );

// const Select = ({ label, children, ...props }) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <select
//       {...props}
//       className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//     >
//       {children}
//     </select>
//   </div>
// );

// const Checkbox = ({ label, ...props }) => (
//   <label className="flex items-center gap-2 text-sm">
//     <input type="checkbox" {...props} />
//     {label}
//   </label>
// );

// export default PetsAdd;






// import React, { useState, useEffect } from "react";
// import SetupNavbar from "../../../components/navbars/SetupNavbar";
// import { useSelector } from "react-redux";
// import { FaCamera } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// import {
//   postPet,
//   getBuildings,
//   getFloors,
//   getUnits,
//   getUsers,
// } from "../../../api";

// const PetsAdd = () => {
//   const themeColor = useSelector((state) => state.theme.color);
//   const navigate = useNavigate();

//   // ================= STATE =================

//   const [formData, setFormData] = useState({
//     pet_name: "",
//     owner_mobile_no: "",
//     pet_breed: "",
//     gender: "",
//     colour: "",
//     age: "",
//     dob: "",
//     is_pet_transfered: false,
//     brought: false,
//     stray_pet_adopted: false,
//     whether_brought_from_current_city: false,
//     pet_born_to_owner_dog: false,
//     user_id: "",
//     attachments: null,
//   });

//   const [buildings, setBuildings] = useState([]);
//   const [floors, setFloors] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [selectedBuilding, setSelectedBuilding] = useState("");
//   const [selectedFloor, setSelectedFloor] = useState("");

//   // ================= LOAD INITIAL =================

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const b = await getBuildings();
//         const u = await getUsers();
//         setBuildings(b.data);
//         setUsers(u.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     loadData();
//   }, []);

//   // ================= DEPENDENT DROPDOWNS =================

//   useEffect(() => {
//     if (selectedBuilding) {
//       getFloors(selectedBuilding).then((res) => {
//         setFloors(res.data);
//         setUnits([]);
//         setSelectedFloor("");
//       });
//     }
//   }, [selectedBuilding]);

//   useEffect(() => {
//     if (selectedFloor) {
//       getUnits(selectedFloor).then((res) => {
//         setUnits(res.data);
//       });
//     }
//   }, [selectedFloor]);

//   // ================= HANDLERS =================

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       attachments: e.target.files,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();

//       data.append("pet[pet_name]", formData.pet_name);
//       data.append("pet[owner_mobile_no]", formData.owner_mobile_no);
//       data.append("pet[pet_breed]", formData.pet_breed);
//       data.append("pet[gender]", formData.gender);
//       data.append("pet[colour]", formData.colour);
//       data.append("pet[age]", formData.age);
//       data.append("pet[dob]", formData.dob);
//       data.append("pet[user_id]", formData.user_id);

//       data.append("pet[is_pet_transfered]", formData.is_pet_transfered ? 1 : 0);
//       data.append("pet[brought]", formData.brought ? 1 : 0);
//       data.append("pet[stray_pet_adopted]", formData.stray_pet_adopted ? 1 : 0);
//       data.append(
//         "pet[whether_brought_from_current_city]",
//         formData.whether_brought_from_current_city ? 1 : 0
//       );
//       data.append(
//         "pet[pet_born_to_owner_dog]",
//         formData.pet_born_to_owner_dog ? 1 : 0
//       );

//       if (formData.attachments) {
//         for (let i = 0; i < formData.attachments.length; i++) {
//           data.append("pet[pet_images][]", formData.attachments[i]);
//         }
//       }

//       await postPet(data);

//       alert("Pet Created Successfully ✅");
//       navigate("/setup/pets");
//     } catch (error) {
//       console.error(error.response?.data || error);
//       alert("Something went wrong ❌");
//     }
//   };

//   // ================= UI =================

//   return (
//     <div className="flex bg-gray-100 min-h-screen">
//       <SetupNavbar />

//       <div className="w-full p-8">
//         <div className="bg-white rounded-2xl shadow-md p-6">

//           <div
//             className="text-white text-center py-3 rounded-xl font-semibold text-lg mb-6"
//             style={{ background: themeColor }}
//           >
//             Add Pet
//           </div>

//           <form onSubmit={handleSubmit}>

//             {/* BASIC DETAILS */}
//             <div className="grid grid-cols-3 gap-4 mb-4">
//               <Input label="Pet Name *" name="pet_name" value={formData.pet_name} onChange={handleChange} />
//               <Input label="Owner Mobile *" name="owner_mobile_no" value={formData.owner_mobile_no} onChange={handleChange} />
//               <Input label="Pet Breed" name="pet_breed" value={formData.pet_breed} onChange={handleChange} />
//             </div>

//             <div className="grid grid-cols-3 gap-4 mb-4">
//               <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </Select>
//               <Input label="Colour" name="colour" value={formData.colour} onChange={handleChange} />
//               <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
//             </div>

//             <div className="mb-6">
//               <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//             </div>

//             {/* DROPDOWNS */}
//             <div className="grid grid-cols-4 gap-4 mb-6">
//               <Select label="Building" value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)}>
//                 <option value="">Select</option>
//                 {buildings.map((b) => (
//                   <option key={b.id} value={b.id}>{b.name}</option>
//                 ))}
//               </Select>

//               <Select label="Floor" value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
//                 <option value="">Select</option>
//                 {floors.map((f) => (
//                   <option key={f.id} value={f.id}>{f.name}</option>
//                 ))}
//               </Select>

//               <Select label="Unit">
//                 <option value="">Select</option>
//                 {units.map((u) => (
//                   <option key={u.id} value={u.id}>{u.name}</option>
//                 ))}
//               </Select>

//               <Select label="User" name="user_id" value={formData.user_id} onChange={handleChange}>
//                 <option value="">Select</option>
//                 {users.map((u) => (
//                   <option key={u.id} value={u.id}>{u.name}</option>
//                 ))}
//               </Select>
//             </div>

//             {/* FILE */}
//             <div className="mb-6">
//               <input type="file" multiple onChange={handleFileChange} />
//             </div>

//             <div className="flex justify-end gap-4">
//               <button type="button" onClick={() => navigate("/setup/pets")} className="px-6 py-2 bg-gray-200 rounded-lg">
//                 Cancel
//               </button>
//               <button type="submit" className="px-6 py-2 text-white rounded-lg" style={{ background: themeColor }}>
//                 Create Pet
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Input = ({ label, ...props }) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <input {...props} className="w-full mt-1 bg-gray-100 border rounded-md p-2" />
//   </div>
// );

// const Select = ({ label, children, ...props }) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <select {...props} className="w-full mt-1 bg-gray-100 border rounded-md p-2">
//       {children}
//     </select>
//   </div>
// );

// export default PetsAdd;



import React, { useState, useEffect, useRef } from "react";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

import {
  postPet,
  getBuildings,
  getFloors,
  getUnits,
  getUsers,
} from "../../../api";

const PetsAdd = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const navigate = useNavigate();
  const fileRef = useRef();

  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [formData, setFormData] = useState({
    pet_name: "",
    owner_mobile_no: "",
    pet_breed: "",
    gender: "",
    colour: "",
    age: "",
    dob: "",
    is_pet_transfered: false,
    brought: false,
    stray_pet_adopted: false,
    whether_brought_from_current_city: false,
    pet_born_to_owner_dog: false,
    building_id: "",
    floor_id: "",
    unit_id: "",
    user_id: "",
    attachments: null,
  });

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Load Buildings + Users
  useEffect(() => {
    const load = async () => {
      const b = await getBuildings();
      const u = await getUsers();
      setBuildings(b.data);
      setUsers(u.data);
    };
    load();
  }, []);

  // Building → Floors
  useEffect(() => {
    if (formData.building_id) {
      getFloors(formData.building_id).then((res) => {
        setFloors(res.data);
        setUnits([]);
        setFilteredUsers([]);
        setFormData((prev) => ({
          ...prev,
          floor_id: "",
          unit_id: "",
          user_id: "",
        }));
      });
    }
  }, [formData.building_id]);

  // Floor → Units
  useEffect(() => {
    if (formData.floor_id) {
      getUnits(formData.floor_id).then((res) => {
        setUnits(res.data);
        setFilteredUsers([]);
        setFormData((prev) => ({
          ...prev,
          unit_id: "",
          user_id: "",
        }));
      });
    }
  }, [formData.floor_id]);

  // Unit → Filter Users
  useEffect(() => {
    if (formData.unit_id) {
      const filtered = users.filter(
        (u) => String(u.unit_id) === String(formData.unit_id)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [formData.unit_id, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const selectedUser = filteredUsers.find(
      (u) => String(u.id) === String(userId)
    );

    setFormData((prev) => ({
      ...prev,
      user_id: userId,
      owner_mobile_no:
        selectedUser?.mobile ||
        selectedUser?.mobile_no ||
        selectedUser?.phone ||
        selectedUser?.contact_number ||
        "",
    }));
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleAttachmentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachments: e.target.files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "attachments") {
          data.append(`pet[${key}]`, formData[key]);
        }
      });

      if (profileImage) {
        data.append("pet[profile_image]", profileImage);
      }

      if (formData.attachments) {
        for (let i = 0; i < formData.attachments.length; i++) {
          data.append("pet[pet_images][]", formData.attachments[i]);
        }
      }

      await postPet(data);
      alert("Pet Created Successfully ✅");
      navigate("/setup/pets");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SetupNavbar />
      <div className="w-full p-8">
        <div className="bg-white rounded-2xl shadow-md p-6">

          <div
            className="text-white text-center py-3 rounded-xl font-semibold text-lg mb-6"
            style={{ background: themeColor }}
          >
            Add Pet
          </div>

          <form onSubmit={handleSubmit}>

            {/* PROFILE IMAGE */}
            <div className="relative w-32 h-32 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-purple-400 overflow-hidden bg-gray-200">
                {profilePreview && (
                  <img src={profilePreview} className="w-full h-full object-cover" />
                )}
              </div>
              <div
                onClick={() => fileRef.current.click()}
                className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer"
              >
                <FaCamera size={14} className="text-white" />
              </div>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                onChange={handleProfileChange}
                className="hidden"
              />
            </div>

            {/* BASIC FIELDS */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input label="Pet Name" name="pet_name" value={formData.pet_name} onChange={handleChange} />
              <Input label="Owner Mobile" name="owner_mobile_no" value={formData.owner_mobile_no} onChange={handleChange} />
              <Input label="Pet Breed" name="pet_breed" value={formData.pet_breed} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>

              <Input label="Colour" name="colour" value={formData.colour} onChange={handleChange} />
              <Input label="Age" name="age" value={formData.age} onChange={handleChange} />
            </div>

            <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />

            <hr className="my-6" />

            {/* CHECKBOXES */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Checkbox label="Is Pet Transferred" name="is_pet_transfered" checked={formData.is_pet_transfered} onChange={handleChange} />
              <Checkbox label="Brought" name="brought" checked={formData.brought} onChange={handleChange} />
              <Checkbox label="Stray Pet Adopted" name="stray_pet_adopted" checked={formData.stray_pet_adopted} onChange={handleChange} />
              <Checkbox label="Brought from Current City" name="whether_brought_from_current_city" checked={formData.whether_brought_from_current_city} onChange={handleChange} />
              <Checkbox label="Pet Born to Owner's Dog" name="pet_born_to_owner_dog" checked={formData.pet_born_to_owner_dog} onChange={handleChange} />
            </div>

            {/* BUILDING FLOW */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Select label="Building" name="building_id" value={formData.building_id} onChange={handleChange}>
                <option value="">Select</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>

              <Select label="Floor" name="floor_id" value={formData.floor_id} onChange={handleChange}>
                <option value="">Select</option>
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </Select>

              <Select label="Unit" name="unit_id" value={formData.unit_id} onChange={handleChange}>
                <option value="">Select</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Select>

              <Select label="User" name="user_id" value={formData.user_id} onChange={handleUserChange}>
                <option value="">Select</option>
                {filteredUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.full_name || `User ${u.id}`}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">Attachments</label>
              <input type="file" multiple onChange={handleAttachmentChange} />
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => navigate("/setup/pets")} className="px-6 py-2 bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-6 py-2 text-white rounded-lg" style={{ background: themeColor }}>
                {submitting ? "Creating..." : "Create Pet"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 bg-gray-100 border rounded-md p-2" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="w-full mt-1 bg-gray-100 border rounded-md p-2">
      {children}
    </select>
  </div>
);

const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" {...props} />
    {label}
  </label>
);

export default PetsAdd;
