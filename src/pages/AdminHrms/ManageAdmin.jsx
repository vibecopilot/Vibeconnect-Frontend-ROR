import React, { useEffect, useState } from "react";
import { PiPlus, PiPlusCircle } from "react-icons/pi";
import Table from "../../components/table/Table";
import { GrHelpBook } from "react-icons/gr";
import { BiEdit } from "react-icons/bi";
import UserDetailsList from "./UserDetailsList";
import { FaCheck, FaTrash } from "react-icons/fa";
import {
  deleteManageAdmin,
  editManageAdminDetails,
  getManageAdmin,
  getManageAdminDetails,
  getMyHRMSAdmins,
  getMyHRMSEmployees,
  postManageAdmin,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import Select from "react-select";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Switch } from "antd";
import Organisation from "../SubPages/Organisation";
import { MdClose } from "react-icons/md";
// import { Switch } from "@material-tailwind/react";
const ManageAdmin = () => {
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedUserOption, setSelectedUserOption] = useState(null);
  const [filteredAdmin, setFilteredAdmin] = useState([]);
  const handleUserChangeSelect = (selectedOption) => {
    setSelectedUserOption(selectedOption);
  };

  const listItemStyle = {
    listStyleType: "disc",
    color: "black",
    fontSize: "14px",
    fontWeight: 500,
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row?.employee_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email_id,
      sortable: true,
      width: "250px",
    },
    {
      name: "Type Of Access",
      selector: (row) => row.access,
      sortable: true,
    },
    {
      name: "Actions",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleEditModal(row.id)}>
            <BiEdit size={15} />
          </button>
          <button
            //to={`/admin/edit-templates/${row.id}`}
            onClick={() => handleDeleteAdmin(row.id)}
            className="text-red-400"
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleDeleteAdmin = async (adminId) => {
    try {
      await deleteManageAdmin(adminId);
      fetchAllAdmin();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const res = await getMyHRMSAdmins(hrmsOrgId);

      const employeesList = res.map((emp) => ({
        value: emp.id,
        label: `${emp.first_name} ${emp.last_name}`,
      }));

      setEmployees(employeesList);
    } catch (error) {
      console.log(error);
    }
  };

  const [AdminList, setAdminList] = useState([]);
  const fetchAllAdmin = async () => {
    try {
      const adminRes = await getManageAdmin(hrmsOrgId);
      setAdminList(adminRes);
      setFilteredAdmin(adminRes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllAdmin();
    fetchAllEmployees();
  }, []);
  const [access, setAccess] = useState("");
  const [role, setRole] = useState("");

  const handleAddAdminAccess = async () => {
    const postData = new FormData();
    postData.append("organization", hrmsOrgId);
    postData.append("access", access);
    postData.append("role", role);
    if (access === "Full Access") {
      Object.keys(permissionAllowed).forEach((key) => {
        postData.append(key, true);
      });
    } else {
      Object.keys(permissionAllowed).forEach((key) => {
        postData.append(key, permissionAllowed[key]);
      });
    }
    if (access === "Full Access") {
      Object.keys(employeePermission).forEach((key) => {
        postData.append(key, true);
      });
    } else {
      Object.keys(employeePermission).forEach((key) => {
        postData.append(key, employeePermission[key]);
      });
    }
    if (access === "Full Access") {
      Object.keys(attendancePermission).forEach((key) => {
        postData.append(key, true);
      });
    } else {
      Object.keys(attendancePermission).forEach((key) => {
        postData.append(key, attendancePermission[key]);
      });
    }
    if (access === "Full Access") {
      Object.keys(rosterPermission).forEach((key) => {
        postData.append(key, true);
      });
    } else {
      Object.keys(rosterPermission).forEach((key) => {
        postData.append(key, rosterPermission[key]);
      });
    }
    if (access === "Full Access") {
      Object.keys(leavePermission).forEach((key) => {
        postData.append(key, true);
      });
    } else {
      Object.keys(leavePermission).forEach((key) => {
        postData.append(key, leavePermission[key]);
      });
    }
    //
    if (selectedUserOption && selectedUserOption.value) {
      postData.append("name", selectedUserOption.value);
    } else {
      toast.error("No user selected.");
    }
    try {
      const res = await postManageAdmin(postData);
      setShowModal(false);
      fetchAllAdmin();
      toast.success("Admin access right added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Please try again ");
    }
  };
  const [adminId, setAdminId] = useState("");
  const handleEditModal = async (id) => {
    setShowModal1(true);
    setAdminId(id);
    try {
      const res = await getManageAdminDetails(id);
      setAccess(res.access);
      setRole(res.role);
      // const admin = employees.find((employee) => employee.value === res.name);
      const admin = employees.find(
        (employee) => String(employee.value) === String(res.name)
      );

      console.log(admin);
      setSelectedUserOption(admin || null);
      const updatedPermissions = { ...permissionAllowed };
      Object.keys(permissionAllowed).forEach((key) => {
        if (res[key] !== undefined) {
          updatedPermissions[key] = res[key];
        }
      });
      setPermissionAllowed(updatedPermissions);

      const updatedEmployeePermissions = { ...employeePermission };
      Object.keys(employeePermission).forEach((key) => {
        if (res[key] !== undefined) {
          updatedEmployeePermissions[key] = res[key];
        }
      });
      setEMployeePermission(updatedEmployeePermissions);

      const updatedAttendancePermissions = { ...attendancePermission };
      Object.keys(attendancePermission).forEach((key) => {
        if (res[key] !== undefined) {
          updatedAttendancePermissions[key] = res[key];
        }
      });
      setAttendancePermission(updatedAttendancePermissions);

      const updatedRosterPermission = { ...rosterPermission };
      Object.keys(rosterPermission).forEach((key) => {
        if (res[key] !== undefined) {
          updatedRosterPermission[key] = res[key];
        }
      });
      setRosterPermission(updatedRosterPermission);

      const updatedLeavePermission = { ...leavePermission };
      Object.keys(leavePermission).forEach((key) => {
        if (res[key] !== undefined) {
          updatedLeavePermission[key] = res[key];
        }
      });
      setLeavePermission(updatedLeavePermission);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAdmin = async () => {
    const editData = new FormData();
    editData.append("name", selectedUserOption.value);
    editData.append("role", role);
    editData.append("access", access);
    editData.append("organization", hrmsOrgId);
    try {
      const res = await editManageAdminDetails(adminId, editData);
      toast.success("Admin access updated successfully");
      setShowModal1(false);
      fetchAllAdmin();
    } catch (error) {
      console.log(error);
    }
  };
  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredAdmin(AdminList);
    } else {
      const filteredResult = AdminList.filter((admin) =>
        `${admin.first_name} ${admin.last_name}`
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setFilteredAdmin(filteredResult);
    }
  };
  const themeColor = useSelector((state) => state.theme.color);
  const [permissionAllowed, setPermissionAllowed] = useState({
    organization_permissions: false,
    can_edit_organization_details: false,
    can_edit_address_info: false,
    can_add_edit_locations: false,
    can_add_edit_department: false,
    can_add_edit_associated_sites: false,
    can_add_edit_company_holiday: false,
    can_add_edit_bank_account: false,
    can_add_edit_admins: false,
  });
  const [employeePermission, setEMployeePermission] = useState({
    employee_permissions: false,
    can_edit_employee: false,
    can_delete_employee: false,
    can_approve_reject_onboarding_request: false,
    can_add_employee: false,
    can_approve_reject_uniform_request: false,
    can_approve_reject_separation_request: false,
    can_initiate_separation: false,
  });
  const [attendancePermission, setAttendancePermission] = useState({
    attendance_permissions: false,
    can_approve_reject_regularisation: false,
    can_apply_regularization_on_behalf_of_employee: false,
  });
  const [rosterPermission, setRosterPermission] = useState({
    roster_permissions: false,
    can_assign_edit_delete_shifts: false,
    can_edit_delete_roster_shift: false,
  });
  const [leavePermission, setLeavePermission] = useState({
    leave_permissions: false,
    can_add_leave_on_behalf_of_employee: false,
    can_add_edit_delete_leave_category: false,
    can_approve_reject_leave: false,
  });
  const permissionLabels = [
    {
      key: "can_edit_basic_info",
      label: "Can edit Organization details",
    },
    { key: "can_edit_address_info", label: "Can edit address info" },
    { key: "can_add_edit_locations", label: "Can add/edit Locations" },
    { key: "can_add_edit_department", label: "Can add/edit Department" },
    {
      key: "can_add_edit_associated_sites",
      label: "Can add/edit Associated Sites",
    },
    {
      key: "can_add_edit_company_holiday",
      label: "Can add/edit Company holiday",
    },
    { key: "can_add_edit_bank_account", label: "Can add/edit Bank account" },
    { key: "can_add_edit_admins", label: "Can add/edit Admins" },
  ];

  const employeePermissionLabel = [
    { key: "can_add_employee", label: "Can add employee" },
    { key: "can_edit_employee", label: "Can edit employee details" },
    { key: "can_delete_employee", label: "Can delete employee " },
    {
      key: "can_approve_reject_onboarding_request",
      label: "Can approve/reject Onboarding Request",
    },
    {
      key: "can_approve_reject_uniform_request",
      label: "Can approve/reject Uniform Request",
    },
    {
      key: "can_approve_reject_separation_request",
      label: "Can approve/reject Separation Request",
    },
    {
      key: "can_initiate_separation",
      label: "Can Initiate Separation Request",
    },
  ];
  const attendancePermissionLabel = [
    {
      key: "can_approve_reject_regularisation",
      label: "Can approve/reject regularisation",
    },
    {
      key: "can_apply_regularization_on_behalf_of_employee",
      label: "Can apply regularization on behalf of employee",
    },
  ];
  const RosterPermissionLabel = [
    {
      key: "can_assign_edit_delete_shifts",
      label: "Can assign/edit/delete shift",
    },
    {
      key: "can_edit_delete_roster_shift",
      label: "Can add/edit/delete Roster shift",
    },
  ];
  const LeavePermissionLabel = [
    {
      key: "can_add_leave_on_behalf_of_employee",
      label: "Can Add Leave on behalf of employee",
    },
    {
      key: "can_add_edit_delete_leave_category",
      label: "Can add/edit/delete Leave Category",
    },
    {
      key: "can_approve_reject_leave",
      label: "Can approve/reject leave application",
    },
  ];
  console.log(permissionAllowed);
  return (
    <section className="flex gap-1 ml-20">
      <UserDetailsList />
      <div className=" w-2/3 flex m-2 flex-col overflow-hidden">
        <div className="flex justify-between gap-2 mt-8 mb-2">
          <input
            type="text"
            placeholder="Search by name "
            className="border border-gray-400 w-full placeholder:text-sm rounded-lg p-2"
            value={searchText}
            onChange={handleSearch}
          />
          <button
            onClick={() => setShowModal(true)}
            style={{ background: themeColor }}
            className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all p-2 rounded-lg text-white cursor-pointer text-center flex items-center gap-2 justify-center"
          >
            <PiPlusCircle size={20} />
            Add
          </button>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-xl">
              <h1 className="text-lg font-semibold border-b flex items-center gap-2 justify-center">
                <PiPlusCircle /> Add Manage Administrator
              </h1>
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto hide-scrollbar">
                <div className="flex flex-col col-span-3">
                  <label className="block text-gray-700 font-medium ">
                    Select Admin :
                  </label>
                  <Select
                    options={employees}
                    noOptionsMessage={() => "No Admin Available"}
                    onChange={handleUserChangeSelect}
                    placeholder="Select Admin"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="block text-gray-700  font-medium">
                    Role :
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    id=""
                    className="border border-gray-300 p-2 rounded w-full"
                    placeholder="Enter Role"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="block text-gray-700  font-medium">
                    Type of access :
                  </label>
                  <select
                    name="type"
                    className="border border-gray-300 p-2 rounded w-full"
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                  >
                    <option value="">Select Access</option>
                    <option value="Full Access">Full Access</option>
                    <option value="Restricted Access">Restricted Access</option>
                  </select>
                </div>
                <div className="col-span-3">
                  {access === "Restricted Access" && (
                    <div className="max-w-full mx-auto">
                      <h1 className="text-lg border-b font-medium mb-1 text-gray-700">
                        Access Permissions
                      </h1>

                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Organization</span>
                          <Switch
                            checked={permissionAllowed.organization_permissions}
                            onChange={() =>
                              setPermissionAllowed((prev) => ({
                                ...prev,
                                organization_permissions:
                                  !prev.organization_permissions,
                              }))
                            }
                          />
                        </div>
                        {permissionAllowed.organization_permissions && (
                          <div className="border rounded-b-md">
                            {permissionLabels.map((permission, index) => (
                              <div
                                key={index}
                                className="p-4 flex justify-between items-center border-b last:border-b-0"
                              >
                                <span className="text-gray-700">
                                  {permission.label}
                                </span>
                                <Switch
                                  checked={permissionAllowed[permission.key]}
                                  onChange={() =>
                                    setPermissionAllowed((prev) => ({
                                      ...prev,
                                      [permission.key]: !prev[permission.key],
                                    }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Employee</span>
                          <Switch
                            checked={employeePermission.employee_permissions}
                            onChange={() =>
                              setEMployeePermission((employeePermission) => ({
                                ...employeePermission,
                                employee_permissions:
                                  !employeePermission.employee_permissions,
                              }))
                            }
                          />
                        </div>
                        {employeePermission.employee_permissions && (
                          <div className="border rounded-b-md">
                            {employeePermissionLabel.map(
                              (permission, index) => (
                                <div
                                  key={index}
                                  className="p-4 flex justify-between items-center border-b last:border-b-0"
                                >
                                  <span className="text-gray-700">
                                    {permission.label}
                                  </span>
                                  <Switch
                                    checked={employeePermission[permission.key]}
                                    onChange={() =>
                                      setEMployeePermission((prev) => ({
                                        ...prev,
                                        [permission.key]: !prev[permission.key],
                                      }))
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Attendance</span>
                          <Switch
                            checked={
                              attendancePermission.attendance_permissions
                            }
                            onChange={() =>
                              setAttendancePermission(
                                (attendancePermission) => ({
                                  ...attendancePermission,
                                  attendance_permissions:
                                    !attendancePermission.attendance_permissions,
                                })
                              )
                            }
                          />
                        </div>
                        {attendancePermission.attendance_permissions && (
                          <div className="border rounded-b-md">
                            {attendancePermissionLabel.map(
                              (permission, index) => (
                                <div
                                  key={index}
                                  className="p-4 flex justify-between items-center border-b last:border-b-0"
                                >
                                  <span className="text-gray-700">
                                    {permission.label}
                                  </span>
                                  <Switch
                                    checked={
                                      attendancePermission[permission.key]
                                    }
                                    onChange={() =>
                                      setAttendancePermission((prev) => ({
                                        ...prev,
                                        [permission.key]: !prev[permission.key],
                                      }))
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Roster</span>
                          <Switch
                            checked={rosterPermission.roster_permissions}
                            onChange={() =>
                              setRosterPermission((rosterPermission) => ({
                                ...rosterPermission,
                                roster_permissions:
                                  !rosterPermission.roster_permissions,
                              }))
                            }
                          />
                        </div>
                        {rosterPermission.roster_permissions && (
                          <div className="border rounded-b-md">
                            {RosterPermissionLabel.map((permission, index) => (
                              <div
                                key={index}
                                className="p-4 flex justify-between items-center border-b last:border-b-0"
                              >
                                <span className="text-gray-700">
                                  {permission.label}
                                </span>
                                <Switch
                                  checked={rosterPermission[permission.key]}
                                  onChange={() =>
                                    setRosterPermission((prev) => ({
                                      ...prev,
                                      [permission.key]: !prev[permission.key],
                                    }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Leave</span>
                          <Switch
                            checked={leavePermission.leave_permissions}
                            onChange={() =>
                              setLeavePermission((leavePermission) => ({
                                ...leavePermission,
                                leave_permissions:
                                  !leavePermission.leave_permissions,
                              }))
                            }
                          />
                        </div>
                        {leavePermission.leave_permissions && (
                          <div className="border rounded-b-md">
                            {LeavePermissionLabel.map((permission, index) => (
                              <div
                                key={index}
                                className="p-4 flex justify-between items-center border-b last:border-b-0"
                              >
                                <span className="text-gray-700">
                                  {permission.label}
                                </span>
                                <Switch
                                  checked={leavePermission[permission.key]}
                                  onChange={() =>
                                    setLeavePermission((prev) => ({
                                      ...prev,
                                      [permission.key]: !prev[permission.key],
                                    }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-2 border-t mt-1 p-1">
                <button
                  className=" bg-red-500 text-white py-2 px-4 rounded-full flex items-center gap-2"
                  onClick={() => setShowModal(false)}
                >
                  <MdClose /> Close
                </button>
                <button
                  className=" bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2"
                  onClick={handleAddAdminAccess}
                >
                  <FaCheck /> Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {showModal1 && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-xl">
              <h1 className="text-lg font-semibold border-b flex items-center gap-2 justify-center">
                <BiEdit /> Edit Manage Administrator
              </h1>
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto hide-scrollbar">
                <div className="flex flex-col col-span-3">
                  <label className="block text-gray-700 font-medium ">
                    Select Admin :
                  </label>
                  <Select
                    options={employees}
                    value={selectedUserOption}
                    noOptionsMessage={() => "No Admin Available"}
                    onChange={handleUserChangeSelect}
                    placeholder="Select Admin"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="block text-gray-700  font-medium">
                    Role :
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    id=""
                    className="border border-gray-300 p-2 rounded w-full"
                    placeholder="Enter Role"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="block text-gray-700  font-medium">
                    Type of access :
                  </label>
                  <select
                    name="type"
                    className="border border-gray-300 p-2 rounded w-full"
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                  >
                    <option value="">Select Access</option>
                    <option value="Full Access">Full Access</option>
                    <option value="Restricted Access">Restricted Access</option>
                  </select>
                </div>
                <div className="col-span-3">
                  {access === "Restricted Access" && (
                    <div className="max-w-full mx-auto">
                      <h1 className="text-lg border-b font-medium mb-1 text-gray-700">
                        Access Permissions
                      </h1>

                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Organization</span>
                          <Switch
                            checked={permissionAllowed.organization_permissions}
                            onChange={() =>
                              setPermissionAllowed((prev) => ({
                                ...prev,
                                organization_permissions:
                                  !prev.organization_permissions,
                              }))
                            }
                          />
                        </div>
                        {permissionAllowed.organization_permissions && (
                          <div className="border rounded-b-md">
                            {permissionLabels.map((permission, index) => (
                              <div
                                key={index}
                                className="p-4 flex justify-between items-center border-b last:border-b-0"
                              >
                                <span className="text-gray-700">
                                  {permission.label}
                                </span>
                                <Switch
                                  checked={permissionAllowed[permission.key]}
                                  onChange={() =>
                                    setPermissionAllowed((prev) => ({
                                      ...prev,
                                      [permission.key]: !prev[permission.key],
                                    }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Employee</span>
                          <Switch
                            checked={employeePermission.employee_permissions}
                            onChange={() =>
                              setEMployeePermission((employeePermission) => ({
                                ...employeePermission,
                                employee_permissions:
                                  !employeePermission.employee_permissions,
                              }))
                            }
                          />
                        </div>
                        {employeePermission.employee_permissions && (
                          <div className="border rounded-b-md">
                            {employeePermissionLabel.map(
                              (permission, index) => (
                                <div
                                  key={index}
                                  className="p-4 flex justify-between items-center border-b last:border-b-0"
                                >
                                  <span className="text-gray-700">
                                    {permission.label}
                                  </span>
                                  <Switch
                                    checked={employeePermission[permission.key]}
                                    onChange={() =>
                                      setEMployeePermission((prev) => ({
                                        ...prev,
                                        [permission.key]: !prev[permission.key],
                                      }))
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Attendance</span>
                          <Switch
                            checked={
                              attendancePermission.attendance_permissions
                            }
                            onChange={() =>
                              setAttendancePermission(
                                (attendancePermission) => ({
                                  ...attendancePermission,
                                  attendance_permissions:
                                    !attendancePermission.attendance_permissions,
                                })
                              )
                            }
                          />
                        </div>
                        {attendancePermission.attendance_permissions && (
                          <div className="border rounded-b-md">
                            {attendancePermissionLabel.map(
                              (permission, index) => (
                                <div
                                  key={index}
                                  className="p-4 flex justify-between items-center border-b last:border-b-0"
                                >
                                  <span className="text-gray-700">
                                    {permission.label}
                                  </span>
                                  <Switch
                                    checked={
                                      attendancePermission[permission.key]
                                    }
                                    onChange={() =>
                                      setAttendancePermission((prev) => ({
                                        ...prev,
                                        [permission.key]: !prev[permission.key],
                                      }))
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Roster</span>
                          <Switch
                            checked={rosterPermission.roster_permissions}
                            onChange={() =>
                              setRosterPermission((rosterPermission) => ({
                                ...rosterPermission,
                                roster_permissions:
                                  !rosterPermission.roster_permissions,
                              }))
                            }
                          />
                        </div>
                        {rosterPermission.roster_permissions && (
                          <div className="border rounded-b-md">
                            {RosterPermissionLabel.map((permission, index) => (
                              <div
                                key={index}
                                className="p-4 flex justify-between items-center border-b last:border-b-0"
                              >
                                <span className="text-gray-700">
                                  {permission.label}
                                </span>
                                <Switch
                                  checked={rosterPermission[permission.key]}
                                  onChange={() =>
                                    setRosterPermission((prev) => ({
                                      ...prev,
                                      [permission.key]: !prev[permission.key],
                                    }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Leave</span>
                          <Switch
                            checked={leavePermission.leave_permissions}
                            onChange={() =>
                              setLeavePermission((leavePermission) => ({
                                ...leavePermission,
                                leave_permissions:
                                  !leavePermission.leave_permissions,
                              }))
                            }
                          />
                        </div>
                        {leavePermission.leave_permissions && (
                          <div className="border rounded-b-md">
                            {LeavePermissionLabel.map((permission, index) => (
                              <div
                                key={index}
                                className="p-4 flex justify-between items-center border-b last:border-b-0"
                              >
                                <span className="text-gray-700">
                                  {permission.label}
                                </span>
                                <Switch
                                  checked={leavePermission[permission.key]}
                                  onChange={() =>
                                    setLeavePermission((prev) => ({
                                      ...prev,
                                      [permission.key]: !prev[permission.key],
                                    }))
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-2 border-t mt-1 p-1">
                <button
                  className=" bg-red-500 text-white py-2 px-4 rounded-full flex items-center gap-2"
                  onClick={() => setShowModal1(false)}
                >
                  <MdClose /> Close
                </button>
                <button
                  className=" bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2"
                  onClick={handleAddAdminAccess}
                >
                  <FaCheck /> Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <Table columns={columns} data={filteredAdmin} isPagination={true} />
      </div>
      <div className="my-4 mx-2 w-fit">
        <div className="flex flex-col mt-4 mr-2 bg-gray-50 rounded-md text-wrap  gap-4 my-2 py-2 pl-5 pr-2 w-[18rem]">
          <div className="flex  gap-4 font-medium">
            <GrHelpBook size={20} />
            <h2>Help Center</h2>
          </div>
          <div className=" ">
            {/* <p className="font-medium">Help Center</p> */}
            <ul style={listItemStyle} className="flex flex-col gap-2">
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can add administrators and manage admin access rights
                    like IP restrictions, 2-factor authentication, etc{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can also restrict access permission based on
                    departments, locations, etc.{" "}
                  </li>
                </ul>
              </li>
              <li>
                <ul style={listItemStyle}>
                  <li>
                    You can add and manage third party users and invite them to
                    join login to the Vibe Connect HRMS software. For e.g.,
                    External auditor, external consultants, etc.{" "}
                  </li>
                </ul>
              </li>

              <li>
                <p>
                  {/* <a href="#" className="text-blue-400">
                      Click Here{" "}
                    </a> */}
                  You can view/edit/delete admin permissions at any time.{" "}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageAdmin;
