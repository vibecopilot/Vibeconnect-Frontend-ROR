import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { BiEdit, BiTrash } from "react-icons/bi";
import {
  getVehicleSetup,
  postVehicleSetup,
  editVehicleSetup,
  deleteVehicleSetup,
} from "../../../api";

const VehicleSetup = () => {
  const [vehicleList, setVehicleList] = useState([{ category: "", type: "" }]);
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editVehicle, setEditVehicle] = useState({
    category: "",
    type: "",
    id: null,
  });

  const handleChange = (index, field, value) => {
    const updated = [...vehicleList];
    updated[index][field] = value;
    setVehicleList(updated);
  };

  const handleAddVehicle = () => {
    setVehicleList([...vehicleList, { category: "", type: "" }]);
  };

  // ✅ REMOVE UNSAVED ROW
  const handleRemoveVehicle = (index) => {
    const updated = vehicleList.filter((_, i) => i !== index);
    setVehicleList(updated.length ? updated : [{ category: "", type: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const v of vehicleList) {
        if (!v.category || !v.type) continue;

        await postVehicleSetup({
          vehicle_category: v.category,
          vehicle_type_name: v.type,
          status: true,
        });
      }

      setVehicleList([{ category: "", type: "" }]);
      fetchVehicles();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await getVehicleSetup();
      let vehicles = response.data?.vehicles || response.data || [];

      if (!Array.isArray(vehicles)) {
        vehicles = Object.values(vehicles || {});
      }

      setSavedVehicles(vehicles);
    } catch (error) {
      console.error("Read error:", error);
      setSavedVehicles([]);
    }
  };

  const handleEdit = (i, v) => {
    setEditIndex(i);
    setEditVehicle({
      category: v.vehicle_category,
      type: v.vehicle_type_name,
      id: v.id,
    });
  };

  const handleEditSave = async (i, orig) => {
    try {
      await editVehicleSetup(editVehicle.id || orig.id, {
        vehicle_category: editVehicle.category,
        vehicle_type_name: editVehicle.type,
        status: true,
      });

      setEditIndex(null);
      setEditVehicle({ category: "", type: "", id: null });
      fetchVehicles();
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVehicleSetup(id);
      fetchVehicles();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditVehicle({ category: "", type: "", id: null });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const columns = [
    {
      name: "Actions",
      cell: (row, i) => (
        <div className="flex gap-3">
          {editIndex === i ? (
            <>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => handleEditSave(i, row)}
              >
                Save
              </button>
              <button
                className="bg-gray-400 text-white px-2 py-1 rounded"
                onClick={handleEditCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit(i, row)}>
                <BiEdit size={20} />
              </button>
              <button onClick={() => handleDelete(row.id)}>
                <BiTrash size={20} className="text-red-500" />
              </button>
            </>
          )}
        </div>
      ),
      width: "160px",
    },
    {
      name: "Category",
      selector: (row) => row.vehicle_category,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.vehicle_type_name,
      sortable: true,
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Allowed Vehicle Categories</h2>

      <form onSubmit={handleSubmit}>
        {vehicleList.map((vehicle, index) => (
          <div key={index} className="mb-4 grid md:grid-cols-4 gap-4 items-center">
            <select
              className="border px-3 py-2 rounded"
              value={vehicle.category}
              onChange={(e) =>
                handleChange(index, "category", e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="2-wheeler">2-Wheeler</option>
              <option value="3-wheeler">3-Wheeler</option>
              <option value="4-wheeler">4-Wheeler</option>
              <option value="6-wheeler">6-Wheeler</option>
            </select>

            <input
              type="text"
              className="border px-3 py-2 rounded"
              placeholder="Vehicle Type"
              value={vehicle.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
            />

            {/* ✅ Remove Button */}
            <button
              type="button"
              onClick={() => handleRemoveVehicle(index)}
              className="bg-red-500 text-white  py-2 rounded w-[80px]"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex gap-5 mt-5">
          <button
            type="button"
            onClick={handleAddVehicle}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Vehicle Type
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Categories
          </button>
        </div>
      </form>

      <div className="mt-8">
        <DataTable
          columns={columns}
          data={savedVehicles}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default VehicleSetup;
