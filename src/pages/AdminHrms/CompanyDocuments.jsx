import React, { useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import Table from "../../components/table/Table";

import { BiEdit } from "react-icons/bi";
import { GrHelpBook } from "react-icons/gr";

import DocumentDetailsList from "./DocumentDetailsList";
import { FaTrash } from "react-icons/fa";

const CompanyDocuments = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const listItemStyle = {
    listStyleType: "disc",
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Employee Permissions",
      selector: (row) => row.p,
      sortable: true,
    },
    {
      name: "Applies To	",
      selector: (row) => row.City,
      sortable: true,
    },
    {
      name: "Last Updated On",
      selector: (row) => row.State,
      sortable: true,
    },
    {
      name: "Actions",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModal1(true)}
            //   to={`/admin/edit-templates/${row.id}`}
          >
            <BiEdit size={15} />
          </button>
          <FaTrash size={15} />
        </div>
      ),
    },
  ];

  const data = [
    {
      Name: "HR Policy",
      Location: "Mittu",
      p: "No",
      City: "Mittu",
      State: "24/10/2023",

      Country: "India",
    },
  ];

  return (
    // <div className="mt-2">
    //   <OrganisationPage/>
    <section className="flex ml-20">
      <DocumentDetailsList />
      <div className=" w-full flex m-3 flex-col overflow-hidden">
        <div className=" flex justify-end gap-2 my-5">
          <input
            type="text"
            placeholder="Search by name "
            className="border border-gray-400 w-96 placeholder:text-sm rounded-lg p-2"
          />
          <button
            onClick={() => setShowModal(true)}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center  gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add
          </button>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg w-96">
              <h1 className="text-2xl font-bold mb-4">Add Company Documents</h1>
              <div className="mb-4">
                <label className="block text-gray-700">Name :</label>
                <input
                  type="text"
                  name="name"
                  className="border border-gray-300 p-2 mt-2 rounded w-full"
                />
                <label className="block text-gray-700 mt-2">
                  Employee Permission:
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 mt-2 rounded w-full"
                />
                <label className="block text-gray-700 mt-2">Select:</label>
                <select
                  name="type"
                  className="border border-gray-300 mt-2 p-2 rounded w-full"
                >
                  <option value="text">Yes</option>
                  <option value="number">No</option>
                </select>
                <label className="block text-gray-700 mt-2">Applies to:</label>
                <select
                  name="type"
                  className="border border-gray-300 mt-2 p-2 rounded w-full"
                >
                  <option value="text">Mittu Panda</option>
                  <option value="number">Ramesh Nayaj</option>
                </select>
              </div>
              <button
                className="mt-4 ml-2 bg-blue-500 text-white py-2 px-4 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button className="mt-4 ml-2 bg-blue-500 text-white py-2 px-4 rounded-md">
                Submit
              </button>
            </div>
          </div>
        )}
        {showModal1 && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg w-96">
              <h1 className="text-2xl font-bold mb-4">
                Edit Company Documents
              </h1>
              <div className="mb-4">
                <label className="block text-gray-700">Name :</label>
                <input
                  type="text"
                  name="name"
                  className="border border-gray-300 p-2 mt-2 rounded w-full"
                />
                <label className="block text-gray-700 mt-2">
                  Employee Permission:
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 mt-2 rounded w-full"
                />
                <label className="block text-gray-700 mt-2">Select:</label>
                <select
                  name="type"
                  className="border border-gray-300 mt-2 p-2 rounded w-full"
                >
                  <option value="text">Yes</option>
                  <option value="number">No</option>
                </select>
                <label className="block text-gray-700 mt-2">Applies to:</label>
                <select
                  name="type"
                  className="border border-gray-300 mt-2 p-2 rounded w-full"
                >
                  <option value="text">Mittu Panda</option>
                  <option value="number">Ramesh Nayaj</option>
                </select>
              </div>
              <button
                className="mt-4 ml-2 bg-blue-500 text-white py-2 px-4 rounded-md"
                onClick={() => setShowModal1(false)}
              >
                Close
              </button>
              <button className="mt-4 ml-2 bg-blue-500 text-white py-2 px-4 rounded-md">
                Update
              </button>
            </div>
          </div>
        )}
        <Table columns={columns} data={data} isPagination={true} />
      </div>
      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>
          <div className=" ">
            {/* <p className="font-medium">Help Center</p> */}
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can store your company documents like HR policy, forms,
                    etc under one roof.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can also manage document visibility permissions to
                    employees{" "}
                  </li>
                </ul>
              </li>
             
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyDocuments;
