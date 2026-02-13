import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import { getPetById } from "../../../api";

const PetsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    fetchPet();
  }, [id]);

  const fetchPet = async () => {
    try {
      const response = await getPetById(id);
      setPet(response.data);
    } catch (error) {
      console.error("Error fetching pet:", error);
    }
  };

  if (!pet) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SetupNavbar />

      <div className="w-full p-8">
        <h1 className="text-2xl font-semibold mb-6">Pet Details</h1>

        <div className="bg-white rounded-xl shadow p-6">

          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {pet.profile_image ? (
                <img
                  src={pet.profile_image}
                  alt="pet"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/setup/pets/edit/${id}`)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>

              <button
                onClick={() => navigate("/setup/pets")}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
              >
                Back
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-6">
            <InfoCard label="Pet Name" value={pet.pet_name} />
            <InfoCard label="Breed" value={pet.pet_breed} />
            <InfoCard label="Gender" value={pet.gender} />
            <InfoCard label="Colour" value={pet.colour} />
            <InfoCard label="Age" value={pet.age} />
            <InfoCard label="Owner Mobile" value={pet.owner_mobile_no} />
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-lg p-4">
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="font-semibold mt-1">{value || "N/A"}</p>
  </div>
);

export default PetsView;
