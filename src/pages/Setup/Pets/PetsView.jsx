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

        <div className="bg-white rounded-2xl shadow-md p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              {pet.profile_image ? (
                <img
                  src={pet.profile_image}
                  alt="pet"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/setup/pets/edit/${id}`)}
                className="bg-purple-600 text-white px-5 py-2 rounded-md"
              >
                Edit
              </button>

              <button
                onClick={() => navigate("/setup/pets")}
                className="bg-gray-800 text-white px-5 py-2 rounded-md"
              >
                Back
              </button>
            </div>
          </div>

          {/* BASIC INFORMATION */}
          <h2 className="text-lg font-semibold mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <InfoCard label="Pet Name" value={pet.pet_name} />
            <InfoCard label="Breed" value={pet.pet_breed} />
            <InfoCard label="Gender" value={pet.gender} />
            <InfoCard label="Colour" value={pet.colour} />
            <InfoCard label="Age" value={pet.age} />
            <InfoCard label="Date of Birth" value={pet.dob} />
            <InfoCard label="Owner Mobile" value={pet.owner_mobile_no} />
          </div>

          {/* ADDITIONAL INFORMATION */}
          <h2 className="text-lg font-semibold mb-4">
            Additional Information
          </h2>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <BooleanCard label="Pet Transferred" value={pet.is_pet_transfered} />
            <BooleanCard label="Brought" value={pet.brought} />
            <BooleanCard label="Stray Pet Adopted" value={pet.stray_pet_adopted} />
            <BooleanCard label="From Current City" value={pet.whether_brought_from_current_city} />
            <BooleanCard label="Born to Owner's Dog" value={pet.pet_born_to_owner_dog} />
          </div>

          {/* CREATED & UPDATED */}
          <div className="grid grid-cols-2 gap-6">
            <InfoCard label="Created At" value={formatDate(pet.created_at)} />
            <InfoCard label="Updated At" value={formatDate(pet.updated_at)} />
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-xl p-4">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      {label}
    </p>
    <p className="font-semibold mt-1">
      {value ? value : "N/A"}
    </p>
  </div>
);

const BooleanCard = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-xl p-4 flex justify-between">
    <p className="text-sm">{label}</p>
    <p className={`font-semibold ${value ? "text-green-600" : "text-red-500"}`}>
      {value ? "Yes" : "No"}
    </p>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB");
};

export default PetsView;
