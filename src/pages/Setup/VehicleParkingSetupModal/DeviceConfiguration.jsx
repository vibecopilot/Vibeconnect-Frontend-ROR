import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";
import AddVehicleParkingModal from "./AddVehicleParkingModal";
import EditVehicleParkingModal from "./EditVehicleParkingModal";
import {
  getVehicleParking,
  deleteVehicleParking,
  getDeviceConfiguration,
} from "../../../api";
import toast from "react-hot-toast";
import AddDeviceModal from "./AddDeviceModal";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import EditDeviceModal from "./EditDeviceModal";
function DeviceConfiguration() {
  const themeColor = useSelector((state) => state.theme.color);
  const [addDevice, setAddDevice] = useState(false);
  const [editVehicleModal, setEditVehicleModal] = useState(false);
  const [configuredDevice, setConfiguredDevice] = useState([]);
  const [added, setAdded] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [editModal, setEditModal] = useState(false);
  const column = [
    {
      name: "Sr. no.",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Device Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "IP Address",
      selector: (row) => row.ip_address,
      sortable: true,
    },
    {
      name: "username",
      selector: (row) => row.username,
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => editDeviceConfiguration(row.id)}>
            <BiEdit size={15} />
          </button>
          {/* <button>
            <RiDeleteBin5Line size={15} onClick={() => deleteVehicle(row.id)} />
          </button> */}
        </div>
      ),
    },
  ];
  const siteId = getItemInLocalStorage("SITEID");
  const fetchDeviceConfiguration = async () => {
    try {
      const deviceRes = await getDeviceConfiguration(siteId);
      setConfiguredDevice(deviceRes?.data);
      setFilteredData(deviceRes?.data);
      console.log(deviceRes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDeviceConfiguration();
  }, []);

  const deleteVehicle = async (id) => {
    try {
      const vehicleParkingRes = await deleteVehicleParking(id);
      toast.success("deleted Successfully");
      setAdded(true);
      console.log(vehicleParkingRes);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setAdded(false);
      }, 500);
    }
  };

  const editDeviceConfiguration = (id) => {
    setEditModal(true);
    setDeviceId(id);
  };

  const [filteredData, setFilteredData] = useState([]);
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredData(configuredDevice);
    } else {
      const filteredResults = configuredDevice.filter(
        (items) =>
          (items.name &&
            items.name.toLowerCase().includes(searchValue.toLowerCase())) ||
          (items.ip_address &&
            items.ip_address.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredData(filteredResults);
    }
  };

  return (
    <section>
      <div className="w-full flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row md:justify-between gap-3 my-3">
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder="Search By Name, Ip address"
            className="border p-2 w-full border-gray-300 rounded-lg placeholder:text-sm"
          />
          <div className="flex gap-3 sm:flex-row flex-col">
            <button
              className="text-white font-semibold px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
              onClick={() => setAddDevice(true)}
            >
              <IoAddCircleOutline size={22} /> Add
            </button>
          </div>
        </div>
        <div className="mb-3">
          <Table columns={column} data={filteredData} isPagination={true} />
        </div>
        {addDevice && <AddDeviceModal setAddDevice={setAddDevice} />}
        {editModal && (
          <EditDeviceModal
            deviceId={deviceId}
            onclose={() => setEditModal(false)}
          />
        )}
      </div>
    </section>
  );
}

export default DeviceConfiguration;
