import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { IoAddCircleOutline, IoFilterOutline } from "react-icons/io5";
import { BsEye, BsFilterLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import { columnsData } from "../utils/assetColumns";
import { BiEdit, BiFilter, BiFilterAlt } from "react-icons/bi";
import {
  API_URL,
  getFloors,
  getPerPageSiteAsset,
  getSiteAsset,
  getFilteredSiteAssets,
  getSiteSearchedAsset,
  getUnits,
  getVibeBackground,
  downloadQrCode,
  getVendors,
  getGroups,
  getSubGroups,
  token,
  getAssetGroups,
} from "../api";
import axiosInstance from "../api/axiosInstance";
import { getItemInLocalStorage } from "../utils/localStorage";
import AMC from "./SubPages/AMC";
import Meter from "./Meter";
import { useSelector } from "react-redux";
import Inventory from "./Inventory";
import Checklist from "./Checklist";
import RoutineTask from "./RoutineTask";
import Table from "../components/table/Table";

import bridge from "/bridge.jpg";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import PPMActivity from "./SubPages/PPMActivity";
import { CirclesWithBar, DNA, ThreeDots } from "react-loader-spinner";
import AssetNav from "../components/navbars/AssetNav";
import ImportAssetModal from "../containers/modals/ImportAssetModal";
import { Pagination } from "antd";
import { FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";

// import jsPDF from "jspdf";
// import QRCode from "qrcode.react";

const Asset = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filter, setFilter] = useState(false);
  // const [omitColumn, setOmitColumn] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columnsData);
  // const [selectedRows, setSelectedRows] = useState([]);
  const [floors, setFloors] = useState([]);
  const [unitName, setUnitName] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [page, setPage] = useState("assets");
  const [assets, setAssets] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSubGroup, setSelectedSubGroup] = useState("");

  const [vendors, setVendors] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(value)
        ? prevSelectedOptions.filter((option) => option !== value)
        : [...prevSelectedOptions, value]
    );
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const vendorRes = await getVendors();
        const groupRes = await getAssetGroups();

        setVendors(vendorRes.data);
        setGroups(groupRes.data);
        setSubGroups([]); // ✅ initially empty
      } catch (err) {
        console.error(err);
      }
    };

    fetchDropdowns();
  }, []);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const vendorRes = await getVendors();
        const groupRes = await getAssetGroups();
        const subGroupRes = await getSubGroups();

        setVendors(vendorRes.data);
        setGroups(groupRes.data);
        setSubGroups(subGroupRes.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchDropdowns();
  }, []);

  const handleGroupChange = async (e) => {
    const groupId = e.target.value;

    setSelectedGroup(groupId);
    setSelectedSubGroup(""); // reset

    try {
      const res = await getSubGroups(groupId); // ✅ pass groupId

      console.log("Subgroups:", res.data); // debug

      setSubGroups(res.data); // ✅ update dropdown
    } catch (error) {
      console.error("SubGroup fetch error:", error);
    }
  };


  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  document.title = `Assets - Vibe Connect`;
  const column = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/assets/asset-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/assets/edit-asset/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Asset Name",
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: "Building",
      selector: (row) => row.building_name,
      sortable: true,
    },

    { name: "Floor", selector: (row) => row.floor_name, sortable: true },
    { name: "Unit", selector: (row) => row.unit_name, sortable: true },
    {
      name: "Asset Number",
      selector: (row) => row.asset_number,
      sortable: true,
    },
    {
      name: "Equipment Id",
      selector: (row) => row.equipemnt_id,
      sortable: true,
    },
    {
      name: "OEM Name",
      selector: (row) => row.oem_name,
      sortable: true,
    },

    {
      name: "Serial Number",
      selector: (row) => row.serial_number,
      sortable: true,
    },

    {
      name: "Model Number",
      selector: (row) => row.model_number,
      sortable: true,
    },

    {
      name: "Group",
      selector: (row) => row.group_name,
      sortable: true,
    },
    {
      name: "Sub Group",
      selector: (row) => row.sub_group_name,
      sortable: true,
    },
    {
      name: "Purchase Date",
      selector: (row) => row.purchased_on,
      sortable: true,
    },

    {
      name: "Purchase Cost",
      selector: (row) => row.purchase_cost,
      sortable: true,
    },

    {
      name: "Critical",
      selector: (row) => (row.critical ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!row.breakdown} // In Use = ON
            onChange={() => handleStatusToggle(row)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
          <div className="absolute w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-5 transition-all duration-300"></div>
        </label>
      ),
      sortable: true,
    },
    {
      name: "Capacity",
      selector: (row) => row.capacity,
      sortable: true,
    },

    {
      name: "Created On",
      selector: (row) => dateFormat(row.created_at),
      sortable: true,
    },
    {
      name: "Updated On",
      selector: (row) => dateFormat(row.updated_at),
      sortable: true,
    },
    {
      name: "Warranty",
      selector: (row) => (row.warranty_start === null ? "No" : "Yes"),
      sortable: true,
    },
    {
      name: "W Start",
      selector: (row) => row.warranty_start,
      sortable: true,
    },

    {
      name: "Installation Date",
      selector: (row) => row.installation,
      sortable: true,
    },
    {
      name: "W Expiry",
      selector: (row) => row.warranty_expiry,
      sortable: true,
    },

    {
      name: "Meter Configured",
      selector: (row) => (row.is_meter ? "Yes" : "No"),
      sortable: true,
    },

    {
      name: "Supplier",
      selector: (row) => row.vendor_name,
      sortable: true,
    },
  ];

  const [filteredData, setFilteredData] = useState([]);

  // const handleSearch = (e) => {
  //   const searchValue = e.target.value;
  //   setSearchText(searchValue);

  //   if (searchValue.trim() === "") {
  //     setFilteredData(assets);
  //   } else {
  //     const filteredResults = assets.filter(
  //       (item) =>
  //         item.building_name
  //           .toLowerCase()
  //           .includes(searchValue.toLowerCase()) ||
  //         item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
  //         (item.oem_name &&
  //           item.oem_name.toLowerCase().includes(searchValue.toLowerCase())) ||
  //         (item.unit_name &&
  //           item.unit_name.toLowerCase().includes(searchValue.toLowerCase()))
  //     );
  //     setFilteredData(filteredResults);
  //   }
  // };

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    try {
      // if search empty → reload paginated data
      if (!searchValue.trim()) {
        if (isFilterApplied) {
          const payload = {};
          if (selectedBuilding) payload.building_id = selectedBuilding;
          if (selectedFloor) payload.floor_id = selectedFloor;
          if (selectedUnit) payload.unit_id = selectedUnit;
          if (selectedGroup) payload.group_id = selectedGroup;
          if (selectedSubGroup) payload.sub_group_id = selectedSubGroup;
          if (selectedVendor) payload.vendor_id = selectedVendor;

          const response = await getFilteredSiteAssets(payload, pageNo, perPage);
          setFilteredData(response.data.site_assets);
          setTotal(response.data.total_count);
        } else {
          const response = await getPerPageSiteAsset(pageNo, perPage);
          setFilteredData(response.data.site_assets);
          setAssets(response.data.site_assets);
          setTotal(response.data.total_count);
        }
        return;
      }

      // Build search query with filters if applied
      let searchQuery = `q[oem_name_or_name_or_building_name_or_unit_name_cont]=${searchValue}`;

      if (isFilterApplied) {
        if (selectedBuilding) searchQuery += `&q[building_id_eq]=${selectedBuilding}`;
        if (selectedFloor) searchQuery += `&q[floor_id_eq]=${selectedFloor}`;
        if (selectedUnit) searchQuery += `&q[unit_id_eq]=${selectedUnit}`;
        if (selectedGroup) searchQuery += `&q[asset_group_id_eq]=${selectedGroup}`;
        if (selectedSubGroup) searchQuery += `&q[sub_group_id_eq]=${selectedSubGroup}`;
        if (selectedVendor) searchQuery += `&q[vendor_id_eq]=${selectedVendor}`;
      }

      const response = await axiosInstance.get(`/site_assets.json?token=${token}&page=${pageNo}&per_page=${perPage}&${searchQuery}`);

      setFilteredData(response.data.site_assets);
      setTotal(response.data.total_count);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  //   const handleStatusToggle = async (row) => {
  //   try {
  //     const updatedStatus = !row.breakdown;

  //     // 🔥 Call your API here
  //     // await updateAssetStatus(row.id, { breakdown: !updatedStatus });

  //     // Update UI instantly
  //     const updatedData = filteredData.map((item) =>
  //       item.id === row.id
  //         ? { ...item, breakdown: !updatedStatus }
  //         : item
  //     );

  //     setFilteredData(updatedData);

  //     toast.success("Status updated");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to update status");
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      if (searchText.trim()) return;

      setLoading(true); // 🔥

      try {
        if (isFilterApplied) {
          const payload = {};
          if (selectedBuilding) payload.building_id = selectedBuilding;
          if (selectedFloor) payload.floor_id = selectedFloor;
          if (selectedUnit) payload.unit_id = selectedUnit;
          if (selectedGroup) payload.group_id = selectedGroup;
          if (selectedSubGroup) payload.sub_group_id = selectedSubGroup;
          if (selectedVendor) payload.vendor_id = selectedVendor;

          const response = await getFilteredSiteAssets(payload, pageNo, perPage);
          setFilteredData(response.data.site_assets);
          setTotal(response.data.total_count);
        } else {
          const response = await getPerPageSiteAsset(pageNo, perPage);
          setFilteredData(response.data.site_assets);
          setAssets(response.data.site_assets);
          setTotal(response.data.total_count);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // 🔥
      }
    };

    fetchData();
  }, [pageNo, perPage, searchText, isFilterApplied, selectedBuilding, selectedFloor, selectedUnit, selectedGroup, selectedSubGroup, selectedVendor]);

  const handlePageChange = async (page, pageSize) => {
    setPageNo(page);
    setPerPage(pageSize);

    if (isFilterApplied) {
      const payload = {};
      if (selectedBuilding) payload.building_id = selectedBuilding;
      if (selectedFloor) payload.floor_id = selectedFloor;
      if (selectedUnit) payload.unit_id = selectedUnit;
      if (selectedGroup) payload.asset_group_id = selectedGroup;
      if (selectedSubGroup) payload.sub_group_id = selectedSubGroup;
      if (selectedVendor) payload.vendor_id = selectedVendor;

      const response = await getFilteredSiteAssets(payload, page, pageSize);
      setFilteredData(response.data.site_assets);
      setTotal(response.data.total_count);
    }
  };

  const exportToExcel = () => {
    const mappedData = filteredData.map((asset) => ({
      "Asset Name": asset.name,
      "Asset Type": asset.asset_type,
      "Serial No.": asset.serial_number,
      "Model No.": asset.model_number,
      Description: asset.description,
      Building: asset.building_name,
      Floor: asset.floor_name,
      Unit: asset.unit_name,
      Vendor: asset.vendor_name,
      "Asset Group": asset.group_name,
      "Asset Sub Group": asset.sub_group_name,
      "Purchased On": asset.purchased_on,
      "Purchased Cost": asset.purchase_cost,
      Critical: asset.critical ? "Yes" : "No",
      Breakdown: asset.breakdown ? "Yes" : "No",
      "Meter Configured": asset.is_meter ? "Yes" : "No",
      "Created On": dateFormat(asset.created_at),
      "Updated On": dateFormat(asset.updated_at),
      Comment: asset.remarks,
      Installation: asset.installation,
      "Warranty Start": asset.warranty_start,
      "Warranty Expiry": asset.warranty_expiry,
    }));
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileName = "asset_data.xlsx";
    const ws = XLSX.utils.json_to_sheet(mappedData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const buildings = getItemInLocalStorage("Building");

  const handleFilterApply = async () => {
    try {
      setLoading(true); // 🔥 start loading
      setPageNo(1);

      const payload = {};

      if (selectedBuilding) payload.building_id = selectedBuilding;
      if (selectedFloor) payload.floor_id = selectedFloor;
      if (selectedUnit) payload.unit_id = selectedUnit;
      if (selectedGroup) payload.group_id = selectedGroup;
      if (selectedSubGroup) payload.sub_group_id = selectedSubGroup;
      if (selectedVendor) payload.vendor_id = selectedVendor;

      const response = await getFilteredSiteAssets(payload, 1, perPage);

      setIsFilterApplied(true);
      setFilteredData(response.data.site_assets);
      setTotal(response.data.total_count);

    } catch (error) {
      console.error("Filter error:", error);
    } finally {
      setLoading(false); // 🔥 stop loading
    }
  };

  const handleFilterReset = () => {
    setSelectedBuilding("");
    setSelectedFloor("");
    setSelectedUnit("");
    setSelectedGroup("");
    setSelectedSubGroup("");
    setSelectedVendor("");

    setIsFilterApplied(false); // ✅ important
    setPageNo(1);
  };

  const handleBuildingChange = async (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);
    const response = await getFloors(buildingId);
    setFloors(response.data.map((item) => ({ name: item.name, id: item.id })));
    setSelectedFloor(""); // Reset floor and unit when building changes
    setUnitName([]);
    setSelectedUnit("");
  };

  const handleFloorChange = async (e) => {
    const floorId = e.target.value;
    setSelectedFloor(floorId);
    const response = await getUnits(floorId);
    setUnitName(
      response.data.map((item) => ({ name: item.name, id: item.id }))
    );
    setSelectedUnit(""); // Reset unit when floor changes
  };

  const handleUnitChange = (e) => {
    const unitId = e.target.value;
    setSelectedUnit(unitId);
  };

  const defaultImage = { index: 0, src: "" };
  let selectedImageSrc = defaultImage.src;
  let selectedImageIndex = defaultImage.index;
  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");

      // 🚨 If user_id not found → don't call API
      if (!user_id) {
        console.log("VIBEUSERID not found. Skipping background API call.");
        return;
      }

      const response = await getVibeBackground(user_id);

      if (response?.success && response?.data) {
        const imageUrl = API_URL + response.data.image;

        setSelectedImage(imageUrl);
        setSelectedIndex(response.data.index);

        console.log("Background loaded successfully");
      } else {
        console.log("Background API returned failure response");
      }
    } catch (error) {
      console.error(
        "Background API Error:",
        error.response?.status,
        error.response?.data
      );
    }
  };
  useEffect(() => {
    // Call the function to get the background image when the component mounts
    Get_Background();
  }, []);

  console.log(uploadModal);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectedRows = (rows) => {
    const selectedId = rows.map((row) => row.id);
    console.log(selectedId);
    setSelectedRows(selectedId);
  };

  const handleQrDownload = async () => {
    if (selectedRows.length === 0) {
      return toast.error("Please select at least one data.");
    }

    console.log(selectedRows);
    toast.loading("Qr code downloading, please wait!");

    try {
      const response = await downloadQrCode(selectedRows);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "qr_codes.pdf");
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);
      console.log(response);
      toast.dismiss();
      toast.success("Qr code downloaded successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Qr code:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <section
      className="flex"
      style={{
        background: `url(${selectedImage})no-repeat center center / cover`,
      }}
    >
      <Navbar />
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <AssetNav />

        {filter && page === "assets" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">

            <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] relative">

              {/* Close Button */}
              <button
                onClick={() => setFilter(false)}
                className="absolute top-2 right-3 text-gray-600 text-xl"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold mb-4">Filter By</h2>

              <div className="grid grid-cols-2 gap-4">

                {/* Building */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Building</label>
                  <select value={selectedBuilding} onChange={handleBuildingChange} className="border p-2 rounded">
                    <option value="">Select Building</option>
                    {buildings?.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Floor */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Floor</label>
                  <select value={selectedFloor} onChange={handleFloorChange} className="border p-2 rounded">
                    <option value="">Select Floor</option>
                    {floors?.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Unit</label>
                  <select value={selectedUnit} onChange={handleUnitChange} className="border p-2 rounded">
                    <option value="">Select Unit</option>
                    {unitName?.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                {/* Group */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Group</label>
                  <select value={selectedGroup} onChange={handleGroupChange} className="border p-2 rounded">
                    <option value="">Select Group</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub Group */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Sub Group</label>
                  <select value={selectedSubGroup} onChange={(e) => setSelectedSubGroup(e.target.value)} className="border p-2 rounded">
                    <option value="">Select Sub Group</option>
                    {subGroups.map((sg) => (
                      <option key={sg.id} value={sg.id}>{sg.name}</option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Supplier</label>
                  <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} className="border p-2 rounded">
                    <option value="">Select Supplier</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.vendor_name}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    handleFilterApply();
                    setFilter(false);
                  }}
                  className="px-4 py-2 text-white rounded"
                  style={{ background: themeColor }}
                >
                  Apply
                </button>

                <button
                  onClick={handleFilterReset}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Reset
                </button>
              </div>

            </div>
          </div>
        )}
        {/* {page === "assets" && (
          <> */}
        <div className="flex md:flex-row flex-col justify-between md:items-center my-2 gap-2  ">
          <input
            type="text"
            placeholder="Search By Building, Asset, Unit or OEM Name"
            className=" p-2 md:w-96 border-gray-300 rounded-md placeholder:text-sm outline-none border "
            value={searchText}
            onChange={handleSearch}
          />
          <div className="md:flex grid grid-cols-2 sm:flex-row my-2 flex-col gap-2">
            <Link
              to={"/assets/add-asset"}
              style={{ background: themeColor }}
              className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center"
            >
              <IoAddCircleOutline />
              Add Asset
            </Link>
            <button
              style={{ background: themeColor }}
              className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center"
              onClick={handleQrDownload}
            >
              <FaDownload />
              QR Code
            </button>
            <div className="" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ background: themeColor }}
                className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center w-full"
              >
                Hide Columns
                {dropdownOpen ? <IoIosArrowDown /> : <MdKeyboardArrowRight />}
              </button>
              {dropdownOpen && (
                <div className="absolute mt-2 bg-white border rounded shadow-md w-64 max-h-64 overflow-y-auto z-10">
                  {columnsData.map((column) => (
                    <label
                      key={column}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={column}
                        checked={selectedOptions.includes(column)}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">{column}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              className=" font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              onClick={() => setFilter(!filter)}
              style={{ background: themeColor }}
            >
              <BiFilterAlt />
              Filter
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              onClick={() => setUploadModal(true)}
              style={{ background: themeColor }}
            >
              Import
            </button>
            {/* <Link
            to={"/assets/asset-utilities"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              style={{ background: themeColor }}
            >
              Utilities
            </Link> */}
            {/* <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={exportToExcel}
            >
              Export
            </button> */}
            {/* <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDownloadQRCode}
            disabled={selectedRows.length === 0}
          >
            Download QR Code
          </button> */}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <DNA height="120" width="120" />
          </div>
        ) : filteredData.length > 0 ? (
          <>
            <Table
              selectableRows
              columns={column.filter(
                (col) => !selectedOptions.includes(col.name)
              )}
              data={filteredData}
              fixedHeader
              pagination={false}
              onSelectedRows={handleSelectedRows}
            />

            <div className="bg-white mb-10 p-2 flex justify-end">
              <Pagination
                current={pageNo}
                total={total}
                pageSize={perPage}
                onChange={handlePageChange}
                showSizeChanger
                onShowSizeChange={handlePageChange}
                pageSizeOptions={["10", "20", "50", "100"]}
              />
            </div>
          </>
        ) : (
    <div className="bg-white shadow rounded-lg p-10 text-center mt-4">
    <h2 className="text-xl font-semibold text-gray-600">
      No Submission Yet
    </h2>
  </div>
        )}
        {/* </>
        )} */}
        {page === "AMC" && <AMC />}
        {page === "meter" && <Meter />}
        {page === "checklist" && <Checklist />}
        {page === "inventory" && <Inventory />}
        {page === "routine" && <RoutineTask />}
        {page === "PPM" && <PPMActivity />}
        {uploadModal && (
          <ImportAssetModal onClose={() => setUploadModal(false)} />
        )}
      </div>
    </section>
  );
};

export default Asset;