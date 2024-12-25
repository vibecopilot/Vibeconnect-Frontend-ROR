import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { RiContactsBook2Line } from "react-icons/ri";
import Accordion from "../AdminHrms/Components/Accordion";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { getFloors, getUnits, getVendors } from "../../api";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PermitListEdit = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [showEntityList, setShowEntityList] = useState(false);
  const [activities, setActivities] = useState([
    { id: 1, activity: "", subActivity: "", hazardCategory: "", risks: "" },
  ]);
  const [nextId, setNextId] = useState(2);

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
        id: nextId,
        activity: "",
        subActivity: "",
        hazardCategory: "",
        risks: "",
      },
    ]);
    setNextId(nextId + 1);
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  const handleRadioChange = (event) => {
    setShowEntityList(event.target.value === "client");
  };

  const firstName = getItemInLocalStorage("Name");
  const lastName = getItemInLocalStorage("LASTNAME");
  const email = getItemInLocalStorage("USEREMAIL");
  const siteName = getItemInLocalStorage("SITENAME");
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const buildings = getItemInLocalStorage("Building");
  const userId = getItemInLocalStorage("UserId");
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    contact_number: "",
    site_id: "",
    unit_id: "",
    permit_for: "",
    building_id: "",
    floor_id: "",
    room_id: "",
    client_specific: "",
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
  const [vendors, setVendors] = useState([]);
  useEffect(() => {
    const fetchVendors = async () => {
      const vendorResp = await getVendors();
      setVendors(vendorResp.data);
    };

    fetchVendors();
  }, []);
  const handleChange = async (e) => {
    async function fetchFloor(floorID) {
      console.log(floorID);
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
    } else if (
      e.target.type === "select-one" &&
      e.target.name === "floor_name"
    ) {
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

  return (
    <section>
      <div className="m-2">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2 rounded-full text-white"
        >
          Edit Permit
        </h2>
        <div className="md:mx-20 my-5 mb-10 sm:border border-gray-400 p-5 px-10 rounded-lg sm:shadow-xl">
          <h2 className="border-b text-center text-xl border-black mb-6 font-bold">
            PERMIT REQUESTOR DETAILS
          </h2>
          <Accordion
            icon={RiContactsBook2Line}
            title={"Requestor Details"}
            content={
              <>
                <div>
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
                        className="block text-gray-700 font-medium "
                        htmlFor="name"
                      >
                        Email :
                      </label>
                      <p>{email}</p>
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
          <h2 className="border-b text-xl border-black font-medium mt-2">
            BASIC DETAILS
          </h2>
          <div className="w-full  my-5 p-5 rounded-lg border border-gray-300">
            {/* Basic details input fields */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="col-span-1">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="permit-for"
                  >
                    Permit For
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="room"
                  >
                    <option>Select Unit</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="type"
                  >
                    Client Specific
                  </label>
                  <div className="flex items-center justify-center shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <input
                      className="mr-2 leading-tight"
                      type="radio"
                      id="internal"
                      name="client_specific"
                      value="internal"
                      checked={formData.client_specific === "internal"}
                      onChange={handleRadioChange}
                    />
                    <label
                      className="text-gray-700 font-bold mr-4"
                      htmlFor="internal"
                    >
                      Internal
                    </label>
                    <input
                      className="mr-2 leading-tight"
                      type="radio"
                      id="client"
                      name="client_specific"
                      value="client"
                      checked={formData.client_specific === "client"}
                      onChange={handleRadioChange}
                    />
                    <label className="text-gray-700 font-bold" htmlFor="client">
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
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="entity-list"
                      onChange={handleChange}
                      value={formData.entity}
                      name="entity"
                    >
                      <option value="">Select Entity</option>
                      <option value="RISING ASSOSIATES">
                        RISING ASSOSIATES
                      </option>
                      <option value="ABS Professional Services">
                        ABS Professional Services
                      </option>
                      <option value="Apex Fund Services LLP">
                        Apex Fund Services LLP
                      </option>
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="copy-to"
                  >
                    <option value="">Select</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <h2 className="border-b  text-xl border-black  font-medium">
            PERMIT DETAILS
          </h2>

         
          {/* Permit details input fields */}
          <div className="w-full my-2">
            <h3 className="font-semibold">Select Permit Type</h3>
            {/* Permit details input fields */}
            <div className="border rounded-xl p-2 bg-gray-50">
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
            </div>
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
                        className="block text-gray-700 font-medium mb-2"
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
                        className="border border-gray-300 rounded-md p-2 w-full"
                      >
                        <option value="">Select Activity</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor={`sub-activity-${index}`}
                      >
                        Sub Activity*
                      </label>
                      <select
                        className="border border-gray-300 rounded-md p-2 w-full"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                    <div className="col-span-1">
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor={`hazard-category-${index}`}
                      >
                        Category of Hazards*
                      </label>
                      <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        id={`hazard-category-${index}`}
                        type="text"
                        placeholder="Select Category of Hazards"
                        name="category_of_hazards"
                        value={activity.category_of_hazards}
                        onChange={(e) => handleInputChange(index, e)}
                      >
                        <option value="">Select </option>
                      </select>
                      <input />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor={`risks-${index}`}
                    >
                      Risks*
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={`risks-${index}`}
                      type="text"
                      placeholder="Enter Risks"
                      name="risks"
                      value={activity.risks}
                      onChange={(e) => handleInputChange(index, e)}
                    />
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
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleAddActivity}
                >
                  Add Activity
                </button>
              </div>
            </div>

            <div className="w-full  border p-2 rounded-xl mt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="col-span-1">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="vendor"
                  >
                    Vendor
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="expiryDateTime"
                    value={formData.expiry_date_and_time}
                    onChange={handleChange}
                    name="expiry_date_and_time"
                    type="datetime-local"
                    placeholder="dd-mm-yyyy --:--"
                  />
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
                    className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

          <h3 className="border-b text-center text-xl border-black mb-6 font-bold">
            ATTACHMENTS
          </h3>
          <FileInputBox />

          {/* Submit button */}
          <div className="sm:flex justify-center grid gap-2 mt-5 border-t p-1">
            <button
              className="bg-red-400 text-white p-2 px-4 rounded-md font-medium flex items-center gap-2"
              onClick={()=>navigate("/admin/permit")}
            >
              <MdClose size={20} /> Cancel
            </button>
            <button
              className="bg-green-400 text-white p-2 px-4 rounded-md font-medium flex items-center gap-2"
              // onClick={handleNewPermit}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PermitListEdit;
