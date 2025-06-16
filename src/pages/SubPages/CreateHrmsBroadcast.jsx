import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaCheck } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import ReactDatePicker from "react-datepicker";
import FileInputBox from '../../containers/Inputs/FileInputBox';
import AdminHRMS from '../AdminHrms/AdminHrms';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateBroadcast = () => {
  // Mock data with emails
  const mockUsers = [
    { value: 1, label: "John Doe", email: "john@example.com" },
    { value: 2, label: "Jane Smith", email: "jane@example.com" },
    { value: 3, label: "Robert Johnson", email: "robert@example.com" },
    { value: 4, label: "Emily Davis", email: "emily@example.com" },
  ];

  const mockGroups = [
    { value: 1, label: "Marketing Team", email: "marketing@company.com" },
    { value: 2, label: "Development Team", email: "dev@company.com" },
    { value: 3, label: "HR Department", email: "hr@company.com" },
    { value: 4, label: "Management", email: "management@company.com" },
  ];

  // State management
  const [share, setShare] = useState("all");
  const themeColor = useSelector(state => state.theme.color) || "#000000";
  const [formData, setFormData] = useState({
    notice_title: "",
    notice_discription: "",
    expiry_date: "",
    user_ids: "",
    notice_image: [],
    group_ids: "",
    important: false,
    send_email: false,
  });

  const datePickerRef = useRef(null);
  const currentDate = new Date();
  const navigate = useNavigate();

  // Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExpiryDateChange = (date) => {
    setFormData({ ...formData, expiry_date: date });
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    const userIdsString = selectedIds.join(",");
    setFormData({ ...formData, user_ids: userIdsString });
  };

  const handleSelectGroupChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    const groupIdsString = selectedIds.join(",");
    setFormData({ ...formData, group_ids: groupIdsString });
  };

  const handleFileChange = (files, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: files,
    });
  };
  
  const handleCreateBroadCast = () => {
    if (formData.notice_title === "" || formData.expiry_date === "") {
      toast.error("Please enter both title and expiry date", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    
    // Mock email sending
    if (formData.send_email && formData.user_ids) {
      const selectedUserIds = formData.user_ids.split(',');
      const selectedUsers = mockUsers.filter(user => 
        selectedUserIds.includes(user.value.toString())
      );
      
      toast.success(`Broadcast created and emails sent to ${selectedUsers.length} recipients`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.success("Broadcast created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    // Navigate after toast is shown
    setTimeout(() => {
      navigate("/admin/hrms/broadcast");
    }, 1500);
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <section className="flex">
        <div className="hidden md:block">
          <AdminHRMS/>
        </div>
        <div className="w-full flex mx-3 flex-col overflow-hidden">
          <div className="flex justify-center">
            <div className="md:mx-20 my-5 mb-10 md:border p-2 md:px-2 rounded-lg w-full">
              <h2
                style={{ background: themeColor }}
                className="text-center text-xl font-bold p-2 mb-2 rounded-md text-white"
              >
                Create Broadcast
              </h2>
              <h2 className="border-b text-xl border-gray-400 mb-6 font-medium">
                Communication Info
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="" className="font-semibold">
                    Title:
                  </label>
                  <input
                    type="text"
                    name="notice_title"
                    value={formData.notice_title}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className="border p-2 rounded-md border-gray-400 placeholder:text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="" className="font-semibold">
                    Description:
                  </label>
                  <textarea
                    name="notice_discription"
                    value={formData.notice_discription}
                    onChange={handleChange}
                    placeholder="Enter Description"
                    rows="3"
                    className="border p-2 rounded-md border-gray-400 placeholder:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 items-end gap-4">
                  <div className="flex flex-col">
                    <p className="font-medium">Expire on</p>
                    <ReactDatePicker
                      selected={formData.expiry_date}
                      onChange={handleExpiryDateChange}
                      showTimeSelect
                      dateFormat="dd/MM/yyyy h:mm aa"
                      placeholderText="Select Date & Time"
                      ref={datePickerRef}
                      minDate={currentDate}
                      className="border border-gray-400 w-full p-2 rounded-md"
                    />
                  </div>
                  <div className='flex gap-3 items-center'>
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        id="imp"
                        checked={formData.important}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            important: !formData.important,
                          })
                        }
                      />
                      <label htmlFor="imp">Mark as Important</label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        id="emailNotify"
                        checked={formData.send_email}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            send_email: !formData.send_email,
                          })
                        }
                        disabled={share !== "individual"}
                      />
                      <label htmlFor="emailNotify">
                        Send email notification
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="border-b border-black my-5 text-lg font-semibold">
                    Share With
                  </h2>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-row gap-2 w-full font-semibold p-2">
                      <button
                        type="button"
                        className={`p-1 ${
                          share === "all" && "bg-black text-white"
                        } rounded-full px-6 cursor-pointer border-2 border-black hover:bg-gray-800 transition`}
                        onClick={() => setShare("all")}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        className={`p-1 ${
                          share === "individual" && "bg-black text-white"
                        } rounded-full px-4 cursor-pointer border-2 border-black hover:bg-gray-800 transition`}
                        onClick={() => setShare("individual")}
                      >
                        Individuals
                      </button>
                      <button
                        type="button"
                        className={`p-1 ${
                          share === "groups" && "bg-black text-white"
                        } rounded-full px-4 cursor-pointer border-2 border-black hover:bg-gray-800 transition`}
                        onClick={() => setShare("groups")}
                      >
                        Groups
                      </button>
                    </div>
                    <div className="my-2 flex w-full">
                      {share === "individual" && (
                        <Select
                          options={mockUsers}
                          placeholder="Select User"
                          value={mockUsers.filter((user) =>
                            formData.user_ids.includes(user.value)
                          )}
                          onChange={handleSelectChange}
                          isMulti
                          className="w-full"
                          getOptionLabel={option => `${option.label}`}
                        />
                      )}
                      {share === "groups" && (
                        <Select
                          options={mockGroups}
                          closeMenuOnSelect={false}
                          placeholder="Select Group"
                          value={mockGroups.filter((group) =>
                            formData.group_ids.includes(group.value)
                          )}
                          onChange={handleSelectGroupChange}
                          isMulti
                          className="w-full"
                          getOptionLabel={option => `${option.label} (${option.email})`}
                        />
                      )}
                    </div>
                  </div>
                  <div className="my-5">
                    <h2 className="border-b text-center text-xl border-black mb-6 font-bold">
                      Attachments
                    </h2>
                    <FileInputBox
                      fieldName={"notice_image"}
                      isMulti={true}
                      handleChange={(files) =>
                        handleFileChange(files, "notice_image")
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-10 my-5">
                  <button
                    style={{ background: themeColor }}
                    onClick={handleCreateBroadCast}
                    className="px-4 text-white p-2 rounded-md flex items-center gap-2 hover:opacity-90 transition"
                  >
                    <FaCheck /> Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateBroadcast;