import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import { getPetById, updatePet } from "../../../api";   // ✅ your api file

const PetsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pet_name: "",
    owner_mobile_no: "",
    pet_breed: "",
    gender: "",
    colour: "",
    age: "",
  });

  useEffect(() => {
    fetchPet();
  }, []);

  const fetchPet = async () => {
    try {
      const response = await getPetById(id);

      const petData = response.data;

      setFormData({
        pet_name: petData.pet_name || "",
        owner_mobile_no: petData.owner_mobile_no || "",
        pet_breed: petData.pet_breed || "",
        gender: petData.gender || "",
        colour: petData.colour || "",
        age: petData.age || "",
      });

    } catch (error) {
      console.error("Error fetching pet:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append("pet[pet_name]", formData.pet_name);
      data.append("pet[owner_mobile_no]", formData.owner_mobile_no);
      data.append("pet[pet_breed]", formData.pet_breed);
      data.append("pet[gender]", formData.gender);
      data.append("pet[colour]", formData.colour);
      data.append("pet[age]", formData.age);

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
        <h1 className="text-2xl font-semibold mb-6">
          Edit Pet
        </h1>

        <div className="bg-white p-6 rounded-lg shadow">

          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              name="pet_name"
              value={formData.pet_name}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="Pet Name"
            />

            <input
              type="text"
              name="owner_mobile_no"
              value={formData.owner_mobile_no}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="Owner Mobile"
            />

            <input
              type="text"
              name="pet_breed"
              value={formData.pet_breed}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="Breed"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate("/setup/pets")}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Update Pet
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PetsEdit;
