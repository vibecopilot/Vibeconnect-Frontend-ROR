import React, { useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getParkingConfiguration,
  getParkingConfigurationDetails,
  editParkingConfiguration,
  getFloors,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";

const ParkingConfigurationSetup = () => {
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [editId, setEditId] = useState(null);
  const [location, setLocation] = useState("");
  const [floor, setFloor] = useState("");
  const [parkName, setParkName] = useState("");
  const [floors, setFloors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buildings = getItemInLocalStorage("Building");

  /* Fetch list */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getParkingConfiguration();
        setData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  /* Fetch edit details */
  const openModal = async (id) => {
    try {
      const res = await getParkingConfigurationDetails(id);
      setEditId(id);
      setLocation(res.data.building_id);
      setFloor(res.data.floor_id);
      setParkName(res.data.name);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* Fetch floors */
  useEffect(() => {
    if (!location) return;
    const fetchFloors = async () => {
      try {
        const res = await getFloors(location);
        setFloors(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFloors();
  }, [location]);

  /* Search */
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredData(
      data.filter(
        (item) =>
          item.name.toLowerCase().includes(value) ||
          item.building_name.toLowerCase().includes(value)
      )
    );
  };

  /* Update */
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("parking_configuration[building_id]", location);
    formData.append("parking_configuration[floor_id]", floor);
    formData.append("parking_configuration[name]", parkName);

    try {
      await editParkingConfiguration(editId, formData);
      toast.success("Updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => openModal(row.id)}>
          <BiEdit size={16} />
        </button>
      ),
    },
    { name: "Name", selector: (row) => row.name },
    { name: "Location", selector: (row) => row.building_name },
    { name: "Floor", selector: (row) => row.floor_name },
    { name: "Vehicle Type", selector: (row) => row.vehicle_type },
  ];

  return (
    <section className="flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search by building"
          className="border p-2 rounded-md w-80"
        />

        {/* ADD BUTTON – GUARANTEED NAVIGATION */}
        <button
          onClick={() => navigate("/admin/add-parking-config")}
          className="border-2 border-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-black hover:text-white"
        >
          <PiPlusCircle size={20} />
          Add
        </button>
      </div>

      <Table
        columns={columns}
        data={filteredData}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="500px"
      />

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-60"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white p-4 rounded-md w-96 relative z-50">
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-3">
              Edit Parking Configuration
            </h2>

            <select
              className="border p-2 w-full mb-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {buildings?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              className="border p-2 w-full mb-2"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            >
              <option value="">Select Floor</option>
              {floors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            <input
              className="border p-2 w-full mb-3"
              value={parkName}
              onChange={(e) => setParkName(e.target.value)}
              placeholder="Parking Name"
            />

            <button
              onClick={handleUpdate}
              className="w-full text-white p-2 rounded-md"
              style={{ background: themeColor }}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ParkingConfigurationSetup;
