import React, { useEffect, useState } from "react";
import AdminHRMS from "./AdminHrms";
import { useSelector } from "react-redux";
import { PiPlusCircle, PiPlusCircleBold } from "react-icons/pi";
import Table from "../../components/table/Table";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Select from "react-select";
import {
  editApprovalAuthoritiesStatus,
  getApprovalAuthorities,
  getHrmsUserRole,
  getHrmsUserRoleDetails,
  getMyHRMSEmployees,
  postApprovalAuthorities,
  postHrmsUserRole,
  putHrmsUserRoleDetails,
} from "../../api";
import { getItemInLocalStorage } from "../../utils/localStorage";
import { BiEdit } from "react-icons/bi";
import toast from "react-hot-toast";
import MultiSelect from "./Components/MultiSelect";
import { Switch } from "antd";

const UserRoles = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddApprovalModal, setShowAddApprovalModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    order: "",
    label: "",
  });
  const fetchUserRoles = async () => {
    try {
      const res = await getHrmsUserRole(hrmsOrgId);
      setRoles(res);
      setFilteredRoles(res);
    } catch (error) {
      console.log(error);
    }
  };
  const [authorities, setAuthorities] = useState([]);
  const [filteredAuthorities, setFilteredAuthorities] = useState([]);
  const fetchApprovalAuthorities = async () => {
    try {
      const res = await getApprovalAuthorities(hrmsOrgId);
      setAuthorities(res);
      setFilteredAuthorities(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserRoles();
    fetchApprovalAuthorities();
  }, []);

  const jobInfoColumn = [
    { name: "Label", selector: (row) => row.label, sortable: true },
    { name: "Role name", selector: (row) => row.name, sortable: true },
    { name: "Seniority order", selector: (row) => row.order, sortable: true },
    {
      name: "Action",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleEditModal(row.id)}>
            <BiEdit size={15} />
          </button>
          {/* <button >
              <BiEdit size={15} />
            </button> */}
        </div>
      ),
    },
  ];
  const ApprovalColumn = [
    {
      name: "Authority name",
      selector: (row) => row.approver_name,
      sortable: true,
    },
    { name: "Type", selector: (row) => row.type_of_approver, sortable: true },
    {
      name: "Status",
      selector: (row) => (
        <div>
          {row.is_active ? (
            <p className="font-medium text-green-500">Active</p>
          ) : (
            <p className="font-medium text-red-500">Inactive</p>
          )}
        </div>
      ),

      sortable: true,
    },

    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <div className="flex items-center gap-4">
    //       <button onClick={() => handleEditModal(row.id)}>
    //         <BiEdit size={15} />
    //       </button>
    //     </div>
    //   ),
    // },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Switch
            checked={row.is_active === true}
            onClick={() => handleToggleApproverStatus(row.id, !row.is_active)}
          />
        </div>
      ),
    },
  ];
  const handleToggleApproverStatus = async (approverId, active) => {
    const payload = { is_active: active };

    try {
      await editApprovalAuthoritiesStatus(approverId, payload);
      fetchApprovalAuthorities();
    } catch (error) {
      console.log(error);
    }
  };

  const [approverType, setApproverType] = useState("");
  const AddApprovalAuthority = async () => {
    const addApprover = new FormData();
    addApprover.append("organization_id", hrmsOrgId);
    addApprover.append("approver_id", selectedOptions.value);
    addApprover.append("type_of_approver", "Employee");
    try {
      const res = await postApprovalAuthorities(addApprover);
      setShowAddApprovalModal(false);
      fetchApprovalAuthorities();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUserRole = async () => {
    const postData = new FormData();
    postData.append("name", formData.name);
    postData.append("label", formData.label);
    postData.append("order", formData.order);
    postData.append("organization", hrmsOrgId);
    try {
      const res = await postHrmsUserRole(postData);
      toast.success("User role created successfully");
      setShowAddModal(false);
      fetchUserRoles();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditUserRole = async () => {
    const postData = new FormData();
    postData.append("name", formData.name);
    postData.append("label", formData.label);
    postData.append("order", formData.order);
    postData.append("organization", hrmsOrgId);
    try {
      const res = await putHrmsUserRoleDetails(typeId, postData);
      toast.success("User role updated successfully");
      setShowEditModal(false);
      fetchUserRoles();
    } catch (error) {
      console.log(error);
    }
  };
  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredRoles(roles);
    } else {
      const filteredResults = roles.filter((role) =>
        role?.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredRoles(filteredResults);
    }
  };
  const [searchApproverText, setSearchApproverText] = useState("");
  const handleSearchApprover = (e) => {
    const searchValue = e.target.value;
    setSearchApproverText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredAuthorities(authorities);
    } else {
      const filteredResults = authorities.filter((role) =>
        role?.approver_name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAuthorities(filteredResults);
    }
  };

  const [typeId, setTypeId] = useState("");
  const handleEditModal = async (typeId) => {
    setShowEditModal(true);
    setTypeId(typeId);
    try {
      const res = await getHrmsUserRoleDetails(typeId);
      console.log(res);
      setFormData({
        ...formData,
        label: res.label,
        name: res.name,
        order: res.order,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [page, setPage] = useState("roles");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const res = await getMyHRMSEmployees(hrmsOrgId);

        const employeesList = res.map((emp) => ({
          value: emp.id,
          label: `${emp.first_name} ${emp.last_name}`,
        }));
        setEmployees(employeesList);
        setFilteredEmployees(employeesList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllEmployees();
  }, []);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleEmployeeChange = (option) => {
    setSelectedOptions(option);
  };

  return (
    <div className="w-full">
      <AdminHRMS />
      <div className="flex items-center gap-4 ml-20 px-4 my-2 border-b">
        <button
          className={`${
            page === "roles" &&
            "font-medium text-blue-400 border-b border-blue-500"
          } text-lg transition-all duration-200`}
          onClick={() => setPage("roles")}
        >
          Roles
        </button>
        <button
          className={`${
            page === "approve" &&
            "font-medium text-blue-400 border-b border-blue-500"
          } text-lg transition-all duration-200`}
          onClick={() => setPage("approve")}
        >
          Approval Authority
        </button>
      </div>
      {page === "roles" && (
        <div className="flex flex-col ml-20 px-4">
          <div className="flex justify-between gap-2 mb-2">
            <input
              type="text"
              name=""
              id=""
              value={searchText}
              onChange={handleSearch}
              className="border rounded-md border-gray-300 p-2 w-full"
              placeholder="Search by name"
            />
            <button
              className="p-2 rounded-md flex items-center gap-2 text-white font-medium"
              style={{ background: themeColor }}
              onClick={() => setShowAddModal(true)}
            >
              <PiPlusCircle /> Add
            </button>
          </div>
          <Table columns={jobInfoColumn} data={filteredRoles} />
        </div>
      )}
      {page === "approve" && (
        <div className="flex flex-col ml-20 px-4">
          <div className="flex justify-between gap-2 mb-2">
            <input
              type="text"
              name=""
              id=""
              value={searchApproverText}
              onChange={handleSearchApprover}
              className="border rounded-md border-gray-300 p-2 w-full"
              placeholder="Search by name"
            />
            <button
              className="p-2 rounded-md flex items-center gap-2 text-white font-medium"
              style={{ background: themeColor }}
              onClick={() => setShowAddApprovalModal(true)}
            >
              <PiPlusCircle /> Add
            </button>
          </div>
          <Table columns={ApprovalColumn} data={filteredAuthorities} />
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
          <div className="max-h-screen bg-white p-2 px-3 w-[35rem] rounded-lg shadow-lg overflow-y-auto">
            <h2 className="flex items-center gap-2 font-medium border-b text-lg justify-center">
              <PiPlusCircleBold /> Add User Role{" "}
            </h2>
            <div className="grid grid-cols-2 gap-2 my-2 p-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Role name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  id=""
                  className="border border-gray-400 rounded-md p-1 px-2"
                  placeholder="Role name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  id=""
                  className="border border-gray-400 rounded-md p-1 px-2"
                  placeholder="label"
                />
              </div>
              <div>
                <label className="font-medium">Seniority Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="Enter seniority order"
                  min="1"
                  required
                  className="border border-gray-400 rounded-md p-1 w-full px-2"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                className="flex items-center gap-2 bg-green-400 text-white rounded-full p-1 px-4"
                onClick={handleAddUserRole}
              >
                <FaCheck /> Submit
              </button>
              <button
                className="flex items-center gap-2 bg-red-400 text-white rounded-full p-1 px-4"
                onClick={() => setShowAddModal(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
          <div className="max-h-screen  bg-white p-2 px-3 w-[35rem] rounded-lg shadow-lg overflow-y-auto">
            <h2 className="flex items-center gap-2 font-medium border-b text-lg justify-center">
              <PiPlusCircleBold /> Add Approval Authority{" "}
            </h2>
            <div className="grid gap-2 mt-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="font-medium">
                  Select Approver
                </label>
                <Select
                  options={employees}
                  onChange={handleEmployeeChange}
                  noOptionsMessage={() => "Select Approver"}
                  maxMenuHeight={139}
                />
              </div>
              <div>
                <p className="font-medium text-gray-500 my-5">
                  (The selected person will be able to approve or reject new
                  onboarding requests.){" "}
                </p>
              </div>
              {/* <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Type
                </label>
                <input
                  type="text"
                  className="p-2 rounded-md border border-gray-300"
                  placeholder="Eg: HR"
                  value={approverType}
                  onChange={(e) => setApproverType(e.target.value)}
                />
              </div> */}
            </div>
            <div className="flex items-end justify-center gap-2 mt-12 border-t p-1">
              <button
                className="flex items-center gap-2 bg-green-400 text-white rounded-full p-2 px-4"
                onClick={AddApprovalAuthority}
              >
                <FaCheck /> Submit
              </button>
              <button
                className="flex items-center gap-2 bg-red-400 text-white rounded-full p-2 px-4"
                onClick={() => setShowAddApprovalModal(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
          <div className="max-h-screen bg-white p-2 px-3 w-[35rem] rounded-lg shadow-lg overflow-y-auto">
            <h2 className="flex items-center gap-2 font-medium border-b text-lg justify-center">
              <BiEdit /> Edit User Role{" "}
            </h2>
            <div className="grid grid-cols-2 gap-2 my-2 p-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Role name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  id=""
                  className="border border-gray-400 rounded-md p-1 px-2"
                  placeholder="Role name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="font-medium">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  id=""
                  className="border border-gray-400 rounded-md p-1 px-2"
                  placeholder="label"
                />
              </div>
              <div>
                <label className="font-medium">Seniority Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="Enter seniority order"
                  min="1"
                  required
                  className="border border-gray-400 rounded-md p-1 w-full px-2"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                className="flex items-center gap-2 bg-green-400 text-white rounded-full p-1 px-4"
                onClick={handleEditUserRole}
              >
                <FaCheck /> Submit
              </button>
              <button
                className="flex items-center gap-2 bg-red-400 text-white rounded-full p-1 px-4"
                onClick={() => setShowEditModal(false)}
              >
                <MdClose /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoles;
