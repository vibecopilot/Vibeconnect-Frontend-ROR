// import React, { useState } from "react";
// import SetupNavbar from "../../../components/navbars/SetupNavbar";
// import { useSelector } from "react-redux";
// import { FaCamera } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";


// const Pets = () => {
//   const themeColor = useSelector((state) => state.theme.color);
//   const navigate = useNavigate();


//   const [formData, setFormData] = useState({
//     pet_name: "",
//     owner_mobile_no: "",
//     pet_breed: "",
//     gender: "",
//     colour: "",
//     age: "",
//     building_id: "",
//     floor_id: "",
//     unit_id: "",
//     user_type: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="flex">
//       <SetupNavbar />

//       <div className="w-full bg-gray-100 p-8">
//         <div className="bg-white rounded-2xl shadow-md p-6">

//           {/* Header */}
//           <div className="rounded-xl overflow-hidden mb-6">
//             <div
//               className="text-white text-center py-3 font-semibold text-lg"
//               style={{ background: themeColor }}
//             >
//               Add Pets Details
//             </div>
//           </div>

//           <h2 className="font-semibold text-gray-600 mb-4">
//             Primary & Contact Info
//           </h2>

//           <div className="flex gap-6">

//             {/* LEFT IMAGE SECTION */}
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-28 h-28 rounded-full border-4 border-purple-300 flex items-center justify-center bg-gray-200">
//                 <div className="w-20 h-20 rounded-full bg-gray-300"></div>
//               </div>

//               <FaCamera className="text-gray-500 cursor-pointer" size={20} />
//             </div>

//             {/* FORM SECTION */}
//             <div className="flex-1">

//               {/* Row 1 */}
//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label className="text-sm font-medium">
//                     Pet Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="pet_name"
//                     value={formData.pet_name}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                     placeholder="Tommy"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Owner Mobile *
//                   </label>
//                   <input
//                     type="text"
//                     name="owner_mobile_no"
//                     value={formData.owner_mobile_no}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                     placeholder="9065445676"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Pet Breed
//                   </label>
//                   <input
//                     type="text"
//                     name="pet_breed"
//                     value={formData.pet_breed}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                     placeholder="Indie Cat"
//                   />
//                 </div>
//               </div>

//               {/* Row 2 */}
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <div>
//                   <label className="text-sm font-medium">
//                     Gender
//                   </label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                   >
//                     <option value="">Select Gender</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Colour
//                   </label>
//                   <input
//                     type="text"
//                     name="colour"
//                     value={formData.colour}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                     placeholder="Colour"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Age
//                   </label>
//                   <input
//                     type="number"
//                     name="age"
//                     value={formData.age}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                     placeholder="Age"
//                   />
//                 </div>
//               </div>

//               <hr className="mb-6" />

//               {/* Row 3 */}
//               <div className="grid grid-cols-4 gap-4">
//                 <div>
//                   <label className="text-sm font-medium">
//                     Tower *
//                   </label>
//                   <select
//                     name="building_id"
//                     value={formData.building_id}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                   >
//                     <option>Select Building</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Floor *
//                   </label>
//                   <select
//                     name="floor_id"
//                     value={formData.floor_id}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                   >
//                     <option>Select Floor</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     Unit ID *
//                   </label>
//                   <select
//                     name="unit_id"
//                     value={formData.unit_id}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                   >
//                     <option>Select Unit</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">
//                     User Type
//                   </label>
//                   <select
//                     name="user_type"
//                     value={formData.user_type}
//                     onChange={handleChange}
//                     className="w-full mt-1 bg-gray-100 border rounded-md p-2"
//                   >
//                     <option>Select</option>
//                     <option>Owner</option>
//                     <option>Tenant</option>
//                   </select>
//                 </div>
//               </div>

//             </div>
//           </div>
//           {/* ✅ Add Button */}
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={() => navigate("/setup/pets/add")}
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow"
//             >
//               Add Pets Details
//             </button>
//           </div>

//           {/* Bottom Action Bar */}
//           <div className="bg-gray-100 rounded-xl mt-8 p-4 flex justify-end gap-4">
//             <button className="px-6 py-2 bg-white border rounded-lg shadow">
//               Cancel
//             </button>

//             <button
//               className="px-6 py-2 text-white rounded-lg shadow"
//               style={{
//                 background:
//                   "linear-gradient(90deg, #7b2ff7 0%, #9b4dff 100%)",
//               }}
//             >
//               Create Pets
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pets;


import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import { getPets, deletePet } from "../../../api";   // ✅ delete added

const Pets = () => {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 10;

  useEffect(() => {
    loadPets();
  }, [page]);

  const loadPets = async () => {
    try {
      setLoading(true);

      const response = await getPets(page, perPage);

      const apiData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      setPets(apiData);

    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    );

    if (!confirmDelete) return;

    try {
      await deletePet(id);
      loadPets(); // refresh list
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredPets = pets.filter((pet) =>
    pet.pet_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SetupNavbar />

      <div className="w-full p-8">
        <h1 className="text-2xl font-semibold mb-4">
          Pets Management
        </h1>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by pet name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-2/3 border rounded-md p-2"
          />

          <button
            onClick={() => {
              setPage(1);
              navigate("/setup/pets/add");
            }}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
            style={{
              background:
                "linear-gradient(90deg, #6a5af9 0%, #e6a117 100%)",
            }}
          >
            <FaPlus />
            Add Pet
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead
              className="text-white"
              style={{
                background:
                  "linear-gradient(90deg, #6a5af9 0%, #e6a117 100%)",
              }}
            >
              <tr>
                <th className="p-3 text-left">ACTION</th>
                <th className="p-3 text-left">PET NAME</th>
                <th className="p-3 text-left">BREED</th>
                <th className="p-3 text-left">GENDER</th>
                <th className="p-3 text-left">COLOUR</th>
                <th className="p-3 text-left">OWNER MOBILE</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredPets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No Pets Found
                  </td>
                </tr>
              ) : (
                filteredPets.map((pet) => (
                  <tr key={pet.id} className="border-t">
                    <td className="p-3">
                      <div className="flex gap-2">

                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(`/setup/pets/view/${pet.id}`)
                          }
                          className="w-8 h-8 bg-gray-100 border rounded-md flex items-center justify-center"
                        >
                          <FaEye size={14} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(`/setup/pets/edit/${pet.id}`)
                          }
                          className="w-8 h-8 bg-gray-100 border rounded-md flex items-center justify-center"
                        >
                          <FaEdit size={14} />
                        </button>

                        {/* Delete */}
                       <button
      onClick={() => handleDelete(pet.id)}
      className="w-8 h-8 bg-gray-100 border rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200"
    >
      <FaTrash size={14} />
    </button>
                      </div>
                    </td>

                    <td className="p-3">{pet.pet_name}</td>
                    <td className="p-3">{pet.pet_breed}</td>
                    <td className="p-3">{pet.gender}</td>
                    <td className="p-3">{pet.colour}</td>
                    <td className="p-3">{pet.owner_mobile_no}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Previous
          </button>

          <span>Page {page}</span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pets;
