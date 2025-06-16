import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import {
  getFloors,
  getPermitType,
  getSetupUsers,
  getUnits,
  getVendors,
  postNewPermit,
  getPermitActivity,
  getPermitSubActivity,
  getPermitRisks,
  getHazardCategory,
  fetchPermitEntity,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { RiContactsBook2Line } from "react-icons/ri";
import Accordion from "../AdminHrms/Components/Accordion";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { PiPlusCircleBold } from "react-icons/pi";
import toast from "react-hot-toast";
import CARAddItemsModal from "../../containers/modals/CARAddItemsModal";

const AddNewPermit = () => {
  const buildings = getItemInLocalStorage("Building");
  const userId = getItemInLocalStorage("UserId");
  const [assignedUser, setAssignedUser] = useState([]);
  // const siteId = getItemInLocalStorage("SITEID");
  const [filteredData, setFilteredData] = useState([]);
  const firstName = getItemInLocalStorage("Name");
  const lastName = getItemInLocalStorage("LASTNAME");
  const email = getItemInLocalStorage("USEREMAIL");
  const siteName = getItemInLocalStorage("SITENAME");
  const mobileNumber = getItemInLocalStorage("Mobile");

  // Permit Activity
  const [allPermitActivities, setAllPermitActivities] = useState([]);
  const [allPermitSubActivities, setAllPermitSubActivities] = useState([]);
  const [allHazardCategories, setAllHazardCategories] = useState([]);
  const [allPermitRisks, setAllPermitRisks] = useState([]);
  const [permitActivityOptions, setPermitActivityOptions] = useState([]);

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const invResp = await getPermitType();
        const sortedInvData = invResp.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        console.log("sortedInvData:", sortedInvData);
        setFilteredData(sortedInvData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPantry();
  }, []);
  // ok

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
  // ok

  const [vendors, setVendors] = useState([]);
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [showEntityList, setShowEntityList] = useState(false);
  const [activities, setActivities] = useState([
    { activity: "", sub_activity: "", category_of_hazards: "", risks: "" },
  ]);
  const [permit_activity, setPermitActivity] = useState([]);

  // ok

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
  const siteId = getItemInLocalStorage("SITEID");

  const handleNewPermit = async () => {
    const sendData = new FormData();
    sendData.append("permit[name]", `${firstName} ${lastName}`);
    sendData.append("permit[contact_number]", formData.contact_number);
    sendData.append("permit[site_id]", siteId);
    sendData.append("permit[unit_id]", formData.unit_id);
    sendData.append("permit[permit_for]", formData.permit_for);
    sendData.append("permit[building_id]", formData.building_id);
    sendData.append("permit[floor_id]", formData.floor_id);
    sendData.append("permit[room_id]", formData.unit_id);
    sendData.append("permit[client_specific]", formData.client_specific);
    sendData.append("permit[entity]", formData.entity);
    sendData.append("permit[copy_to_string]", formData.copy_to_string);
    sendData.append("permit[permit_type]", formData.permit_type);
    sendData.append("permit[vendor_id]", formData.vendor_id);
    const currentDateTime = new Date().toISOString();
    sendData.append("permit[issue_date_and_time]", currentDateTime);
    sendData.append(
      "permit[expiry_date_and_time]",
      formData.expiry_date_and_time
    );
    sendData.append("permit[comment]", formData.comment);
    sendData.append("permit[permit_status]", "Open");
    sendData.append("permit[extention_status]", "false");
    sendData.append("permit[created_by_id]", userId);

    activities.forEach((activity) => {
      sendData.append(
        "permit[permit_activities][][activity]",
        activity.activity || ""
      );
      sendData.append(
        "permit[permit_activities][][sub_activity]",
        activity.sub_activity || ""
      );
      sendData.append(
        "permit[permit_activities][][category_of_hazards]",
        activity.category_of_hazards || ""
      );
      sendData.append(
        "permit[permit_activities][][risks]",
        activity.risks || ""
      );
    });

    try {
      const billResp = await postNewPermit(sendData);
      toast.success("Permit Added Successfully");
      navigate("/admin/permit");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (e) => {
    // Check if the field is permit_type.
    if (e.target.name === "permit_type") {
      const permitType = e.target.value;
      setFormData({
        ...formData,
        permit_type: permitType,
      });
      try {
        // Call the API that returns permit activities based on the selected permit type.
        const res = await getPermitActivity(permitType);
        // console.log("fetchPermitActivities:", res.data);

        if (res && res.data) {
          setPermitActivity(res.data);
        }
      } catch (error) {
        console.error("Error fetching permit activity:", error);
      }
      return; // Prevent further processing.
    }

    async function fetchFloor(floorID) {
      // console.log(floorID);
      try {
        const build = await getFloors(floorID);
        // console.log(build);
        setFloors(build.data.map((item) => ({ name: item.name, id: item.id })));
      } catch (e) {
        console.log(e);
      }
    }

    async function getUnit(UnitID) {
      // console.log(UnitID);
      try {
        const unit = await getUnits(UnitID);
        setUnits(unit.data.map((item) => ({ name: item.name, id: item.id })));
        // console.log(unit);
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
      const floorId = Number(e.target.value);
      await getUnit(floorId);
      setFormData({
        ...formData,
        floor_id: floorId,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        activity: "",
        activity_name: "",
        sub_activity: "",
        sub_activity_name: "",
        category_of_hazards: "",
        category_of_hazards_name: "",
        risks: "",
        risks_name: "",
        subOptions: [],
        hazardOptions: [],
        riskOptions: [],
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
    setFormData((prevData) => ({
      ...prevData,
      client_specific: value,
    }));
  };

  // ---------- 1) Load all data on mount ----------
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Fetch all 4–5 endpoints in parallel
        const [
          permitActivitiesRes,
          permitSubActivitiesRes,
          hazardCategoriesRes,
          permitRisksRes,
        ] = await Promise.all([
          getPermitActivity(), // no params, loads all
          getPermitSubActivity(), // no params, loads all
          getHazardCategory(),
          getPermitRisks(),
        ]);

        // Log each raw API response to console
        console.log(
          "RAW Permit Activities Response:",
          permitActivitiesRes.data
        );
        console.log(
          "RAW Permit Sub Activities Response:",
          permitSubActivitiesRes.data
        );
        console.log(
          "RAW Hazard Categories Response:",
          hazardCategoriesRes.data
        );
        console.log("RAW Permit Risks Response:", permitRisksRes.data);

        // Store the full results in state
        setAllPermitActivities(permitActivitiesRes.data);
        setAllPermitSubActivities(permitSubActivitiesRes.data);
        setAllHazardCategories(hazardCategoriesRes.data);
        setAllPermitRisks(permitRisksRes.data);
      } catch (error) {
        console.error("Error fetching data in parallel:", error);
      }
    };

    loadAllData();
  }, []);

  // When a permit type is selected, filter activities based on that type.
  const handlePermitTypeChange = (e) => {
    const selectedTypeId = e.target.value;
    setFormData({ ...formData, permit_type: selectedTypeId });
    console.log("formdata after:", formData);

    const filteredActivities = allPermitActivities.filter(
      (act) => act.parent_id === Number(selectedTypeId)
    );
    console.log("filteredActivities:", filteredActivities);
    setPermitActivityOptions(filteredActivities);
  };

  // When an activity is selected, store its id only.
  const handleActivityChange = (index, e) => {
    const selectedActivityId = e.target.value;
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index] };
    newActivities[index].activity = selectedActivityId; // store id

    // Reset dependent fields.
    newActivities[index].sub_activity = "";
    newActivities[index].category_of_hazards = "";
    newActivities[index].risks = "";
    // Filter sub activities based on the selected activity id.
    const subActivityList = allPermitSubActivities.filter(
      (sub) => sub.permit_activity_setup_id === Number(selectedActivityId)
    );
    console.log("Filtered Sub Activities:", subActivityList);
    newActivities[index].subOptions = subActivityList;
    newActivities[index].hazardOptions = [];
    newActivities[index].riskOptions = [];

    setActivities(newActivities);
  };

  // When a sub-activity is selected, store its id only.
  const handleSubActivityChange = (index, e) => {
    const selectedSubActivityId = e.target.value;
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index] };
    newActivities[index].sub_activity = selectedSubActivityId; // store id
    newActivities[index].category_of_hazards = "";
    newActivities[index].risks = "";
    // Filter hazard categories using the selected sub-activity id.
    const hazardList = allHazardCategories.filter(
      (haz) => haz.sub_activity_id === Number(selectedSubActivityId)
    );
    console.log("Filtered Hazard Categories:", hazardList);
    newActivities[index].hazardOptions = hazardList;
    newActivities[index].riskOptions = [];

    setActivities(newActivities);
  };

  // When a hazard category is selected, store its id only.
  const handleHazardChange = (index, e) => {
    const selectedHazardId = e.target.value;
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index] };
    newActivities[index].category_of_hazards = selectedHazardId; // store id
    newActivities[index].risks = "";
    // Filter risks based on the hazard category id.
    const riskList = allPermitRisks.filter(
      (risk) => risk.hazard_category_id === Number(selectedHazardId)
    );
    console.log("Filtered Risks:", riskList);
    newActivities[index].riskOptions = riskList;

    setActivities(newActivities);
  };

  // When a risk is selected, store its id only.
  const handleRiskChange = (index, e) => {
    const selectedRiskId = e.target.value;
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index] };
    newActivities[index].risks = selectedRiskId; // store id
    console.log("Updated Activities:", newActivities);
    setActivities(newActivities);
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="m-2 w-full">
        <div className=" my-5 mb-10 sm:border border-gray-300 p-2 rounded-lg ">
          <h2
            style={{ background: themeColor }}
            className="text-center text-xl font-bold p-2 rounded-md text-white"
          >
            New Permit
          </h2>
          <div className=" my-5 mb-10 sm:border border-gray-300 p-5 px-10 rounded-lg ">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 gap-y-4 mb-4">
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
                      className="block text-gray-700 font-medium "
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
                      className="block text-gray-700 font-medium"
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
                      className="block text-gray-700 font-medium "
                      htmlFor="room"
                    >
                      Unit
                    </label>
                    <select
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      name="unit_id"
                      onChange={handleChange}
                      value={formData.unit_id}
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
                      className="block text-gray-700 font-medium"
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
                        className="block text-gray-700 font-medium"
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
                      className="block text-gray-700 font-medium "
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
                onChange={handlePermitTypeChange}
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

            <div className="w-full">
              <div className="w-full rounded-lg">
                {activities.map((activity, index) => (
                  <div key={index} className="mb-4 border p-2 rounded-xl mt-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {/* Activity Dropdown */}
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`activity-${index}`}
                        >
                          Activity <span className="text-red-400">*</span>
                        </label>
                        <select
                          id={`activity-${index}`}
                          name="activity"
                          value={activity.activity || ""}
                          onChange={(e) => handleActivityChange(index, e)}
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Activity</option>
                          {permitActivityOptions.map((act) => (
                            <option key={act.id} value={act.id}>
                              {act.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Sub Activity Dropdown */}
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`sub-activity-${index}`}
                        >
                          Sub Activity<span className="text-red-400">*</span>
                        </label>
                        <select
                          id={`sub-activity-${index}`}
                          name="sub_activity"
                          value={activity.sub_activity || ""}
                          onChange={(e) => handleSubActivityChange(index, e)}
                          disabled={!activity.activity}
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Sub Activity</option>
                          {activity.subOptions?.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {/* Hazard Category Dropdown */}
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`hazard-category-${index}`}
                        >
                          Category of Hazards
                          <span className="text-red-400">*</span>
                        </label>
                        <select
                          id={`hazard-category-${index}`}
                          name="category_of_hazards"
                          value={activity.category_of_hazards || ""}
                          onChange={(e) => handleHazardChange(index, e)}
                          disabled={!activity.sub_activity}
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Category of Hazards</option>
                          {activity.hazardOptions?.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Risk Dropdown */}
                      <div className="col-span-1">
                        <label
                          className="block text-gray-700 font-bold mb-2"
                          htmlFor={`risks-${index}`}
                        >
                          Risks<span className="text-red-400">*</span>
                        </label>
                        <select
                          id={`risks-${index}`}
                          name="risks"
                          value={activity.risks || ""}
                          onChange={(e) => handleRiskChange(index, e)}
                          disabled={!activity.category_of_hazards}
                          className="w-full border p-1 px-4 border-gray-500 rounded-md"
                        >
                          <option value="">Select Risks</option>
                          {activity.riskOptions?.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.risk_name || option.name}
                            </option>
                          ))}
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

              <div className="w-full p-2 rounded-xl mt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="vendor"
                    >
                      Vendor
                    </label>
                    <select
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="vendor"
                      name="vendor_id"
                      value={formData.vendor_id}
                      onChange={handleChange}
                      placeholder="Enter Vendor"
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.vendor_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="expiryDateTime"
                    >
                      Expiry Date & Time*
                    </label>
                    <input
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="expiryDateTime"
                      type="datetime-local"
                      name="expiry_date_and_time"
                      value={formData.expiry_date_and_time}
                      onChange={handleChange}
                      placeholder="dd-mm-yyyy --:--"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="comment"
                    >
                      Comment (Optional)
                    </label>
                    <textarea
                      className="w-full border p-1 px-4 border-gray-500 rounded-md"
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
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

export default AddNewPermit;
