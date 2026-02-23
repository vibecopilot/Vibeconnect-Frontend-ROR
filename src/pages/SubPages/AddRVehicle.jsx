import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllUnits,
  getParkingConfig,
  getSetupUsers,
  postRegisteredVehicle,
} from "../../api";
import { getVehicleSetups } from "../../api";
import toast from "react-hot-toast";
import { getItemInLocalStorage } from "../../utils/localStorage";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const AddRVehicles = () => {
  const today = new Date().toISOString().split("T")[0];
  const themeColor = useSelector((state) => state.theme.color);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);

  const [formData, setFormData] = useState({
    slotNumber: "",
    vehicleCategory: "",
    vehicleType: "",
    stickerNumber: "",
    registrationNumber: "",
    InsuranceNumber: "",
    InsuranceTill: "",
    Category: "",
    vehicleNumber: "",
    unit: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 useEffect(() => {
  const fetchParkingConfig = async () => {
    try {
      const parkingRes = await getParkingConfig();
      setSlots(parkingRes.data || []);
    } catch (error) {
      toast.error("Failed to load parking slots");
    }
  };

  const fetchUnits = async () => {
    try {
      const unitRes = await getAllUnits();
      setUnits(unitRes.data || []);
    } catch (error) {
      toast.error("Failed to load units");
    }
  };

  const fetchUsers = async () => {
    try {
      const userRes = await getSetupUsers();
      const userData = (userRes.data || []).map((user) => ({
        value: user.id,
        label: `${user.firstname} ${user.lastname}`,
      }));
      setUsers(userData);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  // ✅ Vehicle Setup API Integration
//  const fetchVehicleSetups = async () => {
//   try {
//     const res = await getVehicleSetups(47);

//     console.log("Vehicle Setup Response:", res.data);

//     const vehicleData = res.data || [];

//     // Extract unique categories
//     const categories = [
//       ...new Set(vehicleData.map((item) => item.vehicle_category)),
//     ];

//     // Extract vehicle types
//     const types = vehicleData.map((item) => item.vehicle_type_name);

//     setVehicleCategories(categories);
//     setVehicleTypes(types);

//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to load vehicle setups");
//   }
// };

const fetchVehicleSetups = async () => {
  try {
    const res = await getVehicleSetups(47);

    const data = res.data || [];

    console.log("Vehicle Setup Response:", data);

    setVehicleData(data); // store full data

    // Extract unique categories
    const categories = [
      ...new Set(data.map((item) => item.vehicle_category)),
    ];

    setVehicleCategories(categories);

  } catch (error) {
    console.error(error);
    toast.error("Failed to load vehicle setups");
  }
};
  fetchParkingConfig();
  fetchUnits();
  fetchUsers();
  fetchVehicleSetups();

}, []);

  const handleUserSelection = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const userId = getItemInLocalStorage("UserId");
  const navigate = useNavigate();

  const handleAddRVehicle = async () => {
    // basic frontend validation; adjust according to backend validations
    if (
      !selectedUser ||
      !formData.slotNumber ||
      !formData.vehicleCategory ||
      !formData.vehicleType ||
      !formData.registrationNumber ||
      !formData.vehicleNumber ||
      !formData.Category ||
      !formData.unit
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    const postData = new FormData();
    postData.append("registered_vehicle[slot_number]", formData.slotNumber);
    postData.append(
      "registered_vehicle[vehicle_category]",
      formData.vehicleCategory
    );
    postData.append("registered_vehicle[vehicle_type]", formData.vehicleType);
    postData.append(
      "registered_vehicle[sticker_number]",
      formData.stickerNumber
    );
    postData.append(
      "registered_vehicle[registration_number]",
      formData.registrationNumber
    );
    postData.append(
      "registered_vehicle[insurance_number]",
      formData.InsuranceNumber
    );
    postData.append(
      "registered_vehicle[insurance_valid_till]",
      formData.InsuranceTill
    );
    postData.append("registered_vehicle[category]", formData.Category);
    postData.append(
      "registered_vehicle[vehicle_number]",
      formData.vehicleNumber
    );
    postData.append("registered_vehicle[unit_id]", formData.unit);
    if (userId) {
      postData.append("registered_vehicle[created_by_id]", userId);
    }

    // safe access in case selectedUser is null
    const userID = selectedUser?.value;
    if (userID) {
      postData.append("registered_vehicle[user_id]", userID);
    }

    try {
      const registeredRes = await postRegisteredVehicle(postData);
      console.log(registeredRes);
      toast.success("Vehicle Registered Successfully");
      navigate("/admin/passes/registered-vehicles");
    } catch (error) {
      console.log(error?.response?.data || error);
      // Show backend validation errors if available
      if (error?.response?.status === 422 && error?.response?.data) {
        toast.error("Validation failed, please check your inputs");
      } else {
        toast.error("Failed to register vehicle");
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full p-4">
      <div className="border border-gray-300 rounded-lg p-2 w-full mx-4">
        <h2
          style={{ background: themeColor }}
          className="text-center md:text-xl font-bold p-2 bg-black rounded-md text-white mb-4"
        >
          Add Vehicles
        </h2>

        <div className="grid md:grid-cols-3 gap-5 my-2">
          {/* User */}
          <div className="flex flex-col">
            <label htmlFor="users" className="font-semibold">
              Select User
            </label>
            <Select
              options={users}
              noOptionsMessage={() => "No Users Available..."}
              onChange={handleUserSelection}
              value={selectedUser}
            />
          </div>

          {/* Slot */}
          <div className="flex flex-col">
            <label htmlFor="slotNumber" className="font-semibold">
              Select parking Slot
            </label>
            <select
              name="slotNumber"
              value={formData.slotNumber}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Slot</option>
              {Array.isArray(slots) &&
                slots.map((slot) => (
                  <option value={slot.id} key={slot.id}>
                    {slot.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Vehicle Category */}
          <div className="flex flex-col">
            <label htmlFor="vehicleCategory" className="font-semibold">
              Vehicle Category
            </label>
       <select
  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
  value={formData.vehicleCategory}
  name="vehicleCategory"
  onChange={(e) => {
    const selectedCategory = e.target.value;

    // Update category and reset type
    setFormData((prev) => ({
      ...prev,
      vehicleCategory: selectedCategory,
      vehicleType: "",
    }));

    // Filter types from API data
    const filteredTypes = vehicleData
      .filter(
        (item) =>
          item.vehicle_category.trim() === selectedCategory.trim()
      )
      .map((item) => item.vehicle_type_name);

    console.log("Filtered Types:", filteredTypes); // Debug

    setVehicleTypes(filteredTypes);
  }}
>
  <option value="">Select Vehicle Category</option>
  {vehicleCategories.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>
          </div>

        {/* Vehicle Type */}
<div className="flex flex-col">
  <label htmlFor="vehicleType" className="font-semibold">
    Vehicle Type
  </label>

  <select
    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
    value={formData.vehicleType}
    onChange={handleChange}
    name="vehicleType"
    disabled={!formData.vehicleCategory}
  >
    <option value="">Select Vehicle Type</option>

    {[...new Set(vehicleTypes)].map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}

  </select>
</div>
          {/* Sticker Number */}
          <div className="flex flex-col">
            <label htmlFor="stickerNumber" className="font-semibold">
              Sticker Number
            </label>
            <input
              type="text"
              id="stickerNumber"
              name="stickerNumber"
              value={formData.stickerNumber}
              onChange={handleChange}
              placeholder="Enter Sticker Number"
              className="border p-2 rounded-md border-gray-300"
            />
          </div>

          {/* Registration Number */}
          <div className="flex flex-col">
            <label htmlFor="registrationNumber" className="font-semibold">
              Registration Number
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="Enter Registration Number"
              className="border p-2 rounded-md border-gray-300"
            />
          </div>

          {/* Insurance Number */}
          <div className="flex flex-col">
            <label htmlFor="insuranceNumber" className="font-semibold">
              Insurance Number
            </label>
            <input
              type="text"
              id="insuranceNumber"
              name="InsuranceNumber"
              value={formData.InsuranceNumber}
              onChange={handleChange}
              placeholder="Enter Insurance Number"
              className="border p-2 rounded-md border-gray-300"
            />
          </div>

          {/* Insurance Valid Till */}
          <div className="flex flex-col">
            <label htmlFor="insuranceValidTill" className="font-semibold">
              Insurance Valid Till
            </label>
            <input
              type="date"
              id="insuranceValidTill"
              name="InsuranceTill"
              value={formData.InsuranceTill}
              onChange={handleChange}
              className="border p-2 rounded-md border-gray-300"
              min={today}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label htmlFor="category" className="font-semibold">
              Category
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={formData.Category}
              onChange={handleChange}
              name="Category"
            >
              <option value="">Select Category</option>
              <option value="Owned">Owned</option>
              <option value="Staff">Staff</option>
              <option value="Leased">Leased</option>
              <option value="warehouse">warehouse</option>
              <option value="workshop">workshop</option>
            </select>
          </div>

          {/* Vehicle Number */}
          <div className="flex flex-col">
            <label htmlFor="vehicleNumber" className="font-semibold">
              Vehicle Number
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter Vehicle Number"
              className="border p-2 rounded-md border-gray-300"
            />
          </div>

          {/* Unit */}
          <div className="flex flex-col">
            <label htmlFor="unit" className="font-semibold">
              Unit
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={formData.unit}
              onChange={handleChange}
              name="unit"
            >
              <option value="">Select Unit</option>
              {units.map((unit) => (
                <option value={unit.id} key={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-5 justify-center items-center my-4">
          <button
            onClick={handleAddRVehicle}
            className="text-white bg-black hover:bg-white hover:text-black border-2 border-black font-semibold py-2 px-4 rounded transition-all duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRVehicles;



// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   getAllUnits,
//   getParkingConfig,
//   getSetupUsers,
//   postRegisteredVehicle,
//   getVehicleSetups,   // 👈 Added here directly
// } from "../../api";
// import toast from "react-hot-toast";
// import { getItemInLocalStorage } from "../../utils/localStorage";
// import Select from "react-select";
// import { useNavigate } from "react-router-dom";

// const AddRVehicles = () => {
//   const today = new Date().toISOString().split("T")[0];
//   const themeColor = useSelector((state) => state.theme.color);

//   const [units, setUnits] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [slots, setSlots] = useState([]);
//   const [vehicleCategories, setVehicleCategories] = useState([]);
//   const [vehicleTypes, setVehicleTypes] = useState([]);

//   const [formData, setFormData] = useState({
//     slotNumber: "",
//     vehicleCategory: "",
//     vehicleType: "",
//     stickerNumber: "",
//     registrationNumber: "",
//     InsuranceNumber: "",
//     InsuranceTill: "",
//     Category: "",
//     vehicleNumber: "",
//     unit: "",
//   });

//   const navigate = useNavigate();
//   const userId = getItemInLocalStorage("UserId");

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleUserSelection = (selectedOption) => {
//     setSelectedUser(selectedOption);
//   };

//   // =============================
//   // Fetch All Initial Data
//   // =============================
//   useEffect(() => {
//     fetchParkingConfig();
//     fetchUnits();
//     fetchUsers();
//     fetchVehicleSetups();
//   }, []);

//   const fetchParkingConfig = async () => {
//     try {
//       const res = await getParkingConfig();
//       setSlots(res.data || []);
//     } catch (error) {
//       toast.error("Failed to load parking slots");
//     }
//   };

//   const fetchUnits = async () => {
//     try {
//       const res = await getAllUnits();
//       setUnits(res.data || []);
//     } catch (error) {
//       toast.error("Failed to load units");
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await getSetupUsers();
//       const userData = (res.data || []).map((user) => ({
//         value: user.id,
//         label: `${user.firstname} ${user.lastname}`,
//       }));
//       setUsers(userData);
//     } catch (error) {
//       toast.error("Failed to load users");
//     }
//   };

//   // =============================
//   // Vehicle Setup API Integration
//   // =============================
//   const fetchVehicleSetups = async () => {
//     try {
//       const res = await getVehicleSetups(47);
//       console.log("Vehicle Setup:", res.data);

//       // Adjust keys according to API response
//       setVehicleCategories(res.data.vehicle_categories || []);
//       setVehicleTypes(res.data.vehicle_types || []);
//     } catch (error) {
//       toast.error("Failed to load vehicle setup");
//     }
//   };

//   // =============================
//   // Submit Handler
//   // =============================
//   const handleAddRVehicle = async () => {
//     if (
//       !selectedUser ||
//       !formData.slotNumber ||
//       !formData.vehicleCategory ||
//       !formData.vehicleType ||
//       !formData.registrationNumber ||
//       !formData.vehicleNumber ||
//       !formData.Category ||
//       !formData.unit
//     ) {
//       toast.error("Please fill all required fields!");
//       return;
//     }

//     const postData = new FormData();
//     postData.append("registered_vehicle[slot_number]", formData.slotNumber);
//     postData.append("registered_vehicle[vehicle_category]", formData.vehicleCategory);
//     postData.append("registered_vehicle[vehicle_type]", formData.vehicleType);
//     postData.append("registered_vehicle[sticker_number]", formData.stickerNumber);
//     postData.append("registered_vehicle[registration_number]", formData.registrationNumber);
//     postData.append("registered_vehicle[insurance_number]", formData.InsuranceNumber);
//     postData.append("registered_vehicle[insurance_valid_till]", formData.InsuranceTill);
//     postData.append("registered_vehicle[category]", formData.Category);
//     postData.append("registered_vehicle[vehicle_number]", formData.vehicleNumber);
//     postData.append("registered_vehicle[unit_id]", formData.unit);

//     if (userId) {
//       postData.append("registered_vehicle[created_by_id]", userId);
//     }

//     if (selectedUser?.value) {
//       postData.append("registered_vehicle[user_id]", selectedUser.value);
//     }

//     try {
//       await postRegisteredVehicle(postData);
//       toast.success("Vehicle Registered Successfully");
//       navigate("/admin/passes/registered-vehicles");
//     } catch (error) {
//       if (error?.response?.status === 422) {
//         toast.error("Validation failed, please check inputs");
//       } else {
//         toast.error("Failed to register vehicle");
//       }
//     }
//   };

//   return (
//     <div className="flex justify-center items-center w-full p-4">
//       <div className="border border-gray-300 rounded-lg p-4 w-full mx-4">
//         <h2
//           style={{ background: themeColor }}
//           className="text-center text-xl font-bold p-2 rounded-md text-white mb-4"
//         >
//           Add Vehicles
//         </h2>

//         <div className="grid md:grid-cols-3 gap-5">

//           {/* USER */}
//           <div>
//             <label className="font-semibold">Select User</label>
//             <Select
//               options={users}
//               onChange={handleUserSelection}
//               value={selectedUser}
//             />
//           </div>

//           {/* SLOT */}
//           <div>
//             <label className="font-semibold">Select Parking Slot</label>
//             <select
//               name="slotNumber"
//               value={formData.slotNumber}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Select Slot</option>
//               {slots.map((slot) => (
//                 <option key={slot.id} value={slot.id}>
//                   {slot.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* VEHICLE CATEGORY (Dynamic) */}
//           <div>
//             <label className="font-semibold">Vehicle Category</label>
//             <select
//               name="vehicleCategory"
//               value={formData.vehicleCategory}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Select Category</option>
//               {vehicleCategories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* VEHICLE TYPE (Dynamic) */}
//           <div>
//             <label className="font-semibold">Vehicle Type</label>
//             <select
//               name="vehicleType"
//               value={formData.vehicleType}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Select Type</option>
//               {vehicleTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Remaining Fields Same As Before */}
//           {/* Registration Number */}
//           <div>
//             <label className="font-semibold">Registration Number</label>
//             <input
//               type="text"
//               name="registrationNumber"
//               value={formData.registrationNumber}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           {/* Vehicle Number */}
//           <div>
//             <label className="font-semibold">Vehicle Number</label>
//             <input
//               type="text"
//               name="vehicleNumber"
//               value={formData.vehicleNumber}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           {/* UNIT */}
//           <div>
//             <label className="font-semibold">Unit</label>
//             <select
//               name="unit"
//               value={formData.unit}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">Select Unit</option>
//               {units.map((unit) => (
//                 <option key={unit.id} value={unit.id}>
//                   {unit.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//         </div>

//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleAddRVehicle}
//             className="bg-black text-white px-6 py-2 rounded"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddRVehicles;