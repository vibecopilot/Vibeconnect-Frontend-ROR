import React, { useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import { getUniformRequest, getUniformRequestDetails } from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { dateFormatSTD } from "../../../utils/dateUtils";
import { BsEye } from "react-icons/bs";
import { MdClose } from "react-icons/md";

const CompletedUniformRequest = () => {
  const columns = [
    {
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
    },
    {
      name: "Waist size",
      selector: (row) => (
        <p>
          {row.waist} <span>{"inches"}</span>{" "}
        </p>
      ),
      sortable: true,
    },
    {
      name: "Chest size",
      selector: (row) => (
        <p>
          {row.chest} <span>{"inches"}</span>{" "}
        </p>
      ),

      sortable: true,
    },
    {
      name: "Applied on",
      selector: (row) => dateFormatSTD(row.created_date),
      sortable: true,
    },

    // {
    //   name: "Comment",
    //   selector: (row) => row.comment,
    //   sortable: true,
    // },
    {
      name: "Status",
      selector: (row) => (
        <div
          className={`font-medium ${
            row.status === "Rejected" ? "text-red-400" : "text-green-400"
          }`}
        >
          {row.status}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div
          className="flex items-center gap-4"
          onClick={() => handleDetails(row.id)}
        >
          <button>
            <BsEye size={15} />
          </button>
        </div>
      ),
    },
  ];
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const fetchUniformRequests = async () => {
    try {
      const res = await getUniformRequest(hrmsOrgId);
      const filteredData = res.filter((item) => item.status !== "Pending");
      setRequests(filteredData);
      setFilteredRequests(filteredData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUniformRequests();
  }, []);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState({});
  const handleDetails = async (id) => {
    setShowDetails(true);
    try {
      const res = await getUniformRequestDetails(id);
      setDetails(res);
    } catch (error) {
      console.log(error);
    }
  };

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredRequests(requests);
    } else {
      const filteredResult = requests.filter((employee) =>
        employee.employee_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredRequests(filteredResult);
    }
  };
  return (
    <section className="flex">
      <div className="w-full flex mx-2 flex-col overflow-hidden">
        <div className="flex justify-between gap-2 my-2">
          <input
            type="text"
            placeholder="Search by employee name"
            className="border border-gray-400 w-full placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={handleSearch}
          />
        </div>
        <Table
          columns={columns}
          data={filteredRequests}
          isPagination={true}
          selectableRows={true}
        />
      </div>
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
          <div className="max-h-screen bg-white p-2 px-3 w-[32rem] rounded-lg shadow-lg overflow-y-auto">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-center border-b mb-4">
                Uniform Request Details
              </h2>
              <div className="grid grid-cols-2">
                <p className="font-medium">Employee Name :</p>
                <p className="text-right">{details.employee_name}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="font-medium">Waist size :</p>
                <p className="text-right">{details.waist} inches</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="font-medium">Chest size :</p>
                <p className="text-right">{details.chest} inches</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="font-medium">Applied on :</p>
                <p className="text-right">
                  {dateFormatSTD(details.created_date)}
                </p>
              </div>
            </div>
            <div className="flex justify-center my-2 border-t pt-1">
              <button
                className="flex items-center gap-2 border-2 border-red-500 text-red-500 rounded-full p-1 px-4"
                onClick={() => setShowDetails(false)}
              >
                <MdClose /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompletedUniformRequest;
