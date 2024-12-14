import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import Select from "react-select";
import { BiEditAlt } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
const EscalationSetupModal = ({ onclose }) => {
  const [formData, setFormData] = useState({
    meeting: "",
    Attendees: [],
    repeat: false,
    on_behalf: "",
  });
  const options = [
    {
      value: "Akshat",
      label: "Akshat",
      email: "akshat.shrawat@vibecopilot.ai",
    },
    { value: "Kunal", label: "Kunal", email: "kunal.sah@vibecopilot.ai" },
    { value: "Anurag", label: "Anurag", email: "anurag.sharma@vibecopilot.ai" },
  ];
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-sm z-20">
      <div className="bg-white overflow-auto max-h-[70%] md:w-auto w-96 p-4 flex flex-col rounded-xl gap-5">
        <div className="flex flex-col w-full justify-center">
          <h2 className="flex gap-2 items-center justify-center font-bold text-lg ">
            <BiEditAlt /> Edit Incident Escalation
          </h2>
          <div className="border-t-2 border-black">
            <div className="grid grid-cols-2 w-full gap-2 gap-y-4 my-2">
              <Select
                className="col-span-2 z-50"
                options={options}
                isMulti
                value={formData.Attendees}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, Attendees: selectedOption })
                }
              />
              <select
                name=""
                id=""
                className="border p-2 border-gray-500 rounded-md w-full"
              >
                <option value="">Select Level</option>
                <option value="">L1</option>
              </select>
              <input
                type="number"
                name=""
                id=""
                placeholder="Escalate In Days"
                className="border p-2 border-gray-500 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4 border-t p-1">
            <button
              className="bg-red-500 flex items-center gap-2 text-white rounded-md p-2 px-4 "
              onClick={onclose}
            >
              <MdClose /> Cancel
            </button>
            <button className="bg-green-500 flex items-center gap-2 text-white rounded-md px-4 p-2 ">
              <FaCheck /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscalationSetupModal;
