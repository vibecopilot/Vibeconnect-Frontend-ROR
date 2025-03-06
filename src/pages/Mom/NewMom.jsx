import { useState } from "react";

export default function NewMom() {
    const [points, setPoints] = useState([{
        pointsToDiscuss: "",
        responsiblePersonType: "internal",
        responsiblePerson: "",
        continueInProgress: false,
        targetDate: "",
        pointTag: "",
        showTargetDate: false,
      }]);

      const [attendeeSections, setAttendeeSections] = useState([
        {
          attendeeType: "internal",
          selectedAttendee: "",
          externalAttendeeName: "",
          externalAttendeeEmail: "",
          externalAttendeePhone: "",
          externalAttendeeCompany: "",
        },
      ]);

  const [attendees, setAttendees] = useState([]);
  //const [attendeeType, setAttendeeType] = useState("internal");
  //const [selectedAttendee, setSelectedAttendee] = useState("");
 // const [showTargetDate, setShowTargetDate] = useState(true);
  const handleInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedPoints = [...points];
    updatedPoints[index] = {
      ...updatedPoints[index],
      [name]: type === "checkbox" ? checked : value,
    };
    if (!name === "continueInProgress") {
        updatedPoints[index].showTargetDate = checked;
      }
    setPoints(updatedPoints);
  };

  const handleAddPoint = () => {
    setPoints([...points, {
      pointsToDiscuss: "",
      responsiblePersonType: "internal",
      responsiblePerson: "",
      continueInProgress: false,
      targetDate: "",
      pointTag: "",
      showTargetDate: false,
    }]);
  };

  const handleAttendeeTypeChange = (e, index) => {
    const newSections = [...attendeeSections];
    newSections[index].attendeeType = e.target.value;
    if (e.target.value === "external") {
      newSections[index].externalAttendeeName = "";
      newSections[index].externalAttendeeEmail = "";
      newSections[index].externalAttendeePhone = "";
      newSections[index].externalAttendeeCompany = "";
    }
    setAttendeeSections(newSections);
  };
  const handleAttendeeChange = (e, index) => {
    const newSections = [...attendeeSections];
    if (newSections[index].attendeeType === "internal") {
      newSections[index].selectedAttendee = e.target.value;
    } else {
      newSections[index][e.target.name] = e.target.value;
    }
    setAttendeeSections(newSections);
  };
  const handleAddAttendeeSection = () => {
    const newSection = {
      attendeeType: "internal",
      selectedAttendee: "",
      externalAttendeeName: "",
      externalAttendeeEmail: "",
      externalAttendeePhone: "",
      externalAttendeeCompany: "",
    };
    setAttendeeSections([...attendeeSections, newSection]);
  };
  const handleRemoveAttendeeSection = (index) => {
    const newSections = [...attendeeSections];
    newSections.splice(index, 1);
    setAttendeeSections(newSections);
  };
  
  const handleRemovePoint = (index) => {
    const updatedPoints = [...points];
    updatedPoints.splice(index, 1);
    setPoints(updatedPoints);
  };

  return (
    <div className="max-w-7xl mx-auto pt-12 bg-white">
      <h1 className="text-2xl font-bold mb-6">NEW MOM</h1>

      {/* Basic Details Section */}
      <div className="mb-8 shadow-lg p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
            <span>1</span>
          </div>
          <h2 className="text-2xl font-medium text-black">
            BASIC DETAILS
          </h2>
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
              value={points.title}
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
              value={points.meetingDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Tag</label>
            <div className="relative">
              <select
                name="tag"
                value={points.tag}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2 appearance-none"
              >
                <option value="">Select Tag</option>
                <option value="tag1">Tag 1</option>
                <option value="tag2">Tag 2</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Points To Discuss Section */}
      <div className="mb-8 shadow-lg p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
            <span>2</span>
          </div>
          <h2 className="text-2xl font-semibold text-black">
            Points To Discuss
          </h2>
        </div>

        {points.map((point, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
            <div className=" justify-end text-end">
      <button
        onClick={() => handleRemovePoint(index)}
        className="bg-red-500 text-white px-4 py-2 rounded text-sm"
      >
        Remove
      </button>
    </div>
            <div className="mb-4">
              <label className="block text-xl mb-1">Points To Discuss</label>
              <textarea
                name="pointsToDiscuss"
                placeholder="Enter Discussion"
                value={point.pointsToDiscuss}
                onChange={(e) => handleInputChange(e, index)}
                className="w-full border border-gray-300 rounded p-2 min-h-[110px]"
              ></textarea>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-4">
  <div>
    <label className="block text-xl mb-1">
      Responsible Person Type
    </label>
    <div className="flex items-center space-x-4">
      <label className="flex items-center">
        <div className="relative flex items-center">
          <input
            type="radio"
            name="responsiblePersonType"
            value="internal"
            checked={point.responsiblePersonType === "internal"}
            onChange={(e) => handleInputChange(e, index)}
            className="opacity-0 absolute h-5 w-5"
          />
          <div
            className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
              point.responsiblePersonType === "internal"
                ? "bg-green-500 border-transparent"
                : ""
            }`}
          >
            {point.responsiblePersonType === "internal" && (
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
            checked={point.responsiblePersonType === "external"}
            onChange={(e) => handleInputChange(e, index)}
            className="opacity-0 absolute h-5 w-5"
          />
          <div
            className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
              point.responsiblePersonType === "external"
                ? "bg-green-500 border-transparent"
                : ""
            }`}
          >
            {point.responsiblePersonType === "external" && (
              <div className="rounded-full w-3 h-3 bg-white"></div>
            )}
          </div>
        </div>
        <span>External</span>
      </label>
    </div>
  </div>

  <div>
    {point.responsiblePersonType === "internal" ? (
      <label className="block text-xl mb-1">Responsible Person</label>
    ) : (
      <label className="block text-xl mb-1"> Responsible Person Name</label>
    )}
    <div className="relative">
      {point.responsiblePersonType === "internal" ? (
        <select
          name="responsiblePerson"
          value={point.responsiblePerson}
          onChange={(e) => handleInputChange(e, index)}
          className="w-full border border-gray-300 rounded p-2 appearance-none"
        >
          <option value="">Select Responsible Person</option>
          <option value="person1">Person 1</option>
          <option value="person2">Person 2</option>
        </select>
      ) : (
        <input
          type="text"
          name="externalResponsiblePerson"
          value={point.externalResponsiblePerson}
          onChange={(e) => handleInputChange(e, index)}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Responsible Person Name"
        />
      )}
      {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div> */}
    </div>
  </div>

  {point.responsiblePersonType === "external" && (
    <div>
      <label className="block text-xl mb-1">Responsible Person Email</label>
      <input
        type="email"
        name="externalResponsiblePersonEmail"
        value={point.externalResponsiblePersonEmail}
        onChange={(e) => handleInputChange(e, index)}
        className="w-full border border-gray-300 rounded p-2"
        placeholder=" Responsible Person Email"
      />
    </div>
  )}
</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-1">
                <div className="flex items-center h-full">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="continueInProgress"
                      checked={point.continueInProgress}
                      onChange={(e) => handleInputChange(e, index)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-xl">Continue/In Progress</span>
                  </label>
                </div>
              </div>

              {!point.continueInProgress && (
                <div>
                  <label className="block text-xl mb-1">Target Date</label>
                  <input
                    type="text"
                    name="targetDate"
                    placeholder="Enter Target Date"
                    value={point.targetDate}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-xl mb-1">Tag</label>
                <div className="relative">
                  <select
                    name="pointTag"
                    value={point.pointTag}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full border border-gray-300 rounded p-2 appearance-none"
                  >
                    <option value="">Select Tag</option>
                    <option value="tag1">Tag 1</option>
                    <option value="tag2">Tag 2</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* <div>
              <button
                onClick={() => handleRemovePoint(index)}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              >
                Remove
              </button>
            </div> */}
          </div>
        ))}

        <div>
          <button
            onClick={handleAddPoint}
            className="bg-blue-500 ml-3 text-white px-5 py-2 rounded text-lg"
          >
            + Add
          </button>
        </div>
      </div>


      {/* Attendees Section */}
      <div className="mb-8 shadow-lg p-4">
  <div className="flex items-center mb-4">
    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white mr-2">
      <span>3</span>
    </div>
    <h2 className="text-2xl font-medium text-black">Attendees</h2>
  </div>

  <div className="border border-gray-200 rounded-md p-4">
  {attendeeSections.map((section, index) => (
  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-b border-gray-200 pb-4">
    <div>
      <label className="block text-2xl mb-1">Attendee Type</label>
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <div className="relative flex items-center  ">
            <input
              type="radio"
              name={`attendeeType${index}`}
              value="internal"
              checked={section.attendeeType === "internal"}
              onChange={(e) => handleAttendeeTypeChange(e, index)}
              className="opacity-0 absolute h-5 w-5"
            />
            <div
              className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                section.attendeeType === "internal"
                  ? "bg-green-500 border-transparent"
                  : ""
              }`}
            >
              {section.attendeeType === "internal" && (
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
              name={`attendeeType${index}`}
              value="external"
              checked={section.attendeeType === "external"}
              onChange={(e) => handleAttendeeTypeChange(e, index)}
              className="opacity-0 absolute h-5 w-5"
            />
            <div
              className={`border border-gray-300 rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 ${
                section.attendeeType === "external"
                  ? "bg-green-500 border-transparent"
                  : ""
              }`}
            >
              {section.attendeeType === "external" && (
                <div className="rounded-full w-3 h-3 bg-white"></div>
              )}
            </div>
          </div>
          <span>External</span>
        </label>
      </div>
      
    </div>
    <div className="ml-auto flex items-center">
        <div
          className="w-20 h-8 rounded-sm bg-red-500 flex items-center justify-center text-white cursor-pointer"
          onClick={() => handleRemoveAttendeeSection(index)}
        >
          <span className="text-sm">Remove</span>
        </div>
      </div>
    {section.attendeeType === "internal" ? (
  <div>
    <label className="block text-lg mb-1">Name</label>
    <div className="relative flex">
      <select
        value={section.selectedAttendee}
        onChange={(e) => handleAttendeeChange(e, index)}
        className="w-[70%] border border-gray-300 rounded p-2 appearance-none"
      >
        <option value="">Select Attendee</option>
        <option value="attendee1">Attendee 1</option>
        <option value="attendee2">Attendee 2</option>
      </select>
      <div className="absolute inset-y-0 right-48 flex items-center  pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      
    </div>
  </div>
) : (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
    <div className="grid grid-cols-1 gap-2">
      <label className="block text-lg ">Name</label>
      <input
        type="text"
        name="externalAttendeeName"
        value={section.externalAttendeeName}
        onChange={(e) => handleAttendeeChange(e, index)}
        className="w-full border border-gray-300 rounded p-2"
        placeholder="Attendee Name"
      />
    </div>
    <div className="grid grid-cols-1 gap-2">
      <label className="block text-lg ">Organization</label>
      <input
        type="text"
        name="externalAttendeeEmail"
        value={section.externalAttendeeEmail}
        onChange={(e) => handleAttendeeChange(e, index)}
        className="w-full border border-gray-300 rounded p-2"
        placeholder=" Attendee Organization "
      />
    </div>
    <div className="grid grid-cols-1 gap-2">
      <label className="block text-lg ">Roll</label>
      <input
        type="text"
        name="externalAttendeePhone"
        value={section.externalAttendeePhone}
        onChange={(e) => handleAttendeeChange(e, index)}
        className="w-full border border-gray-300 rounded p-2"
        placeholder="Attendee Phone"
      />
    </div>
    <div className="grid grid-cols-1 gap-2">
      <label className="block text-lg ">Email</label>
      <input
        type="text"
        name="externalAttendeeCompany"
        value={section.externalAttendeeCompany}
        onChange={(e) => handleAttendeeChange(e, index)}
        className="w-full border border-gray-300 rounded p-2"
        placeholder="Attendee Email"
      />
    </div>
  </div>
)}
  </div>
))}
    <div>
      <button
        onClick={handleAddAttendeeSection}
        className="bg-blue-500 text-white px-4 py-2 rounded text-lg"
      >
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
          <button className="bg-blue-500 text-white px-7 py-2 rounded text-lg m-3 ml-[2%]">
            + Attach file
          </button>
        </div>
      </div>

      {/* create section  */}
      <div className=" my-20 grid grid-cols-2 justify-center text-center px-[30%] ">
        <div>
          <button className="bg-blue-500  text-white px-7 py-3 rounded text-lg  ">
            Create MOM
          </button>
        </div>
        <div>
          <button className="border border-gray-200 text-start text-black px-4 py-3 text-lg">
            Save And Create New MOM
          </button>
        </div>
      </div>
    </div>
  );
}
