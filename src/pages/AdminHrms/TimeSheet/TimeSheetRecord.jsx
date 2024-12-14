import React, { useState } from "react";
import AdminHRMS from "../AdminHrms";
import Table from "../../../components/table/Table";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const TimeSheetRecord = () => {
  const [recordDetails, setRecordDetails] = useState(false);
  const columns = [
    {
      name: "Employee Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Start time	",
      selector: (row) => row.start,
      sortable: true,
    },
    {
      name: "End time",
      selector: (row) => row.end,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button
            // to={`/admin/edit-letter-templates`}
            onClick={() => setRecordDetails(true)}
          >
            <BsEye size={15} />
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      Name: "Rajesh Kumar",
      Location: "abc",
      City: "abc",
      State: "Mittu",
      id: "101",
      Country: "pending",
      start: "26/11/2024",
      
    },
  ];
  return (
    <div className="flex">
      <AdminHRMS />
      <div className=" w-full my-2 flex  overflow-hidden flex-col ml-20 p-2">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name=""
            id=""
            className="border border-gray-300 rounded-md p-2"
            placeholder="Search by employee name"
          />
          <Table columns={columns} data={data} isPagination={true} />
        </div>
      </div>
      {recordDetails && (
        <div>
          <div className="z-10 fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-xl shadow-lg w-2/3">
              <h2 className="text-xl font-bold mb-2 border-b text-center">
                Record Details
              </h2>
              <div className="max-h-96 overflow-y-auto p-2">
                <div className="grid-cols-2 grid bg-blue-50 p-2 rounded-md border">
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Name :</p>
                    <p>Rajesh Kumar</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Date :</p>
                    <p>26/11/2024</p>
                  </div>
                </div>
                <div className="my-2 ">
                  <p className="font-medium border-b">Row 1</p>
                  <div className="bg-blue-50 rounded-md border my-1 p-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Start time :</p>
                        <p>10:30 AM</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">End time :</p>
                        <p>12:30 PM</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Total Duration :</p>
                        <p>2 hrs</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Status :</p>
                        <p>Completed</p>
                      </div>
                    </div>
                    <div className="my-2 flex flex-col">
                      <p className="font-medium">Task :</p>
                      <p className=" p-2 rounded-md bg-blue-100">
                        Document Preparation
                      </p>
                    </div>
                    <div className="my-2 flex flex-col">
                      <p className="font-medium">Description :</p>
                      <p className=" p-2 rounded-md bg-blue-100">
                        Document Preparation
                      </p>
                    </div>
                    <div className="my-2 flex flex-col">
                      <p className="font-medium border-b">Attachments :</p>
                      <p className="text-center">No Attachments</p>
                    </div>
                  </div>
                </div>
                <div className="my-2 ">
                  <p className="font-medium border-b">Row 2</p>
                  <div className="bg-blue-50 rounded-md border my-1 p-2">
                    <div className="grid grid-cols-2">
                      <div className="grid grid-cols-2">
                        <p className="font-medium">Start time :</p>
                        <p>01:00 PM</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="font-medium">End time :</p>
                        <p>02:00 PM</p>
                      </div>
                    </div>
                    <div className="my-2 flex flex-col">
                      <p className="font-medium">Task :</p>
                      <p className=" p-2 rounded-md bg-blue-100">
                        Report Writing
                      </p>
                    </div>
                    <div className="my-2 flex flex-col">
                      <p className="font-medium">Description :</p>
                      <p className=" p-2 rounded-md bg-blue-100">
                        Report Writing
                      </p>
                    </div>
                    <div className="my-2 flex flex-col">
                      <p className="font-medium border-b">Attachments :</p>
                      <p className="text-center">No Attachments</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Comment
                  </label>
                  <textarea
                    name=""
                    id=""
                    rows={2}
                    className="border rounded-md p-2 border-gray-300"
                    placeholder="Enter comment"
                  ></textarea>
                  <div className="flex justify-end">
                    <button className="bg-green-400 p-1 px-4 flex items-center gap-2 text-white rounded-full">
                      <FaCheck /> Submit
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="border-b font-medium">Comment Logs</h2>
                  <div className="bg-gray-100 p-2 rounded-md">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        Akshat Shrawat{" "}
                        <span className="text-sm text-gray-400">(HR head)</span>
                      </p>
                      <p className="text-sm text-gray-400">10:59:45 AM</p>
                    </div>
                    <p className="text-gray-600">
                      Please submit all the reports of the Tasks you performed
                    </p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-md">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        Rajesh Kumar
                        {/* <span className="text-sm text-gray-400">(HR head)</span> */}
                      </p>
                      <p className="text-sm text-gray-400">11:20:45 AM</p>
                    </div>
                    <p className="text-gray-600">Sure</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center p-2 border-t">
                <button
                  className="border-2 border-red-400 text-red-400 p-1 rounded-full px-4 flex items-center gap-2"
                  onClick={() => setRecordDetails(false)}
                >
                  <MdClose /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSheetRecord;
