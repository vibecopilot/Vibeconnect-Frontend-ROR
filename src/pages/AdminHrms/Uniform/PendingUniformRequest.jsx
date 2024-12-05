import React, { useEffect, useState } from "react";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { PiPlusCircle } from "react-icons/pi";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import {
  getMyHRMSEmployees,
  getUniformRequest,
  postUniformApproval,
  postUniformRequest,
} from "../../../api";
import Select from "react-select";
import toast from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { dateFormatSTD } from "../../../utils/dateUtils";
const PendingUniformRequest = () => {
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
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
            !row.status ? "text-red-400" : "text-green-400"
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
        <div className="flex items-center gap-4">
          <button
            className="bg-green-400 text-white p-2 rounded-full"
            onClick={() => handleUniformApproval(row.id, "Approved")}
          >
            <FaCheck title="Approve uniform" />
          </button>
          <button
            className="bg-red-400 text-white p-2 rounded-full"
            onClick={() => handleUniformApproval(row.id, "Rejected")}
          >
            <MdClose title="Reject uniform" size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleUniformApproval = async (approvalId, decision) => {
    const approvalData = new FormData();
    approvalData.append("status", decision);
    try {
      const res = await postUniformApproval(approvalId, approvalData);
      toast.success(`Uniform request ${decision}`);
      fetchUniformRequests();
    } catch (error) {
      console.log(error);
    }
  };

  const themeColor = useSelector((state) => state.theme.color);
  const [addRequest, setAddRequest] = useState(false);
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const res = await getMyHRMSEmployees(hrmsOrgId);

        const employeesList = res.map((emp) => ({
          value: emp.id,
          label: `${emp.first_name} ${emp.last_name}`,
        }));
        setEmployees(employeesList);
        // setFilteredEmployees(employeesList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllEmployees();
  }, []);
  const [selectedOption, setSelectedOption] = useState({});
  const handleEmployeeChange = (option) => {
    setSelectedOption(option);
  };
  const [formData, setFormData] = useState({
    size: "",
    waist: "",
    chest: "",
  });
  const handleAddUniformRequest = async () => {
    const postData = new FormData();
    postData.append("select_size", formData.size);
    postData.append("chest", formData.chest);
    postData.append("waist", formData.waist);
    postData.append("status", "Approved");
    postData.append("employee", selectedOption.value);
    try {
      const res = await postUniformRequest(postData);
      setAddRequest(false);
      toast.success("Uniform request added successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const fetchUniformRequests = async () => {
    try {
      const res = await getUniformRequest(hrmsOrgId);
      const filteredData = res.filter((item) => item.status === "Pending");
      setRequests(filteredData);
      setFilteredRequests(filteredData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUniformRequests();
  }, []);

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
          <div className="flex gap-2">
            {/* <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setShowFilterModal(true)}
            >
              Filter
            </button> */}
            <button
              style={{ background: themeColor }}
              onClick={() => setAddRequest(true)}
              className="px-4 py-2 font-medium bg-blue-600 text-white rounded-md flex items-center gap-2"
            >
              <PiPlusCircle /> Add
            </button>
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredRequests}
          selectableRow={true}
          isPagination={true}
          //   onSelectedRows={handleSelectedRows}
        />
      </div>
      {addRequest && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
          <div className="max-h-screen bg-white p-2 px-3 w-[32rem] rounded-lg shadow-lg overflow-y-auto">
            <div>
              <h2 className="text-xl font-semibold mb-2 flex border-b justify-center gap-2 items-center">
                <PiPlusCircle /> Uniform Request
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="mt-2">
                  <label className="block  font-medium text-gray-700">
                    Select Employee
                  </label>
                  <Select
                    options={employees}
                    onChange={handleEmployeeChange}
                    noOptionsMessage={() => "Select Approver"}
                    maxMenuHeight={139}
                  />
                </div>
                <div className="mt-2">
                  <label className="block t font-medium text-gray-700">
                    Select Size
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-300 p-2 rounded-md w-full"
                  >
                    <option value="">Select Size</option>
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="XXL">Double Extra Large (XXL)</option>
                  </select>
                </div>
                <div className="mt-2">
                  <label className="block t font-medium text-gray-700">
                    Chest{" "}
                    <span className="text-gray-400 text-sm">(inches)</span>
                  </label>
                  <input
                    type="number"
                    name="chest"
                    value={formData.chest}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-300 p-2 rounded-md w-full"
                    placeholder="Chest size"
                  />
                </div>
                <div className="mt-2">
                  <label className="block t font-medium text-gray-700">
                    Waist{" "}
                    <span className="text-gray-400 text-sm">(inches)</span>
                  </label>
                  <input
                    type="number"
                    name="waist"
                    value={formData.waist}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-300 p-2 rounded-md w-full"
                    placeholder="Waist size"
                  />
                </div>
                <div className="mt-2">
                  <label className="block t font-medium text-gray-700">
                    Shoes
                    {/* <span className="text-gray-400 text-sm">(inches)</span> */}
                  </label>
                  <input
                    type="number"
                    name="waist"
                    value={formData.shoes}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-300 p-2 rounded-md w-full"
                    placeholder="Shoes size"
                  />
                </div>
                {/* <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Comment{" "}
              </label>
              <input
                type="text"
                className="mt-1 p-2  border rounded-md w-full"
                placeholder="Comment"
                value={formData.comment}
                onChange={handleChange}
                name="comment"
              />
            </div> */}
              </div>
              <div className="flex my-2 justify-center gap-2 border-t p-1">
                <button
                  type="button"
                  onClick={() => setAddRequest(false)}
                  className="border-2 border-red-400 rounded-full text-red-400 px-4 p-1 flex items-center gap-2"
                >
                  <MdClose /> Cancel
                </button>
                <button
                  onClick={handleAddUniformRequest}
                  type="submit"
                  className=" bg-green-400 rounded-full p-1 px-4 text-white flex items-center gap-2"
                >
                  <FaCheck /> Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PendingUniformRequest;
