import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../../utils/localStorage";
import {
  editDeviceConfiguration,
  getDeviceConfigurationDetails,
} from "../../../api";
import toast from "react-hot-toast";

const EditDeviceModal = ({ deviceId, onclose }) => {
  const [formData, setFormData] = useState({
    name: "",
    ipAddress: "",
    username: "",
    password: "",
    buildingId: "",
    default: false,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const buildings = getItemInLocalStorage("Building");
  const siteId = getItemInLocalStorage("SITEID");

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        const res = await getDeviceConfigurationDetails(deviceId);
        const data = res.data;
        setFormData({
          ...formData,
          buildingId: data.building_id,
          ipAddress: data.ip_address,
          name: data.name,
          username: data.username,
          password: data.password,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeviceDetails();
  }, []);

  const handleAddDevice = async () => {
    const postData = new FormData();
    postData.append("hik_device[name]", formData.name);
    postData.append("hik_device[ip_address]", formData.ipAddress);
    postData.append("hik_device[username]", formData.username);
    postData.append("hik_device[password]", formData.password);
    postData.append("hik_device[building_id]", formData.buildingId);
    postData.append("hik_device[site_id]", siteId);
    try {
      const res = await editDeviceConfiguration(deviceId, postData);
      toast.success("Device Configured successfully");
      if (formData.default) {
        setItemInLocalStorage("DEFAULT", formData.ipAddress);
      setItemInLocalStorage("DeviceUsername", formData.username);
             setItemInLocalStorage("DevicePassword", formData.password);
      }

      onclose();
    } catch (error) {
      console.log(error);
      toast.error("Error Configuring Device");
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%]   w-[40rem] p-4  flex flex-col rounded-md gap-5">
        <div className="flex flex-col">
          <h2 className="border-b border-gray-400 pb-2 flex justify-center font-semibold text-xl w-full">
            Configure Device
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col ">
              <label htmlFor="" className="font-medium">
                Device Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                id=""
                className="border rounded-md p-2"
                placeholder="Enter Name"
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="" className="font-medium">
                IP Address
              </label>
              <input
                type="text"
                name="ipAddress"
                onChange={handleChange}
                value={formData.ipAddress}
                id=""
                className="border rounded-md p-2"
                placeholder="Enter IP Address"
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="" className="font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                id=""
                className="border rounded-md p-2"
                placeholder="Enter Username"
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="" className="font-medium">
                Password
              </label>
              <input
                type="text"
                name="password"
                onChange={handleChange}
                id=""
                value={formData.password}
                className="border rounded-md p-2"
                placeholder="Enter Password"
              />
            </div>
            <div className="flex flex-col ">
              <label htmlFor="" className="font-medium">
                Select Building
              </label>
              <select
                name="buildingId"
                id=""
                className="border rounded-md p-2"
                onChange={handleChange}
                value={formData.buildingId}
              >
                <option value="">Select Building</option>
                {buildings.map((building) => (
                  <option value={building.id} key={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name=""
                id="default"
                value={formData.default}
                onChange={() =>
                  setFormData({ ...formData, default: !formData.default })
                }
              />
              <label htmlFor="default">Default for this Machine</label>
            </div>
          </div>
          <div className="flex justify-center gap-2 border-t p-1 my-2">
            <button
              className="bg-red-400 text-white p-2 px-4 rounded-full flex items-center gap-2"
              onClick={() => onclose(false)}
            >
              <MdClose /> Cancel
            </button>
            <button
              className="bg-green-400 text-white p-2 px-4 rounded-full flex items-center gap-2"
              onClick={handleAddDevice}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeviceModal;
