import React, { useEffect, useState } from "react";
import Table from "../../../components/table/Table";
import {
  getEmployeeAssociatedSites,
  getEmployeeDetails,
  getUniformRequest,
  getUniformRequestDetails,
  hrmsDomain,
  getAssociatedSites,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { dateFormatSTD } from "../../../utils/dateUtils";
import { BsEye } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import Accordion from "../Components/Accordion";
import { FaRegAddressCard } from "react-icons/fa";
import { CustomDropdown } from "../../../utils/CustomDropdown";

const CompletedUniformRequest = () => {
  const columns = [
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
    //   selector: (row) => row.comment,
    //   sortable: true,
    // },
    {
      name: "Applied on",
      selector: (row) => dateFormatSTD(row.created_date),
      sortable: true,
    },
    {
      name: "Received on",
      selector: (row) =>
        row.received_date ? dateFormatSTD(row.received_date) : "",
      sortable: true,
    },

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
          onClick={() => handleDetails(row.id, row.employee)}
        >
          <button>
            <BsEye size={15} />
          </button>
        </div>
      ),
    },
  ];
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const orgId = getItemInLocalStorage("HRMSORGID");

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const fetchUniformRequests = async () => {
    try {
      const res = await getUniformRequest(hrmsOrgId);
      const filteredData = res.filter((item) => item.status !== "Pending");
      console.log(filteredData);
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

  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState({});
  const handleDetails = async (id, empID) => {
    setShowDetails(true);
    fetchEmployeeDetails(empID);
    fetchEmployeeAssociatedSite(empID);
    try {
      const res = await getUniformRequestDetails(id);
      setDetails(res);
    } catch (error) {
      console.log(error);
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

  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredRequests(requests);
    } else {
      const filteredResult = requests.filter(
        (employee) =>
          employee.employee_name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          employee.associated_organization_name
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      );
      setFilteredRequests(filteredResult);
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
      setEmpSiteDetails(res[0]);
    } catch (error) {
      console.log(error);
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
          {/* DROPDOWN */}
          {/* <select
            onChange={handleDropdownChange}
            className="border border-gray-400 w-full placeholder:text-sm rounded-lg p-2"
            value={selectedSite}
          >
            <option value="All">All Sites</option>
            {allSites.map((site, index) => (
              <option key={index} value={site}>
                {site}
              </option>
            ))}
          </select> */}

          <CustomDropdown
            AllSites={allSites}
            selectedValue={selectedSite}
            onSelect={(site) =>
              site.site_name === "Select All Sites"
                ? setSelectedSite(null) // Reset filter
                : setSelectedSite(site)
            }
          />
        </div>
        {/* <div className="flex gap-2"></div> */}
        <Table
          columns={columns}
          data={filteredRequests}
          isPagination={true}
          selectableRows={true}
        />
      </div>
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
                {details.received_date && (
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Received on :</p>
                    <p className="">{dateFormatSTD(details.received_date)}</p>
                  </div>
                )}
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
                  <p className="font-medium">Waist size :</p>
                  <p className="">{details.waist} inches</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium">Chest size :</p>
                  <p className="">{details.chest} inches</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="font-medium">Shoe size :</p>
                  <p className="">
                    {details.shoes_size ? details.shoes_size : "-"}{" "}
                  </p>
                </div>
                {details?.id_card !== null && (
                  <div className="grid grid-cols-2">
                    <p className="font-medium">ID Card:</p>
                    <p className="">
                      {details?.id_card === "Yes" ? "Required" : "Not Required"}
                    </p>
                  </div>
                )}
              </div>
              {details.received_date && (
                <div className="bg-blue-50 grid grid-cols-2 p-2 rounded-md my-1">
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Uniform :</p>
                    {details.received_uniform ? (
                      <p className="text-green-400 font-medium">Received</p>
                    ) : (
                      <p className="text-red-400 font-medium">Not Received</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Shoe :</p>
                    {details.received_shoes ? (
                      <p className="text-green-400 font-medium">Received</p>
                    ) : (
                      <p className="text-red-400 font-medium">Not Received</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">ID Card :</p>
                    {details.received_idcard ? (
                      <p className="text-green-400 font-medium">Received</p>
                    ) : (
                      <p className="text-red-400 font-medium">Not Received</p>
                    )}
                  </div>
                </div>
              )}
              {details.received_date && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium border-b">Attachment</p>
                  {details?.photo !== null ? (
                    <a
                      href={hrmsDomain + details?.photo}
                      target="_blank"
                      className="h-32 w-36 rounded-md"
                    >
                      <img
                        src={hrmsDomain + details?.photo}
                        alt=""
                        className="h-40 w-40 rounded-md"
                      />
                    </a>
                  ) : (
                    <p className="text-center">No Attachments</p>
                  )}
                </div>
              )}
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

export default CompletedUniformRequest;
