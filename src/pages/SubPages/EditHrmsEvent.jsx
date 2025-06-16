import React, { useState } from 'react'
import AdminHRMS from '../AdminHrms/AdminHrms'

import { useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheck } from "react-icons/fa";
import FileInputBox from "../../containers/Inputs/FileInputBox";

const EditHrmsEvent = () => {
    const dummyUsers = [
        { value: 1, label: "John Doe", email: "john@example.com" },
        { value: 2, label: "Jane Smith", email: "jane@example.com" },
        { value: 3, label: "Robert Johnson", email: "robert@example.com" },
        { value: 4, label: "Emily Davis", email: "emily@example.com" },
      ];
    
      const dummyGroups = [
        { id: 1, group_name: "Marketing Team" },
        { id: 2, group_name: "Development Team" },
        { id: 3, group_name: "HR Department" },
        { id: 4, group_name: "Management" },
      ];

      const [share,setShare] = useState("all");
    const themeColor  = useSelector((state)=>state.theme.color) || "#000000";
    const [formData, setFormData] = useState({
        event_name: "Annual Company Retreat",
        venue: "Beach Resort, Goa",
        description: "Join us for our annual company retreat with team building activities and strategy sessions.",
        start_date_time: new Date(),
        end_date_time: new Date(Date.now() + 86400000), 
        user_ids: [],
        event_image: [],
        important: true,
        sendMail: true,
        group_ids: "",
        rsvp_enabled: true,
    })

    const handleStartDateChange = (date)=>{
        setFormData({...formData , start_date_time:date})
    }
    const handleEndDateChange = (date) =>{
        setFormData({...formData , end_date_time:date})
    }
    const handleChange =(e)=>{
        setFormData({...formData, [e.target.value]:e.target.value});
    }
    const handleSelectChange = (selectedOptions) =>{
        const selectedIds = selectedOptions ? selectedOptions.map((options)=>options.value) : []
        setFormData({...formData, user_ids:selectedIds})
    }
    const handleFileChange=(files, fieldName)=>{
        setFormData({
            ...formData,
            [fieldName]:files
        })
    }

    const handleEditEvent = ()=>{
        console.log("Form Submitted with data:", formData)
        alert("Event Updated successfully")
    }
  return (
    <section className="flex">
    <div className="hidden md:block">
      <AdminHRMS/>
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
              <label htmlFor="" className="font-medium">
                Title:
              </label>
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
              <label htmlFor="" className="font-medium">
                Venue:
              </label>
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
                className="border border-gray-400 p-2 w-full rounded-md"
              />
              <span>-</span>
              <DatePicker
                selected={formData.end_date_time}
                onChange={handleEndDateChange}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                placeholderText="Select end date & time"
                className="border border-gray-400 rounded-md p-2 w-full"
              />
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
              rows="3"
              placeholder="Enter Description"
              className="border-gray-400 border px-2 p-1 rounded-md"
            />
          </div>

          <div className="flex gap-4 my-5">
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
              <label htmlFor="imp">Important</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sendMail"
                checked={formData.sendMail}
                onChange={() =>
                  setFormData({
                    ...formData,
                    sendMail: !formData.sendMail,
                  })
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
                <button
                  type="button"
                  className={`p-1 ${
                    share === "all" && "bg-black text-white"
                  } rounded-full px-6 cursor-pointer border-2 border-black`}
                  onClick={() => setShare("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`p-1 ${
                    share === "individual" && "bg-black text-white"
                  } rounded-full px-4 cursor-pointer border-2 border-black`}
                  onClick={() => setShare("individual")}
                >
                  Individuals
                </button>
                <button
                  type="button"
                  className={`p-1 ${
                    share === "groups" && "bg-black text-white"
                  } rounded-full px-4 cursor-pointer border-2 border-black`}
                  onClick={() => setShare("groups")}
                >
                  Groups
                </button>
              </div>
              <div className="my-5 flex w-full">
                {share === "individual" && (
                  <Select
                    options={dummyUsers}
                    closeMenuOnSelect={false}
                    placeholder="Select User"
                    value={dummyUsers.filter((user) =>
                      formData.user_ids.includes(user.value)
                    )}
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
                    {dummyGroups.map((group) => (
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
            <h2 className="border-b text-xl border-black font-semibold">
              RSVP
            </h2>
            <div className="flex gap-4 mt-2">
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="RSVP"
                  id="yes"
                  checked={formData.rsvp_enabled === true}
                  onChange={() =>
                    setFormData({ ...formData, rsvp_enabled: true })
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
                    setFormData({ ...formData, rsvp_enabled: false })
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
              fieldName={"event_image"}
              handleChange={(files) => handleFileChange(files, "event_image")}
              fileType="image/*"
            />
          </div>
          <div className="flex justify-center mt-10 my-5">
            <button
              style={{ background: themeColor }}
              className="text-white p-2 rounded-md hover:opacity-90 flex items-center gap-2 px-4"
              onClick={handleEditEvent}
            >
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default EditHrmsEvent
