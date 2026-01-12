import React, { useEffect, useState } from "react";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import toast from "react-hot-toast";
import { getFloors, getUnits, getBuildings, postSetupUsers } from "../../../api";
import { useNavigate } from "react-router-dom";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const getSites = () => Promise.resolve({ data: [] });

const AddUser = () => {
  const navigate = useNavigate();
  const siteId = getItemInLocalStorage("SITEID");

  const [sites, setSites] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);

  const [selectedTower, setSelectedTower] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const [selectedUnitName, setSelectedUnitName] = useState("");

  const [members, setMembers] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  // NEW — Profile Image Preview
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
    status: "",
    userType: "",
    occupancy_type: "",
    birth_date: "",
    lives_here: "",
    membershipType: "Primary",
    panCard: "",
    gstin: "",
    alternateAddress: "",
    anniversary: "",
    alternateEmail: "",
    intercomNumber: "",
    landlineNumber: "",
    evConnection: "",
    is_occupied: "",
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [siteRes, buildingRes] = await Promise.all([getSites(), getBuildings()]);
        setSites(siteRes.data || []);
        setBuildings(buildingRes.data || []);
      } catch (error) {
        toast.error("Failed to load dropdown data");
      }
    };

    loadDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const digits = value.replace(/\D/g, "");
      return setFormData({ ...formData, mobile: digits.slice(0, 10) });
    }

    if (name === "email") {
      return setFormData({ ...formData, email: value.trim() });
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleUnitChange = (e) => {
    const unitId = Number(e.target.value);
    setSelectedUnit(unitId);

    const unit = units.find((u) => Number(u.id) === unitId);
    setSelectedUnitName(unit ? unit.name : "");
  };

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

  const handleAddUser = async () => {
    const required = [
      "firstname",
      "lastname",
      "email",
      "mobile",
      "password",
      "occupancy_type",
      "status",
    ];

    for (let key of required) {
      if (!formData[key]) {
        const messageKey =
          key === "occupancy_type" ? "Ownership Type" : key.replace("_", " ");
        return toast.error(`Please enter ${messageKey}`);
      }
    }

    if (!selectedTower || !selectedFloorId || !selectedUnit) {
      return toast.error("Please select Tower, Floor & Unit");
    }

    const payload = {
      user: {
        ...formData,
        building_id: Number(selectedTower),
        user_sites: [
          {
            site_id: Number(siteId),
            unit_id: Number(selectedUnit),
            ownership: formData.occupancy_type,
            ownership_type: formData.membershipType.toLowerCase(),
            is_approved: true,
            lives_here: formData.lives_here,
          },
        ],
        user_members: members,
        user_vendors: vendorList,
      },
      site_ids: [Number(siteId)],
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
          {/* ✅ ONLY "Add User Details" background changed to your radial-gradient */}
          <div
            className="text-white text-xl font-bold py-4 text-center rounded-t-xl"
            style={{
              background:
                "radial-gradient(897px at 9% 80.3%, rgb(55, 60, 245) 0%, rgba(234, 161, 15, 0.9) 100.2%)",
            }}
          >
            Add User Details
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Primary & Contact Info
            </h3>

            <div className="flex flex-wrap items-start">
              <div className="w-full sm:w-[150px] text-center mb-6 sm:mb-0">
                <div className="w-[120px] h-[120px] bg-indigo-100 rounded-full mx-auto overflow-hidden border-4 border-indigo-400/50 shadow-md">
                  <img
                    src={
                      profileImage ||
                      "https://www.pngitem.com/pimgs/m/137-1370051_avatar-generic-avatar-hd-png-download.png"
                    }
                    alt=""
                    className="w-full h-full object-cover mx-auto block"
                  />
                </div>

                <button
                  type="button"
                  className="text-2xl mt-2 text-indigo-600 hover:text-indigo-800 transition"
                  onClick={() => document.getElementById("profileUpload").click()}
                >
                  📷
                </button>

                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileImage(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-0 sm:ml-8">
                <div>
                  <label className="text-sm font-medium block mb-1">Title</label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>

                {[
                  { label: "First Name *", name: "firstname" },
                  { label: "Last Name *", name: "lastname" },
                  { label: "Email *", name: "email", type: "email" },
                  { label: "Password *", name: "password", type: "password" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium block mb-1">
                      {f.label}
                    </label>
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-sm font-medium block mb-1">Mobile *</label>
                  <div className="flex gap-2">
                    <select
                      className="border border-gray-300 rounded-md py-2 w-20"
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
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 border-t pt-4">
              <div>
                <label className="text-sm font-medium block mb-1">Tower *</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedTower}
                  onChange={async (e) => {
                    const id = e.target.value;
                    setSelectedTower(id);
                    setSelectedFloorId("");
                    setFloors([]);
                    setSelectedUnit("");
                    setUnits([]);
                    setSelectedUnitName("");

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

              <div>
                <label className="text-sm font-medium block mb-1">Floor *</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedFloorId}
                  onChange={async (e) => {
                    const id = e.target.value;
                    setSelectedFloorId(id);
                    setSelectedUnit("");
                    setUnits([]);
                    setSelectedUnitName("");

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

              <div>
                <label className="text-sm font-medium block mb-1">Unit ID *</label>

                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedUnit || ""}
                  onChange={handleUnitChange}
                  required
                  disabled={!selectedFloorId || units.length === 0}
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

              <div>
                <label className="text-sm font-medium block mb-1">
                  Ownership Type *
                </label>
                <select
                  name="occupancy_type"
                  value={formData.occupancy_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="" disabled>
                    Select Ownership Type
                  </option>
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="pending">Pending</option>
                  <option value="complete">Complete</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Occupied</label>
                <select
                  name="is_occupied"
                  value={formData.is_occupied}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Membership Type
                </label>
                <select
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">User Type</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select</option>
                  <option value="Admin">Admin</option>
                  <option value="Technician">Technician</option>
                  <option value="Security Guard">Security Guard</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
            </div>

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
                    className="w-full border border-gray-300 rounded-md py-2 px-3"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium block mb-1">
                Alternate Address
              </label>
              <textarea
                name="alternateAddress"
                value={formData.alternateAddress}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full h-20 p-3"
              ></textarea>
            </div>
          </div>

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
                {
                  label: "EV Connection",
                  name: "evConnection",
                  type: "select",
                  options: [
                    { value: "", label: "Select EV Connection" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ],
                },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-sm font-medium block mb-1">{f.label}</label>

                  {f.type === "select" ? (
                    <select
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {f.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-xl border-t border-gray-200">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-indigo-700"
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
