import React, { useState } from "react";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import Select from "react-select";
import { RiDeleteBinLine } from "react-icons/ri";
import EscalationSetupModal from "../../../containers/modals/IncidentSetupModal.jsx/IncidentEsclationSetupModal";
import { FaCheck, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { PiPlusCircle } from "react-icons/pi";
const IncidentEscalationSetup = () => {
  const [modal, showModal] = useState(false);
  const [formData, setFormData] = useState({
    meeting: "",
    Attendees: [],
    repeat: false,
    on_behalf: "",
  });
  const column = [
    { name: "Level", selector: (row) => row.Level, sortable: true },
    {
      name: "Escalate In Days",
      selector: (row) => row.Escalate,
      sortable: true,
    },
    { name: "Users", selector: (row) => row.Users, sortable: true },
    {
      name: "action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => showModal(true)} className="text-blue-500">
            <BiEdit size={15} />
          </button>

          <button className="text-red-500">
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];
  const data = [
    {
      id: 1,
      Level: "L1",
      Escalate: "3",
      Users: "sameer",
      action: <BsEye />,
    },
  ];
  const options = [
    {
      value: "Akshat",
      label: "Akshat",
      email: "akshat.shrawat@vibecopilot.ai",
    },
    { value: "Kunal", label: "Kunal", email: "kunal.sah@vibecopilot.ai" },
    { value: "Anurag", label: "Anurag", email: "anurag.sharma@vibecopilot.ai" },
  ];
  const [addEscalation, setAddEscalation] = useState(false);
  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addEscalation && (
            <div className="flex items-center gap-2 w-full">
              <select
                name=""
                id=""
                className="border p-2 w-full border-gray-300 rounded-lg"
              >
                <option value="">Select Level</option>
                <option value="">L1</option>
              </select>
              <input
                type="numbar"
                placeholder="Escalate In Days"
               className="border p-2 w-full border-gray-300 rounded-lg"
              />
              <Select
                className="z-50 w-full "
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
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                onClick={() => setAddEscalation(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          )}
          {!addEscalation && (
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddEscalation(true)}
            >
              <PiPlusCircle /> Add
            </button>
          )}
        </div>
        <div>
          <Table columns={column} data={data} isPagination={true} />
        </div>
      </div>
      {modal && <EscalationSetupModal onclose={() => showModal(false)} />}
    </section>
  );
};

export default IncidentEscalationSetup;
