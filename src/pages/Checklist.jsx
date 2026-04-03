import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  API_URL,
  ChecklistImport,
  downloadSampleChecklist,
  exportChecklist,
  getChecklist,
  getChecklistTemplate,
  getVibeBackground,
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
import { FaCopy, FaDownload } from "react-icons/fa";
import Switch from "../Buttons/Switch";
import DatePicker from "react-datepicker";
import { BsEye } from "react-icons/bs";

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

  const handleFileChange = (files) => {
    setSelectedFiles(files);
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
        setImportStatus("Checklist successfully imported!");
        await getChecklist();
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

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const checklist = await getChecklist();

        // FIXED: Filter only ctype: "routine" (opposite of PPMActivity)
        const routineChecklistsOnly = checklist.data.checklists.filter(
          (checklist) => checklist.ctype === "routine",
        );

        const sortedChecklists = routineChecklistsOnly.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setChecklists(sortedChecklists);
        setFilteredData(sortedChecklists);
        console.log("Routine Checklists:", sortedChecklists);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChecklist();
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
    { name: "Start Date", selector: (row) => row.start_date, sortable: true },
    { name: "End Date", selector: (row) => row.end_date, sortable: true },
    {
      name: "No. of Groups",
      selector: (row) => row?.groups?.length,
      sortable: true,
    },
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
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/edit-checklist/${row.id}`}>
            <BsEye size={15} />
          </Link>
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
      alert("Please select start date and end date");
      return;
    }

    try {
      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];

      const response = await exportChecklist(formattedStart, formattedEnd);

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "checklist_report.xlsx";
      link.click();

      window.URL.revokeObjectURL(downloadUrl);

      closeModalDownload();
    } catch (error) {
      console.error("Failed to export checklist:", error);
      alert("Error exporting checklist");
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
        {checklists.length !== 0 ? (
          <Table columns={columns} data={filteredData} isPagination={true} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <DNA
              visible={true}
              height="120"
              width="120"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
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
                  placeholderText="dd/mm/yyyy"
                  className="border p-2 rounded w-40"
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
                  placeholderText="dd/mm/yyyy"
                  className="border p-2 rounded w-40"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModalDownload}
                className="bg-red-500 text-white px-4 py-3 rounded-lg flex"
                style={{ background: themeColor }}
              >
                <MdClose className="h-5 w-5 mx-1"/> Cancel
              </button>
              <button
                onClick={handleExport}
                className="bg-green-500 text-white px-4 py-3 rounded-lg flex"
                style={{ background: themeColor }}
              >
                <MdFileDownload className="h-5 w-5 mx-1"/> Export
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Checklist;