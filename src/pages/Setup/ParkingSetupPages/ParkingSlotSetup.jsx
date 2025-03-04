import React, { useEffect, useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../../components/table/Table";
import { ImEye } from "react-icons/im";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import {
  editParkingSlots,
  getParkingSlotDetails,
  getParkingSlots,
  postParkingSlots,
} from "../../../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../../utils/localStorage";
//import Modal from "../containers/modals/Modal";

const ParkingSlotSetup = () => {
  const siteID = getItemInLocalStorage("SITEID");
  const themeColor = useSelector((state) => state.theme.color);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [id, setid] = useState(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModal1 = () => setIsModalOpen1(true);
  const closeModal1 = () => setIsModalOpen1(false);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getParkingSlots();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setFilteredData(sortedInvData);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, []);

  const [formData, setFormData] = useState({
    start_hr: "",
    start_min: "",
    end_hr: "",
    end_min: "",
  });
  const fetchParkingSlotDetails = async (id) => {
    try {
      const resp = await getParkingSlotDetails(id);
      console.log(resp);
      if (resp) {
        setFormData({
          start_hr: resp.data.start_hr || "",
          start_min: resp.data.start_min || "",
          end_hr: resp.data.end_hr || "",
          end_min: resp.data.end_min || "",
        });
      }
    } catch (error) {
      console.log("Error fetching parking slot details:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [hour, minute] = value.split(":");

    if (name === "start_time") {
      setFormData({ ...formData, start_hr: hour, start_min: minute });
    } else if (name === "end_time") {
      setFormData({ ...formData, end_hr: hour, end_min: minute });
    }
  };

  const navigate = useNavigate();

  const handleCreateParkingSlot = async () => {
    const sendData = new FormData();
    sendData.append("parking_slot[site_id]", siteID);
    sendData.append("parking_slot[start_hr]", formData.start_hr);
    sendData.append("parking_slot[start_min]", formData.start_min);
    sendData.append("parking_slot[end_hr]", formData.end_hr);
    sendData.append("parking_slot[end_min]", formData.end_min);

    try {
      const resp = await postParkingSlots(sendData);
      console.log(resp);

      toast.success("Slot Created Successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditParkingSlot = async () => {
    const sendData = new FormData();
    sendData.append("parking_slot[site_id]", siteID);
    sendData.append("parking_slot[start_hr]", formData.start_hr);
    sendData.append("parking_slot[start_min]", formData.start_min);
    sendData.append("parking_slot[end_hr]", formData.end_hr);
    sendData.append("parking_slot[end_min]", formData.end_min);

    try {
      const resp = await editParkingSlots(id, sendData);
      console.log(resp);

      toast.success("Slot Updated Successfully");
      setIsModalOpen1(false);
    } catch (error) {
      console.log(error);
    }
  };
  const formatTime = (hour = 0, minute = 0) => {
    if (minute == null) minute = 0; // Handle null or undefined
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinute = String(minute).padStart(2, "0"); // Ensure two digits

    return `${formattedHour}:${formattedMinute} ${period}`;
  };

  const column = [
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          {/* <button onClick={openModal1}>
            <BiEdit size={15} />
          </button> */}
          <button
            onClick={() => {
              setid(row.id);
              fetchParkingSlotDetails(row.id);
              setIsModalOpen1(true);
            }}
          >
            <BiEdit size={15} />
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={closeModal}
              ></div>
              <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative z-10">
                <button
                  className="absolute top-4 right-2 text-gray-600 hover:text-gray-900"
                  onClick={closeModal}
                >
                  <FaTimes size={15} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Create Slot</h2>
                <div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="start_time"
                    >
                      Start Time
                    </label>
                    <input
                      className="border p-1 px-4 w-full border-gray-500 rounded-md"
                      id="start_time"
                      name="start_time"
                      type="time"
                      value={
                        formData.start_hr && formData.start_min
                          ? `${String(formData.start_hr).padStart(
                              2,
                              "0"
                            )}:${String(formData.start_min).padStart(2, "0")}`
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="end_time"
                    >
                      End Time
                    </label>
                    <input
                      className="border p-1 px-4 w-full border-gray-500 rounded-md"
                      id="end_time"
                      name="end_time"
                      type="time"
                      value={
                        formData.end_hr && formData.end_min
                          ? `${String(formData.end_hr).padStart(
                              2,
                              "0"
                            )}:${String(formData.end_min).padStart(2, "0")}`
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={handleCreateParkingSlot}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isModalOpen1 && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={closeModal1}
              ></div>
              <div className="bg-white w-96 rounded-lg shadow-lg p-4 relative z-10">
                <button
                  className="absolute top-4 right-2 text-gray-600 hover:text-gray-900"
                  onClick={closeModal1}
                >
                  <FaTimes size={15} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Edit Slot</h2>
                <div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="start_time"
                    >
                      Start Time
                    </label>
                    <input
                      className="border p-1 px-4 w-full border-gray-500 rounded-md"
                      id="start_time"
                      name="start_time"
                      type="time"
                      value={
                        formData.start_hr && formData.start_min
                          ? `${String(formData.start_hr).padStart(
                              2,
                              "0"
                            )}:${String(formData.start_min).padStart(2, "0")}`
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="end_time"
                    >
                      End Time
                    </label>
                    <input
                      className="border p-1 px-4 w-full border-gray-500 rounded-md"
                      id="end_time"
                      name="end_time"
                      type="time"
                      value={
                        formData.end_hr && formData.end_min
                          ? `${String(formData.end_hr).padStart(
                              2,
                              "0"
                            )}:${String(formData.end_min).padStart(2, "0")}`
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={handleEditParkingSlot}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Start time",
      selector: (row) => formatTime(row.start_hr, row.start_min),
      sortable: true,
    },
    {
      name: "End time",
      selector: (row) => formatTime(row.end_hr, row.end_min),
      sortable: true,
    },

    // { name: "Active/Inactive", selector: (row) => row.active, sortable: true },
    {
      name: "Created On",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
  ];
  const data = [
    {
      time: "2:00AM to 3:00AM",
      //   active:<ToggleSwitch/>,
      create: "23/04/2024",
    },
  ];

  return (
    <section className="flex ">
      {/* <Navbar /> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-end my-2">
          <button
            className="border-2 font-semibold hover:bg-black hover:text-white transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
            onClick={openModal}
          >
            <PiPlusCircle size={20} />
            Add
          </button>
        </div>
        <Table
          columns={column}
          data={filteredData}
          // customStyles={customStyle}
          responsive
          fixedHeader
          fixedHeaderScrollHeight="500px"
          pagination
          selectableRowsHighlight
          highlightOnHover
          omitColumn={column}
        />
      </div>
    </section>
  );
};

export default ParkingSlotSetup;
