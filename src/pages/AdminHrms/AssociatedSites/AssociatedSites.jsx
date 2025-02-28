import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { BsEye, BsDownload } from "react-icons/bs";
import {
  PiPlusCircle,
  PiPlusCircleBold,
  PiPlusCircleFill,
} from "react-icons/pi";
import OrganisationSetting from "../OrganisationSetting";
import { GrHelpBook } from "react-icons/gr";
import { useSelector } from "react-redux";
import { getItemInLocalStorage } from "../../../utils/localStorage";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import {
  getAdminAccess,
  getAssociatedSiteDetails,
  getAssociatedSites,
  postAssociatedSites,
  putAssociatedSiteDetails,
} from "../../../api";
import toast from "react-hot-toast";
import { Switch } from "antd";
const AssociatedSites = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [editSelectedOption, setEditSelectedOption] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [headOfDepartment, setHeadOfDepartment] = useState("");
  const themeColor = useSelector((state) => state.theme.color);
  const [formData, setFormData] = useState({
    siteName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    latitude: "",
    longitude: "",
    radius: "",
    aadhar: false,
    pan: false,
    esic: false,
    BVG: false,
    clientName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function qrDownload(imageUrl) {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "image.png"; // Set the filename
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading image:", error));
  }
  const listItemStyle = {
    listStyleType: "disc",
    color: "gray",
    fontSize: "14px",
    fontWeight: 500,
  };
  const columns = [
    {
      name: "Site Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Site Name",
      selector: (row) => row.site_name,
      sortable: true,
    },
    {
      name: "city",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "state",
      selector: (row) => row.state,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status ? (
          <p className="text-green-400 font-medium">Active</p>
        ) : (
          <p className="text-red-400 font-medium">Inactive</p>
        ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          {roleAccess.can_add_edit_associated_sites && (
            <button onClick={() => handleEditModal(row.id)}>
              <BiEdit size={15} />
            </button>
          )}
          {/* <button
            onClick={() => handleDeleteDepartment(row.id)}
            className="text-red-400"
          >
            <FaTrash size={15} />
          </button> */}
        </div>
      ),
    },
    {
      name: "QR Code",
      cell: (row) => (
        <div className="flex items-center gap-4">
          {roleAccess.can_add_edit_associated_sites && (
            <a
              href={`https://api.hrms.vibecopilot.ai/${row.qr_code}`}
              target="_blank"
            >
              <BsEye size={15} />
            </a>
          )}
        </div>
      ),
    },
    {
      name: "Download Code",
      cell: (row) => (
        <div className="flex items-center gap-4">
          {roleAccess.can_add_edit_associated_sites && (
            <button
              onClick={() =>
                qrDownload(`https://api.hrms.vibecopilot.ai/${row.qr_code}`)
              }
            >
              <BsDownload size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const [siteDetails, setSiteDetails] = useState({
    siteName: "",
    clientName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    latitude: "",
    longitude: "",
    status: true,
    radius: "",
    aadhar: false,
    pan: false,
    esic: false,
    BVG: false,
  });
  const [siteId, setSiteId] = useState("");
  const handleEditModal = async (siteID) => {
    setSiteId(siteID);
    setIsModalOpen(true);
    try {
      const res = await getAssociatedSiteDetails(siteID);
      setSiteDetails({
        ...siteDetails,
        siteName: res?.site_name,
        clientName: res?.client_name || "",
        address1: res?.address_1,
        address2: res?.address_2,
        city: res?.city,
        state: res?.state,
        country: res?.country,
        latitude: res?.latitude,
        longitude: res?.longitude,
        pinCode: res?.zip_code,
        status: res?.status,
        radius: res?.radius,
        aadhar: res?.aadhar_required,
        qr_code_status: res?.qr_code_status,
        BVG: res?.pan_required,
        esic: res?.esic_required,
        pan: res?.bvg_required,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const hrmsOrgId = getItemInLocalStorage("HRMSORGID");
  const [associatedSites, setAssociatedSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const fetchAssociatedSites = async () => {
    try {
      const res = await getAssociatedSites(hrmsOrgId);
      setAssociatedSites(res);
      setFilteredSites(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAssociatedSites();
  }, []);

  const rorSiteId = getItemInLocalStorage("SITEID");
  const rorCompanyId = getItemInLocalStorage("COMPANYID");

  const handleAddAssociatedSite = async () => {
    if (!formData.siteName) {
      toast.error("Site name is required");
      return;
    }
    if (!formData.address1) {
      toast.error("Address 1 is required");
      return;
    }
    if (!formData.city) {
      toast.error("City is required");
      return;
    }
    if (!formData.state) {
      toast.error("State is required");
      return;
    }
    if (!formData.pinCode) {
      toast.error("Pin code is required");
      return;
    }
    if (!formData.country) {
      toast.error("Country is required");
      return;
    }
    const postData = new FormData();
    postData.append("site_name", formData.siteName);
    postData.append("client_name", formData.clientName);
    postData.append("address_1", formData.address1);
    postData.append("address_2", formData.address2);
    postData.append("city", formData.city);
    postData.append("state", formData.state);
    postData.append("zip_code", formData.pinCode);
    postData.append("country", formData.country);
    postData.append("latitude", formData.latitude);
    postData.append("longitude", formData.longitude);
    postData.append("radius", formData.radius);
    postData.append("status", true);
    postData.append("aadhar_required", formData.aadhar);
    postData.append("pan_required", formData.pan);
    postData.append("esic_required", formData.esic);
    postData.append("bvg_required", formData.BVG);
    postData.append("organization", hrmsOrgId);
    postData.append("company_id_ror", rorCompanyId);
    postData.append("site_id_ror", rorSiteId);

    try {
      const res = await postAssociatedSites(postData);
      toast.success("Site created successfully");
      fetchAssociatedSites();
      setIsModalOpen1(false);
      setFormData({
        siteName: "",
        clientName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pinCode: "",
        country: "",
        latitude: "",
        longitude: "",
        radius: "",
        qr_code_status: false,
        aadhar: false,
        BVG: false,
        esic: false,
        pan: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditChange = (e) => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };
  console.log(siteDetails);
  const handleEditAssociatedSites = async () => {
    if (!siteDetails.siteName) {
      toast.error("Site name is required");
      return;
    }
    if (!siteDetails.address1) {
      toast.error("Address 1 is required");
      return;
    }
    if (!siteDetails.city) {
      toast.error("City is required");
      return;
    }
    if (!siteDetails.state) {
      toast.error("State is required");
      return;
    }
    if (!siteDetails.pinCode) {
      toast.error("Pin code is required");
      return;
    }
    if (!siteDetails.country) {
      toast.error("Country is required");
      return;
    }
    const editData = new FormData();
    editData.append("site_name", siteDetails.siteName);
    editData.append("client_name", siteDetails.clientName);
    editData.append("address_1", siteDetails.address1);
    editData.append("address_2", siteDetails.address2);
    editData.append("city", siteDetails.city);
    editData.append("state", siteDetails.state);
    editData.append("zip_code", siteDetails.pinCode);
    editData.append("country", siteDetails.country);
    editData.append("latitude", siteDetails.latitude);
    editData.append("longitude", siteDetails.longitude);
    editData.append("radius", siteDetails.radius);
    editData.append("aadhar_required", siteDetails.aadhar);
    editData.append("pan_required", siteDetails.pan);
    editData.append("esic_required", siteDetails.esic);
    editData.append("bvg_required", siteDetails.BVG);
    editData.append("status", siteDetails.status);
    editData.append("organization", hrmsOrgId);
    editData.append("company_id_ror", rorCompanyId);
    editData.append("site_id_ror", rorSiteId);
    editData.append("qr_code_status", siteDetails.qr_code_status);

    try {
      await putAssociatedSiteDetails(siteId, editData);
      toast.success("Site updated successfully");
      // Update the associatedSites array:
      setAssociatedSites((prev) =>
        prev.map((site) =>
          site.id === siteId
            ? { ...site, qr_code_status: siteDetails.qr_code_status }
            : site
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);
    if (searchValue.trim() === "") {
      setFilteredSites(associatedSites);
    } else {
      const filteredResults = associatedSites.filter((role) =>
        role?.site_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredSites(filteredResults);
    }
  };
  // can_add_edit_associated_sites
  const empId = getItemInLocalStorage("HRMS_EMPLOYEE_ID");
  const orgId = getItemInLocalStorage("HRMSORGID");
  const [roleAccess, setRoleAccess] = useState({});
  useEffect(() => {
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

  return (
    <section className="flex ml-20">
      <OrganisationSetting />
      <div className="w-full flex m-3 flex-col overflow-hidden">
        <div className="flex justify-between gap-2 my-2 mt-3">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-400 w-full placeholder:text-sm rounded-md p-2"
            value={searchText}
            onChange={handleSearch}
          />
          {roleAccess?.can_add_edit_associated_sites && (
            <button
              onClick={() => setIsModalOpen1(true)}
              style={{ background: themeColor }}
              className="border-2 font-medium hover:text-white duration-150 transition-all  p-2 rounded-md text-white cursor-pointer text-center flex items-center gap-2 justify-center"
            >
              <PiPlusCircle size={20} />
              Add
            </button>
          )}
        </div>
        <Table columns={columns} data={filteredSites} isPagination={true} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-5 rounded-xl shadow-md w-[32rem]">
            <div className="flex justify-center border-b">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-center ">
                <BiEdit /> Edit Associated Sites
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto hide-scrollbar">
              <div className="flex justify-between items-center gap-1 border-b py-2">
                <label htmlFor="" className="font-medium">
                  Active/Inactive :
                </label>
                {/* <div className="flex items-center gap-2">

                 <p>Inactive</p> */}
                <Switch
                  checked={siteDetails.status}
                  onChange={() =>
                    setSiteDetails({
                      ...siteDetails,
                      status: !siteDetails.status,
                    })
                  }
                />
                {/* <p>Active</p> */}
                {/* </div> */}
              </div>
              <div className="flex justify-between items-center gap-1 border-b  py-2">
                <label htmlFor="" className="font-medium">
                  QR Code
                </label>
                {/* <div className="flex items-center gap-2">

                 <p>Inactive</p> */}
                <Switch
                  checked={siteDetails.qr_code_status}
                  onChange={() =>
                    setSiteDetails({
                      ...siteDetails,
                      qr_code_status: !siteDetails.qr_code_status,
                    })
                  }
                />
                {/* <p>Active</p> */}
                {/* </div> */}
              </div>
              <div className="flex flex-col gap-1 ">
                <label htmlFor="" className="font-medium">
                  Client name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={siteDetails.clientName}
                  onChange={handleEditChange}
                  id=""
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Client name"
                />
              </div>
              <div className="flex flex-col gap-1 ">
                <label htmlFor="" className="font-medium">
                  Site name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={siteDetails.siteName}
                  onChange={handleEditChange}
                  id=""
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Site name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={siteDetails.address1}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={siteDetails.address2}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={siteDetails.city}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="City"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={siteDetails.state}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="State/Province"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Zip/Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={siteDetails.pinCode}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Zip/Pin Code"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={siteDetails.country}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Country"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={siteDetails.latitude}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Latitude"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={siteDetails.longitude}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Longitude"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Radius
                  </label>
                  <input
                    type="text"
                    name="radius"
                    value={siteDetails.radius}
                    onChange={handleEditChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="radius(meter)"
                  />
                </div>
              </div>
              <div>
                <div className="border-b-2 border-black my-2 ">
                  <label htmlFor="" className="font-medium text-lg">
                    Documents required on site
                  </label>
                </div>
                <div className="flex gap-4 items-center mb-4">
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={siteDetails.aadhar === true}
                      onChange={() =>
                        setSiteDetails({
                          ...siteDetails,
                          aadhar: !siteDetails.aadhar,
                        })
                      }
                    />
                    <label htmlFor="">Aadhar </label>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={siteDetails.pan === true}
                      onChange={() =>
                        setSiteDetails({
                          ...siteDetails,
                          pan: !siteDetails.pan,
                        })
                      }
                    />
                    <label htmlFor="">Pan </label>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={siteDetails.esic === true}
                      onChange={() =>
                        setSiteDetails({
                          ...siteDetails,
                          esic: !siteDetails.esic,
                        })
                      }
                    />
                    <label htmlFor="">ESIC </label>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={siteDetails.BVG === true}
                      onChange={() =>
                        setSiteDetails({
                          ...siteDetails,
                          BVG: !siteDetails.BVG,
                        })
                      }
                    />
                    <label htmlFor="" title="Background verification">
                      BGV{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 my-2 border-t p-1">
              <button
                onClick={handleEditAssociatedSites}
                className="bg-green-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <MdClose /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen1 && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-xl w-[32rem]">
            <div className="flex justify-center border-b">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-center ">
                <PiPlusCircleFill /> Add Associated Sites
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto hide-scrollbar">
              <div className="flex flex-col gap-1 ">
                <label htmlFor="" className="font-medium">
                  Client name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  id=""
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Client name"
                />
              </div>
              <div className="flex flex-col gap-1 ">
                <label htmlFor="" className="font-medium">
                  Site name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  id=""
                  className="border border-gray-400 rounded-md p-2"
                  placeholder="Site name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Address 2 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address2"
                    onChange={handleChange}
                    value={formData.address2}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Address 1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    onChange={handleChange}
                    value={formData.city}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="City"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="State/Province"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Zip/Pin Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Zip/Pin Code"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Country"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Latitude"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Longitude"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="font-medium">
                    Radius
                  </label>
                  <input
                    type="number"
                    name="radius"
                    value={formData.radius}
                    onChange={handleChange}
                    id=""
                    className="border border-gray-400 rounded-md p-2"
                    placeholder="Radius (meter)"
                  />
                </div>
              </div>
              <div>
                <div className="border-b-2 border-black my-2 ">
                  <label htmlFor="" className="font-medium text-lg">
                    Documents required on site
                  </label>
                </div>
                <div className="flex gap-4 items-center mb-4">
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={formData.aadhar === true}
                      onChange={(e) =>
                        setFormData({ ...formData, aadhar: !formData.aadhar })
                      }
                    />
                    <label htmlFor="">Aadhar </label>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={formData.pan === true}
                      onChange={(e) =>
                        setFormData({ ...formData, pan: !formData.pan })
                      }
                    />
                    <label htmlFor="">Pan </label>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={formData.esic === true}
                      onChange={(e) =>
                        setFormData({ ...formData, esic: !formData.esic })
                      }
                    />
                    <label htmlFor="">ESIC </label>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={formData.BVG === true}
                      onChange={(e) =>
                        setFormData({ ...formData, BVG: !formData.BVG })
                      }
                    />
                    <label htmlFor="" title="Background verification">
                      BGV{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 my-2 border-t p-1">
              <button
                onClick={handleAddAssociatedSite}
                className="bg-green-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={() => setIsModalOpen1(false)}
                className="bg-red-400 flex gap-2 items-center p-1 px-2 rounded-md text-white"
              >
                <MdClose /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AssociatedSites;
