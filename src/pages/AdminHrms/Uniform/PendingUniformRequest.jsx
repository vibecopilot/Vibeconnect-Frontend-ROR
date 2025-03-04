import React, { useEffect, useState } from "react";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import { PiPlusCircle } from "react-icons/pi";
import { MdClose } from "react-icons/md";
import { FaCheck, FaRegAddressCard } from "react-icons/fa";
import {CustomDropdown} from "../../../utils/CustomDropdown";
import {
  getAdminAccess,
  getEmployeeAssociatedSites,
  getEmployeeDetails,
  getMyHRMSEmployees,
  getUniformRequest,
  getUniformRequestDetails,
  hrmsDomain,
  postUniformApproval,
  postUniformRequest,
  getAssociatedSites,
} from "../../../api";
import Select from "react-select";
import toast from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { dateFormatSTD } from "../../../utils/dateUtils";
import Accordion from "../Components/Accordion";
const PendingUniformRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const themeColor = useSelector((state) => state.theme.color);
  const [addRequest, setAddRequest] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedOption, setSelectedOption] = useState({});

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div
          className="flex items-center gap-4"
          onClick={() => handleDetails(row.id, row.employee)}
        >
          <button>
            <BsEye size={15} />
          </button>
        </div>
      ),
    },
    {
      name: "Site Name",
      selector: (row) => row.associated_organization_name,
      sortable: true,
    },
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
    // {
    //   name: "Shoes",
    //   selector: (row) => row.shoes,
    //   sortable: true,
    // },
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
          {roleAccess?.can_approve_reject_uniform_request && (
            <>
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
            </>
          )}
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

  const handleEmployeeChange = (option) => {
    setSelectedOption(option);
  };
  const [formData, setFormData] = useState({
    size: "",
    waist: "",
    chest: "",
    shoes: "",
    ID: "",
  });
  const handleAddUniformRequest = async () => {
    const postData = new FormData();
    postData.append("select_size", formData.size);
    postData.append("chest", formData.chest);
    postData.append("id_card", formData.ID);
    postData.append("waist", formData.waist);
    postData.append("shoes_size", formData.shoes);
    // postData.append("status", "Approved");
    postData.append("employee", selectedOption.value);
    try {
      const res = await postUniformRequest(postData);
      setAddRequest(false);
      fetchUniformRequests();
      toast.success("Uniform request added successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchUniformRequests = async () => {
    try {
      const res = await getUniformRequest(hrmsOrgId);
      const filteredData = res.filter((item) => item.status === "Pending");
      setRequests(filteredData);
      setFilteredRequests(filteredData);

      const allSites = await getAssociatedSites(orgId);
      console.log("allSites:", allSites);
      // Extract unique associated organization names
      const uniqueSites = Array.from(
        new Map(
          allSites.map((item, index) => [
            item.site_name,
            { index, site_name: item.site_name },
          ])
        ).values()
      );

      console.log("Unique Sites:", uniqueSites);
      setAllSites(uniqueSites);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUniformRequests();
  }, []);

  useEffect(() => {
    if (selectedSite && selectedSite.site_name !== "Select All Sites") {
      console.log("Selected Site:", selectedSite);
      console.log("Selected Site Data:", requests);
      const newFiltered = requests.filter((item) =>
        item.associated_organization_name
          .toLowerCase()
          .includes(selectedSite.site_name.toLowerCase())
      );

      console.log("newFiltered:", newFiltered);
      setFilteredRequests(newFiltered);
    } else {
      // If no specific site is selected, show all requests
      setFilteredRequests(requests);
    }
  }, [selectedSite, requests]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredRequests(requests);
    } else {
      const filteredResult = requests.filter(
        (employee) =>
          employee.associated_organization_name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          employee.employee_name
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      );
      setFilteredRequests(filteredResult);
    }
  };

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedSite(selectedValue);

    if (selectedValue === "All") {
      setFilteredRequests(requests); // Show all data if "All" is selected
    } else {
      const filteredData = requests.filter(
        (item) => item.associated_organization_name === selectedValue
      );
      setFilteredRequests(filteredData);
    }
  };

  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState({});
  const [empId, setEmpId] = useState("");
  const handleDetails = async (id, empID) => {
    setShowDetails(true);
    setEmpId(empID);
    fetchEmployeeDetails(empID);
    fetchEmployeeAssociatedSite(empID);
    try {
      const res = await getUniformRequestDetails(id);
      setDetails(res);
    } catch (error) {
      console.log(error);
    }
  };

  const [empDetails, setEmpDetails] = useState({});
  const [empSiteDetails, setEmpSiteDetails] = useState({});
  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const res = await getEmployeeDetails(employeeId);
      setEmpDetails(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchEmployeeAssociatedSite = async (employeeId) => {
    try {
      const res = await getEmployeeAssociatedSites(employeeId);
      setEmpSiteDetails(res);
    } catch (error) {
      console.log(error);
    }
  };

  // can_approve_reject_uniform_request
  const employeeId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});
  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, employeeId);

        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoleAccess();
  }, []);

  return (
    <section className="flex">
      <div className="w-full flex mx-2 flex-col overflow-hidden">
        <div className="flex justify-between gap-2 my-2">
          <input
            type="text"
            placeholder="Search by employee name & Site name"
            className="border border-gray-400 w-full placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={handleSearch}
          />
          {/* DROPDOWN */}
          <CustomDropdown
            AllSites={allSites}
            selectedValue={selectedSite}
            onSelect={(site) =>
              site.site_name === "Select All Sites"
                ? setSelectedSite(null) // Reset filter
                : setSelectedSite(site)
            }
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
          // selectableRow={true}
          isPagination={true}
          selectableRows={true}
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
                    Select Shoe size
                  </label>

                  <select
                    id="shoeSize"
                    name="shoes"
                    className="border border-gray-300 p-2 rounded-md w-full"
                    value={formData.shoes}
                    onChange={handleChange}
                  >
                    <option value="">Select shoe size</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className="mb-1"
                    value={formData.ID}
                    onChange={(e) =>
                      setFormData({ ...formData, ID: e.target.value })
                    }
                  />
                  <label htmlFor="">ID Card Required</label>
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
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
          <div className="max-h-screen bg-white p-2 px-3 w-[55rem] rounded-xl shadow-lg overflow-y-auto">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-center border-b mt-1">
                Uniform Request Details
              </h2>
              <Accordion
                title={"Requestor Details"}
                icon={FaRegAddressCard}
                content={
                  <>
                    <div className="grid  gap-2 border bg-blue-50 rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={hrmsDomain + empDetails.profile_photo}
                          alt={empDetails?.employee?.first_name}
                          className="border border-gray-300 rounded-full h-10 w-10 object-cover"
                        />
                        <p className="font-medium">
                          {empDetails.first_name} {empDetails.last_name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid grid-cols-2">
                          <label htmlFor="" className="font-medium">
                            DOB :{" "}
                          </label>
                          <p>{empDetails.date_of_birth}</p>
                        </div>
                        <div className="grid grid-cols-2">
                          <label htmlFor="" className="font-medium">
                            Gender :{" "}
                          </label>
                          <p>{empDetails.gender}</p>
                        </div>

                        <div className="grid grid-cols-2">
                          <label htmlFor="" className="font-medium">
                            Mobile :{" "}
                          </label>
                          <p>{empDetails.mobile}</p>
                        </div>
                        <div className="grid grid-cols-2 ">
                          <label htmlFor="" className="font-medium">
                            Aadhar :{" "}
                          </label>
                          <p>{empDetails.aadhar_number}</p>
                        </div>
                        <div className="grid grid-cols-2">
                          <label htmlFor="" className="font-medium">
                            Pan :{" "}
                          </label>
                          <p>{empDetails.pan}</p>
                        </div>
                        <div className="grid grid-cols-2">
                          <label htmlFor="" className="font-medium">
                            Site :{" "}
                          </label>
                          <p>
                            {empSiteDetails.associated_organization_name
                              ? empSiteDetails.associated_organization_name
                              : "Not Associated"}
                          </p>
                        </div>
                        <div className="grid grid-cols-2">
                          <label htmlFor="" className="font-medium">
                            Site ID :{" "}
                          </label>
                          <p>
                            {empSiteDetails.associated_organization
                              ? empSiteDetails.associated_organization
                              : "Not Associated"}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 ">
                          <label htmlFor="" className="font-medium">
                            Email :{" "}
                          </label>
                          <p className="text-wrap max-w-20">
                            {empDetails.email_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="grid grid-cols-2">
                  <p className="font-medium">Applied on :</p>
                  <p className="">{dateFormatSTD(details.created_date)}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium">Employee Name :</p>
                  <p className="">{details.employee_name}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium">Status :</p>
                  <p
                    className={`${
                      details.status === "Rejected"
                        ? "text-red-500"
                        : "text-green-500 font-medium"
                    }`}
                  >
                    {details.status}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium"> Size :</p>
                  <p className="">{details.select_size} </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium">Waist size :</p>
                  <p className="">{details.waist} inches</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium">Chest size :</p>
                  <p className="">{details.chest} inches</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium">Shoe size :</p>
                  <p className="">{details.shoes_size}</p>
                </div>
                {details.id_card !== null && (
                  <div className="grid grid-cols-2">
                    <p className="font-medium">ID Card:</p>
                    <p className="">
                      {details.id_card === "Yes" ? "Required" : "Not Required"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center my-2 mt-3 border-t pt-1">
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

export default PendingUniformRequest;
