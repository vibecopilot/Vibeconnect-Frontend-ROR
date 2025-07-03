import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import Table from "../../components/table/Table";
import { useSelector } from "react-redux";
import { getResignations } from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import SeparationDetails from "./Modals/SeparationDetails";

// Modal Component
const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Initiate Separation</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Employee Name *</label>
            <select className="border border-gray-300 rounded-lg p-2 w-full">
              <option>Please Select Employee</option>
              {/* Add employee options here */}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SeparationCompleted = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
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
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
    },
    {
      name: "Resignation Date",
      selector: (row) => row.resignation_application_date,
      sortable: true,
    },
    {
      name: "Last Working Date",
      selector: (row) => row.requested_last_working_date,
      sortable: true,
    },
    {
      name: "Separation Reason",
      selector: (row) => row.separation_reason,
      sortable: true,
    },
    {
      name: "Separation Status",
      selector: (row) => row.status,
      sortable: true,
    },
    // {
    //   name: "FnF Status",
    //   selector: (row) => row.Leave_Days,
    //   sortable: true,
    // },
  ];

  const [filteredResignationData, setFilteredResignationData] = useState([]);
  const [resignationData, setResignationData] = useState([]);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const fetchResignations = async () => {
    try {
      const res = await getResignations(hrmsOrgId);
      const pendingSeparation = res.filter(
        (separation) => separation.status !== "Pending"
      );
      setFilteredResignationData(pendingSeparation);
      setResignationData(pendingSeparation);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchResignations();
  }, []);

  const [showRegModal, setShowRegModal] = useState(false);
  const [regId, setRegId] = useState("");
  const [empId, setEmpId] = useState("");
  const handleDetails = async (id, empId) => {
    setShowRegModal(true);
    setRegId(id);
    setEmpId(empId);
  };
  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredResignationData(resignationData);
    } else {
      const filtered = resignationData.filter((item) =>
        item.employee_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResignationData(filtered);
    }
  };
  return (
    <section className="flex">
      <div className="w-full flex m-2 flex-col overflow-hidden">
        <div className="flex gap-2  my-2">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-400 w-full placeholder:text-sm rounded-md p-2"
            onChange={handleSearch}
            value={searchText}
          />
        </div>
        {isModalOpen1 && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
            <div className="bg-white p-5 rounded-md shadow-md w-1/3">
              {/* <h1 className="text-xl font-bold mb-4">Bulk Upload Contract Agreement Document</h1> */}
              <div className="mb-4">
                <label
                  htmlFor="departmentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Separation Reason
                </label>
                <select
                  type="text"
                  id="departmentName"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                  placeholder=""
                >
                  <option value="">Better Opportunity-compensation</option>
                  <option value="">Better Opportunity-Job Role</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Separation Status
                </label>
                <select
                  type="text"
                  id="departmentName"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                  placeholder=""
                >
                  <option value="">Level 1 Approval Pending</option>
                  <option value="">Level 2 Approval Pending</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="headOfDepartment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Branch Location
                </label>
                <select
                  id="headOfDepartment"
                  className="mt-1 block w-full border border-gray-400 p-2 rounded-md"
                >
                  <option value="">Mumbai</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen1(false)}
                  className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2"
                >
                  Clear
                </button>
                <button
                  // onClick={handleAddDepartment}
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
        <Table
          columns={columns}
          data={filteredResignationData}
          isPagination={true}
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
      {showRegModal && (
        <SeparationDetails
          empId={empId}
          regId={regId}
          onClose={() => setShowRegModal(false)}
          page={"completed"}
        />
      )}
    </section>
  );
};

export default SeparationCompleted;