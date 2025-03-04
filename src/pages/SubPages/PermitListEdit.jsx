import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import {
  editPermit,
  getFloors,
  getPermitDetails,
  getPermitType,
  getSetupUsers,
  getUnits,
  getVendors,
  postNewPermit,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { RiContactsBook2Line } from "react-icons/ri";
import Accordion from "../AdminHrms/Components/Accordion";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { PiPlusCircleBold } from "react-icons/pi";
import toast from "react-hot-toast";

const PermitListEdit = () => {
  const buildings = getItemInLocalStorage("Building");
  const userId = getItemInLocalStorage("UserId");
  const [assignedUser, setAssignedUser] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getPermitType();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setFilteredData(sortedInvData);
        setupdate(false);
        console.log(invResp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, []);
  useEffect(() => {
    const fetchAssignedTo = async () => {
      try {
        const response = await getSetupUsers();

        // Assuming response.data is an array of user objects
        const formattedUsers = response.data.map((user) => ({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
        }));

        setAssignedUser(formattedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    fetchAssignedTo();
  }, []);
  const [vendors, setVendors] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [showEntityList, setShowEntityList] = useState(false);
  const [activities, setActivities] = useState([
    { activity: "", sub_activity: "", category_of_hazards: "", risks: "" },
  ]);

  useEffect(() => {
    const fetchVendors = async () => {
      const vendorResp = await getVendors();
      setVendors(vendorResp.data);
    };

    fetchVendors();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    site_id: "",
    unit_id: "",
    permit_for: "",
    building_id: "",
    floor_id: "",
    room_id: "",
    client_specific: "internal",
    entity: "",
    copy_to_string: "",
    permit_type: "",
    vendor_id: "",
    issue_date_and_time: "",
    expiry_date_and_time: "",
    comment: "",
    permit_status: "",
    extention_status: true,
    created_by_id: "",
    permit_activities: [],
  });

  const navigate = useNavigate();
  const handleNewPermit = async () => {
    const sendData = new FormData();
    sendData.append("permit[name]", `${firstName} ${lastName}`);
    sendData.append("permit[contact_number]", formData.contact_number);
    // sendData.append("permit[site_id]", formData.site_id);
    // sendData.append("permit[unit_id]", formData.unit_id);
    sendData.append("permit[permit_for]", formData.permit_for);
    sendData.append("permit[building_id]", formData.building_id);
    sendData.append("permit[floor_id]", formData.floor_id);
    // sendData.append("permit[room_id]", formData.room_id);
    sendData.append("permit[client_specific]", formData.client_specific);
    sendData.append("permit[entity]", formData.entity);
    sendData.append("permit[copy_to_string]", formData.copy_to_string);
    sendData.append("permit[permit_type]", formData.permit_type);
    sendData.append("permit[vendor_id]", formData.vendor_id);
    // sendData.append("permit[issue_date_and_time]", formData.issue_date_and_time);
    sendData.append(
      "permit[expiry_date_and_time]",
      formData.expiry_date_and_time
    );
    sendData.append("permit[comment]", formData.comment);
    sendData.append("permit[permit_status]", formData.permit_status);
    // sendData.append("permit[extention_status]", formData.extention_status);
    sendData.append("permit[created_by_id]", userId);

    activities.forEach((activity) => {
      sendData.append(
        `permit[permit_activities][][activity]`,
        activity.activity
      );
      sendData.append(
        `permit[permit_activities][][sub_activity]`,
        activity.sub_activity
      );
      sendData.append(
        `permit[permit_activities][][category_of_hazards]`,
        activity.category_of_hazards
      );
      sendData.append(`permit[permit_activities][][risks]`, activity.risks);
    });

    // formData.permit_attachments.forEach((file) => {
    //     sendData.append("attachfiles[]", file)
    // });
    try {
      const billResp = await editPermit(id, sendData);
      toast.success("Permit Updated Successfully");
      navigate("/admin/permit");
      console.log("Permit response", billResp);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = async (e) => {
    async function fetchFloor(floorID) {
      try {
        const build = await getFloors(floorID);
        setFloors(build.data.map((item) => ({ name: item.name, id: item.id })));
      } catch (e) {
        console.log(e);
      }
    }

    async function getUnit(UnitID) {
      try {
        const unit = await getUnits(UnitID);
        setUnits(unit.data.map((item) => ({ name: item.name, id: item.id })));
        console.log(unit);
      } catch (error) {
        console.log(error);
      }
    }
    if (e.target.type === "select-one" && e.target.name === "building_id") {
      const BuildID = Number(e.target.value);
      await fetchFloor(BuildID);

      setFormData({
        ...formData,
        building_id: BuildID,
      });
    } else if (e.target.type === "select-one" && e.target.name === "floor_id") {
      const UnitID = Number(e.target.value);
      await getUnit(UnitID);
      setFormData({
        ...formData,
        floor_id: UnitID,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const { id } = useParams();
  const fetchPermitsDetails = async () => {
    try {
      const res = await getPermitDetails(id);
      setFormData({
        ...formData,
        name: res?.data?.name,
        contact_number: res?.data?.contact_number,
        permit_for: res?.data?.permit_for,
        building_id: res?.data?.building_id,
        floor_id: res?.data?.floor_id,
        unit_id: res?.data?.unit_id,
        client_specific: res?.data?.client_specific,
      });
      fetchFloors(res?.data?.building_id);
      fetchUnits(res?.data?.floor_id);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchFloors = async (buildingId) => {
    try {
      const res = await getFloors(buildingId);
      setFloors(res.data.map((item) => ({ name: item.name, id: item.id })));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUnits = async (floorId) => {
    try {
      const res = await getUnits(floorId);
      setUnits(res.data.map((item) => ({ name: item.name, id: item.id })));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPermitsDetails();
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newActivities = [...activities];
    newActivities[index][name] = value;
    setActivities(newActivities);
  };

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        activity: "",
        subActivity: "",
        hazardCategory: "",
        risks: "",
      },
    ]);
  };

  const handleDeleteActivity = (index) => {
    const removeActivities = [...activities];
    removeActivities.splice(index, 1);
    setActivities(removeActivities);
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setShowEntityList(value === "client");

    // Update formData with the selected value
    setFormData((prevData) => ({
      ...prevData,
      client_specific: value,
    }));
  };
  const firstName = getItemInLocalStorage("Name");
  const lastName = getItemInLocalStorage("LASTNAME");
  const email = getItemInLocalStorage("USEREMAIL");
  const siteName = getItemInLocalStorage("SITENAME");
  return (
    <section className="flex">
      <Navbar />
      <div className="m-2 w-full">
        <div className=" my-5 mb-10 sm:border border-gray-300 p-2 rounded-lg ">
          <h2
            style={{ background: themeColor }}
            className="text-center text-xl font-bold p-2 rounded-md text-white"
          >
            Edit Permit
          </h2>
          <div className=" my-5 mb-10 sm:border border-gray-300 p-5 px-10 rounded-lg ">
            {/* <h2 className="border-b text-center text-xl border-black  font-bold">
            PERMIT REQUESTOR DETAILS
          </h2> */}
            <Accordion
              icon={RiContactsBook2Line}
              title={"Requestor Details"}
              content={
                <>
                  <div className="bg-green-50 p-2 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="grid grid-cols-2 items-center">
                        <label
                          className="block text-gray-700 font-medium "
                          htmlFor="name"
                        >
                          Name :
                        </label>
                        <p>{`${firstName} ${lastName}`}</p>
                      </div>

                      <div className="grid grid-cols-2 items-center">
                        <label
                          className="block text-gray-700 font-medium  text-center"
                          htmlFor="name"
                        >
                          Site :
                        </label>
                        <p>{siteName}</p>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <label
                          className="block text-gray-700 font-medium "
                          htmlFor="name"
                        >
                          Contact number :
                        </label>
                        <p>{formData?.contact_number}</p>
                      </div>
                      {/* <div className="grid grid-cols-2 items-center">
                      <label
                        className="block text-gray-700 font-medium "
                        htmlFor="name"
                      >
                        Unit :
                      </label>
                      <p>{siteName}</p>
                    </div> */}
                    </div>
                  </div>
                </>
              }
            />

            <h2 className="border-b  text-xl border-black font-medium mt-2">
              BASIC DETAILS
            </h2>

            <div className="w-full my-3  ">
              {/* Basic details input fields */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="col-span-1">
                    <label
                      className="block  font-semibold mb-2"
                      htmlFor="permit-for"
                    >
                      Permit For
                    </label>
                    <input
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="permit-for"
                      type="text"
                      onChange={handleChange}
                      value={formData.permit_for}
                      name="permit_for"
                      placeholder="Enter Permit For"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="building"
                    >
                      Building
                    </label>
                    <select
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="building"
                      onChange={handleChange}
                      value={formData.building_id}
                      name="building_id"
                    >
                      <option value="">Select Building</option>
                      {buildings?.map((building) => (
                        <option key={building.id} value={building.id}>
                          {building.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="floor"
                    >
                      Floor
                    </label>
                    <select
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="floor"
                      onChange={handleChange}
                      value={formData.floor_id}
                      name="floor_id"
                    >
                      <option value="">Select Floor</option>
                      {floors?.map((floor) => (
                        <option value={floor.id} key={floor.id}>
                          {floor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="room"
                    >
                      Unit
                    </label>
                    <select
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="room"
                    >
                      <option>Select Unit</option>
                      {units?.map((floor) => (
                        <option value={floor.id} key={floor.id}>
                          {floor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="type"
                    >
                      Client Specific
                    </label>
                    <div className="flex items-center justify-center bg-gray-200 border rounded-md  w-full p-1  text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                      <input
                        className="mr-2 "
                        type="radio"
                        id="internal"
                        name="client_specific"
                        value="internal"
                        checked={formData.client_specific === "internal"}
                        onChange={handleRadioChange}
                      />
                      <label
                        className="text-gray-700 font-semibold mr-10"
                        htmlFor="internal"
                      >
                        Internal
                      </label>
                      <input
                        className="mr-2 "
                        type="radio"
                        id="client"
                        name="client_specific"
                        value="client"
                        checked={formData.client_specific === "client"}
                        onChange={handleRadioChange}
                      />
                      <label
                        className="text-gray-700 font-semibold"
                        htmlFor="client"
                      >
                        Client
                      </label>
                    </div>
                  </div>
                  {showEntityList && (
                    <div className="col-span-2 md:col-span-1">
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="entity-list"
                      >
                        List of Entity
                      </label>
                      <select
                        className="w-full border p-1 px-4 border-gray-500 rounded-md"
                        id="entity-list"
                        onChange={handleChange}
                        value={formData.entity}
                        name="entity"
                      >
                        <option value="">Select Entity</option>
                        {/* <option value="RISING ASSOSIATES">
                        RISING ASSOSIATES
                      </option>
                      <option value="ABS Professional Services">
                        ABS Professional Services
                      </option>
                      <option value="Apex Fund Services LLP">
                        Apex Fund Services LLP
                      </option> */}
                      </select>
                    </div>
                  )}
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="copy-to"
                    >
                      Copy To
                    </label>
                    <select
                      name="copy_to_string"
                      onChange={handleChange}
                      value={formData.copy_to_string}
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="copy-to"
                    >
                      <option value="">Select</option>
                      {assignedUser?.map((assign) => (
                        <option key={assign.id} value={assign.id}>
                          {assign.firstname} {assign.lastname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="border-b  text-xl border-black  font-medium">
              PERMIT DETAILS
            </h2>

            <div className="w-full my-2 ">
              <h3 className="font-semibold mb-2">Permit Type</h3>
              {/* Permit details input fields */}
              {/* <div className="border rounded-xl p-2 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="cold-work"
                    name="permit_type"
                    value="Cold Work"
                    checked={formData.permit_type === "Cold Work"}
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="cold-work"
                  >
                    Cold Work
                  </label>
                </div>
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="confined-space-work"
                    name="permit_type"
                    value="Confined Space Work"
                    checked={formData.permit_type === "Confined Space Work"}
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="confined-space-work"
                  >
                    Confined Space Work
                  </label>
                </div>
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="electrical-work"
                    name="permit-type"
                    value="Electrical Work"
                    checked={formData.permit_type === "Electrical Work"}
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="electrical-work"
                  >
                    Electrical Work
                  </label>
                </div>
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="excavation-work"
                    name="permit_type"
                    value="Excavation Work"
                    checked={formData.permit_type === "Excavation Work"}
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="excavation-work"
                  >
                    Excavation Work
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="height-work"
                    name="permit_type"
                    value="Height Work"
                    checked={formData.permit_type === "Height Work"}
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="height-work"
                  >
                    Height Work
                  </label>
                </div>
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="hot-work"
                    name="permit_type"
                    value="Hot Work"
                    checked={formData.permit_type === "Hot Work"}
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="hot-work"
                  >
                    Hot Work
                  </label>
                </div>
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="radiology-work"
                    name="permit_type"
                    value="Radiology Work"
                    checked={formData.permit_type === "Radiology Work"}
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="radiology-work"
                  >
                    Radiology Work
                  </label>
                </div>
                <div className="col-span-1">
                  <input
                    type="radio"
                    id="loading-unloading-work"
                    name="permit_type"
                    value="Loading, Unloading Hazardous Material Work"
                    checked={
                      formData.permit_type ===
                      "Loading, Unloading Hazardous Material Work"
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, permit_type: e.target.value })
                    }
                  />
                  <label
                    className="text-gray-700 font-medium ml-2"
                    htmlFor="loading-unloading-work"
                  >
                    Loading, Unloading Hazardous Material Work
                  </label>
                </div>
              </div>
            </div> */}
              <select
                name="permit_type"
                id=""
                onChange={handleChange}
                value={formData.permit_type}
                className=" border p-1 px-4 border-gray-500 w-1/3  rounded-md "
              >
                <option value="">Select Permit Type</option>
                {filteredData?.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="font-semibold border-b border-gray-500 text-xl">
              Enter Permit Description
            </h3>

            <div className="w-full ">
              {/* Permit details input fields */}
              <div className="w-full   rounded-lg ">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="mb-4 border p-2 rounded-xl mt-1"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`activity-${index}`}
                        >
                          Activity*
                        </label>
                        <select
                          id={`activity-${index}`}
                          type="text"
                          name="activity"
                          value={activity.activity}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Activity</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`sub-activity-${index}`}
                        >
                          Sub Activity*
                        </label>
                        <select
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                          id={`sub-activity-${index}`}
                          type="text"
                          placeholder="Select Sub Activity"
                          name="sub_activity"
                          value={activity.sub_activity}
                          onChange={(e) => handleInputChange(index, e)}
                        >
                          <option value="">Select Sub Activity</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`hazard-category-${index}`}
                        >
                          Category of Hazards*
                        </label>
                        <select
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                          id={`hazard-category-${index}`}
                          type="text"
                          placeholder="Select Category of Hazards"
                          name="category_of_hazards"
                          value={activity.category_of_hazards}
                          onChange={(e) => handleInputChange(index, e)}
                        >
                          <option value="">Select Category of Hazards</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`risks-${index}`}
                        >
                          Risks*
                        </label>
                        <select
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                          id={`risks-${index}`}
                          type="text"
                          placeholder="Enter Risks"
                          name="risks"
                          value={activity.risks}
                          onChange={(e) => handleInputChange(index, e)}
                        >
                          <option value="">Select Risks</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mt-1"
                        type="button"
                        onClick={() => handleDeleteActivity(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <button
                    style={{ background: themeColor }}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold flex items-center gap-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleAddActivity}
                  >
                    <PiPlusCircleBold /> Add Activity
                  </button>
                </div>
              </div>

              <div className="w-full   p-2 rounded-xl mt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="vendor"
                    >
                      Vendor
                    </label>
                    <select
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="vendor"
                      type="text"
                      value={formData.vendor_id}
                      onChange={handleChange}
                      name="vendor_id"
                      placeholder="Enter Vendor"
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map((vendor) => (
                        <option value={vendor.id} key={vendor.id}>
                          {vendor.vendor_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="expiryDateTime"
                    >
                      Expiry Date&Time*
                    </label>
                    <input
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="expiryDateTime"
                      value={formData.expiry_date_and_time}
                      onChange={handleChange}
                      name="expiry_date_and_time"
                      type="datetime-local"
                      placeholder="dd-mm-yyyy --:--"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="expiryDateTime"
                    >
                      Status
                    </label>
                    <select
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      name="permit_status"
                      id=""
                      value={formData.permit_status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Draft">Draft</option>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="comment"
                    >
                      Comment (Optional)
                    </label>
                    <textarea
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      name="comment"
                      placeholder="Enter Comment"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="border-b text-xl border-black mb-2 font-medium">
              ATTACHMENTS
            </h3>

            <FileInputBox />

            {/* Submit button */}
            <div className="sm:flex justify-center grid gap-2 mt-5 border-t p-1">
              <button
                className="bg-red-400 text-white p-2 px-4 rounded-md font-medium flex items-center gap-2"
                onClick={() => navigate("/admin/permit")}
              >
                <MdClose size={20} /> Cancel
              </button>
              <button
                className="bg-green-400 text-white p-2 px-4 rounded-md font-medium flex items-center gap-2"
                onClick={handleNewPermit}
              >
                <FaCheck /> Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PermitListEdit;
