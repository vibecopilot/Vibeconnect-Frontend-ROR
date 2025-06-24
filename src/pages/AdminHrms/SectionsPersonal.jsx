import React, { useEffect, useState } from "react";
import EmployeeSections from "./EmployeeSections";
import EditEmployeeDirectory from "./EditEmployeeDirectory";
import Table from "../../components/table/Table";
import { BiEdit } from "react-icons/bi";

import Select from "react-select";

import {
  editEmployeeAddressDetails,
  editEmployeeDetails,
  editEmployeeFamilyDetails,
  editPaymentInfoDetails,
  getAdminAccess,
  getAvailableSites,
  getEmployeeAddressDetails,
  getEmployeeAssociations,
  getEmployeeDetails,
  getEmployeeFamilyDetails,
  getEmployeePaymentInfo,
  getHrmsUserRole,
  getPaymentInfoDetails,
  getPaymentModeList,
  postEmployeeAddress,
  postEmployeeFamily,
  postEmployeePaymentInfo,
  updateEmployeeAssociations,
} from "../../api";
import { useParams } from "react-router-dom";
import { getItemInLocalStorage } from "../../utils/localStorage";
import toast from "react-hot-toast";
import Accordion from "./Components/Accordion";
import { RiContactsBook2Line } from "react-icons/ri";
import { MdClose, MdFamilyRestroom, MdOutlinePayment } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { FaCheck, FaHome, FaSitemap } from "react-icons/fa";
import { PiPlusCircle } from "react-icons/pi";
import { Switch } from "antd";

