import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import {
  getAdminAccess,
  getEmployeeAssociatedSites,
  getEmployeeDetails,
  getMyHRMSEmployees,
  getMyOrganizationLocations,
  getMyOrgDepartments,
  getReportingSupervisors,
  hrmsDomain,
  postApproveOrRejectEmployee,
  postEmployeeEmploymentInfo,
} from "../../../api";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import toast from "react-hot-toast";

const OnboardingEmployeeDetail = ({
  setDetailsModal,
  empId,
  grantId,
  fetchApprovalNotification,
}) => {
  const [details, setDetails] = useState({});
  const [siteDetails, setSiteDetails] = useState({});
  const fetchEmployeeDetails = async () => {
    try {
      const res = await getEmployeeDetails(empId);
      setDetails(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchEmployeeSiteDetails = async () => {
    try {
      const res = await getEmployeeAssociatedSites(empId);
      setSiteDetails(res[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchEmployeeDetails();
    fetchEmployeeSiteDetails();
  }, []);

  const [formData, setFormData] = useState({
    employeeCode: "",
    joinDate: "",
    employmentType: "",
    probationDueDate: "",
    branch: "",
    department: "",
    designation: "",
    supervisor: "",
    monthlyCTC: "",
  });
  console.log(formData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const approverID = getItemInLocalStorage("APPROVERID");

  const handleGrantApproval = async (notiId, decision) => {
    try {
      const payload = {
        approver_id: approverID,
        action: decision,
      };
      await postApproveOrRejectEmployee(notiId, payload);
      fetchApprovalNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const [reportSupervisors, setReportSupervisors] = useState([]);

  const handleDepartmentChange = async (e) => {
    const fetchReportingSupervisors = async (deptId) => {
      const reportingSupervisors = await getReportingSupervisors(
        deptId,
        hrmsOrgId
      );
      console.log(reportingSupervisors);
      reportingSupervisors.forEach((department) => {
        setReportSupervisors(department.reporting_supervisor);
      });
      // setParentAsset(parentAssetResp.data.site_assets);
    };

    if (e.target.type === "select-one" && e.target.name === "department") {
      const departmentId = Number(e.target.value);
      await fetchReportingSupervisors(departmentId);

      setFormData({
        ...formData,
        department: departmentId,
      });
    }
  };

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
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

  const handleAddEmployment = async () => {
    if (!formData.joinDate) {
      toast.error("Joining Date is required!");
      return;
    }
    if (!formData.employmentType) {
      toast.error("Employment Type is required!");
      return;
    }

    const postData = new FormData();
    postData.append("employee_code", formData.employeeCode);
    postData.append("joining_date", formData.joinDate);
    postData.append("employment_type", formData.employmentType);
    postData.append("probation_due_date", formData.probationDueDate);
    postData.append("branch_location", formData.branch);
    postData.append("department", formData.department);
    postData.append("reporting_supervisor", formData.supervisor);
    postData.append("designation", formData.designation);
    postData.append("ctc_months", formData.monthlyCTC);
    postData.append("employee", empId);
    try {
      const res = await postEmployeeEmploymentInfo(postData);
      console.log(res);
      handleGrantApproval(grantId, "approve");
      toast.success("Employee Onboarded successfully");
      setDetailsModal();
    } catch (error) {
      console.log(error);
    }
  };

  const employeeId = getItemInLocalStorage("APPROVERID");
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="max-h-screen bg-white p-4  rounded-xl shadow-lg overflow-y-auto">
        <div className="flex justify-center mb-2">
          <img
            src={hrmsDomain + details?.profile_photo}
            alt={details?.employee?.first_name}
            className="border-4 border-gray-300 rounded-full w-28 h-28 object-cover"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-2 border bg-blue-50 rounded-md p-2">
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Name : 
            </label>
            <p>
              {details?.first_name} {details?.last_name}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              DOB :{" "}
            </label>
            <p>{details?.date_of_birth}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Gender :{" "}
            </label>
            <p>{details?.gender}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Mobile :{" "}
            </label>
            <p>{details?.mobile}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Aadhar :{" "}
            </label>
            <p>{details?.aadhar_number}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Pan :{" "}
            </label>
            <p>{details?.pan}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Site :{" "}
            </label>
            <p>{siteDetails?.associated_organization_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Site ID :{" "}
            </label>
            <p>{siteDetails?.associated_organization}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label htmlFor="" className="font-medium">
              Email :{" "}
            </label>
            <p>{details?.email_id}</p>
          </div>
        </div>
        <div className="w-full p-2 bg-white rounded-lg ">
          <h2 className="border-b  text-xl border-black mb-2 font-bold mt-2">
            Employment Information
          </h2>
          <div className="grid md:grid-cols-3 gap-2 ">
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="companyName" className="font-semibold">
                Employee Code:
              </label>
              <input
                type="text"
                id="companyName"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter Employee code"
                value={formData.employeeCode}
                onChange={handleChange}
                name="employeeCode"
              />
            </div>

            <div className="grid gap-2 items-center w-full">
              <label htmlFor="jobTitle" className="font-semibold">
                Joining Date:<span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="jobTitle"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter Job Title"
                value={formData.joinDate}
                onChange={handleChange}
                name="joinDate"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="jobTitle" className="font-semibold">
                Employment Type:<span className="text-red-400">*</span>
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md"
                value={formData.employmentType}
                onChange={handleChange}
                name="employmentType"
              >
                <option value="">Select Employment Type</option>
                <option value="fullTime">Full Time</option>
                <option value="partTime">Part Time</option>
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="jobTitle" className="font-semibold">
                Probation Due Date:
              </label>
              <input
                type="date"
                name="probationDueDate"
                id=""
                className="border border-gray-400 p-2 rounded-md"
                value={formData.probationDueDate}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="jobTitle" className="font-semibold">
                Branch Location:
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md"
                value={formData.branch}
                onChange={handleChange}
                name="branch"
              >
                <option value="">Select Branch Location</option>
                {locations?.map((location) => (
                  <option value={location.id} key={location.id}>
                    {location.location}, {location.city}, {location.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="jobTitle" className="font-semibold">
                Department:
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md"
                value={formData.department}
                onChange={handleDepartmentChange}
                name="department"
              >
                <option value="">Select Department</option>
                {departments?.map((department) => (
                  <option value={department.id} key={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="designation" className="font-semibold">
                Designation:
              </label>
              <input
                type="text"
                id="designation"
                className="border border-gray-400 p-2 rounded-md"
                placeholder="Enter Designation"
                onChange={handleChange}
                value={formData.designation}
                name="designation"
              />
            </div>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="designation" className="font-semibold">
                Reporting Supervisor:
              </label>
              <select
                className="border border-gray-400 p-2 rounded-md"
                value={formData.supervisor}
                onChange={handleChange}
                name="supervisor"
              >
                <option value="">Select Supervisor</option>
                {reportSupervisors.map((supervisor) => (
                  <option value={supervisor.id} key={supervisor.id}>
                    {supervisor.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 items-center w-full">
              <label htmlFor="CTC" className="font-semibold">
                Enter Monthly CTC:
              </label>
              <input
                type="text"
                name="monthlyCTC"
                value={formData.monthlyCTC}
                onChange={handleChange}
                id="CTC"
                placeholder="Enter Monthly CTC"
                className="border border-gray-400 p-2 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 border-t p-2">
          {roleAccess?.can_approve_reject_onboarding_request && (
            <button
              className="flex items-center gap-2 bg-green-400 p-2 px-4 rounded-full text-white"
              onClick={handleAddEmployment}
            >
              <FaCheck /> Submit & Approve
            </button>
          )}
          <button
            onClick={setDetailsModal}
            className="flex items-center gap-2 bg-red-400 p-2 rounded-full text-white px-4"
          >
            <MdClose /> Close
          </button>
        </div>
      </div>{" "}
    </div>
  );
};

export default OnboardingEmployeeDetail;
