import React, { useEffect, useRef, useState } from "react";
import FileInput from "../../Buttons/FileInput";
import Switch from "../../Buttons/Switch";
import FileInputBox from "../../containers/Inputs/FileInputBox";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { postEvents, getAssignedTo } from "../../api";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const CreateEvent = () => {
  const siteId = getItemInLocalStorage("SITEID");
  const [share, setShare] = useState("all");
  const [users, setUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [formData, setFormData] = useState({
    site_id: siteId,
    event_name: "",
    venue: "",
    description: "",
    start_date_time: "",
    end_date_time: "",
    user_ids: "",
    event_image: [],
  });
  console.log(formData);
  const fileInputRef = useRef(null);
  const themeColor = useSelector((state) => state.theme.color);
  const datePickerRef = useRef(null);
  const currentDate = new Date();

  const handleStartDateChange = (date) => {
    setFormData({ ...formData, start_date_time: date });
  };

  const handleEndDateChange = (date) => {
    setFormData({ ...formData, end_date_time: date });
  };

  const formatDateTime = (date) => {
    return format(date, "yyyy-MM-dd HH:mm:ss");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAssignedTo();
        const transformedUsers = response.data.map((user) => ({
          value: user.id,
          label: `${user.firstname} ${user.lastname}`,
        }));
        setUsers(transformedUsers);
        console.log(response);
      } catch (error) {
        console.error("Error fetching assigned users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleCreateEvent = async () => {
    if (formData.event_name === "" || formData.start_date_time === "") {
      return toast.error("All fields are Required");
    }
    try {
      toast.loading("Creating Event Please Wait!");
      const formDataSend = new FormData();

      formDataSend.append("event[site_id]", formData.site_id);
      formDataSend.append("event[event_name]", formData.event_name);
      formDataSend.append("event[discription]", formData.description);
      formDataSend.append(
        "event[start_date_time]",
        formatDateTime(formData.start_date_time)
      );
      formDataSend.append(
        "event[end_date_time]",
        formatDateTime(formData.end_date_time)
      );
      formDataSend.append("event[venue]", formData.venue);
      formDataSend.append("event[user_ids]", formData.user_ids);

      // formData.user_ids.forEach((user_id) => {
      //   formDataSend.append("event[user_ids]", user_id);
      // });

      formData.event_image.forEach((file) => {
        formDataSend.append("attachfiles[]", file);
      });

      const response = await postEvents(formDataSend);
      toast.success("Event Created Successfully");
      console.log("Response:", response.data);
      toast.dismiss();
      navigate("/communication/events");
    } catch (error) {
      console.log(error);
      toast.dismiss();
    }
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    const userIdsString = selectedIds.join(",");

    setFormData({ ...formData, user_ids: userIdsString });
  };

  const handleFileAttachment = (event) => {
    const selectedFiles = event.target.files;
    const newAttachments = Array.from(selectedFiles);
    setFormData({ ...formData, event_image: newAttachments });
  };

  const filterTime = (time) => {
    const selectedDate = new Date(time);
    const currentDate = new Date();

    // Compare selected date with current date
    if (selectedDate.getTime() > currentDate.getTime()) {
      return true; // Future date
    } else if (selectedDate.getTime() === currentDate.getTime()) {
      // If selected date is today, compare times
      const selectedTime =
        selectedDate.getHours() * 60 + selectedDate.getMinutes();
      const currentTime =
        currentDate.getHours() * 60 + currentDate.getMinutes();
      return selectedTime >= currentTime; // Future time
    } else {
      return false; // Past date
    }
  };

  const handleFileChange = (files, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    });
  };

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold p-2 my-2 rounded-full text-white"
        >
          Create Event
        </h2>
        <div className="flex justify-center">
          <div className="w-fit my-5 mb-10 border border-gray-400 p-5 px-10 rounded-lg shadow-xl">
            <h2 className="border-b text-xl border-black mb-6 font-semibold">
              Event Info
            </h2>
            <div className="grid grid-cols-2 gap-4">
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
                  className="border-gray-400 border px-2 p-1 rounded-md"
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
                  className="border-gray-400 border px-2 p-1 rounded-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium mb-2">Start Time:</p>
                  <DatePicker
                    selected={formData.start_date_time}
                    onChange={handleStartDateChange}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy h:mm aa"
                    placeholderText="Select Date & Time"
                    ref={datePickerRef}
                    minDate={currentDate}
                    className="border border-black p-1 rounded-md"
                  />
                </div>
                -
                <div>
                  <p className="font-medium mb-2">End Time:</p>
                  <DatePicker
                    selected={formData.end_date_time}
                    onChange={handleEndDateChange}
                    showTimeSelect
                    dateFormat="dd/MM/yyyy h:mm aa"
                    placeholderText="Select Date & Time"
                    ref={datePickerRef}
                    minDate={currentDate}
                    className="border border-black rounded-md p-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 my-2">
              <label htmlFor="" className="font-medium">
                Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                id=""
                rows="3"
                placeholder="Enter Description"
                className="border-gray-400 border px-2 p-1 rounded-md"
              />
            </div>
            <div className="flex gap-4 my-5">
              <div className="flex gap-2 items-center">
                <input type="checkbox" name="" id="imp" />
                <label htmlFor="imp" className="font-semibold">
                  Important
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <input type="checkbox" name="" id="email" />
                <label htmlFor="email" className="font-semibold">
                  Send Email
                </label>
              </div>
            </div>
            <h2 className="border-b text-xl border-black my-5 font-semibold">
              Upload Attachments
            </h2>
            {/* <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileAttachment}
            /> */}
            <FileInputBox
              fieldName={"event_image"}
              handleChange={(files) => handleFileChange(files, "event_image")}
            />
            <div className="">
              <h2 className="border-b t border-black my-5 text-lg font-semibold">
                Share With
              </h2>
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row gap-2 w-full font-semibold p-2 ">
                  <h2
                    className={`p-1 ${
                      share === "all" && "bg-black text-white"
                    } rounded-full px-6 cursor-pointer border-2 border-black`}
                    onClick={() => setShare("all")}
                  >
                    All
                  </h2>
                  <h2
                    className={`p-1 ${
                      share === "individual" && "bg-black text-white"
                    } rounded-full px-4 cursor-pointer border-2 border-black`}
                    onClick={() => setShare("individual")}
                  >
                    Individuals
                  </h2>
                </div>
                <div className="my-5 flex w-full">
                  {share === "individual" && (
                    <Select
                      options={users}
                      placeholder="Select User"
                      value={users.filter((user) =>
                        formData.user_ids.includes(user.value)
                      )}
                      onChange={handleSelectChange}
                      isMulti
                      className="w-full"
                    />
                  )}
                  {share === "groups" && <p>list of groups</p>}
                </div>
              </div>
            </div>
            <div>
              <h2 className="border-b text-xl border-black m-5 font-semibold">
                RSVP
              </h2>
              <div className="flex gap-10 justify-center">
                <div className="flex gap-2">
                  <input type="radio" name="RSVP" id="yes" />
                  <label htmlFor="yes" className="text-lg">
                    Yes
                  </label>
                </div>
                <div className="flex gap-2">
                  <input type="radio" name="RSVP" id="no" />
                  <label htmlFor="no" className="text-lg">
                    No
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10 my-5">
              <button
                className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:border-2 border-black"
                onClick={handleCreateEvent}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
