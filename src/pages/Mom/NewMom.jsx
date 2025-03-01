
import { useState } from "react"

export default function NewMom() {
  const [formData, setFormData] = useState({
    title: "",
    meetingDate: "",
    tag: "",
    pointsToDiscuss: "",
    responsiblePersonType: "internal",
    responsiblePerson: "",
    continueInProgress: false,
    targetDate: "",
    pointTag: "",
  })

  const [attendees, setAttendees] = useState([])
  const [attendeeType, setAttendeeType] = useState("internal")
  const [selectedAttendee, setSelectedAttendee] = useState("")

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddPoint = () => {
    // Logic to add a discussion point
    console.log("Adding point:", formData.pointsToDiscuss)
    // Reset fields
    setFormData({
      ...formData,
      pointsToDiscuss: "",
      responsiblePerson: "",
      targetDate: "",
      pointTag: "",
    })
  }

  const handleAddAttendee = () => {
    if (selectedAttendee) {
      setAttendees([...attendees, { type: attendeeType, name: selectedAttendee }])
      setSelectedAttendee("")
    }
  }

  return (
    <div className="max-w-7xl mx-auto pt-12 bg-white">
      <h1 className="text-2xl font-bold mb-6">NEW MOM</h1>

      {/* Basic Details Section */}
      <div className="mb-8 shadow-lg p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
            <span>1</span>
          </div>
          <h2 className="text-2xl font-medium text-orange-500">BASIC DETAILS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-lg mb-1">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">
              Date of Meeting<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="meetingDate"
              placeholder="Date of Meeting"
              value={formData.meetingDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Tag</label>
            <div className="relative">
              <select
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2 appearance-none"
              >
                <option value="">Select Tag</option>
                <option value="tag1">Tag 1</option>
                <option value="tag2">Tag 2</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Points To Discuss Section */}
      <div className="mb-8 shadow-lg p-4 ">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
            <span>2</span>
          </div>
          <h2 className="text-2xl font-semibold text-orange-500">Points To Discuss</h2>
        </div>

        <div className="border border-gray-200 rounded-md p-4  min-h-80">
          <div className="mb-4">
            <label className="block text-xl mb-1">Points To Discuss</label>
            <textarea
              name="pointsToDiscuss"
              placeholder="Enter Discussion"
              value={formData.pointsToDiscuss}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 min-h-[110px]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xl mb-1">Responsible Person Type</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <div className="relative flex items-centers">
                    <input
                      type="radio"
                      name="responsiblePersonType"
                      value="internal"
                      checked={formData.responsiblePersonType === "internal"}
                      onChange={handleInputChange}
                      className="opacity-0 absolute h-5 w-5"
                    />
                    <div
                      className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                        formData.responsiblePersonType === "internal" ? "bg-green-500 border-transparent" : ""
                      }`}
                    >
                      {formData.responsiblePersonType === "internal" && (
                        <div className="rounded-full w-3 h-3 bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span>Internal</span>
                </label>

                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="responsiblePersonType"
                      value="external"
                      checked={formData.responsiblePersonType === "external"}
                      onChange={handleInputChange}
                      className="opacity-0 absolute h-5 w-5"
                    />
                    <div
                      className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                        formData.responsiblePersonType === "external" ? "bg-green-500 border-transparent" : ""
                      }`}
                    >
                      {formData.responsiblePersonType === "external" && (
                        <div className="rounded-full w-3 h-3 bg-white"></div>
                      )}
                    </div>
                  </div>
                  <span>External</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xl mb-1">Responsible Person</label>
              <div className="relative">
                <select
                  name="responsiblePerson"
                  value={formData.responsiblePerson}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 appearance-none"
                >
                  <option value="">Select Responsible Person</option>
                  <option value="person1">Person 1</option>
                  <option value="person2">Person 2</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-1">
              <div className="flex items-center h-full">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="continueInProgress"
                    checked={formData.continueInProgress}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-xl">Continue/In Progress</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xl mb-1">Target Date</label>
              <input
                type="text"
                name="targetDate"
                placeholder="Enter Target Date"
                value={formData.targetDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-xl mb-1">Tag</label>
              <div className="relative">
                <select
                  name="pointTag"
                  value={formData.pointTag}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 appearance-none"
                >
                  <option value="">Select Tag</option>
                  <option value="tag1">Tag 1</option>
                  <option value="tag2">Tag 2</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button onClick={handleAddPoint} className="bg-purple-800 text-white px-5 py-2 rounded text-lg">
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Attendees Section */}
      <div className="mb-8 shadow-lg p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
            <span>3</span>
          </div>
          <h2 className="text-2xl font-medium text-orange-500">Attendees</h2>
        </div>

        <div className="border border-gray-200 rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-2xl mb-1">Attendee Type</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <div className="relative flex items-center  ">
                    <input
                      type="radio"
                      name="attendeeType"
                      value="internal"
                      checked={attendeeType === "internal"}
                      onChange={(e) => setAttendeeType(e.target.value)}
                      className="opacity-0 absolute h-5 w-5"
                    />
                    <div
                      className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                        attendeeType === "internal" ? "bg-green-500 border-transparent" : ""
                      }`}
                    >
                      {attendeeType === "internal" && <div className="rounded-full w-3 h-3 bg-white"></div>}
                    </div>
                  </div>
                  <span>Internal</span>
                </label>

                <label className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="attendeeType"
                      value="external"
                      checked={attendeeType === "external"}
                      onChange={(e) => setAttendeeType(e.target.value)}
                      className="opacity-0 absolute h-5 w-5"
                    />
                    <div
                      className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                        attendeeType === "external" ? "bg-green-500 border-transparent" : ""
                      }`}
                    >
                      {attendeeType === "external" && <div className="rounded-full w-3 h-3 bg-white"></div>}
                    </div>
                  </div>
                  <span>External</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-lg mb-1">Name</label>
              <div className="relative flex">
                <select
                  value={selectedAttendee}
                  onChange={(e) => setSelectedAttendee(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 appearance-none"
                >
                  <option value="">Select Attendee</option>
                  <option value="attendee1">Attendee 1</option>
                  <option value="attendee2">Attendee 2</option>
                </select>
                <div className="absolute inset-y-0 right-8 flex items-center  pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="ml-2 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                    <span>×</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button onClick={handleAddAttendee} className="bg-purple-800 text-white px-4 py-2 rounded text-lg">
              + Add Attendee
            </button>
          </div>

          {attendees.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-medium mb-2">Added Attendees:</h3>
              <ul className="space-y-1">
                {attendees.map((attendee, index) => (
                  <li key={index} className="text-sm">
                    {attendee.name} ({attendee.type})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Attachment Section */}
      <div className="mb-8 shadow-lg p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
            <span>4</span>
          </div>
          <h2 className="text-2xl font-medium text-orange-500">Attachment</h2>
        </div>

        <div>
          <button className="bg-purple-800 text-white px-7 py-2 rounded text-lg m-3 ml-[2%]">+ Attach file</button>
        </div>
      </div>

      {/* create section  */}
      <div className=" my-20 grid grid-cols-2 justify-center text-center px-[30%] ">
        <div><button className="bg-purple-800  text-white px-7 py-3 rounded text-lg  ">Create MOM</button></div>
        <div><button className="border border-gray-200 text-start text-black px-4 py-3 text-lg">Save And Create New MOM</button></div>
      </div>


    </div>
  )
}


