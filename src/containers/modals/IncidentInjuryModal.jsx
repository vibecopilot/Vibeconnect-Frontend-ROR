import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";
import { PiPlusCircleBold } from "react-icons/pi";
const IncidentInjuryModal = ({ onclose }) => {
  const [incident, setIncident] = useState([{ name: "", mobile: "" }]);
  const [injury, setInjury] = useState();
  const handleAddIncident = (event) => {
    event.preventDefault();
    setIncident([...incident, { name: "", mobile: "" }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newIncident = [...incident];
    newIncident[index][name] = value;
    setIncident(newIncident);
  };

  const handleRemoveIncident = (index) => {
    const newIncident = [...incident];
    newIncident.splice(index, 1);
    setIncident(newIncident);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[80%]  md:w-auto w-96 p-2 pt-4 px-4 flex flex-col rounded-xl gap-2">
            <h1 className="font-semibold text-center text-xl border-b flex items-center gap-2 justify-center">
              <PiPlusCircleBold /> Add Injury
            </h1>
        <div className="overflow-y-auto hide-scrollbar">
          <div className="flex flex-col gap-2 z-10">

            {incident.map((incident1, index) => (
              <div key={index} className="bg-green-50 rounded-md p-1 border-b">
                <div className="grid gap-x-5 gap-y-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="" className="text-sm font-medium">
                      Injury Type
                    </label>
                    <select
                      name=""
                      id=""
                      className="border p-2 border-gray-400 rounded-md w-full"
                    >
                      <option value="">Select Type</option>
                      <option value="">Head</option>
                      <option value="">Neck</option>
                      <option value="">Nose</option>
                      <option value="">Tongue</option>
                      <option value="">Arms</option>
                      <option value="">Legs</option>
                      <option value="">Eye</option>
                      <option value="">Ears</option>
                      <option value="">Skin</option>
                      <option value="">Mouth</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="" className="text-sm font-medium">
                      Who got injured
                    </label>
                    <select
                      name=""
                      id=""
                      className="border p-2 border-gray-400 rounded-md w-full"
                    >
                      <option value="">Select </option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-1">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Name"
                      value={incident.mobile}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border rounded-md border-gray-400 p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-medium">
                      Mobile
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Mobile"
                      value={incident.mobile}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border rounded-md border-gray-400 p-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-sm font-medium">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Company"
                      value={incident.mobile}
                      onChange={(event) => handleInputChange(index, event)}
                      className="border rounded-md border-gray-400 p-2"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end border-b">
                  <button
                    className="bg-red-400 p-2 px-4 text-white rounded-md my-2"
                    onClick={() => handleRemoveIncident(index)}
                  >
                    <FaTrash/>
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-start">
              <button
                className="bg-green-400 p-2 px-4 text-white rounded-md flex items-center gap-2"
                onClick={handleAddIncident}
              >
               <PiPlusCircleBold/> Add More
              </button>
            </div>
           
          </div>
        </div>
        <div className="flex justify-center gap-2 border-t p-1">
          <button className="bg-red-400 text-white p-2 px-4 rounded-full flex items-center gap-2" onClick={()=> onclose()}>
            <MdClose /> Cancel
          </button>
          <button className="bg-green-400 text-white p-2 px-4 rounded-full flex items-center gap-2">
            <FaCheck /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default IncidentInjuryModal;
