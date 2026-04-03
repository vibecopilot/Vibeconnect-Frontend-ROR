import React, { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { API_URL, getAMC, getVibeBackground } from "../../api";
import Table from "../../components/table/Table";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { getItemInLocalStorage } from "../../utils/localStorage";
import Navbar from "../../components/Navbar";
import AssetNav from "../../components/navbars/AssetNav";
import { DNA } from "react-loader-spinner";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { MdClose, MdFileDownload } from "react-icons/md";

const AMC = () => {
  const [searchText, setSearchText] = useState("");
  const [amc, setAmc] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const themeColor = useSelector((state) => state.theme.color);

  useEffect(() => {
    const fetchAmc = async () => {
      try {
        setLoading(true);

        const response = await getAMC(1, 10);

        const amcData =
          response?.data?.asset_amcs ||
          response?.data?.data ||
          response?.data ||
          [];

        const sortedAmc = amcData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        setAmc(sortedAmc);
        setFilteredData(sortedAmc);
      } catch (error) {
        console.error("AMC Fetch Error:", error);
        setAmc([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAmc();
  }, []);
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(amc);
    } else {
      const filteredResults = amc.filter(
        (item) =>
          item.asset_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.vendor_name?.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredData(filteredResults);
    }
  };

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const AMCColumn = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/asset/asset-amc/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/assets/edit-amc/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Asset Name", selector: (row) => row.asset_name },
    { name: "Vendor", selector: (row) => row.vendor_name },
    { name: "Start Date", selector: (row) => row.start_date },
    { name: "End Date", selector: (row) => row.end_date },
    { name: "Frequency", selector: (row) => row.frequency },
    { name: "Created On", selector: (row) => dateFormat(row.created_at) },
  ];

  const exportToExcel = () => {
    let dataToExport = filteredData;

    if (startDate && endDate) {
      dataToExport = filteredData.filter((item) => {
        const createdDate = new Date(item.created_at);
        return (
          createdDate >= new Date(startDate) && createdDate <= new Date(endDate)
        );
      });
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "AMC_data.xlsx";
    link.click();

    setShowExportModal(false);
    setStartDate("");
    setEndDate("");
  };

  return (
    <section className="flex">
      <Navbar />

      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <AssetNav />

        <div className="flex md:flex-row flex-col justify-between items-center my-2 gap-2">
          <input
            type="text"
            placeholder="Search By Asset Name, Vendor Name"
            className="border-2 p-2 md:w-96 border-gray-300 rounded-lg"
            value={searchText}
            onChange={handleSearch}
          />

          <div className="md:flex grid grid-cols-2 gap-2">
            <button
              className="text-white font-medium py-2 px-4 rounded flex items-center gap-2"
              style={{ background: themeColor }}
              onClick={() => setShowExportModal(true)}
            >
              <MdFileDownload size={20} />
              Export
            </button>

            <Link
              to="/assets/add-amc"
              className="text-white font-medium py-2 px-4 rounded flex items-center gap-2"
              style={{ background: themeColor }}
            >
              <IoAddCircleOutline size={20} />
              Add
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <DNA height="120" width="120" visible />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex justify-center items-center h-96 text-gray-500 text-lg">
            No AMC Data Found
          </div>
        ) : (
          <Table columns={AMCColumn} data={filteredData} isPagination />
        )}
      </div>

      {/* EXPORT MODAL */}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Export AMC Data
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="text-black bg-gray-200 font-medium py-2 px-4 rounded-md flex items-center gap-2"
                onClick={() => setShowExportModal(false)}
              >
                <MdClose/>
                Cancel
              </button>

              <button
                className="text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
                style={{ background: themeColor }}
                onClick={exportToExcel}
              >
                <MdFileDownload/>
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AMC;