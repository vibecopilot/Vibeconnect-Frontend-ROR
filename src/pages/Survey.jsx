import React, { useState } from "react";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Table from "../components/table/Table";
import "react-datepicker/dist/react-datepicker.css";
import { IoAddCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

function Survey() {
    const themeColor = useSelector((state) => state.theme.color);
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={``}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Survey Name",
      selector: (row, index) => row.survey_name,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      sortable: true,
    },
  ];

  const data = [
    {
      Id: 1,
      survey_name: "Customer Feedback Survey",
      frequency: "Daily",
      start_date: "2024-12-24",
      end_date: "2024-12-31",
    },
  ];

  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex md:flex-row flex-col justify-between md:items-center my-2 gap-2  ">
          <input
            type="text"
            placeholder="Search By Survey Name"
            className=" p-2 md:w-96 border-gray-300 rounded-md placeholder:text-sm outline-none border "
          />
          <div className="md:flex grid grid-cols-2 sm:flex-row my-2 flex-col gap-2">
            <Link
              to={`/admin/add-survey`}
              style={{ background: themeColor }}
              className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center"
            >
              <IoAddCircleOutline />
              Add
            </Link>
          </div>
        </div>
        <Table columns={columns} data={data} selectableRow={true} />
      </div>
    </section>
  );
}

export default Survey;
