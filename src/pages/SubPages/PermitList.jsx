import React, { useEffect, useState } from "react";
//import Navbar from "../components/Navbar";
import Table from "../../components/table/Table";
import { ImEye } from "react-icons/im";
import { useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { PiPlusCircle } from "react-icons/pi";

import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getPermits } from "../../api";
//import Modal from "../containers/modals/Modal";
const PermitList = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const column = [
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/permit-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-permit/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },

    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Ref No.", selector: (row) => row.ref, sortable: true },
    { name: "Permit Type", selector: (row) => row.permit_type, sortable: true },
    { name: "Permit For", selector: (row) => row.permit_for, sortable: true },

    { name: "Created By", selector: (row) => row.name, sortable: true },
    // { name: "Designation", selector: (row) => row.desg, sortable: true },
    { name: "Status", selector: (row) => row.permit_status, sortable: true },
    { name: "Location", selector: (row) => row.location, sortable: true },
  ];

  document.title = `Permit - Vibe Connect`;
  const [permits, setPermits] = useState([]);
  const [filteredPermits, setFilteredPermits] = useState([]);
  const fetchPermits = async () => {
    try {
      const res = await getPermits();
      setPermits(res.data);
      setFilteredPermits(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPermits();
  }, []);
  return (
    <section className="flex ">
      {/* <Navbar /> */}
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex flex-col flex-wrap flex-shrink md:flex-row justify-start gap-2 my-2  ">
          <div className="shadow-xl rounded-full border-4 border-gray-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Total Permits</p>
            <p className="text-center font-semibold ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-green-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Draft Permits</p>
            <p className="text-center font-semibold  ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-red-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Open Permits</p>
            <p className="text-center font-semibold  ">0</p>
          </div>

          <div className="shadow-xl rounded-full border-4 border-orange-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold">Approved</p>
            <p className="text-center font-semibold  ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-indigo-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold">Rejected</p>
            <p className="text-center font-semibold  ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-blue-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Extended</p>
            <p className="text-center font-semibold ">0</p>
          </div>
          <div className="shadow-xl rounded-full border-4 border-yellow-400 w-52  px-6 flex flex-col items-center">
            <p className="font-semibold ">Closed</p>
            <p className="text-center font-semibold ">0</p>
          </div>
        </div>
        <div className=" flex my-2 flex-col">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search by Permit for"
              className="border p-2 w-96 border-gray-300 rounded-lg"
            />
            <Link
              to={"/admin/permit/add-new-permit"}
              className="border-2 font-semibold   transition-all p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
              style={{ background: themeColor }}
            >
              <PiPlusCircle size={20} />
              Add
            </Link>
          </div>
        </div>
        <Table columns={column} data={filteredPermits} />
      </div>
    </section>
  );
};

export default PermitList;
