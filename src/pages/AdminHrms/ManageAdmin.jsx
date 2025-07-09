import React, { useEffect, useState, useMemo } from "react";
import { PiPlus, PiPlusCircle } from "react-icons/pi";
import Table from "../../components/table/Table";
import { GrHelpBook } from "react-icons/gr";
import { BiEdit } from "react-icons/bi";
import UserDetailsList from "./UserDetailsList";
import MultiSelect from "./Components/MultiSelect";
import { FaCheck, FaTrash } from "react-icons/fa";
import {
  deleteManageAdmin,
  editApprovalAuthoritiesStatus,
  editManageAdminDetails,
  getAdminAccess,
  getApprovalAuthoritiesDetail,
  getManageAdmin,
  getManageAdminDetails,
  getMyHRMSAdmins,
  getMyHRMSEmployees,
  postApprovalAuthorities,
  postManageAdmin,
  getAvailableSites,
  updateEmployeeAssociations,
  getEmployeeAssociations,
  getUserSettingsIdDetails,
  getUserSettingsList,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import Select from "react-select";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Pagination, Switch } from "antd";
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
      name: "Role",
      selector: (row) => row.role,
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
          {roleAccess?.can_add_edit_admins && (
            <>
              {empId !== row.name && (
                <>
                  <button onClick={() => handleEditModal(row.id)}>
                    <BiEdit size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(row.id)}
                    className="text-red-400"
                  >
                    <FaTrash size={15} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ),
    },
  ];
  // Associated Sites
  const [availableSites, setAvailableSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [sitesOptions, setSitesOptions] = useState([]);
  useEffect(() => {
    const fetchAvailableSitesData = async () => {
      try {
        const sitesData = await getAvailableSites(hrmsOrgId);
        if (!sitesData) {
          toast.error("No Sites Available");
        }

        const formattedSites = sitesData.map((site) => ({
          value: site.id,
          label: site.site_name,
        }));

        // Add Select All option at the beginning
        setAvailableSites(formattedSites);
        setSitesOptions([
          { value: "select-all", label: "Select All" },
          ...formattedSites,
        ]);
      } catch (error) {
        console.log("Error in getting The available sites", error);
      }
    };
    fetchAvailableSitesData();
  }, [hrmsOrgId]);

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
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchText, setSearchText] = useState("");
  const fetchAllAdmin = async () => {
    try {
      const res = await getUserSettingsList(pageNumber + 1, searchText);
      console.log(res);
      setAdminList(res?.results);
      setFilteredAdmin(res?.results);
      setTotalPages(res?.total_pages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllAdmin();
  }, [pageNumber, searchText]);
  useEffect(() => {
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
    if (access === "Full Access") {
      Object.keys(dashboardPermission).forEach((key) => {
        postData.append(key, true);
      });
    } else {
      Object.keys(dashboardPermission).forEach((key) => {
        postData.append(key, dashboardPermission[key]);
      });
    }
    if (selectedUserOption && selectedUserOption.value) {
      postData.append("name", selectedUserOption.value);
    } else {
      toast.error("No user selected.");
    }
    try {
      const res = await postManageAdmin(postData);
      if (selectedSites.length > 0) {
        const siteIds = selectedSites.map((site) => site.value);
        const associationData = {
          multiple_associated: siteIds,
          organization: hrmsOrgId,
        };
        const updateId = associationId || selectedUserOption.value;
        await updateEmployeeAssociations(updateId, associationData);
      }

      if (
        employeePermission.can_approve_reject_onboarding_request ||
        access === "Full Access"
      ) {
        const addApprover = new FormData();
        addApprover.append("organization_id", hrmsOrgId);
        addApprover.append("approver_id", selectedUserOption.value);
        addApprover.append("type_of_approver", "Employee");
        try {
          const res = await postApprovalAuthorities(addApprover);
        } catch (error) {
          console.log(error);
        }
      }
      setShowModal(false);
      fetchAllAdmin();
      toast.success("Admin access right added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Please try again ");
    }
  };
  const [adminId, setAdminId] = useState("");

  const [selectedSitesEdit, setSelectedSitesEdit] = useState([]);

  const [associationId, setAssociationId] = useState(null); // Add this state at the top of your component

  const handleEditModal = async (id) => {
    try {
      setShowModal1(true);
      setAdminId(id);
      // fetchUserAccess(id);
      // 2. Fetch admin details by ID
      const response = await getUserSettingsIdDetails(id);
      if (!response) {
        throw new Error("No admin data found");
      }

      const adminDetails = response;
      // const adminDetails = response.find((admin) => admin.id === id);
      if (!adminDetails) {
        throw new Error(`Admin with ID ${id} not found`);
      }
      // 3. Set access and role
      setAccess(adminDetails.access || "");
      setRole(adminDetails.role || "");

      // 4. Set selected employee in dropdown
      const selectedEmployee = employees.find(
        (emp) => String(emp.value) === String(adminDetails.name)
      );
      if (!selectedEmployee && adminDetails.name) {
        console.warn("Employee not found in dropdown:", adminDetails.name);
      }
      setSelectedUserOption(selectedEmployee || null);

      // 5. Set permissions
      console.log(adminDetails);
      setPermissionAllowed({
        organization_permissions: !!adminDetails.organization_permissions,
        can_edit_basic_info: !!adminDetails.can_edit_basic_info,
        can_edit_address_info: !!adminDetails.can_edit_address_info,
        can_add_edit_locations: !!adminDetails.can_add_edit_locations,
        can_add_edit_department: !!adminDetails.can_add_edit_department,
        can_add_edit_associated_sites:
          !!adminDetails.can_add_edit_associated_sites,
        can_add_edit_company_holiday:
          !!adminDetails.can_add_edit_company_holiday,
        can_add_edit_bank_account: !!adminDetails.can_add_edit_bank_account,
        can_add_edit_admins: !!adminDetails.can_add_edit_admins,
      });

      setEMployeePermission({
        employee_permissions: !!adminDetails.employee_permissions,
        can_edit_employee: !!adminDetails.can_edit_employee,
        can_delete_employee: !!adminDetails.can_delete_employee,
        can_approve_reject_onboarding_request:
          !!adminDetails.can_approve_reject_onboarding_request,
        can_add_employee: !!adminDetails.can_add_employee,
        can_approve_reject_uniform_request:
          !!adminDetails.can_approve_reject_uniform_request,
        can_approve_reject_separation_request:
          !!adminDetails.can_approve_reject_separation_request,
        can_initiate_separation: !!adminDetails.can_initiate_separation,
      });

      setAttendancePermission({
        attendance_permissions: !!adminDetails.attendance_permissions,
        can_approve_reject_regularisation:
          !!adminDetails.can_approve_reject_regularisation,
        can_apply_regularization_on_behalf_of_employee:
          !!adminDetails.can_apply_regularization_on_behalf_of_employee,
      });

      setRosterPermission({
        roster_permissions: !!adminDetails.roster_permissions,
        can_assign_edit_delete_shifts:
          !!adminDetails.can_assign_edit_delete_shifts,
        can_edit_delete_roster_shift:
          !!adminDetails.can_edit_delete_roster_shift,
      });

      setLeavePermission({
        leave_permissions: !!adminDetails.leave_permissions,
        can_add_leave_on_behalf_of_employee:
          !!adminDetails.can_add_leave_on_behalf_of_employee,
        can_add_edit_delete_leave_category:
          !!adminDetails.can_add_edit_delete_leave_category,
        can_approve_reject_leave: !!adminDetails.can_approve_reject_leave,
      });
      console.log(adminDetails);
      setDashboardPermission({
        dashboard_permissions: !!adminDetails.dashboard_permissions,
        can_view_dashboard: !!adminDetails.can_view_dashboard,
        client_dashboard: !!adminDetails.client_dashboard,
      });

      // 6. Fetch associated sites if name is present
      if (adminDetails.name) {
        try {
          const siteResponse = await getEmployeeAssociations(adminDetails.name);
          console.log("Site associations API response:", siteResponse);

          const associationData =
            Array.isArray(siteResponse) && siteResponse.length > 0
              ? siteResponse[0]
              : null;

          // Store the association ID for later updates
          if (associationData?.id) {
            setAssociationId(associationData.id);
          } else {
            setAssociationId(null);
          }

          if (associationData?.multiple_associated_info?.length > 0) {
            const matchedSites = sitesOptions.filter((site) =>
              associationData.multiple_associated.includes(site.value)
            );
            setSelectedSitesEdit(matchedSites);
          } else {
            setSelectedSitesEdit([]);
          }
        } catch (error) {
          console.error("Error fetching associated sites:", error);
          setSelectedSitesEdit([]);
          setAssociationId(null);
          toast.error("Failed to load associated sites");
        }
      }

      // 7. Fetch approver details if permission is granted
      if (
        adminDetails.can_approve_reject_onboarding_request &&
        adminDetails.name
      ) {
        try {
          const approverResponse = await fetchApproverDetails(
            adminDetails.name
          );
        } catch (error) {
          console.error("Error fetching approver details:", error);
          toast.error("Failed to load approver details");
        }
      }
    } catch (error) {
      console.error("Error in handleEditModal:", error);
      toast.error(`Failed to load admin details: ${error.message}`);
      setShowModal1(false);
    }
  };

  const [approverDetails, setApproverDetails] = useState({
    approverSettingId: "",
    approverName: "",
    approverId: "",
    active: "",
  });

  const fetchApproverDetails = async (approverId) => {
    try {
      const res = await getApprovalAuthoritiesDetail(approverId);
      const data = res[0];
      setApproverDetails({
        ...approverDetails,
        approverId: data?.approver || "",
        approverName: data?.approver_name || "",
        approverSettingId: data?.id || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAdmin = async () => {
    const editData = new FormData();
    editData.append("organization", hrmsOrgId);
    editData.append("access", access);
    editData.append("role", role);

    // Append permissions based on access type
    if (access === "Full Access") {
      Object.keys(permissionAllowed).forEach((key) => {
        editData.append(key, true);
      });
    } else {
      Object.keys(permissionAllowed).forEach((key) => {
        editData.append(key, permissionAllowed[key]);
      });
    }

    if (access === "Full Access") {
      Object.keys(employeePermission).forEach((key) => {
        editData.append(key, true);
      });
    } else {
      Object.keys(employeePermission).forEach((key) => {
        editData.append(key, employeePermission[key]);
      });
    }

    if (access === "Full Access") {
      Object.keys(attendancePermission).forEach((key) => {
        editData.append(key, true);
      });
    } else {
      Object.keys(attendancePermission).forEach((key) => {
        editData.append(key, attendancePermission[key]);
      });
    }

    if (access === "Full Access") {
      Object.keys(rosterPermission).forEach((key) => {
        editData.append(key, true);
      });
    } else {
      Object.keys(rosterPermission).forEach((key) => {
        editData.append(key, rosterPermission[key]);
      });
    }

    if (access === "Full Access") {
      Object.keys(leavePermission).forEach((key) => {
        editData.append(key, true);
      });
    } else {
      Object.keys(leavePermission).forEach((key) => {
        editData.append(key, leavePermission[key]);
      });
    }

    if (access === "Full Access") {
      Object.keys(dashboardPermission).forEach((key) => {
        editData.append(key, true);
      });
    } else {
      Object.keys(dashboardPermission).forEach((key) => {
        editData.append(key, dashboardPermission[key]);
      });
    }

    if (selectedUserOption && selectedUserOption.value) {
      editData.append("name", selectedUserOption.value);
    } else {
      toast.error("No user selected.");
      return;
    }

    try {
      // First update the admin details
      const res = await editManageAdminDetails(adminId, editData);

      // Then update the associated sites if user is selected
      if (selectedUserOption && selectedUserOption.value) {
        const siteIds = selectedSitesEdit.map((site) => site.value);
        const associationData = {
          multiple_associated: siteIds,
          organization: hrmsOrgId,
        };

        const updateId = associationId || selectedUserOption.value;
        await updateEmployeeAssociations(updateId, associationData);
      }

      // Handle approval authorities logic
      if (!employeePermission.can_approve_reject_onboarding_request) {
        const addApprover = {
          is_active: employeePermission.can_approve_reject_onboarding_request,
          organization_id: hrmsOrgId,
          approver_id: selectedUserOption.value,
          type_of_approver: "Employee",
        };
        if (approverDetails.approverSettingId) {
          await editApprovalAuthoritiesStatus(
            approverDetails.approverSettingId,
            addApprover
          );
        }
      }

      if (
        employeePermission.can_approve_reject_onboarding_request ||
        access === "Full Access"
      ) {
        const addApprover = {
          is_active: employeePermission.can_approve_reject_onboarding_request,
          organization_id: hrmsOrgId,
          approver_id: selectedUserOption.value,
          type_of_approver: "Employee",
        };

        try {
          if (approverDetails.approverSettingId) {
            await editApprovalAuthoritiesStatus(
              approverDetails.approverSettingId,
              addApprover
            );
          } else {
            await postApprovalAuthorities(addApprover);
          }
        } catch (error) {
          console.log(error);
        }
      }

      setShowModal1(false);
      fetchAllAdmin();
      toast.success("Admin access right updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update admin details");
    }
  };

  const themeColor = useSelector((state) => state.theme.color);
  const [permissionAllowed, setPermissionAllowed] = useState({
    organization_permissions: false,
    can_edit_basic_info: false,
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
  const [dashboardPermission, setDashboardPermission] = useState({
    dashboard_permissions: false,
    can_view_dashboard: false,
    client_dashboard: false, // Added for your dashboard toggle.
  });
  console.log(rosterPermission);
  console.log(dashboardPermission);
  const [Dashboard, setDashboard] = useState(false);

  // useEffect(() => {
  //   async function fetchDetails() {
  //     try {
  //       const res = await getManageAdminDetails(adminId);
  //       console.log(res);
  //       // Update your state based on the response.
  //       // setDashboardPermission({
  //       //   dashboard_permissions: res.dashboard_permissions,
  //       //   can_view_dashboard: res.can_view_dashboard,

  //       //   client_dashboard: res.client_dashboard,
  //       // });
  //     } catch (error) {
  //       console.error("Error fetching admin details:", error);
  //     }
  //   }
  //   if (adminId) fetchDetails();
  // }, [adminId]);
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
  // can_add_edit_admins
  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});
  useEffect(() => {
    console.log("test");
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, empId);

        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoleAccess();
  }, []);
  const fetchUserAccess = async (employeeId) => {
    try {
      const res = await getAdminAccess(orgId, employeeId);
      console.log(res);
      // setRoleAccess(res[0]);
    } catch (error) {
      console.log(error);
    }
  };
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
            onChange={(e) => {
              setSearchText(e.target.value), setPageNumber(0);
            }}
          />
          {roleAccess?.can_add_edit_admins && (
            <button
              onClick={() => setShowModal(true)}
              style={{ background: themeColor }}
              className="border-2 font-semibold hover:bg-black hover:text-white duration-150 transition-all p-2 rounded-lg text-white cursor-pointer text-center flex items-center gap-2 justify-center"
            >
              <PiPlusCircle size={20} />
              Add
            </button>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-xl w-[80%]">
              <h1 className="text-lg font-semibold border-b flex items-center gap-2 justify-center">
                <PiPlusCircle /> Add Manage Administrator
              </h1>
              <div className="grid grid-cols-3 gap-2 max-h-96 min-h-52 overflow-y-auto hide-scrollbar">
                <div className="flex flex-col col-span-3 justify-center z-50">
                  <label className="block text-gray-700 font-medium ">
                    Select Admin :
                  </label>
                  <Select
                    options={employees}
                    noOptionsMessage={() => "No Admin Available"}
                    onChange={handleUserChangeSelect}
                    placeholder="Select Admin"
                    maxMenuHeight={140}
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
                <div className="flex flex-col ">
                  <label htmlFor="" className="block text-gray-700 font-medium">
                    Associated Sites :
                  </label>

                  {/* <Select
                    isMulti
                    options={availableSites}
                    value={selectedSites}
                    onChange={setSelectedSites}
                    placeholder="Select associated sites "
                    className="basic-multi-select "
                    classNamePrefix="select"
                  /> */}
                  <Select
                    isMulti
                    options={sitesOptions}
                    value={selectedSites}
                    onChange={(selectedOptions) => {
                      // Handle Select All functionality
                      const lastOption =
                        selectedOptions[selectedOptions.length - 1];
                      if (lastOption?.value === "select-all") {
                        // If Select All was clicked, select all options except the Select All option
                        setSelectedSites(availableSites);
                      } else {
                        // Otherwise, just update with the selected options
                        setSelectedSites(selectedOptions);
                      }
                    }}
                    placeholder="Select associated sites"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    closeMenuOnSelect={false} // Keep menu open when selecting
                    hideSelectedOptions={false} // Show selected options in the dropdown
                    isOptionDisabled={(option) =>
                      option.value === "select-all" &&
                      selectedSites.length === availableSites.length
                    }
                  />
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
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Dashboard</span>

                          {/* <Switch
                            checked={dashboardPermission.client_dashboard}
                            onChange={async () => {
                              const toggledValue =
                                !dashboardPermission.client_dashboard;
                              // Update the state immediately so the UI reflects the new value.
                              setDashboardPermission((prev) => ({
                                ...prev,
                                client_dashboard: toggledValue,
                              }));
                              // Build the payload for the API update.
                              const payload = {
                                client_dashboard: toggledValue,
                              };
                              try {
                                // Send the PUT request to update the API.
                                const res = await updateManageAdminDetails(
                                  adminId,
                                  payload
                                );
                                console.log("Updated client_dashboard:", res);
                              } catch (error) {
                                console.error(
                                  "Error updating client_dashboard:",
                                  error
                                );
                              }
                            }}
                          /> */}

                          <Switch
                            checked={dashboardPermission.dashboard_permissions}
                            onChange={async () => {
                              // Toggle the current value
                              const toggledValue =
                                !dashboardPermission.dashboard_permissions;
                              // Update state immediately
                              setDashboardPermission((prev) => ({
                                ...prev,
                                dashboard_permissions: toggledValue,
                              }));

                              // Build the payload with the toggled value
                              const payload = {
                                client_dashboard: toggledValue, // API expects this field
                              };

                              try {
                                const res = await editManageAdminDetails(
                                  adminId,
                                  payload
                                );
                                console.log("Dashboard updated:", res);
                              } catch (error) {
                                console.error(
                                  "Error updating dashboard:",
                                  error
                                );
                              }
                            }}
                          />
                          <span className="ml-2">
                            {dashboardPermission.client_dashboard
                              ? "Toggle Active"
                              : "Toggle Inactive"}
                          </span>
                        </div>
                        {dashboardPermission.dashboard_permissions && (
                          <div className="border rounded-b-md">
                            <div className="p-4 flex justify-between items-center border-b last:border-b-0">
                              <span className="text-gray-700">
                                Can view dashboard
                              </span>
                              <Switch
                                checked={dashboardPermission.can_view_dashboard}
                                onChange={async () => {
                                  const toggledView =
                                    !dashboardPermission.can_view_dashboard;
                                  setDashboardPermission((prev) => ({
                                    ...prev,
                                    can_view_dashboard: toggledView,
                                  }));
                                  const payload = {
                                    can_view_dashboard: toggledView,
                                  };

                                  try {
                                    const res = await editManageAdminDetails(
                                      adminId,
                                      payload
                                    );
                                    console.log(
                                      "Updated can_view_dashboard:",
                                      res
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error updating can_view_dashboard:",
                                      error
                                    );
                                  }
                                }}
                              />
                            </div>
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
            <div className="bg-white p-4 rounded-xl w-[80%]">
              <h1 className="text-lg font-semibold border-b flex items-center gap-2 justify-center">
                <BiEdit /> Edit Manage Administrator
              </h1>
              <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto hide-scrollbar">
                <div className="flex flex-col col-span-3 z-50">
                  <label className="block text-gray-700 font-medium ">
                    Select Admin :
                  </label>
                  <Select
                    options={employees}
                    value={selectedUserOption}
                    noOptionsMessage={() => "No Admin Available"}
                    onChange={handleUserChangeSelect}
                    placeholder="Select Admin"
                    maxMenuHeight={140}
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
                <div className="flex flex-col">
                  <label htmlFor="" className="block text-gray-700 font-medium">
                    Associated Sites :
                  </label>
                  {/* <Select
  isMulti
  options={availableSites}
  value={selectedSitesEdit}
  onChange={setSelectedSitesEdit}
  className="basic-multi-select"
  classNamePrefix="select"
  placeholder="Select sites..."
  getOptionLabel={(option) => option.label}
  getOptionValue={(option) => option.value}
  isDisabled={!availableSites.length} // Disable if no sites loaded
/> */}
                  <Select
                    isMulti
                    options={[
                      { value: "select-all", label: "Select All" },
                      ...availableSites,
                    ]}
                    value={selectedSitesEdit}
                    onChange={(selectedOptions) => {
                      const lastOption =
                        selectedOptions[selectedOptions.length - 1];
                      if (lastOption?.value === "select-all") {
                        setSelectedSitesEdit(availableSites);
                      } else {
                        setSelectedSitesEdit(selectedOptions);
                      }
                    }}
                    className="basic-multi-select z-50"
                    classNamePrefix="select"
                    placeholder="Select sites..."
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    isDisabled={!availableSites.length}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isOptionDisabled={(option) =>
                      option.value === "select-all" &&
                      selectedSitesEdit.length === availableSites.length
                    }
                  />
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
                      <div>
                        <div className="bg-gray-400 text-white p-2 flex justify-between items-center">
                          <span className="text-lg">Client Dashboard</span>
                          <Switch
                            checked={dashboardPermission.client_dashboard}
                            onChange={() =>
                              setDashboardPermission((dashboardPermission) => ({
                                ...dashboardPermission,
                                client_dashboard:
                                  !dashboardPermission.client_dashboard,
                              }))
                            }
                          />
                        </div>

                        {/* {dashboardPermission.dashboard_permissions && (
                          <div className="border rounded-b-md">
                            <div className="p-4 flex justify-between items-center border-b last:border-b-0">
                              <span className="text-gray-700">
                                Can view dashboard
                              </span>
                              <Switch
                                checked={dashboardPermission.client_dashboard}
                                onChange={() =>
                                  setDashboardPermission((prev) => ({
                                    ...prev,
                                    can_view_dashboard:
                                      !prev.can_view_dashboard,
                                    client_dashboard: !prev.client_dashboard,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        )} */}
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
                  onClick={handleEditAdmin}
                >
                  <FaCheck /> Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <Table columns={columns} data={filteredAdmin} pagination={false} />
        {filteredAdmin.length > 0 && (
          <div className={"w-full mt- flex justify-end border rounded-md p-2"}>
            <Pagination
              current={pageNumber + 1}
              total={totalPages * 10}
              pageSize={10}
              onChange={(page) => {
                setPageNumber(page - 1);
              }}
              showSizeChanger={false}
            />
          </div>
        )}
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