import React, { useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import { PiPlusCircle } from "react-icons/pi";
import { BsEye } from "react-icons/bs";
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

const ParkingConfigurationSetup = () => {
  const [data, setData] = useState([]); // Store the original data here
  const [filteredData, setFilteredData] = useState([]); // For displaying filtered data
  const [editid, setEditId] = useState(null);
  const [parkname, setparkname] = useState(null);
  const [update, setupdate] = useState(false);
  const themeColor = useSelector((state) => state.theme.color);
  const [location, setLocation] = useState(null);
  const [floor, setFloor] = useState(null);
  const [floors, setFloors] = useState([]);
  const userId = getItemInLocalStorage("UserId");
  const buildings = getItemInLocalStorage("Building");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const openModal = (categoryId) => {
    setEditId(categoryId);
    fetchCategoryDetails(categoryId);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getParkingConfiguration();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setData(sortedInvData); // Save original data
        setFilteredData(sortedInvData); // Initialize filteredData with all data
        setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, [update]);

  const fetchCategoryDetails = async (categoryId) => {
    try {
      const categoryDetails = await getParkingConfigurationDetails(categoryId);
      setLocation(categoryDetails.data.building_id);
      setFloor(categoryDetails.data.floor_id);
      setparkname(categoryDetails.data.name);
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        if (location) {
          const floorsResp = await getFloors(location);
          setFloors(floorsResp.data);
          console.log("Floors:", floorsResp.data);
        }
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };
    fetchFloors();
  }, [location]);

  const column = [
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => openModal(row.id)}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Location", selector: (row) => row.building_name, sortable: true },
    { name: "Floor", selector: (row) => row.floor_name, sortable: true },
    {
      name: "Parking Type",
      selector: (row) => row.vehicle_type,
      sortable: true,
    },
  ];

  // Updated handleSearch function
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    const filteredResults = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.building_name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  // Edit function remains the same
  const handleEdit = async () => {
    const sendData = new FormData();
    sendData.append("parking_configuration[building_id]", location);
    sendData.append("parking_configuration[floor_id]", floor);
    sendData.append("parking_configuration[name]", parkname);

    try {
      const resp = await editParkingConfiguration(editid, sendData);
      setupdate(true);
      setIsModalOpen(false);
      toast.success("Parking configuration Update Successfully");

      // Reset any form fields if necessary
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex">
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex m-3 flex-col">
          <div className="flex gap-2 items-center justify-between my-2">
            <input
              type="text"
              placeholder="Search By building name"
              value={searchText}
              onChange={handleSearch}
              className="border-2 p-2 w-96 border-gray-300 rounded-lg"
            />
            <Link
              to={"/admin/add-parking-config"}
              className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
              style={{ height: "1cm" }}
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </div>
          <Table
            columns={column}
            data={filteredData}
            responsive
            fixedHeader
            fixedHeaderScrollHeight="500px"
            pagination
            selectableRowsHighlight
            highlightOnHover
          />
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="fixed inset-0 bg-black bg-opacity-90"
                onClick={closeModal}
              ></div>
              <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative z-10">
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                  onClick={closeModal}
                >
                  <FaTimes />
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  Edit Parking Configuration
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="grid md:grid-cols-1 gap-2">
                    <div className="grid gap-2 items-center w-full">
                      <select
                        name="building_id"
                        className="border p-1 px-4 border-gray-500 rounded-md"
                        value={location || ""}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="">Select a location</option>
                        {buildings?.map((building) => (
                          <option value={building.id} key={building.id}>
                            {building.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2 items-center w-full">
                      <select
                        className="border p-1 px-4 border-gray-500 rounded-md"
                        value={floor || ""}
                        onChange={(e) => setFloor(e.target.value)}
                      >
                        <option value="">Select Floor</option>
                        {floors?.map((floor) => (
                          <option value={floor.id} key={floor.id}>
                            {floor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2 items-center w-full">
                      <input
                        id="category-name"
                        name="name"
                        className="border p-1 px-4 w-full border-gray-500 rounded-md"
                        onChange={(e) => setparkname(e.target.value)}
                        value={parkname || ""}
                        type="text"
                        placeholder="Enter Parking Name"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="bg-green-400 text-white rounded-md flex items-center gap-2 p-2 font-medium"
                      type="button"
                      style={{ background: themeColor }}
                      onClick={handleEdit}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ParkingConfigurationSetup;
