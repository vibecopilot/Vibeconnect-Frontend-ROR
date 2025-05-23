import React, { useEffect, useRef, useState } from "react";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { HiChevronDown } from "react-icons/hi";
import Navbar from "../../../components/Navbar";
import Table from "../../../components/table/Table";

function Survey() {
  const themeColor = useSelector((state) => state.theme.color);
  const [isStatus, setIsStatus] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const statusRef = useRef(null);
  const ownerRef = useRef(null);

  // Status options state
  const [statusOptions, setStatusOptions] = useState({
    selectAll: false,
    open: false,
    closeShared: false,
    draftYou: false,
  });

  // Owner options state
  const [ownerOptions, setOwnerOptions] = useState({
    selectAll: false,
    youOwn: false,
    youOwnShared: false,
    sharedWith: false,
  });

  // Handle "Select All" for Status dropdown
  const handleStatusChange = (key) => {
    if (key === "selectAll") {
      const newValue = !statusOptions.selectAll;
      setStatusOptions({
        selectAll: newValue,
        open: newValue,
        closeShared: newValue,
        draftYou: newValue,
      });
    } else {
      const updatedOptions = { ...statusOptions, [key]: !statusOptions[key] };
      updatedOptions.selectAll =
        updatedOptions.open &&
        updatedOptions.closeShared &&
        updatedOptions.draftYou;
      setStatusOptions(updatedOptions);
    }
  };

  // Handle "Select All" for Owner dropdown
  const handleOwnerChange = (key) => {
    if (key === "selectAll") {
      const newValue = !ownerOptions.selectAll;
      setOwnerOptions({
        selectAll: newValue,
        youOwn: newValue,
        youOwnShared: newValue,
        sharedWith: newValue,
      });
    } else {
      const updatedOptions = { ...ownerOptions, [key]: !ownerOptions[key] };
      updatedOptions.selectAll =
        updatedOptions.youOwn &&
        updatedOptions.youOwnShared &&
        updatedOptions.sharedWith;
      setOwnerOptions(updatedOptions);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatus(false);
      }
      if (ownerRef.current && !ownerRef.current.contains(event.target)) {
        setIsOwner(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/survey-details/${row.id}`}>
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
    {
      name: "No Of Response",
      selector: (row) => row.response,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
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
      response: "12/25",
      status: "Close",
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
            <div className="flex gap-4">
              <div className="relative inline-block" ref={statusRef}>
                <button
                  onClick={() => setIsStatus(!isStatus)}
                  className="flex items-center px-4 py-2 border rounded-md bg-white hover:bg-gray-200"
                >
                  Status <HiChevronDown className="w-4 h-4 ml-2" />
                </button>
                {isStatus && (
                  <div className="absolute left-0 mt-2 w-52 bg-white shadow-md rounded-md border border-gray-200 z-10">
                    {Object.keys(statusOptions).map((key) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={statusOptions[key]}
                          onChange={() => handleStatusChange(key)}
                        />
                        {key === "selectAll"
                          ? "Select all"
                          : key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative inline-block" ref={ownerRef}>
                <button
                  onClick={() => setIsOwner(!isOwner)}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Owner <HiChevronDown size={16} />
                </button>
                {isOwner && (
                  <div className="absolute left-0 mt-2 w-52 bg-white shadow-md rounded-md border border-gray-200 z-10">
                    {Object.keys(ownerOptions).map((key) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={ownerOptions[key]}
                          onChange={() => handleOwnerChange(key)}
                        />{" "}
                        {key === "selectAll"
                          ? "Select all"
                          : key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
