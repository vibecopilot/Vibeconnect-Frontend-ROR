import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllUnits,
  getParkingConfig,
  getSetupUsers,
  postRegisteredVehicle,
} from "../../api";
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
        console.log(error);
        toast.error("Failed to load parking slots");
      }
    };

    const fetchUnits = async () => {
      try {
        const unitRes = await getAllUnits();
        setUnits(unitRes.data || []);
      } catch (error) {
        console.log(error);
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
        console.log(error);
        toast.error("Failed to load users");
      }
    };

    fetchParkingConfig();
    fetchUnits();
    fetchUsers();
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
              onChange={handleChange}
              name="vehicleCategory"
            >
              <option value="">Select Vehicle Category</option>
              <option value="2 Wheeler">2 Wheeler</option>
              <option value="4 Wheeler">4 Wheeler</option>
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
            >
              <option value="">Select Vehicle Type</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Bike">Bike</option>
              <option value="Truck">Truck</option>
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
