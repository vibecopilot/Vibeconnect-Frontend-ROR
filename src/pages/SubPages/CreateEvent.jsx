import React, { useEffect, useRef, useState } from "react";
import FileInput from "../../Buttons/FileInput";
import Switch from "../../Buttons/Switch";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { getItemInLocalStorage } from "../../utils/localStorage";
import {
  postEvents,
  getAssignedTo,
  getGroups,
  getSetupUsers,
  getAllUnits,
  getBuildings,
} from "../../api";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaTimesCircle } from "react-icons/fa";
import MultiSelect from "../AdminHrms/Components/MultiSelect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateEvent = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const userID = getItemInLocalStorage("UserId");
  const [share, setShare] = useState("all");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [ownership, setOwnership] = useState([]);
  const [selectedOwnership, setSelectedOwnership] = useState("");
  const [selectedFloor, setselectedFloor] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formData, setFormData] = useState({
    site_id: siteId,
    created_by: userID,
    event_name: "",
    venue: "",
    description: "",
    start_date_time: null,
    end_date_time: null,
    user_ids: "",
    group_id: null,
    group_name: "",
    event_images: [],
    shared: "all",
    email_enabled: false,
    rsvp_enabled: false,
    important: false,
    group_member: [],
  });

  const fileInputRef = useRef(null);
  const themeColor = useSelector((state) => state.theme.color);
  const datePickerRef = useRef(null);
  const currentDate = new Date();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await getSetupUsers();
        const unitsRes = await getBuildings();

        setUnits(unitsRes?.data || []);

        const employeesList = (usersRes?.data || []).map((emp) => ({
          id: emp.id,
          name: `${emp.firstname || ""} ${emp.lastname || ""}`.trim(),
          building_id: emp.building_id || emp.building?.id || null,
          userSites: emp.user_sites || [],
          building: emp.building || {},
        }));

        setMembers(employeesList);
        // ✅ important: by default show all, so multi-select has options without clicking Filter
        setFilteredMembers(employeesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    const filtered = members.filter((member) => {
      const buildingId = Number(member.building_id ?? member.building?.id);

      if (!selectedUnit && !selectedOwnership) return true;

      if (selectedUnit && !selectedOwnership) {
        return buildingId === Number(selectedUnit);
      }

      if (!selectedUnit && selectedOwnership) {
        return (member.userSites || []).some(
          (site) =>
            site.ownership?.toLowerCase() === selectedOwnership.toLowerCase()
        );
      }

      if (buildingId !== Number(selectedUnit)) return false;

      return (member.userSites || []).some(
        (site) =>
          site.ownership?.toLowerCase() === selectedOwnership.toLowerCase()
      );
    });

    setFilteredMembers(filtered);

    if (filtered.length === 0) {
      toast.error("No users found matching the selected filters");
    } else {
      toast.success(`Filter applied - ${filtered.length} user(s) found`);
    }
  };

  const handleStartDateChange = (date) => {
    setFormData((p) => ({ ...p, start_date_time: date }));
  };

  const handleEndDateChange = (date) => {
    setFormData((p) => ({ ...p, end_date_time: date }));
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd HH:mm:ss");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getSetupUsers();
        const transformedUsers = (response.data || []).map((user) => ({
          value: user.id,
          label: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };

    if (share === "groups") {
      fetchGroups();
    }

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share]);

  useEffect(() => {
    const filtered = members.filter((user) =>
      (user.userSites || []).some(
        (site) =>
          (!selectedUnit || Number(user.building_id ?? user.building?.id) === Number(selectedUnit)) &&
          (!ownership || site.ownership === ownership)
      )
    );
    setFilteredMembers(filtered);
  }, [selectedUnit, ownership, members]);

  const fetchGroups = async () => {
    try {
      const response = await getGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleGroupChange = (event) => {
    const groupId = parseInt(event.target.value, 10) || 0;
    const selectedGroupObj = groups.find((group) => group.id === groupId);

    setSelectedGroup(event.target.value);
    setFormData((p) => ({
      ...p,
      group_id: groupId || null,
      group_name: selectedGroupObj?.group_name || "",
    }));

    setGroupMembers(selectedGroupObj?.group_members || []);
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreateEvent = async () => {
    if (formData.event_name === "" || !formData.start_date_time) {
      return toast.error("All fields are Required");
    }
    try {
      toast.loading("Creating Event Please Wait!", { id: "createEvent" });

      const formDataSend = new FormData();

      formDataSend.append("event[site_id]", formData.site_id);
      formDataSend.append("event[event_name]", formData.event_name);
      // backend expects "discription" (typo) - keep as is
      formDataSend.append("event[discription]", formData.description || "");
      formDataSend.append(
        "event[start_date_time]",
        formatDateTime(formData.start_date_time)
      );
      formDataSend.append(
        "event[end_date_time]",
        formatDateTime(formData.end_date_time)
      );
      formDataSend.append("event[venue]", formData.venue || "");
      formDataSend.append("event[email_enabled]", formData.email_enabled ? "1" : "0");
      formDataSend.append("event[rsvp_enabled]", formData.rsvp_enabled ? "1" : "0");
      formDataSend.append("event[important]", formData.important ? "1" : "0");

      // ✅ make payload consistent & avoid stale fields
      if (share === "all") {
        formDataSend.append("event[shared]", "all");
        formDataSend.append("event[user_ids]", "");
        formDataSend.append("event[group_id]", "");
        formDataSend.append("event[group_name]", "");
      } else if (share === "individual") {
        formDataSend.append("event[shared]", "individual");
        formDataSend.append("event[user_ids]", formData.user_ids || "");
        formDataSend.append("event[group_id]", "");
        formDataSend.append("event[group_name]", "");
      } else if (share === "groups") {
        formDataSend.append("event[shared]", "groups");
        formDataSend.append("event[user_ids]", "");
        formDataSend.append("event[group_id]", formData.group_id || "");
        formDataSend.append("event[group_name]", formData.group_name || "");
      }

      if (formData.event_images && formData.event_images.length > 0) {
  formData.event_images.forEach((file) => {
    const actualFile = file?.file || file?.originFileObj || file;

    if (actualFile instanceof File) {
      formDataSend.append("event[event_images][]", actualFile);
    }
  });
}

      const response = await postEvents(formDataSend);
      toast.success("Event Created Successfully", { id: "createEvent" });

      // keep existing behavior (list page)
      navigate("/communication/events");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create event", { id: "createEvent" });
    }
  };

  const handleSelectEdit = (selectedOption) => {
    setSelectedMembers(selectedOption || []);

    const selectedUserIds = (selectedOption || []).map((option) => option.value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      user_ids: selectedUserIds.join(","),
    }));
  };

  const handleFileAttachment = (input) => {
    let files = [];
    if (input && input.target && input.target.files) {
      files = Array.from(input.target.files);
    } else if (Array.isArray(input)) {
      files = input;
    } else if (input) {
      files = [input];
    }
    setFormData((p) => ({ ...p, event_images: files }));
  };

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-center">
          <div className=" my-5 mb-10 border w-full max-w-[70rem] border-gray-400 p-2 rounded-lg ">
            <h2
              style={{ background: themeColor }}
              className="text-center text-xl font-medium p-2  rounded-md text-white"
            >
              Create Event
            </h2>
            <h2 className="border-b text-xl border-black my-6 font-semibold">
              Event Info
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Title :
                </label>
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  id=""
                  placeholder="Enter Title"
                  className="border-gray-400 border p-2  rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Venue :
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  id=""
                  placeholder="Enter Venue"
                  className="border-gray-400 border p-2  rounded-md"
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <DatePicker
                  selected={formData.start_date_time}
                  onChange={handleStartDateChange}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select start date & time"
                  ref={datePickerRef}
                  minDate={currentDate}
                  className="border border-gray-400 p-2 w-full rounded-md"
                />
                -
                <DatePicker
                  selected={formData.end_date_time}
                  onChange={handleEndDateChange}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select end date & time"
                  ref={datePickerRef}
                  minDate={currentDate}
                  className="border border-gray-400 rounded-md p-2 w-full "
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 my-2">
              <label htmlFor="" className="font-medium">
                Description:
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) =>
                  setFormData((p) => ({ ...p, description: value }))
                }
                placeholder="Enter Description"
                className="bg-white"
                style={{ minHeight: "120px" }}
              />
            </div>
            <div className="flex gap-4 my-5">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name=""
                  id="imp"
                  checked={formData.important === true}
                  onChange={() =>
                    setFormData((p) => ({ ...p, important: !p.important }))
                  }
                />
                <label htmlFor="imp" className="font-semibold">
                  Important
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name=""
                  id="email"
                  checked={formData.email_enabled === true}
                  onChange={() =>
                    setFormData((p) => ({
                      ...p,
                      email_enabled: !p.email_enabled,
                    }))
                  }
                />
                <label htmlFor="email" className="font-semibold">
                  Send Email
                </label>
              </div>
            </div>

            <div className="">
              <h2 className="border-b t border-black my-5 text-lg font-semibold">
                Share With
              </h2>
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row gap-2 w-full font-semibold p-2 ">
                  <h2
                    className={`p-1 ${share === "all" && "bg-black text-white"} rounded-full px-6 cursor-pointer border-2 border-black`}
                    onClick={() => setShare("all")}
                  >
                    All
                  </h2>
                  <h2
                    className={`p-1 ${share === "individual" && "bg-black text-white"} rounded-full px-4 cursor-pointer border-2 border-black`}
                    onClick={() => setShare("individual")}
                  >
                    Individuals
                  </h2>
                  <h2
                    className={`p-1 ${share === "groups" && "bg-black text-white"} rounded-full px-4 cursor-pointer border-2 border-black`}
                    onClick={() => setShare("groups")}
                  >
                    Groups
                  </h2>
                </div>

                {share === "individual" && (
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    <div className="flex gap-2 items-end">
                      <select
                        className="border p-3 border-gray-300 rounded-md flex-1"
                        value={selectedUnit ?? ""}
                        onChange={(e) =>
                          setSelectedUnit(e.target.value ? Number(e.target.value) : null)
                        }
                      >
                        <option value="">Select Tower</option>
                        {units.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))}
                      </select>

                      <select
                        className="border p-3 border-gray-300 rounded-md flex-1"
                        value={selectedOwnership}
                        onChange={(e) => setSelectedOwnership(e.target.value)}
                      >
                        <option value="">Select Ownership</option>
                        <option value="tenant">Tenant</option>
                        <option value="owner">Owner</option>
                      </select>

                      <button
                        style={{ background: themeColor }}
                        onClick={handleFilter}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      >
                        Filter
                      </button>
                    </div>
                    <div className="w-full mt-3 mb-3">
                      <Select
                        options={filteredMembers.map((member) => ({
                          value: member.id,
                          label: member.name,
                        }))}
                        className="w-full"
                        isMulti
                        title="Select Members"
                        value={selectedMembers}
                        onChange={handleSelectEdit}
                        placeholder="Select Members"
                      />
                    </div>
                  </div>
                )}

                {share === "groups" && (
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    <label htmlFor="groupSelect" className="font-medium mb-1">
                      Select Group
                    </label>
                    <select
                      id="groupSelect"
                      className="border p-3 border-gray-300 rounded-md"
                      value={selectedGroup}
                      onChange={handleGroupChange}
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.group_name}
                        </option>
                      ))}
                    </select>

                    {selectedGroup && (
                      <div className="mt-4 p-4 border rounded-md bg-gray-50">
                        <h2 className="text-lg font-semibold mb-2">
                          Group Members
                        </h2>

                        {groupMembers.length > 0 ? (
                          <div className="space-y-2">
                            {groupMembers.map((member, index) => (
                              <div
                                key={index}
                                className="p-2 border rounded bg-white shadow-sm"
                              >
                                {member.user_name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">
                            No members exist inside this group.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 mt-2">
              <h2 className="border-b text-xl border-black font-semibold">
                RSVP
              </h2>
              <div className="flex gap-4 mt-2">
                <div className="flex gap-2 ">
                  <input
                    type="radio"
                    name="RSVP"
                    id="yes"
                    checked={formData.rsvp_enabled === true}
                    onChange={() =>
                      setFormData((p) => ({ ...p, rsvp_enabled: true }))
                    }
                  />
                  <label htmlFor="yes" className="text-lg">
                    Yes
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    name="RSVP"
                    id="no"
                    checked={formData.rsvp_enabled === false}
                    onChange={() =>
                      setFormData((p) => ({ ...p, rsvp_enabled: false }))
                    }
                  />
                  <label htmlFor="no" className="text-lg">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="border-b text-xl border-black my-5 font-semibold">
                Upload Attachments
              </h2>
              <FileInputBox
                fieldName={"event_images"}
                handleChange={handleFileAttachment}
                fileType="image/*"
              />
            </div>

            <div className="flex justify-end mt-10 my-5 gap-3">
                <button
                className="bg-gray-400 text-white p-2 px-4 rounded-md flex items-center gap-2 transition-colors duration-200"
                onClick={() => navigate("/communication/events")}
              >
                <FaTimesCircle className="text-white-600 text-xl" />
                Cancel
              </button>
              <button
                style={{ background: themeColor }}
                className="bg-black text-white p-2 rounded-md hover:bg-white  flex items-center gap-2 px-4"
                onClick={handleCreateEvent}
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

export default CreateEvent;
