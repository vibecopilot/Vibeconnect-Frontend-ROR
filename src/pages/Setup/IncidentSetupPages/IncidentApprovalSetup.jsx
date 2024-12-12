import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import Select from "react-select";
const IncidentApprovalSetup = () => {
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
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {/* {addStatus && ( */}
          <div className="flex items-center gap-2 w-full">
            <Select
              className=" rounded-md z-10 w-full"
              options={options}
              isMulti
              value={formData.Attendees}
              onChange={(selectedOption) =>
                setFormData({ ...formData, Attendees: selectedOption })
              }
            />
            <button className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md">
            <FaCheck /> Submit
            </button>
          </div>
          {/* )} */}
        </div>
      </div>
    </section>
  );
};

export default IncidentApprovalSetup;
