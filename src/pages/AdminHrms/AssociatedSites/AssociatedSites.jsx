import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import {
  PiPlusCircle,
  PiPlusCircleBold,
  PiPlusCircleFill,
} from "react-icons/pi";
import OrganisationSetting from "../OrganisationSetting";
import { GrHelpBook } from "react-icons/gr";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
const AssociatedSites = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [editSelectedOption, setEditSelectedOption] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [headOfDepartment, setHeadOfDepartment] = useState("");
  const themeColor = useSelector((state) => state.theme.color);

  const listItemStyle = {
    listStyleType: "disc",
    color: "gray",
    fontSize: "14px",
    fontWeight: 500,
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Head Of Department",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleEditModal(row.id)}>
            <BiEdit size={15} />
          </button>
          {/* <button
            onClick={() => handleDeleteDepartment(row.id)}
            className="text-red-400"
          >
            <FaTrash size={15} />
          </button> */}
        </div>
      ),
    },
  ];

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");

  return (
    <section className="flex ml-20">
      <OrganisationSetting />
      <div className="w-full flex m-3 flex-col overflow-hidden">
        <div className="flex justify-between gap-2 my-2 mt-5">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-400 w-full placeholder:text-sm rounded-md p-2"
            // value={searchText}
            // onChange={handleSearch}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ background: themeColor }}
            className="border-2 font-medium hover:text-white duration-150 transition-all  p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add
          </button>
        </div>
        <Table
          columns={columns}
          //   data={filteredDepartments}
          isPagination={true}
        />
      </div>
      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col  bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>

          <div>
            <p className="font-medium"> Department Settings Guidelines</p>
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can create departments such as a Sales, Marketing, HR,
                    Finance, Operations, etc. By adding departments, you will be
                    able to map the employees under specific departments from
                    the employee profile --{">"} employment ---{">"} Job
                    Information ---{">"} Position. This can further be mapped to
                    head of departments for direct reporting and workflow
                    approvals.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    An analytic view is displayed on the dashboard that gives
                    information on the no. Of employees mapped under specific
                    departments. Departments can also be used in filters across
                    modules.
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>How do I create departments?</li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    Click on{" "}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="  text-white py-1 px-4 rounded-lg"
                      style={{ background: themeColor }}
                    >
                      Add Department
                    </button>
                    ---{">"} Enter department name and select the head of the
                    department from the employee list.
                  </li>
                </ul>
              </li>

              <li>
                You can edit and disable the departments. But you cannot delete
                the departments that contains mapped employees.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-[30rem]">
            <div className="flex justify-center">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-center">
                <PiPlusCircleFill /> Add Associated Sites
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto hide-scrollbar">
              <div className="flex flex-col gap-1 ">
                <label htmlFor="" className="font-medium">
                  Site name
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Site name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 1
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 2
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="City"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="State/Province"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Zip/Pin Code
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Zip/Pin Code"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Country"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Latitude"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Longitude"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 my-2 border-t p-1">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-green-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <MdClose /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen1 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-[30rem]">
            <div className="flex justify-center">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-center">
                <BiEdit/> Edit Associated Sites
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto hide-scrollbar">
              <div className="flex flex-col gap-1 ">
                <label htmlFor="" className="font-medium">
                  Site name
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Site name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 1
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 2
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="City"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="State/Province"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Zip/Pin Code
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Zip/Pin Code"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Country"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Latitude"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Longitude"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 my-2 border-t p-1">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-green-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <MdClose /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AssociatedSites;
