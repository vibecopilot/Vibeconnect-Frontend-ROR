import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import {
  getPetById,
  updatePet,
  getBuildings,
  getFloors,
  getUnits,
  getUsers,
} from "../../../api";

const PetsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  // STATES
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [attachments, setAttachments] = useState(null);

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

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
  });

  // ================= FETCH PET + BUILDINGS + USERS =================
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setFetching(true);

        const [bRes, uRes, petRes] = await Promise.all([
          getBuildings(),
          getUsers(),
          getPetById(id),
        ]);

        setBuildings(bRes.data);
        setUsers(uRes.data);

        const pet = petRes.data;

        setFormData({
          pet_name: pet.pet_name || "",
          owner_mobile_no: pet.owner_mobile_no || "",
          pet_breed: pet.pet_breed || "",
          gender: pet.gender || "",
          colour: pet.colour || "",
          age: pet.age || "",
          dob: pet.dob ? pet.dob.split("T")[0] : "",
          is_pet_transfered: !!pet.is_pet_transfered,
          brought: !!pet.brought,
          stray_pet_adopted: !!pet.stray_pet_adopted,
          whether_brought_from_current_city: !!pet.whether_brought_from_current_city,
          pet_born_to_owner_dog: !!pet.pet_born_to_owner_dog,
          building_id: pet.building_id || "",
          floor_id: pet.floor_id || "",
          unit_id: pet.unit_id || "",
          user_id: pet.user_id || "",
        });

        if (pet.profile_image) setProfilePreview(pet.profile_image);
      } catch (err) {
        console.error("Failed to load:", err);
        alert("Failed to load pet data");
      } finally {
        setFetching(false);
      }
    };

    loadInitialData();
  }, [id]);

  // ================= CASCADING DROPDOWNS =================

  // Floors when building changes
  useEffect(() => {
    if (!formData.building_id) return;

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
  }, [formData.building_id]);

  // Units when floor changes
  useEffect(() => {
    if (!formData.floor_id) return;

    getUnits(formData.floor_id).then((res) => {
      setUnits(res.data);
      setFilteredUsers([]);
      setFormData((prev) => ({
        ...prev,
        unit_id: "",
        user_id: "",
      }));
    });
  }, [formData.floor_id]);

  // Filter users when unit changes
  useEffect(() => {
    if (!formData.unit_id) {
      setFilteredUsers([]);
      return;
    }

    const filtered = users.filter(
      (u) => String(u.unit_id) === String(formData.unit_id)
    );
    setFilteredUsers(filtered);
  }, [formData.unit_id, users]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const selectedUser = filteredUsers.find((u) => String(u.id) === String(userId));
    setFormData((prev) => ({
      ...prev,
      user_id: userId,
      owner_mobile_no: selectedUser?.mobile || selectedUser?.mobile_no || "",
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
    setAttachments(e.target.files);
  };

  // ================= UPDATE PET =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = new FormData();

      Object.keys(formData).forEach((key) => data.append(`pet[${key}]`, formData[key]));

      if (profileImage) data.append("pet[profile_image]", profileImage);

      if (attachments) {
        for (let i = 0; i < attachments.length; i++) {
          data.append("pet[pet_images][]", attachments[i]);
        }
      }

      await updatePet(id, data);

      alert("Pet Updated Successfully ✅");
      navigate("/setup/pets");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      alert("Update failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SetupNavbar />
      <div className="w-full p-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">

          <div className="text-center text-lg font-semibold mb-6">
            Edit Pet
          </div>

          <form onSubmit={handleUpdate}>

            {/* PROFILE IMAGE */}
            <div className="relative w-32 h-32 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-purple-400 overflow-hidden bg-gray-200">
                {profilePreview && <img src={profilePreview} className="w-full h-full object-cover" alt="preview" />}
              </div>
              <div onClick={() => fileRef.current.click()} className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer">
                <FaCamera size={14} className="text-white" />
              </div>
              <input type="file" ref={fileRef} accept="image/*" onChange={handleProfileChange} className="hidden" />
            </div>

            {/* BASIC FIELDS */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Input label="Pet Name" name="pet_name" value={formData.pet_name} onChange={handleChange} />
              <Input label="Owner Mobile" name="owner_mobile_no" value={formData.owner_mobile_no} onChange={handleChange} />
              <Input label="Pet Breed" name="pet_breed" value={formData.pet_breed} onChange={handleChange} />
            </div>

            {/* GENDER FIXED AS SELECT */}
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

            {/* CHECKBOXES */}
            <div className="grid grid-cols-3 gap-4 my-6">
              <Checkbox label="Is Pet Transferred" name="is_pet_transfered" checked={formData.is_pet_transfered} onChange={handleChange} />
              <Checkbox label="Brought" name="brought" checked={formData.brought} onChange={handleChange} />
              <Checkbox label="Stray Pet Adopted" name="stray_pet_adopted" checked={formData.stray_pet_adopted} onChange={handleChange} />
              <Checkbox label="Brought from Current City" name="whether_brought_from_current_city" checked={formData.whether_brought_from_current_city} onChange={handleChange} />
              <Checkbox label="Pet Born to Owner's Dog" name="pet_born_to_owner_dog" checked={formData.pet_born_to_owner_dog} onChange={handleChange} />
            </div>

            {/* DROPDOWNS */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Select label="Building" name="building_id" value={formData.building_id} onChange={handleChange}>
                <option value="">Select</option>
                {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>

              <Select label="Floor" name="floor_id" value={formData.floor_id} onChange={handleChange}>
                <option value="">Select</option>
                {floors.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </Select>

              <Select label="Unit" name="unit_id" value={formData.unit_id} onChange={handleChange}>
                <option value="">Select</option>
                {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Select>

              <Select label="User" name="user_id" value={formData.user_id} onChange={handleUserChange}>
                <option value="">Select User</option>
                {filteredUsers.map((u) => <option key={u.id} value={u.id}>{`${u.firstname || ""} ${u.lastname || ""}`.trim()}</option>)}
              </Select>
            </div>

            {/* ATTACHMENTS */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Add New Pet Images</label>
              <input type="file" multiple onChange={handleAttachmentChange} />
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => navigate("/setup/pets")} className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2 bg-purple-600 text-white rounded-lg">{submitting ? "Updating..." : "Update Pet"}</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// INPUT COMPONENTS
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 border rounded-md p-2 bg-gray-50" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="w-full mt-1 border rounded-md p-2 bg-gray-50">{children}</select>
  </div>
);

const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" {...props} />
    {label}
  </label>
);

export default PetsEdit;
