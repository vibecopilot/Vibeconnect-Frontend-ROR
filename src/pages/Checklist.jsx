import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  API_URL,
  ChecklistImport,
  downloadSampleChecklist,
  editChecklist,
  exportChecklist,
  getChecklist,
  getChecklistTemplate,
  getVibeBackground,
  getChecklistGroups,
} from "../api";
import Table from "../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { MdClose, MdDeleteForever, MdFileDownload } from "react-icons/md";
import AssetNav from "../components/navbars/AssetNav";
import Navbar from "../components/Navbar";
import { getItemInLocalStorage } from "../utils/localStorage";
import { DNA } from "react-loader-spinner";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import FileInputBox from "../containers/Inputs/FileInputBox";
import { FiDownload, FiUpload } from "react-icons/fi";
import { FaCheckCircle, FaCopy, FaDownload, FaTimesCircle } from "react-icons/fa";
import Switch from "../Buttons/Switch";
import DatePicker from "react-datepicker";
import { BsEye } from "react-icons/bs";
import toast from "react-hot-toast";
import { Filter } from "lucide-react";

const Checklist = () => {
  const [checklists, setChecklists] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showImport, setShowImportModal] = useState(false); // FIXED: Proper state name
  const [showDownload, setShowDownloadModal] = useState(false); // FIXED: Proper state name
  const openModalImport = () => setShowImportModal(true);
  const closeModalImport = () => setShowImportModal(false);
  const openModalDownload = () => setShowDownloadModal(true);
  const closeModalDownload = () => setShowDownloadModal(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [importStatus, setImportStatus] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filterValues, setFilterValues] = useState({
    name: "",
    frequency: "",
    status: "",
    startDate: "",
    endDate: "",
    group: "",
  });
  const [checklistGroups, setChecklistGroups] = useState([]);

  const handleFileChange = (files) => {
    setSelectedFiles(files);
  };

  const handleApprove = async (row) => {
    try {
      await editChecklist({ is_approved: true }, row.id);
      await fetchChecklist();
      toast.success("Checklist approved successfully");
    } catch (error) {
      console.error("Error approving checklist:", error);
      toast.error("Failed to approve checklist");
    }
  };

  const handleReject = async (row) => {
    try {
      await editChecklist({ is_approved: false }, row.id);
      await fetchChecklist();
      toast.success("Checklist rejected successfully");
    } catch (error) {
      console.error("Error rejecting checklist:", error);
      toast.error("Failed to reject checklist");
    }
  };

  const handleImportChecklist = async () => {
    if (selectedFiles.length === 0) {
      setImportStatus("No files selected.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await ChecklistImport(formData);
      if (response.status === 200) {
        // setImportStatus("Checklist successfully imported!");
        toast.success("Checklist successfully imported!");
        await fetchChecklist();
        closeModalImport();
      } else {
        setImportStatus("Failed to import checklist.");
      }
    } catch (error) {
      console.error("Error importing checklist:", error);
      setImportStatus("An error occurred during import.");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadSampleChecklist();
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "sample_format_checklist.xlsx";
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to export checklist:", error);
      alert("Error exporting checklist. Please try again.");
    }
  };

  const themeColor = useSelector((state) => state.theme.color);

  const fetchChecklist = async () => {
    try {
      setLoading(true);

      const checklist = await getChecklist();

      const routineChecklistsOnly = checklist.data.checklists.filter(
        (checklist) => checklist.ctype === "routine"
      );

      const sortedChecklists = routineChecklistsOnly.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setChecklists(sortedChecklists);
      setFilteredData(sortedChecklists);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
    const fetchChecklistCategories = async () => {
      try {
        const response = await getChecklistGroups();
        setChecklistGroups(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching checklist categories:", error);
      }
    };

    fetchChecklistCategories();
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "300px",
    },
    {
      name: "frequency",
      selector: (row) => row.frequency,
      sortable: true,
    },
    {
      name: "Checklist Category",
      selector: (row) => row.group_name || "-",
      sortable: true,
    },
    { name: "Start Date", selector: (row) => row.start_date, sortable: true },
    { name: "End Date", selector: (row) => row.end_date, sortable: true },
    {
      name: "No. of Groups",
      selector: (row) => row?.groups?.length,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: (row) => row.is_approved === null ? (
    //     <span className="text-yellow-500">Pending</span>
    //   ) : row.is_approved ? (
    //     <span className="text-green-500">Approved</span>
    //   ) : (
    //     <span className="text-red-500">Rejected</span>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Associations",
      selector: (row) => (
        <div>
          <Link
            to={`/assets/associate-checklist/${row.id}`}
            className=" px-4 bg-green-400 text-white rounded-full"
          >
            Associate
          </Link>
        </div>
      ),
      sortable: true,
    },
    // {
    //   name: "Approvals",
    //   cell: (row) => (
    //     <div className="flex items-center gap-3">
    //       <FaCheckCircle
    //         className="text-green-500 cursor-pointer hover:text-green-700"
    //         size={22}
    //         title="Approve"
    //         onClick={() => handleApprove(row)}
    //       />
    //       <FaTimesCircle
    //         className="text-red-500 cursor-pointer hover:text-red-700"
    //         size={23}
    //         title="Reject"
    //         onClick={() => handleReject(row)}
    //       />
    //     </div>
    //   ),
    // },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/edit-checklist/${row.id}`}>
            <BsEye size={15} />
          </Link>
          {/* <Link to={`/admin/edit-checklist/${row.id}`}>
            <BiEdit size={15} />
          </Link> */}
          <Link to={`/admin/copy-checklist/${row.id}`}>
            <FaCopy size={15} />
          </Link>
        </div>
      ),
    },
  ];

  let selectedImageSrc = "";
  let selectedImageIndex = 0;
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      const data = await getVibeBackground(user_id);

      if (data.success) {
        selectedImageSrc = API_URL + data.data.image;
        selectedImageIndex = data.data.index;
        setSelectedImage(selectedImageSrc);
        setSelectedIndex(selectedImageIndex);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    Get_Background();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(checklists);
    } else {
      // FIXED: Filter from checklists (full routine list)
      const filteredResults = checklists.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredData(filteredResults);
    }
  };

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both Start Date and End Date");
      return;
    }

    try {
      // Format dates properly (YYYY-MM-DD)
      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];

      console.log("Exporting with date range:", formattedStart, "to", formattedEnd);

      const response = await exportChecklist(formattedStart, formattedEnd);

      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        alert("No data found for the selected date range.");
        return;
      }

      // Create blob and download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `checklist_report_${formattedStart}_to_${formattedEnd}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      closeModalDownload();

      // Optional: Reset date range after successful export
      setDateRange([null, null]);
    } catch (error) {
      console.error("Failed to export checklist:", error);
      alert("Error exporting checklist. Please check console for details.");
    }
  };

  const applyFilter = async () => {
    try {
      setLoading(true);

      const payload = {
        name: filterValues.name,
        frequency: filterValues.frequency,
        startDate: filterValues.startDate,
        endDate: filterValues.endDate,
        group: filterValues.group,
      };

      const response = await getChecklist(payload);

      setFilteredData(response.data.checklists);
      setChecklists(response.data.checklists);

      setShowFilter(false);
    } catch (error) {
      console.error("Filter API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = async () => {
    try {
      setLoading(true);

      setFilterValues({
        name: "",
        frequency: "",
        status: "",
        startDate: "",
        endDate: "",
        group: "",
      });

      const response = await getChecklist();

      const routineChecklistsOnly = response.data.checklists.filter(
        (item) => item.ctype === "routine"
      );

      const sortedData = routineChecklistsOnly.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setChecklists(sortedData);
      setFilteredData(sortedData);

    } catch (error) {
      console.error("Reset filter error:", error);
    } finally {
      setLoading(false);
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
        <div className="flex md:flex-row flex-col justify-between items-center my-2 gap-2  ">
          <input
            type="text"
            placeholder="Search By name"
            className="border-2 p-2 md:w-96 border-gray-300 rounded-lg placeholder:text-sm"
            value={searchText}
            onChange={handleSearch}
          />
          <div className="md:flex grid grid-cols-2 sm:flex-row  flex-col gap-2">
            <Link
              to={"/admin/add-checklist"}
              className="bg-black  text-sm rounded-lg flex justify-center font-semibold items-center gap-2 text-white py-2 px-4 transition-all duration-300 "
              style={{ background: themeColor }}
            >
              <IoAddCircleOutline size={20} />
              Add
            </Link>
            <button
              onClick={() => setShowFilter(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex justify-center items-center gap-2"
            >
              <Filter size={20} />   Filter
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex justify-center items-center gap-2"
              onClick={openModalImport}
              style={{ background: themeColor }}
            >
              <FiDownload size={15} /> Import
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex justify-center items-center gap-2"
              onClick={openModalDownload}
              style={{ background: themeColor }}
            >
              <FiUpload size={15} /> Export
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <DNA height="120" width="120" />
          </div>
        ) : filteredData.length > 0 ? (
          <Table
            columns={columns}
            data={filteredData}
            isPagination={true}
          />
        ) : (
          <div className="bg-white shadow rounded-lg p-10 text-center mt-4">
    <h2 className="text-xl font-semibold text-gray-600">
      No Submission Yet
    </h2>
  </div>
        )}
      </div>
      {showImport && ( // FIXED: Use correct state variable
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold text-center mb-4">Bulk Upload</h2>
            <FileInputBox
              handleChange={handleFileChange}
              fieldName="checklist"
              isMulti={true}
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleDownload}
                className="bg-red-500 text-white px-4 py-2 rounded"
                style={{ background: themeColor }}
              >
                Download Sample Format
              </button>
              <button
                onClick={closeModalImport}
                className="bg-red-500 text-white px-4 py-2 rounded"
                style={{ background: themeColor }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                style={{ background: themeColor }}
                onClick={handleImportChecklist}
              >
                Import
              </button>
            </div>
            {importStatus && <p className="mt-4 text-center">{importStatus}</p>}
          </div>
        </div>
      )}
      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[800px] shadow-lg relative">

            {/* Close */}
            <button
              className="absolute top-3 right-3 text-[30px] text-gray-500 hover:text-gray-700 transition"
              onClick={() => setShowFilter(false)}
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">Filter By</h2>

            <div className="grid grid-cols-3 gap-4">

              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Name</label>
                <input
                  type="text"
                  className="border p-2 rounded"
                  value={filterValues.name}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, name: e.target.value })
                  }
                />
              </div>

              {/* Frequency */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Frequency</label>
                <select
                  className="border p-2 rounded"
                  value={filterValues.frequency}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, frequency: e.target.value })
                  }
                >
                  <option value="">Select Frequency</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half_yearly">Half Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Status */}
              {/* <div className="flex flex-col">
                <label className="text-sm mb-1">Status</label>
                <select
                  className="border p-2 rounded"
                  value={filterValues.status}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, status: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div> */}

              {/* Start Date */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Start Date</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={filterValues.startDate}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, startDate: e.target.value })
                  }
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">End Date</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={filterValues.endDate}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, endDate: e.target.value })
                  }
                />
              </div>

              {/* Group */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Checklist Category</label>
                <select
                  className="border p-2 rounded"
                  value={filterValues.group}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, group: e.target.value })
                  }
                >
                  <option value="">Select Checklist Category</option>
                  {checklistGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={applyFilter}
                className="bg-gray-700 text-white px-6 py-2 rounded"
              >
                Filter
              </button>

              <button
                onClick={clearFilter}
                className="border px-6 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      {showDownload && ( // FIXED: Use correct state variable
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex z-10 justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg fw-bold mb-4 text-center">
              <b>Export Checklist Report</b>{" "}
            </h2>
            <div className="flex gap-4 mt-8">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Start Date :
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setDateRange([date, endDate])}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="border p-2 rounded w-40"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">End Date :</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setDateRange([startDate, date])}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  className="border p-2 rounded w-40"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModalDownload}
                className="bg-red-500 text-white px-4 py-3 rounded-lg flex"
                style={{ background: themeColor }}
              >
                <MdClose className="h-5 w-5 mx-1" /> Cancel
              </button>
              <button
                onClick={handleExport}
                className="bg-green-500 text-white px-4 py-3 rounded-lg flex"
                style={{ background: themeColor }}
              >
                <MdFileDownload className="h-5 w-5 mx-1" /> Export
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checklist;