import React, { useState } from "react";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { RiDeleteBinLine } from "react-icons/ri";
import InjurySetupModal from "../../../containers/modals/IncidentSetupModal.jsx/InjurySetupModal";
import { PiPlusCircle } from "react-icons/pi";
import { MdClose } from "react-icons/md";
import { FaCheck, FaTrash } from "react-icons/fa";

const InjurySetup = () => {
  const [modal, showModal] = useState(false);
  const column = [
    { name: "Name", selector: (row) => row.Name, sortable: true },
    {
      name: "action",

      cell: (row) => (
        <div className="flex items-center gap-2">
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
      Name: "ashish",
      action: <BsEye />,
    },
  ];
  const [addInjury, setAddInjury] = useState(false);
  return (
    <section className="mx-2">
      <div className="w-full flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-end">
          {addInjury && (
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Person Name"
                className="border p-2 w-full border-gray-300 rounded-lg"
              />
              <button className="bg-green-500 text-white p-2 flex gap-2 items-center rounded-md">
                <FaCheck /> Submit
              </button>
              <button
                className="bg-red-400 text-white flex items-center gap-2 p-2 rounded-md"
                onClick={() => setAddInjury(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          )}
          {!addInjury && (
            <button
              className="bg-green-500 p-2 rounded-md text-white flex items-center gap-2"
              onClick={() => setAddInjury(true)}
            >
              <PiPlusCircle /> Add
            </button>
          )}
        </div>
        <div>
          <Table columns={column} data={data} isPagination={true} />
        </div>
      </div>
      {modal && <InjurySetupModal onclose={() => showModal(false)} />}
    </section>
  );
};

export default InjurySetup;