const SectionsPersonal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addPaymentInfoModal, setAddPaymentInfoModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFamEditing, setIsFamEditing] = useState(false);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const role = getItemInLocalStorage("Role");
  console.log(role);
  const [geotag, setGeoTag] = useState(false);

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const [paymentData, setPaymentData] = useState({
    paymentMode: "",
    bankName: "",
    accountNumber: "",
    Ifsc: "",
  });
  console.log(paymentData);

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    closeModal();
  };
  const [paymentInfoId, setPaymentInfoId] = useState("");
  const handleOpenPaymentEditModal = async (paymentId) => {
    setModalIsOpen(true);
    setPaymentInfoId(paymentId);
    try {
      const res = await getPaymentInfoDetails(paymentId);
      console.log(res);
      setPaymentData({
        ...paymentData,
        paymentMode: res.payments_mode.toString(),
        accountNumber: res.bank_account_number,
        bankName: res.bank_name,
        Ifsc: res.ifsc_code,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const PaymentColumn = [
    // {
    //   name: "Payment Type",
    //   selector: (row) => row.Payment_Type,
    //   sortable: true,
    // },
    {
      name: "Payment Mode",
      selector: (row) =>
        row.payments_mode === 1
          ? "Cash"
          : row.payments_mode === 2
          ? "Cheque"
          : "Bank Transfer",
      sortable: true,
    },
    { name: "Bank Name", selector: (row) => row.bank_name, sortable: true },
    {
      name: "Bank Account Number",
      selector: (row) => row.bank_account_number,
      sortable: true,
    },
    {
      name: "Bank IFSC Code",
      selector: (row) => row.ifsc_code,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleOpenPaymentEditModal(row.id)}>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
  ];

  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    pan: "",
    aadhar: "",
    maritalStatus: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactNo: "",
    userType: "",
    status: false,
    latRequired: true,
    geotag_enabled: false,
  });
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    pan: "",
    aadhar: "",
    maritalStatus: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactNo: "",
    userType: "",
    status: false,
    latRequired: true,
    geotag_enabled: false,
  });
  const [familyData, setFamilyData] = useState({
    fatherName: "",
    motherName: "",
    spouseName: "",
    familyId: "",
  });

  const [addressData, setAddressData] = useState({
    addressId: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    code: "",
  });
  const fetchEmployeeDetails = async () => {
    try {
      const res = await getEmployeeDetails(id);
      console.log("Complete details of employee ----->", res);
      const rawAadharValue = res?.aadhar_number?.replace(/\D/g, "");
      console.log(rawAadharValue);
      setFormData({
        ...formData,
        firstName: res?.first_name,
        lastName: res?.last_name,
        email: res?.email_id,
        mobile: res?.mobile,
        gender: res?.gender,
        dob: res?.date_of_birth,
        pan: res?.pan,
        bloodGroup: res?.blood_group,
        status: res?.status,
        // aadhar: rawAadharValue.match(/.{1,4}/g)?.join("-") || "",
        aadhar: rawAadharValue?.match(/.{1,4}/g)?.join("-") || "",
        maritalStatus: res?.marital_status,
        emergencyContactName: res?.emergency_contact_name,
        emergencyContactNo: res?.emergency_contact_no,
        userType: res?.user_type || "employee",
        latRequired: res?.lat_long_required,
        geotag_enabled: res?.geotag_enabled,
      });
      setOriginalData({
        ...originalData,
        firstName: res?.first_name,
        lastName: res?.last_name,
        email: res?.email_id,
        mobile: res?.mobile,
        gender: res?.gender,
        dob: res?.date_of_birth,
        pan: res?.pan,
        bloodGroup: res?.blood_group,
        status: res?.status,
        // aadhar: rawAadharValue.match(/.{1,4}/g)?.join("-") || "",
        aadhar: rawAadharValue?.match(/.{1,4}/g)?.join("-") || "",
        maritalStatus: res?.marital_status,
        emergencyContactName: res?.emergency_contact_name,
        emergencyContactNo: res?.emergency_contact_no,
        userType: res?.user_type || "employee",
        latRequired: res?.lat_long_required,
        geotag_enabled: res?.geotag_enabled,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeFamilyDetails = async () => {
    try {
      const res = await getEmployeeFamilyDetails(id);

      const familyData = res[0];

      const familyObject = {
        fatherName: familyData?.father_name || "",
        motherName: familyData?.mother_name || "",
        spouseName: familyData?.spouse_name || "",
        familyId: familyData?.id,
      };

      setFamilyData(familyObject);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeAddressDetails = async () => {
    try {
      const res = await getEmployeeAddressDetails(id);
      const address = res[0];
      const addressObj = {
        address1: address?.address_line_1 || "",
        address2: address?.address_line_2 || "",
        country: address?.country || "",
        addressId: address?.id,
        city: address?.city,
        state: address?.state_province,
        code: address?.zip_code,
      };

      setAddressData(addressObj);
    } catch (error) {
      console.log(error);
    }
  };

  const [paymentsData, setPaymentsData] = useState([]);
  const fetchEmployeePaymentInfo = async () => {
    try {
      const res = await getEmployeePaymentInfo(id);
      setPaymentsData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
    fetchEmployeeFamilyDetails();
    fetchEmployeeAddressDetails();
    fetchEmployeePaymentInfo();
    fetchUserRoles();
  }, []);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const [rawAadhar, setRawAadhar] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "aadhar") {
      const rawValue = value.replace(/\D/g, "");
      const formattedValue =
        rawValue
          .match(/.{1,4}/g)
          ?.join("-")
          .slice(0, 14) || "";
      setFormData((prevData) => ({
        ...prevData,
        aadhar: formattedValue,
      }));
      setRawAadhar(rawValue);
      console.log(rawValue);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const handleEditEmployeeBasicInfo = async () => {
    const editData = new FormData();

    const appendIfChanged = (key, newValue, oldValue) => {
      if (newValue !== oldValue) {
        editData.append(key, newValue);
      }
    };

    appendIfChanged("first_name", formData.firstName, originalData.firstName);
    appendIfChanged("last_name", formData.lastName, originalData.lastName);
    appendIfChanged("email_id", formData.email, originalData.email);
    appendIfChanged("mobile", formData.mobile, originalData.mobile);
    appendIfChanged("gender", formData.gender, originalData.gender);
    appendIfChanged("date_of_birth", formData.dob, originalData.dob);
    appendIfChanged(
      "blood_group",
      formData.bloodGroup,
      originalData.bloodGroup
    );
    appendIfChanged("pan", formData.pan || null, originalData.pan || null);
    appendIfChanged(
      "aadhar_number",
      formData.aadhar.replace(/\D/g, ""),
      originalData.aadhar.replace(/\D/g, "")
    );
    appendIfChanged(
      "marital_status",
      formData.maritalStatus,
      originalData.maritalStatus
    );
    appendIfChanged(
      "emergency_contact_name",
      formData.emergencyContactName,
      originalData.emergencyContactName
    );
    appendIfChanged(
      "emergency_contact_no",
      formData.emergencyContactNo,
      originalData.emergencyContactNo
    );
    appendIfChanged("user_type", formData.userType, originalData.userType);
    appendIfChanged("status", formData.status, originalData.status);
    appendIfChanged("organization", hrmsOrgId, originalData.organization);
    appendIfChanged(
      "lat_long_required",
      formData.latRequired,
      originalData.latRequired
    );
    appendIfChanged(
      "geotag_enabled",
      formData.geotag_enabled,
      originalData.geotag_enabled
    );

    if ([...editData.entries()].length === 0) {
      toast.info("No changes detected.");
      return;
    }

    try {
      const res = await editEmployeeDetails(id, editData);
      setIsEditing(false);
      console.log(res);
      toast.success("Personal details updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleFamChange = (e) => {
    setFamilyData({ ...familyData, [e.target.name]: e.target.value });
  };

  const handleEditFamily = async () => {
    const postData = new FormData();
    postData.append("father_name", familyData.fatherName);
    postData.append("mother_name", familyData.motherName);
    postData.append("spouse_name", familyData.spouseName);
    postData.append("employee", id);
    try {
      if (familyData.familyId) {
        const res = await editEmployeeFamilyDetails(
          familyData.familyId,
          postData
        );
        toast.success("Family details updated successfully");
      } else {
        const res = await postEmployeeFamily(postData);
        toast.success("Family details updated successfully");
      }
      setIsFamEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong please try again");
    }
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleEditAddress = async () => {
    if (!addressData.address1) {
      toast.error("Address Line 1 is required");
      return;
    }
    if (!addressData.address2) {
      toast.error("Address Line 2 is required");
      return;
    }
    if (!addressData.country) {
      toast.error("Country is required");
      return;
    }
    if (!addressData.state) {
      toast.error("State/Province is required");
      return;
    }
    if (!addressData.city) {
      toast.error("City is required");
      return;
    }
    if (!addressData.code) {
      toast.error("ZIP Code is required");
      return;
    }
    const postAddress = new FormData();
    postAddress.append("address_line_1", addressData.address1);
    postAddress.append("address_line_2", addressData.address2);
    postAddress.append("country", addressData.country);
    postAddress.append("state_province", addressData.state);
    postAddress.append("city", addressData.city);
    postAddress.append("zip_code", addressData.code);
    postAddress.append("employee", id);
    try {
      if (addressData.addressId) {
        const res = await editEmployeeAddressDetails(
          addressData.addressId,
          postAddress
        );
        toast.success("Address details updated successfully");
      } else {
        const res = await postEmployeeAddress(postAddress);
        toast.success("Address details updated successfully");
      }
      setIsAddressEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong please try again");
    }
  };

  const paymentOptions = [
    { value: "salary", label: "Salary" },
    { value: "expense", label: "Expense" },
    { value: "offcycle", label: "Off-Cycle" },
  ];
  const [roles, setRoles] = useState([]);
  const fetchUserRoles = async () => {
    try {
      const res = await getHrmsUserRole(hrmsOrgId);
      setRoles(res);
    } catch (error) {
      console.log(error);
    }
  };

  const [paymentModeList, setPaymentModeList] = useState([]);
  useEffect(() => {
    const fetchPaymentModeList = async () => {
      try {
        const res = await getPaymentModeList();
        setPaymentModeList(res);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPaymentModeList();
  }, []);

  const handleEditPaymentInfo = async () => {
    const postPayment = new FormData();
    postPayment.append("bank_name", paymentData.bankName);
    postPayment.append("bank_account_number", paymentData.accountNumber);
    postPayment.append("ifsc_code", paymentData.Ifsc);
    postPayment.append("payments_mode", paymentData.paymentMode);
    postPayment.append("employee", id);

    try {
      const res = await editPaymentInfoDetails(paymentInfoId, postPayment);
      toast.success("Payment info updated successfully");
      setModalIsOpen(false);
      fetchEmployeePaymentInfo();
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddPaymentInfo = async () => {
    const postPayment = new FormData();
    postPayment.append("bank_name", paymentData.bankName);
    postPayment.append("bank_account_number", paymentData.accountNumber);
    postPayment.append("ifsc_code", paymentData.Ifsc);
    postPayment.append("payments_mode", paymentData.paymentMode);
    postPayment.append("employee", id);

    try {
      const res = await postEmployeePaymentInfo(postPayment);
      toast.success("Payment info updated successfully");
      setAddPaymentInfoModal(false);
      fetchEmployeePaymentInfo();
    } catch (error) {
      console.log(error);
    }
  };
  // can_edit_employee

  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});
  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await getAdminAccess(orgId, empId);
        console.log("Role AdminAccess", res);
        setRoleAccess(res[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoleAccess();
  }, []);

  console.log("roleAccess", roleAccess.role);

  const allowedRoles = ["superadmin", "admin", "pms_admin"];
  const normalizedRole = roleAccess?.role?.toLowerCase().replace(/\s/g, "");
  const isAuthorized = allowedRoles.includes(normalizedRole);

  const [associatedSites, setAssociatedSites] = useState([]);
  const [baseSite, setBaseSite] = useState("");
  const [baseSiteId, setBaseSiteId] = useState("");
  const [selectedSitesEdit, setSelectedSitesEdit] = useState([]);
  const fetchAssociatedSites = async () => {
    try {
      const res = await getEmployeeAssociations(id);
      const associatedSites = res[0]?.multiple_associated_info || [];
      setBaseSite(res[0]?.associated_organization_name);
      setBaseSiteId(res[0]?.associated_organization);
      setAssociatedSites(associatedSites);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAssociatedSites();
  }, []);

  const AssociationColumn = [
    { name: "Site ID", selector: (row) => row?.id, sortable: true },
    { name: "Site Name", selector: (row) => row?.site_name, sortable: true },
  ];

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

  const [associationId, setAssociationId] = useState(null);
  const [editSite, setEditSite] = useState(false);
  const handleEditSiteAssociation = async () => {
    setEditSite(true);
    try {
      const siteResponse = await getEmployeeAssociations(id);
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
  };

  const handleSubmitSiteAssociation = async () => {
    try {
      const siteIds = selectedSitesEdit.map((site) => site.value);
      const associationData = {
        multiple_associated: siteIds,
        organization: hrmsOrgId,
      };

      await updateEmployeeAssociations(associationId, associationData);
      toast.success("Site Association updated successfully");
      setEditSite(false);
      fetchAssociatedSites();
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
        <div className="w-full p-2 bg-white rounded-lg  mb-5">
          <Accordion
            icon={RiContactsBook2Line}
            title={"Basic Information"}
            content={
              <>
                {roleAccess?.can_edit_employee && (
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="border-2 rounded-full p-1 transition-all duration-150 hover:bg-opacity-30 border-green-400  px-4 text-green-400 mb-2 hover:bg-green-300 font-semibold flex items-center gap-2 "
                          onClick={handleEditEmployeeBasicInfo}
                        >
                          <FaCheck /> Save
                        </button>
                        <button
                          type="button"
                          className="border-2 rounded-full p-1 border-red-400  px-4 text-red-400 mb-2 hover:bg-opacity-30 hover:bg-red-300 font-semibold flex items-center gap-2 "
                          onClick={() => setIsEditing(false)}
                        >
                          <MdClose /> Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="bg-blue-500 text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded-full flex items-center gap-2 "
                        onClick={() => setIsEditing(true)}
                      >
                        <BiEdit /> Edit
                      </button>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="First Name"
                      value={formData.firstName}
                      required
                      readOnly={!isEditing}
                      onChange={handleChange}
                      name="firstName"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      value={formData.lastName}
                      placeholder="Last Name"
                      required
                      readOnly={!isEditing}
                      name="lastName"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email ID *
                    </label>
                    <input
                      type="email"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      readOnly={!isEditing}
                      name="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Mobile Number"
                      value={formData.mobile}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      name="mobile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender *
                    </label>
                    <select
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      required
                      disabled={!isEditing}
                      value={formData.gender}
                      onChange={handleChange}
                      name="gender"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      required
                      readOnly={!isEditing}
                      value={formData.dob}
                      onChange={handleChange}
                      name="dob"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      PAN
                    </label>
                    <input
                      type="text"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="PAN NUMBER"
                      readOnly={!isEditing}
                      value={formData.pan}
                      onChange={handleChange}
                      name="pan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Aadhar No
                    </label>
                    <input
                      type="text"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Aadhar Number"
                      readOnly={!isEditing}
                      value={formData.aadhar}
                      onChange={handleChange}
                      name="aadhar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Marital Status
                    </label>
                    <select
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      disabled={!isEditing}
                      onChange={handleChange}
                      value={formData.maritalStatus}
                      name="maritalStatus"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                    </select>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">User type</label>
                     <select
                     className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                       value={formData.userType}
      onChange={handleChange}
                      disabled={!isEditing}

                     >
                      <option value="pms_admin">Admin</option>
                      <option value="employee">Employee</option>
                     </select>
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User type
                    </label>
                    {isEditing ? (
                      <select
                        className="mt-1 p-2 w-full border rounded-md"
                        value={formData.userType}
                        onChange={handleChange}
                        name="userType"
                      >
                        <option value="employee">Employee</option>
                        <option value="pms_admin">Admin</option>
                        {/* <option value="pms_admin">PMS Admin</option>
      <option value="superadmin">Super Admin</option> */}
                      </select>
                    ) : (
                      <div className="mt-1 p-2 w-full border rounded-md bg-gray-200">
                        {formData.userType === "employee" && "Employee"}
                        {formData.userType === "pms_admin" && "Admin"}
                        {/* {formData.userType === "pms_admin" && "PMS Admin"}
      {formData.userType === "superadmin" && "Super Admin"} */}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location Required
                    </label>
                    <Switch
                      checked={formData.latRequired}
                      disabled={!isEditing}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          latRequired: !formData.latRequired,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      GeoTag Enable
                    </label>
                    <Switch
                      checked={formData.geotag_enabled}
                      disabled={!isEditing || !isAuthorized}
                      onChange={() =>
                        isAuthorized &&
                        setFormData({
                          ...formData,
                          geotag_enabled: !formData.geotag_enabled,
                        })
                      }
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isEditing ? "bg-gray-200" : ""
                      }`}
                      disabled={!isEditing}
                      onChange={handleChange}
                      value={formData.userType}
                      name="userType"
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option value={role.id} key={role.id}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>
              </>
            }
          />

          <Accordion
            icon={MdFamilyRestroom}
            title={"Family Information"}
            content={
              <>
                {roleAccess?.can_edit_employee && (
                  <div className="flex justify-end gap-2">
                    {isFamEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleEditFamily}
                          className="border-2 rounded-full p-1 transition-all duration-150 hover:bg-opacity-30 border-green-400  px-4 text-green-400 mb-2 hover:bg-green-300 font-semibold flex items-center gap-2 "
                        >
                          <FaCheck /> Save
                        </button>
                        <button
                          type="button"
                          className="border-2 rounded-full p-1 border-red-400  px-4 text-red-400 mb-2 hover:bg-opacity-30 hover:bg-red-300 font-semibold flex items-center gap-2 "
                          onClick={() => setIsFamEditing(false)}
                        >
                          <MdClose /> Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="bg-blue-500 text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded-full flex items-center gap-2"
                        onClick={() => setIsFamEditing(true)}
                      >
                        <BiEdit /> Edit
                      </button>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={familyData.fatherName}
                      onChange={handleFamChange}
                      name="fatherName"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isFamEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Father's Name"
                      readOnly={!isFamEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isFamEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Mother's Name"
                      value={familyData.motherName}
                      onChange={handleFamChange}
                      name="motherName"
                      readOnly={!isFamEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Spouse's Name
                    </label>
                    <input
                      type="text"
                      name="spouseName"
                      value={familyData.spouseName}
                      onChange={handleFamChange}
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isFamEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Spouse's Name"
                      readOnly={!isFamEditing}
                    />
                  </div>
                </div>
              </>
            }
          />

          <Accordion
            icon={FaHome}
            title={"Address Information"}
            content={
              <>
                {roleAccess?.can_edit_employee && (
                  <div className="flex justify-end gap-2">
                    {isAddressEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleEditAddress}
                          className="border-2 rounded-full p-1 transition-all duration-150 hover:bg-opacity-30 border-green-400  px-4 text-green-400 mb-2 hover:bg-green-300 font-semibold  "
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="border-2 rounded-full p-1 border-red-400  px-4 text-red-400 mb-2 hover:bg-opacity-30 hover:bg-red-300 font-semibold  "
                          onClick={() => setIsAddressEditing(false)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="bg-blue-500 text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded-full flex items-center gap-2"
                        onClick={() => setIsAddressEditing(true)}
                      >
                        <BiEdit /> Edit
                      </button>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={addressData.address1}
                      onChange={handleAddressChange}
                      name="address1"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isAddressEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Address Line 1"
                      maxLength="150"
                      readOnly={!isAddressEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={addressData.address2}
                      name="address2"
                      onChange={handleAddressChange}
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isAddressEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Address Line 2"
                      maxLength="150"
                      readOnly={!isAddressEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={addressData.city}
                      name="city"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isAddressEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="City"
                      readOnly={!isAddressEditing}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      name="state"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isAddressEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="State/Province"
                      readOnly={!isAddressEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zip / Pin Code
                    </label>
                    <input
                      type="text"
                      value={addressData.code}
                      name="code"
                      onChange={handleAddressChange}
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isAddressEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Zip / Pin Code"
                      readOnly={!isAddressEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      value={addressData.country}
                      onChange={handleAddressChange}
                      name="country"
                      className={`mt-1 p-2 w-full border rounded-md ${
                        !isAddressEditing ? "bg-gray-200" : ""
                      }`}
                      placeholder="Country"
                      readOnly={!isAddressEditing}
                    />
                  </div>
                </div>
              </>
            }
          />

          <Accordion
            icon={MdOutlinePayment}
            title={"Payment Information"}
            content={
              <div>
                {paymentsData.length === 0 && (
                  <>
                    {roleAccess?.can_edit_employee && (
                      <div className="flex justify-end">
                        <button
                          className="bg-blue-500 text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded-full flex items-center gap-2"
                          onClick={() => setAddPaymentInfoModal(true)}
                        >
                          <PiPlusCircle size={18} /> Add
                        </button>
                      </div>
                    )}
                  </>
                )}
                <Table
                  columns={PaymentColumn}
                  data={paymentsData}
                  isPagination={false}
                />
              </div>
            }
          />
          <Accordion
            icon={FaSitemap}
            title={"Site Association"}
            content={
              <div>
                <div>
                  <div className="flex items-center justify-between my-2">
                    <h2 className="text-lg ">
                      Base site:{" "}
                      <span className="font-medium">{baseSite} - </span>{" "}
                      <span className="font-medium">{`(${baseSiteId})`}</span>{" "}
                    </h2>
                    {!editSite && (
                      <button
                        className="bg-blue-500 text-white mb-2 hover:bg-gray-700 font-semibold py-2 px-4 rounded-full flex items-center gap-2 "
                        onClick={handleEditSiteAssociation}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {editSite && (
                    <div className="flex items-center gap-4 w-full my-2">
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
                        className="basic-multi-select z-50 w-full"
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
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="border-2 rounded-full p-1 transition-all duration-150 hover:bg-opacity-30 border-green-400  px-4 text-green-400 mb-2 hover:bg-green-300 font-semibold flex items-center gap-2 "
                          onClick={handleSubmitSiteAssociation}
                        >
                          <FaCheck /> Save
                        </button>
                        <button
                          type="button"
                          className="border-2 rounded-full p-1 border-red-400  px-4 text-red-400 mb-2 hover:bg-opacity-30 hover:bg-red-300 font-semibold flex items-center gap-2 "
                          onClick={() => setEditSite(false)}
                        >
                          <MdClose /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <Table
                  columns={AssociationColumn}
                  data={associatedSites}
                  // isPagination={false}
                />
              </div>
            }
          />

          {modalIsOpen && (
            <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
              <div className="max-h-screen bg-white p-8 w-96 rounded-lg shadow-lg overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold mb-4">Edit Payment Type</h2>
                  {/* <div className="flex flex-col gap-2">
                    <label
                      htmlFor=""
                      className="block text-sm font-medium text-gray-700"
                    >
                      Payment Type
                    </label>
                    <Select
                      id="paymentType"
                      options={paymentOptions}
                      isMulti // Enables multiple selection
                      value={selectedOptions}
                      onChange={handleSelectChange}
                      placeholder="Select payment type(s)"
                    />
                  </div> */}

                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="border border-gray-400  p-2 w-full rounded-md"
                      required
                      value={paymentData.paymentMode}
                      onChange={handlePaymentChange}
                      name="paymentMode"
                    >
                      <option value="">Select payment Mode</option>
                      {paymentModeList &&
                        paymentModeList.map((payment) => (
                          <option value={payment.id} key={payment.id}>
                            {payment.mode_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {paymentData.paymentMode === "3" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2 mt-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Bank Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          id=""
                          className="border border-gray-300  p-2  rounded-md"
                          placeholder="Enter bank name"
                          value={paymentData.bankName}
                          onChange={handlePaymentChange}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Bank Account Number{" "}
                          <span className="text-red-300">*</span>
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          id=""
                          className="border border-gray-400  p-2  rounded-md"
                          placeholder="Enter bank account no."
                          value={paymentData.accountNumber}
                          onChange={handlePaymentChange}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Bank IFSC code <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="Ifsc"
                          id=""
                          className="border border-gray-300  p-2  rounded-md"
                          placeholder="Enter IFSC"
                          value={paymentData.Ifsc}
                          onChange={handlePaymentChange}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex mt-2 justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="border-2 border-red-500 text-red-500 px-4 p-1 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditPaymentInfo}
                      type="submit"
                      className="bg-green-500 text-white p-1 px-5 rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {addPaymentInfoModal && (
            <div className="fixed inset-0 z-50 flex items-center overflow-y-auto justify-center bg-gray-500 bg-opacity-50">
              <div className="max-h-screen bg-white p-8 w-96 rounded-lg shadow-lg overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Add Payment Type</h2>

                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="border border-gray-400  p-2 w-full rounded-md"
                      required
                      value={paymentData.paymentMode}
                      onChange={handlePaymentChange}
                      name="paymentMode"
                    >
                      <option value="">Select payment Mode</option>
                      {paymentModeList &&
                        paymentModeList.map((payment) => (
                          <option value={payment.id} key={payment.id}>
                            {payment.mode_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {paymentData.paymentMode === "3" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2 mt-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Bank Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          id=""
                          className="border border-gray-300  p-2  rounded-md"
                          placeholder="Enter bank name"
                          value={paymentData.bankName}
                          onChange={handlePaymentChange}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Bank Account Number{" "}
                          <span className="text-red-300">*</span>
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          id=""
                          className="border border-gray-400  p-2  rounded-md"
                          placeholder="Enter bank account no."
                          value={paymentData.accountNumber}
                          onChange={handlePaymentChange}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Bank IFSC code <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="Ifsc"
                          id=""
                          className="border border-gray-300  p-2  rounded-md"
                          placeholder="Enter IFSC"
                          value={paymentData.Ifsc}
                          onChange={handlePaymentChange}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex mt-2 justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddPaymentInfoModal(false)}
                      className="border-2 border-red-500 text-red-500 px-4 p-1 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddPaymentInfo}
                      type="submit"
                      className="bg-green-500 text-white p-1 px-5 rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionsPersonal;