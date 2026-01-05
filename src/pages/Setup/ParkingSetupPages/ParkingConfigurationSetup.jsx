import React, { useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import {
  editParkingConfiguration,
  getFloors,
  getParkingConfiguration,
  getParkingConfigurationDetails,
} from "../../../api";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ParkingConfigurationSetup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editid, setEditId] = useState(null);
  const [parkname, setparkname] = useState("");
  const [update, setupdate] = useState(false);
  const themeColor = useSelector((state) => state.theme.color);
  const [location, setLocation] = useState("");
  const [floor, setFloor] = useState("");
  const [floors, setFloors] = useState([]);
  const buildings = getItemInLocalStorage("Building");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const openModal = (id) => {
    setEditId(id);
    fetchCategoryDetails(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const res = await getParkingConfiguration();
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setData(sorted);
        setFilteredData(sorted);
        setupdate(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchParking();
  }, [update]);

  const fetchCategoryDetails = async (id) => {
    try {
      const res = await getParkingConfigurationDetails(id);
      setLocation(res.data.building_id);
      setFloor(res.data.floor_id);
      setparkname(res.data.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchFloors = async () => {
      if (!location) return;
      try {
        const res = await getFloors(location);
        setFloors(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFloors();
  }, [location]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.building_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEdit = async () => {
    const sendData = new FormData();
    sendData.append("parking_configuration[building_id]", location);
    sendData.append("parking_configuration[floor_id]", floor);
    sendData.append("parking_configuration[name]", parkname);

    try {
      await editParkingConfiguration(editid, sendData);
      toast.success("Parking configuration updated successfully");
      setupdate(true);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const columns = [
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => openModal(row.id)}>
          <BiEdit size={15} />
        </button>
      ),
    },
    { name: "Name", selector: (row) => row.name },
    { name: "Location", selector: (row) => row.building_name },
    { name: "Floor", selector: (row) => row.floor_name },
    { name: "Parking Type", selector: (row) => row.vehicle_type },
  ];

  return (
    <section className="flex relative">
      <div className="w-full mx-3 flex-col">
        <div className="flex flex-col m-3">

          <div className="flex items-center justify-between my-2 relative z-50">
            <input
              type="text"
              placeholder="Search by building name"
              value={searchText}
              onChange={handleSearch}
              className="border-2 p-2 w-96 border-gray-300 rounded-lg"
            />

            <button
              onClick={() => navigate("/admin/add-parking-config")}
              className="border-2 font-semibold border-black px-4 py-2 rounded-md
                         flex items-center gap-2 hover:bg-black hover:text-white"
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
            highlightOnHover
          />

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="fixed inset-0 bg-black bg-opacity-60"
                onClick={closeModal}
              />
              <div className="bg-white w-96 p-4 rounded-md relative z-50">
                <button
                  className="absolute top-3 right-3"
                  onClick={closeModal}
                >
                  <FaTimes />
                </button>

                <h2 className="text-lg font-semibold mb-4">
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
                  value={parkname}
                  onChange={(e) => setparkname(e.target.value)}
                  placeholder="Parking Name"
                />

                <button
                  onClick={handleEdit}
                  className="text-white w-full p-2 rounded-md"
                  style={{ background: themeColor }}
                >
                  Update
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default ParkingConfigurationSetup;