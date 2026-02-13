import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import { getPetById, updatePet } from "../../../api";

const PetsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [newImages, setNewImages] = useState(null);

  const [formData, setFormData] = useState({
    pet_name: "",
    pet_breed: "",
    gender: "",
    colour: "",
    age: "",
    dob: "",
    is_pet_transfered: false,
    stray_pet_adopted: false,
    pet_born_to_owner_dog: false,
    brought: false,
    whether_brought_from_current_city: false,
    building_id: "",
    floor_id: "",
    unit_id: "",
    user_id: "",
    owner_mobile_no: "",
  });

  useEffect(() => {
    fetchPet();
  }, []);

  const fetchPet = async () => {
    try {
      const res = await getPetById(id);
      const pet = res.data;

      setFormData({
        pet_name: pet.pet_name || "",
        pet_breed: pet.pet_breed || "",
        gender: pet.gender || "",
        colour: pet.colour || "",
        age: pet.age || "",
        dob: pet.dob || "",
        is_pet_transfered: pet.is_pet_transfered || false,
        stray_pet_adopted: pet.stray_pet_adopted || false,
        pet_born_to_owner_dog: pet.pet_born_to_owner_dog || false,
        brought: pet.brought || false,
        whether_brought_from_current_city:
          pet.whether_brought_from_current_city || false,
        building_id: pet.building_id || "",
        floor_id: pet.floor_id || "",
        unit_id: pet.unit_id || "",
        user_id: pet.user_id || "",
        owner_mobile_no: pet.owner_mobile_no || "",
      });

      if (pet.profile_image) {
        setProfilePreview(pet.profile_image);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleNewImagesChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(`pet[${key}]`, formData[key]);
      });

      if (profileImage) {
        data.append("pet[profile_image]", profileImage);
      }

      if (newImages) {
        for (let i = 0; i < newImages.length; i++) {
          data.append("pet[pet_images][]", newImages[i]);
        }
      }

      await updatePet(id, data);
      navigate("/setup/pets");

    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SetupNavbar />

      <div className="w-full p-8">
        <h1 className="text-2xl font-semibold mb-6">Edit Pet</h1>

        <div className="bg-white p-6 rounded-2xl shadow-md">

          {/* PROFILE IMAGE */}
          <div className="flex gap-8 mb-6">
            <div className="relative w-32 h-32">
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
                onChange={handleProfileChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 grid grid-cols-3 gap-4">
              <Input label="Pet Name *" name="pet_name" value={formData.pet_name} onChange={handleChange} />
              <Input label="Pet Breed" name="pet_breed" value={formData.pet_breed} onChange={handleChange} />
              <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>

              <Input label="Colour" name="colour" value={formData.colour} onChange={handleChange} />
              <Input label="Age" name="age" value={formData.age} onChange={handleChange} />
              <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
          </div>

          <hr className="my-6" />

          <h3 className="font-semibold mb-4">Additional Information</h3>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <Checkbox label="Is Pet Transferred" name="is_pet_transfered" checked={formData.is_pet_transfered} onChange={handleChange} />
            <Checkbox label="Brought" name="brought" checked={formData.brought} onChange={handleChange} />
            <Checkbox label="Stray Pet Adopted" name="stray_pet_adopted" checked={formData.stray_pet_adopted} onChange={handleChange} />
            <Checkbox label="Brought from Current City" name="whether_brought_from_current_city" checked={formData.whether_brought_from_current_city} onChange={handleChange} />
            <Checkbox label="Pet Born to Owner's Dog" name="pet_born_to_owner_dog" checked={formData.pet_born_to_owner_dog} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Input label="Tower *" name="building_id" value={formData.building_id} onChange={handleChange} />
            <Input label="Floor *" name="floor_id" value={formData.floor_id} onChange={handleChange} />
            <Input label="Unit *" name="unit_id" value={formData.unit_id} onChange={handleChange} />
            <Input label="User *" name="user_id" value={formData.user_id} onChange={handleChange} />
          </div>

          <Input
            label="Owner Mobile *"
            name="owner_mobile_no"
            value={formData.owner_mobile_no}
            onChange={handleChange}
          />

          {/* ✅ ADD NEW PET IMAGES */}
          <div className="mt-8">
            <h3 className="font-semibold mb-3">Add New Pet Images</h3>
            <input
              type="file"
              multiple
              onChange={handleNewImagesChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => navigate("/setup/pets")}
              className="px-6 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg"
            >
              Update Pet
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input {...props} className="w-full mt-1 border rounded-md p-2 bg-gray-50" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select {...props} className="w-full mt-1 border rounded-md p-2 bg-gray-50">
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

export default PetsEdit;
