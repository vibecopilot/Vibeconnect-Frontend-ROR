import React, { useEffect, useRef, useState } from "react";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { getEventsDetails, editEventDetails, getGroups, getSetupUsers } from "../../api";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

const EditEvent = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const [share, setShare] = useState("all");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    site_id: siteId,
    event_name: "",
    venue: "",
    description: "",
    start_date_time: null,
    end_date_time: null,
    user_ids: [],
    group_ids: "",
   attachfiles:[],
    existing_event_image: [],
    important: false,
    sendMail: false,
    rsvp_enabled: false,
  });

  const themeColor = useSelector((state) => state.theme.color);
  const datePickerRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const formatDateTime = (date) => (date ? format(date, "yyyy-MM-dd HH:mm:ss") : "");

  const handleStartDateChange = (date) =>
    setFormData((p) => ({ ...p, start_date_time: date }));
  const handleEndDateChange = (date) =>
    setFormData((p) => ({ ...p, end_date_time: date }));

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const fetchUsers = async () => {
    try {
      const response = await getSetupUsers();
      const transformedUsers = (response.data || []).map((user) => ({
        value: user.id,
        label: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEvent = async () => {
    try {
      const res = await getEventsDetails(id);
      const response = res.data || {};

      // selected users (react-select)
      const selectedUsers = Array.isArray(response?.users)
        ? response.users.map((user) => ({
            value: user.user_id ?? user.id,
            label: user.name ?? user.user_name ?? `${user.firstname || ""} ${user.lastname || ""}`.trim(),
          }))
        : [];

      // existing images normalize
      const existingImages = Array.isArray(response?.event_image)
        ? response.event_image
        : response?.event_image
        ? [response.event_image]
        : [];

      const sharedValue =
        response?.shared ||
        response?.share_with ||
        (response?.group_id ? "groups" : selectedUsers.length ? "individual" : "all");

      setFormData((prev) => ({
        ...prev,
        event_name: response?.event_name || "",
        description: response?.discription || response?.description || "",
        end_date_time: response?.end_date_time ? new Date(response.end_date_time) : null,
        start_date_time: response?.start_date_time ? new Date(response.start_date_time) : null,
        venue: response?.venue || "",
        important: !!response?.important,
        sendMail: !!response?.email_enabled,
        rsvp_enabled: !!response?.rsvp_enabled,
        group_ids: response?.group_id || "",
        user_ids: selectedUsers,
        existing_event_image: existingImages,
        event_image: [],
      }));

      setShare(sharedValue);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchGroups();
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (selectedOptions) => {
    setFormData((p) => ({ ...p, user_ids: selectedOptions || [] }));
  };

  const handleFileChange = (files, fieldName) => {
    const arr = Array.isArray(files) ? files : files ? [files] : [];
    setFormData((p) => ({ ...p, [fieldName]: arr }));
  };

  const handleEditEvent = async () => {
    if (!formData.event_name || !formData.start_date_time) {
      return toast.error("Title and Start Date/Time are required");
    }

    try {
      toast.loading("Updating Event Please Wait!", { id: "editEvent" });

      const formDataSend = new FormData();
      formDataSend.append("event[site_id]", formData.site_id);
      formDataSend.append("event[event_name]", formData.event_name);
      // backend expects "discription" (typo) - keep consistent
      formDataSend.append("event[discription]", formData.description || "");
      formDataSend.append("event[start_date_time]", formatDateTime(formData.start_date_time));
      formDataSend.append("event[end_date_time]", formatDateTime(formData.end_date_time));
      formDataSend.append("event[venue]", formData.venue || "");
      formDataSend.append("event[important]", formData.important ? "true" : "false");
formDataSend.append("event[email_enabled]", formData.sendMail ? "true" : "false");
formDataSend.append("event[rsvp_enabled]", formData.rsvp_enabled ? "true" : "false");

      // ✅ share + ids (same pattern as Create)
      if (share === "all") {
        formDataSend.append("event[shared]", "all");
        formDataSend.append("event[user_ids]", "");
        formDataSend.append("event[group_id]", "");
      } else if (share === "individual") {
        const selectedIds = Array.isArray(formData.user_ids)
          ? formData.user_ids.map((u) => u.value)
          : [];
        formDataSend.append("event[shared]", "individual");
        formDataSend.append("event[user_ids]", selectedIds.join(","));
        formDataSend.append("event[group_id]", "");
      } else if (share === "groups") {
        formDataSend.append("event[shared]", "groups");
        formDataSend.append("event[user_ids]", "");
        formDataSend.append("event[group_id]", formData.group_ids || "");
      }

      // ✅ attachments key same as Create
  if (formData.event_image && formData.event_image.length > 0) {
  formData.event_image.forEach((file) => {
    formDataSend.append("attachfiles[]", file);
  });
}

      await editEventDetails(id, formDataSend);

      toast.success("Event updated successfully", { id: "editEvent" });

      // ✅ go to details after edit (end-to-end)
      navigate(`/communication/events/details/${id}`, {
        state: { refresh: Date.now() },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update event", { id: "editEvent" });
    }
  };

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-center">
          <div className="my-5 mb-10 border w-full max-w-[70rem] border-gray-400 p-2 rounded-lg">
            <h2
              style={{ background: themeColor }}
              className="text-center text-xl font-medium p-2 rounded-md text-white"
            >
              Edit Event
            </h2>

            <h2 className="border-b text-xl border-black my-6 font-semibold">
              Event Info
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-medium">Title :</label>
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  placeholder="Enter Title"
                  className="border-gray-400 border p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Venue :</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Enter Venue"
                  className="border-gray-400 border p-2 rounded-md"
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
                  className="border border-gray-400 p-2 w-full rounded-md"
                />
                <DatePicker
                  selected={formData.end_date_time}
                  onChange={handleEndDateChange}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Select end date & time"
                  ref={datePickerRef}
                  className="border border-gray-400 rounded-md p-2 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 my-2">
              <label className="font-medium">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter Description"
                className="border-gray-400 border px-2 p-1 rounded-md"
              />
            </div>

            <div className="flex gap-6 my-5">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="important"
                  checked={formData.important === true}
                  onChange={() =>
                    setFormData((p) => ({ ...p, important: !p.important }))
                  }
                />
                <label htmlFor="important">Important</label>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="sendMail"
                  checked={formData.sendMail === true}
                  onChange={() =>
                    setFormData((p) => ({ ...p, sendMail: !p.sendMail }))
                  }
                />
                <label htmlFor="sendMail">Send mail</label>
              </div>
            </div>

            <div>
              <h2 className="border-b border-black my-5 text-lg font-semibold">
                Share With
              </h2>

              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row gap-2 w-full font-semibold p-2">
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

                <div className="my-5 flex w-full">
                  {share === "individual" && (
                    <Select
                      options={users}
                      closeMenuOnSelect={false}
                      placeholder="Select User"
                      value={formData.user_ids}
                      onChange={handleSelectChange}
                      isMulti
                      className="w-full"
                    />
                  )}

                  {share === "groups" && (
                    <select
                      name="group_ids"
                      className="w-full border rounded-md p-2"
                      onChange={handleChange}
                      value={formData.group_ids}
                    >
                      <option value="">Select Group</option>
                      {groups.map((group) => (
                        <option value={group.id} key={group.id}>
                          {group.group_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="border-b text-xl border-black font-semibold">RSVP</h2>
              <div className="flex gap-4 mt-2">
                <div className="flex gap-2">
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

              {Array.isArray(formData.existing_event_image) &&
                formData.existing_event_image.length > 0 && (
                  <div className="mb-3 text-sm text-gray-600">
                    Existing attachment(s): {formData.existing_event_image.length}
                  </div>
                )}

              <FileInputBox
                fieldName={"event_image"}
                handleChange={(files) => handleFileChange(files, "event_image")}
                fileType="image/*"
                isMulti={true}
              />
            </div>

            <div className="flex justify-center mt-10 my-5">
              <button
                style={{ background: themeColor }}
                className="bg-black text-white p-2 rounded-md hover:bg-white flex items-center gap-2 px-4"
                onClick={handleEditEvent}
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

export default EditEvent;
