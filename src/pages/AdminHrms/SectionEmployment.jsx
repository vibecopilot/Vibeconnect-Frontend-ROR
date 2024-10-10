import React, { useState, useRef, useEffect } from "react";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import Table from "../../components/table/Table";
import { Link, useParams } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import Collapsible from "react-collapsible";
import CustomTrigger from "../../containers/CustomTrigger";
import { getItemInLocalStorage } from "../../utils/localStorage";
import {
  editEmployeeEmploymentDetails,
  getEmployeeEmploymentDetails,
  getMyHRMSEmployees,
  getMyOrganizationLocations,
  getMyOrgDepartments,
  postEmployeeEmploymentInfo,
} from "../../api";
import toast from "react-hot-toast";
const SectionsEmployment = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing(!isEditing);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const openModal1 = () => setModalIsOpen1(true);
  const closeModal1 = () => setModalIsOpen1(false);
  const openModal2 = () => setModalIsOpen2(true);
  const closeModal2 = () => setModalIsOpen2(false);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeCode: "",
    joinDate: "",
    employmentType: "",
    probationDueDate: "",
    branch: "",
    department: "",
    designation: "",
    supervisor: "",
    id: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationRes = await getMyOrganizationLocations(hrmsOrgId);
        setLocations(locationRes);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDepartments = async () => {
      try {
        const departmentRes = await getMyOrgDepartments(hrmsOrgId);
        setDepartments(departmentRes);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchEmployees = async () => {
      try {
        const employeeRes = await getMyHRMSEmployees(hrmsOrgId);
        setEmployees(employeeRes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocations();
    fetchDepartments();
    fetchEmployees();
  }, []);

  const column = [
    {
      name: "view",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={openModal2}>
            <BsEye size={15} />
          </button>
        </div>
      ),
    },

    { name: "Effective From", selector: (row) => row.from, sortable: true },
    { name: "Effective To", selector: (row) => row.to, sortable: true },
    {
      name: "Confirmation Due Date",
      selector: (row) => row.due_date,
      sortable: true,
    },

    { name: "Confirmation Date", selector: (row) => row.date, sortable: true },
    {
      name: "Employment Status",
      selector: (row) => row.estatus,
      sortable: true,
    },
  ];
  const column1 = [
    {
      name: "view",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={openModal1}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },

    { name: "Effective From", selector: (row) => row.from, sortable: true },
    { name: "Effective To", selector: (row) => row.to, sortable: true },
    { name: "Branch Location", selector: (row) => row.loc, sortable: true },

    { name: "Department", selector: (row) => row.dept, sortable: true },
    { name: "Designation", selector: (row) => row.desgn, sortable: true },
    {
      name: "Reporting Supervisor",
      selector: (row) => row.supervisior,
      sortable: true,
    },
  ];

  const data = [
    {
      from: "2/2/2024",
      to: "4/4/2024",
      date: "2/2/2024",
      due_date: "4/4/2024",
      estatus: "confirmed",
    },
  ];
  const data1 = [
    {
      from: "2/2/2024",
      to: "4/4/2024",
      loc: "Mumbai; Maharashtra",
      dept: "Marketing",
      desgn: "Digital Marketer",
      supervisior: "Mittu",
    },
  ];

  const fetchEmploymentDetails = async () => {
    try {
      const response = await getEmployeeEmploymentDetails(id);
      const res = response[0];
      setFormData({
        ...formData,
        employeeCode: res.employee_code,
        joinDate: res.joining_date,
        branch: res.branch_location,
        department: res.department,
        designation: res.designation,
        employmentType: res.employment_type,
        probationDueDate: res.probation_due_date,
        supervisor: res.reporting_supervisor,
        id: res.id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchEmploymentDetails();
  }, []);

  const handleEditEmployment = async () => {
    const postData = new FormData();
    postData.append("joining_date", formData.joinDate);
    postData.append("probation_due_date", formData.probationDueDate);
    postData.append("employee_code", formData.employeeCode);
    postData.append("employment_type", formData.employmentType);
    postData.append("branch_location", formData.branch);
    postData.append("department", formData.department);
    postData.append("reporting_supervisor", formData.supervisor);
    postData.append("designation", formData.designation);
    postData.append("employee", id);
    try {
      if (formData.id) {
        const res = await editEmployeeEmploymentDetails(formData.id, postData);
        console.log(res);
        // setDisableNext(false);
        toast.success("Employment details updated successfully");
        setIsEditing(false);
        fetchEmploymentDetails();
      } else {
        const res = await postEmployeeEmploymentInfo(postData);
        console.log(res);
        // setDisableNext(false);
        toast.success("Employment details updated successfully");
        setIsEditing(false);
        fetchEmploymentDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col ml-20">
      <EditEmployeeDirectory />
      <div className="flex">
        <div className="">
          <EmployeeSections empId={id} />
        </div>
        <div className="w-full p-2 bg-white rounded-lg ">
        {/* <div className="p-2 bg-white max-w-[60rem]"> */}
          <Collapsible
            readOnly
            trigger={
              <CustomTrigger isOpen={isOpen}>
                <h2 className="text-xl font-semibold ">Employment</h2>
              </CustomTrigger>
            }
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            className="bg-gray-100 my-4 p-2 rounded-md font-bold "
          >
            <div className="flex justify-end gap-2 ">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="border-2 rounded-full p-1 transition-all duration-150 hover:bg-opacity-30 border-green-400  px-4 text-green-400 mb-2 hover:bg-green-300 font-semibold  "
                    onClick={handleEditEmployment}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="border-2 rounded-full p-1 border-red-400  px-4 text-red-400 mb-2 hover:bg-opacity-30 hover:bg-red-300 font-semibold  "
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">
              General Employment Details
            </h3>
            <div className="grid md:grid-cols-2 gap-2 mt-5">
              <div className="grid gap-2 items-center ">
                <label htmlFor="companyName" className="font-semibold">
                  Employee Code:
                </label>
                <input
                  type="text"
                  id="companyName"
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  placeholder="Enter Employee code"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  name="employeeCode"
                  readOnly={!isEditing}
                />
              </div>

              <div className="grid gap-2 items-center ">
                <label htmlFor="jobTitle" className="font-semibold">
                  Joining Date:
                </label>
                <input
                  type="date"
                  id="jobTitle"
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  placeholder="Enter Job Title"
                  value={formData.joinDate}
                  onChange={handleChange}
                  name="joinDate"
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid gap-2 items-center">
                <label htmlFor="jobTitle" className="font-semibold">
                  Employment Type:
                </label>
                <select
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  value={formData.employmentType}
                  onChange={handleChange}
                  name="employmentType"
                  disabled={!isEditing}
                >
                  <option value="">Select Employment Type</option>
                  <option value="fullTime">Full Time</option>
                  <option value="partTime">Part Time</option>
                </select>
              </div>
              <div className="grid gap-2 items-center ">
                <label htmlFor="jobTitle" className="font-semibold">
                  Probation Due Date:
                </label>
                <input
                  type="date"
                  name="probationDueDate"
                  id=""
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  value={formData.probationDueDate}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid gap-2 items-center ">
                <label htmlFor="jobTitle" className="font-semibold">
                  Branch Location:
                </label>
                <select
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  value={formData.branch}
                  onChange={handleChange}
                  name="branch"
                  disabled={!isEditing}
                >
                  <option value="">Select Branch Location</option>
                  {locations?.map((location) => (
                    <option value={location.id} key={location.id}>
                      {location.location}, {location.city}, {location.state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 items-center ">
                <label htmlFor="jobTitle" className="font-semibold">
                  Department:
                </label>
                <select
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  value={formData.department}
                  onChange={handleChange}
                  name="department"
                  disabled={!isEditing}
                >
                  <option value="">Select Department</option>
                  {departments?.map((department) => (
                    <option value={department.id} key={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 items-center ">
                <label htmlFor="designation" className="font-semibold">
                  Designation:
                </label>
                <input
                  type="text"
                  id="designation"
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  placeholder="Enter Designation"
                  onChange={handleChange}
                  value={formData.designation}
                  name="designation"
                  readOnly={!isEditing}
                />
              </div>
              <div className="grid gap-2 items-center ">
                <label htmlFor="designation" className="font-semibold">
                  Reporting Supervisor:
                </label>
                <select
                  className={`mt-1 p-2  border rounded-md ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                  value={formData.supervisor}
                  onChange={handleChange}
                  name="supervisor"
                  disabled={!isEditing}
                >
                  <option value="">Select Supervisor</option>
                  {employees.map((employee) => (
                    <option value={employee.id} key={employee.id}>
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Collapsible>

          <Collapsible
            readOnly
            trigger={
              <CustomTrigger isOpen={isOpen}>
                <h2 className="text-xl font-semibold ">Employment Status</h2>
              </CustomTrigger>
            }
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            className="bg-gray-100 my-4 p-2 rounded-md font-bold "
          >
            <div className="flex justify-end ">
              <button
                onClick={openModal}
                className="bg-black text-white mb-2 hover:bg-gray-700 font-medium py-2 px-4 rounded"
              >
                Update Employment Status
              </button>
            </div>

            <Table columns={column} data={data} isPagination={true} />
          </Collapsible>
          <Collapsible
            readOnly
            trigger={
              <CustomTrigger isOpen={isOpen}>
                <h2 className="text-xl font-semibold">Job Information</h2>
              </CustomTrigger>
            }
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            className="bg-gray-100 my-4 p-2 rounded-md font-bold "
          >
            <div className="flex justify-end ">
              <button
                onClick={openModal1}
                className="bg-black text-white mb-2 hover:bg-gray-700 font-semibold py-1 px-4 rounded"
              >
                Update Position
              </button>
            </div>

            <Table columns={column1} data={data1} isPagination={true} />
          </Collapsible>
          {modalIsOpen && (
            <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
              <div class="max-h-screen  bg-white p-4 w-96 rounded-lg shadow-lg overflow-y-auto">
                <form>
                  <h2 className="text-xl font-medium mb-4">
                    Update Employment Status
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Please select Employment Status you wish to update <span className="text-red-500">*</span>
                    </label>
                    <select className="mt-1 p-2  border rounded-md w-full">
                      <option value="cash">Probation</option>
                      <option value="cash">Confirmed</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      What is the employee's confirmation due date? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Please enter comments, if any{" "}
                    </label>
                    <textarea
                      
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>

                  <div className="flex mt-2 justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="border-2 border-red-400 text-red-400 font-semibold p-1 px-4 rounded-full "
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-400 text-white font-semibold p-1 px-6 rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {modalIsOpen2 && (
            <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
              <div class="max-h-screen  bg-white p-8 w-96 rounded-lg shadow-lg overflow-y-auto">
                <form>
                  <h2 className="text-2xl font-bold mb-4">
                    Employment Status and Comment History
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Effective From{" "}
                    </label>

                    <input
                      type="date"
                      value={2 / 2 / 2024}
                      className="mt-1 p-2  border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirmation Date
                    </label>

                    <input
                      type="date"
                      value={2 / 2 / 2024}
                      className="mt-1 p-2  border rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Employment Status{" "}
                    </label>
                    <select className="mt-1 p-2  border rounded-md">
                      <option value="cash">Probation</option>
                      <option value="cash">Confirmed</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Comments and History{" "}
                    </label>
                    {/* <textarea type="date" className="mt-1 p-2  border rounded-md"/> */}
                  </div>

                  <div className="flex mt-2 justify-end">
                    <button
                      type="button"
                      onClick={closeModal2}
                      className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-black p-2 rounded-md text-black mr-4"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {modalIsOpen1 && (
            <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
              <div class="max-h-screen bg-white p-8 w-96 rounded-lg shadow-lg overflow-y-auto">
                <form>
                  <h2 className="text-2xl font-bold mb-4">Job Information</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Effective From *{" "}
                    </label>
                    <input
                      type="date"
                      className="mt-1 p-2  border rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Branch Location *
                    </label>
                    <select className="mt-1 p-2  border rounded-md" />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department *{" "}
                    </label>
                    <select className="mt-1 p-2  border rounded-md">
                      <option>HR</option>
                    </select>
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Designation *{" "}
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2  border rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Reporting supervisor{" "}
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2  border rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Comment{" "}
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2  border rounded-md"
                    />
                  </div>

                  <div className="flex mt-2 justify-end">
                    <button
                      type="button"
                      onClick={closeModal1}
                      className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all border-black p-2 rounded-md text-black mr-4"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white font-semibold p-2 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionsEmployment;
