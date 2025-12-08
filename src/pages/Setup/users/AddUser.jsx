
import React, { useEffect, useState } from "react";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import toast from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  getFloors,
  getUnits,
  // getSites,
  getBuildings,
  postSetupUsers,
} from "../../../api";
import { useNavigate } from "react-router-dom";
import { getItemInLocalStorage } from "../../../utils/localStorage";

// Mock implementation for getSites, assuming it returns site data
const getSites = () => Promise.resolve({ data: [] });

const AddUser = () => {
  const navigate = useNavigate();
  // siteId is used in the final payload
  const siteId = getItemInLocalStorage("SITEID");

  const [sites, setSites] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);

  // RENAMED: selectedBuilding -> selectedTower to match JSX
  const [selectedTower, setSelectedTower] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  // ADDED: State for Flat Number display
  const [selectedUnitName, setSelectedUnitName] = useState("");

  const [members, setMembers] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
    occupancy_type: "",
    birth_date: "",
    lives_here: "",
    membershipType: "Primary",
    panCard: "",
    gstin: "",
    alternateAddress: "",
    // Additional Info Fields
    anniversary: "",
    alternateEmail: "",
    intercomNumber: "",
    landlineNumber: "",
    evConnection: "",
    // ADDED: Occupied status for unit (Yes/No)
    is_occupied: "", 
  });

  // ========== FETCH SITES + BUILDINGS ==========
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [siteRes, buildingRes] = await Promise.all([
          getSites(),
          getBuildings(),
        ]);

        // Note: getSites is called but currently commented out in imports. Assuming it is available.
        setSites(siteRes.data || []);
        setBuildings(buildingRes.data || []);
      } catch (error) {
        toast.error("Failed to load dropdown data");
      }
    };

    loadDropdowns();
  }, []);

  // ========== HANDLE INPUT ==========
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile only numbers
    if (name === "mobile") {
      const digits = value.replace(/\D/g, "");
      return setFormData({ ...formData, mobile: digits.slice(0, 10) });
    }

    // Email no spaces (trimming is correct)
    if (name === "email") {
      return setFormData({ ...formData, email: value.trim() });
    }

    setFormData({ ...formData, [name]: value });
  };

  // Unit Dropdown Handler Logic (Improved)
  const handleUnitChange = (e) => {
    const unitId = e.target.value;
    setSelectedUnit(unitId);

    // Get the selected unit object to extract its name
    const unit = units.find((u) => u.id === unitId);
    setSelectedUnitName(unit ? unit.name : "");
  };

  // ========== MEMBERS (kept for brevity) ==========
  const addMember = () => {
    setMembers([
      ...members,
      { member_type: "", member_name: "", contact: "", relation: "" },
    ]);
  };

  const updateMember = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  // ========== VENDORS (kept for brevity) ==========
  const addVendor = () => {
    setVendorList([...vendorList, { service_type: "", name: "", contact: "" }]);
  };

  const updateVendor = (index, field, value) => {
    const updated = [...vendorList];
    updated[index][field] = value;
    setVendorList(updated);
  };

  const removeVendor = (index) => {
    setVendorList(vendorList.filter((_, i) => i !== index));
  };

  // ========== SUBMIT ==========
  const handleAddUser = async () => {
    const required = [
      "firstname",
      "lastname",
      "email",
      "mobile",
      "password",
      "occupancy_type", // Owner or Tenant status
    ];

    for (let key of required) {
      if (!formData[key]) {
        // Fix for occupancy_type message
        const messageKey = key === "occupancy_type" ? "Resident Status" : key.replace("_", " ");
        return toast.error(`Please enter ${messageKey}`);
      }
    }

    // Explicit check for Tower, Floor & Unit IDs
    if (!selectedTower || !selectedFloorId || !selectedUnit) {
      return toast.error("Please select Tower, Floor & Unit");
    }

    // // Check for Lease Expiry if Tenant is selected
    // if (formData.occupancy_type.toLowerCase() === "tenant" && !formData.lease_expiry) {
    //   return toast.error("Lease expiry is required for a tenant");
    // }

    const payload = {
      user: {
        ...formData,
        building_id: selectedTower, 
        user_sites: [
          {
            site_id: siteId,
            unit_id: selectedUnit,
            ownership: formData.occupancy_type, 
            ownership_type: formData.membershipType.toLowerCase(),
            is_approved: true,
            lives_here: formData.lives_here,
          },
        ],
        user_members: members,
        user_vendors: vendorList,
      },
      site_ids: [siteId],
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      await postSetupUsers(payload);
      toast.success("User added successfully!");
      navigate("/setup/users-setup");
    } catch (error) {
      console.log("API ERROR:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to add user");
    }
  };

  return (
    <section className="w-full p-6 flex bg-gray-50 min-h-screen">
      <SetupNavbar />
      <div className="w-full p-6 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
          className="w-full bg-white shadow-md rounded-2xl border p-6 sm:p-8"
        >
          {/* ---------- Header ---------- */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white text-xl font-bold py-4 text-center rounded-t-xl">
            Add User Details
          </div>

          {/* ---------------- PRIMARY DETAILS ---------------- */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Primary & Contact Info
            </h3>

            <div className="flex flex-wrap items-start">
              {/* Profile Section */}
              <div className="w-full sm:w-[150px] text-center mb-6 sm:mb-0">
                <div className="w-[120px] h-[120px] bg-indigo-100 rounded-full mx-auto overflow-hidden border-4 border-indigo-400/50 shadow-md">
                  <img
                    src="https://www.pngitem.com/pimgs/m/137-1370051_avatar-generic-avatar-hd-png-download.png"
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="text-2xl mt-2 text-indigo-600 hover:text-indigo-800 transition"
                >
                  📷
                </button>
              </div>

              {/* Form Fields (Title, Name, Contact, Auth) */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 sm:ml-8">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium block mb-1">Title</label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>

                {/* First Name, Last Name, Email, Password */}
                {[
                  { label: "First Name *", name: "firstname" },
                  { label: "Last Name *", name: "lastname" },
                  { label: "Email *", name: "email", type: "email" },
                  { label: "Password *", name: "password", type: "password" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium block mb-1">{f.label}</label>
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                ))}
                
                {/* Mobile */}
                <div>
                  <label className="text-sm font-medium block mb-1">Mobile *</label>
                  <div className="flex gap-2">
                    <select 
                      className="border border-gray-300 rounded-md py-2 w-20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      defaultValue="+91" 
                    >
                      <option>+91</option>
                    </select>
                    <input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      maxLength="10"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Occupancy and Unit Details in a new row/section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 border-t pt-4">
              {/* Building (Tower) */}
              <div>
                <label className="text-sm font-medium block mb-1">Tower *</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={selectedTower}
                  onChange={async (e) => {
                    const id = e.target.value;
                    setSelectedTower(id);
                    setSelectedFloorId("");
                    setFloors([]);
                    setSelectedUnit("");
                    setUnits([]);
                    setSelectedUnitName(""); // Clear unit name
                    if (id) {
                      try {
                        const res = await getFloors(id);
                        setFloors(res.data || []);
                      } catch (error) {
                          toast.error("Failed to fetch floors");
                      }
                    }
                  }}
                  required
                >
                  <option value="">Select Building</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor */}
              <div>
                <label className="text-sm font-medium block mb-1">Floor *</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={selectedFloorId}
                  onChange={async (e) => {
                    const id = e.target.value;
                    setSelectedFloorId(id);
                    setSelectedUnit("");
                    setUnits([]);
                    setSelectedUnitName(""); // Clear unit name
                    if (id) {
                      try {
                        const res = await getUnits(id);
                        setUnits(res.data || []);
                      } catch (error) {
                          toast.error("Failed to fetch units");
                      }
                    }
                  }}
                  required
                  disabled={!selectedTower}
                >
                  <option value="">Select Floor</option>
                  {floors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

{/* Unit ID Dropdown */}
<div>
  <label className="text-sm font-medium block mb-1">Unit ID *</label>

  <select
    className="w-full border border-gray-300 rounded-md px-3 py-2 
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    value={selectedUnit || ""}          // Prevent uncontrolled warning
    onChange={(e) => setSelectedUnit(e.target.value)} 
    required
    disabled={!selectedFloorId || units.length === 0} // Disable if no floor or units
  >
    <option value="">Select Unit</option>

    {Array.isArray(units) && units.length > 0 ? (
      units.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name}
        </option>
      ))
    ) : (
      <option disabled>No Units Available</option>
    )}
  </select>
</div>

              {/* Resident Status (The Occupancy Type for API: 'owner' or 'tenant') */}
              <div>
                <label className="text-sm font-medium block mb-1">Status *</label>
                <select
                  name="occupancy_type"
                  value={formData.occupancy_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>
              
              {/* Lease Expiry (Conditional) */}
              {formData.occupancy_type.toLowerCase() === "tenant" && (
                <div>
                  <label className="text-sm font-medium block mb-1">Lease Expiry *</label>
                  <input
                    type="date"
                    name="lease_expiry"
                    value={formData.lease_expiry}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                </div>
              )}
              
              {/* Lives Here */}
              <div>
                <label className="text-sm font-medium block mb-1">Lives Here</label>
                <select
                  name="lives_here"
                  value={formData.lives_here}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Unit Occupied Status (Replaced the old 'Occupied' field) */}
              <div>
                <label className="text-sm font-medium block mb-1">Occupied</label>
                <select
                  name="is_occupied"
                  value={formData.is_occupied}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
              {/* Membership Type */}
              <div>
                <label className="text-sm font-medium block mb-1">Membership Type</label>
                <select
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>
            </div>

            {/* PAN & GST, Alternate Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {[
                { label: "PAN Card", name: "panCard" },
                { label: "GSTIN", name: "gstin" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-sm font-medium block mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              ))}
            </div>

            {/* Alternate Address */}
            <div className="mt-4">
              <label className="text-sm font-medium block mb-1">Alternate Address</label>
              <textarea
                name="alternateAddress"
                placeholder="Enter an address "
                value={formData.alternateAddress}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full h-20 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              ></textarea>
            </div>
          </div>
          
          {/* ---------------- ADDITIONAL INFO ---------------- */}
          <div className="border-t border-gray-300 p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Additional Info & Utilities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Birth Date", name: "birth_date", type: "date" },
                { label: "Anniversary", name: "anniversary", type: "date" },
                { label: "Alternate Email", name: "alternateEmail", type: "email" },
                { label: "Intercom Number", name: "intercomNumber" },
                { label: "Landline Number", name: "landlineNumber" },
                { label: "EV Connection (Yes/No)", name: "evConnection" },
              
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-sm font-medium block mb-1">{f.label}</label>
                  <input
                    type={f.type || "text"}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-xl border-t border-gray-200">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.02]"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddUser;