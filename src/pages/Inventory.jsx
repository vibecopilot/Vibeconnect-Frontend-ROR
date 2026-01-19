import React, { useEffect, useState, useMemo } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  API_URL,
  getInventory,
  getMasters,
  getVibeBackground,
  ImportMasters,
} from "../api";
import Table from "../components/table/Table";
import { BiEdit } from "react-icons/bi";
import AssetNav from "../components/navbars/AssetNav";
import Navbar from "../components/Navbar";
import { getItemInLocalStorage } from "../utils/localStorage";
import GRN from "./GRN";
import GDN from "./GDN";
import { BsEye } from "react-icons/bs";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import FileInputBox from "../containers/Inputs/FileInputBox";

const Inventory = () => {
  const [stocks, setStocks] = useState([]);
  const [masters, setMastersState] = useState([]);
  const [searchText, setSearchText] = useState("");

  // ✅ keep separate filtered lists for Masters & Stocks
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [filteredMasters, setFilteredMasters] = useState([]);

  const [page, setPage] = useState("Masters");
  const themeColor = useSelector((state) => state.theme.color);

  // ✅ modal state name fix
  const [showImport, setShowImport] = useState(false);
  const openModalImport = () => setShowImport(true);
  const closeModalImport = () => setShowImport(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [importStatus, setImportStatus] = useState("");

  // ✅ background as string
  const [bgImage, setBgImage] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;

    if (data && typeof data === "object") {
      if (Array.isArray(data.inventories)) return data.inventories;
      if (Array.isArray(data.masters)) return data.masters;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.items)) return data.items;

      // ✅ extra common keys
      if (Array.isArray(data.stocks)) return data.stocks;
      if (Array.isArray(data.inventory)) return data.inventory;
    }
    return [];
  };

  const dateFormat = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // ✅ robust pick helper for group/sub-group values
  const pickText = (...vals) => {
    for (const v of vals) {
      if (v === 0) return "0";
      if (typeof v === "string" && v.trim()) return v.trim();
      if (typeof v === "number") return String(v);
    }
    return "-";
  };

  const getGroupName = (row) =>
    pickText(
      row?.group_name,
      row?.groupName,
      row?.group,
      row?.group?.name,
      row?.asset_group,
      row?.asset_group_name,
      row?.asset_group?.name,
      row?.group_master_name
    );

  const getSubGroupName = (row) =>
    pickText(
      row?.sub_group_name,
      row?.subGroupName,
      row?.sub_group,
      row?.sub_group?.name,
      row?.asset_sub_group,
      row?.asset_sub_group_name,
      row?.asset_sub_group?.name,
      row?.sub_group_master_name
    );

  // ✅ Fetch Stocks
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const invResp = await getInventory();
        const list = normalizeList(invResp?.data);

        const sorted = [...list].sort(
          (a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0)
        );

        setStocks(sorted);
        setFilteredStocks(sorted);
      } catch (error) {
        console.log("getInventory error:", error);
        setStocks([]);
        setFilteredStocks([]);
      }
    };

    fetchInventory();
  }, []);

  // ✅ Fetch Masters
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const resp = await getMasters();
        const list = normalizeList(resp?.data);

        const sorted = [...list].sort(
          (a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0)
        );

        setMastersState(sorted);
        setFilteredMasters(sorted);
      } catch (error) {
        console.log("getMasters error:", error);
        setMastersState([]);
        setFilteredMasters([]);
      }
    };

    fetchMasters();
  }, []);

  // ✅ Background
  const Get_Background = async () => {
    try {
      const user_id = getItemInLocalStorage("VIBEUSERID");
      if (!user_id) return;

      const resp = await getVibeBackground(user_id);
      const data = resp?.data;

      const imagePath = data?.data?.image || data?.image;

      if (imagePath) {
        setBgImage(API_URL + imagePath);
      }
    } catch (error) {
      console.log("getVibeBackground error:", error);
      setBgImage("");
    }
  };

  useEffect(() => {
    Get_Background();
  }, []);

  // ✅ search works for current page (Masters / Stocks)
  const handleSearch = (event) => {
    const val = event.target.value;
    setSearchText(val);

    const q = val.trim().toLowerCase();
    if (!q) {
      setFilteredStocks(stocks);
      setFilteredMasters(masters);
      return;
    }

    if (page === "stocks") {
      const filtered = (Array.isArray(stocks) ? stocks : []).filter((item) => {
        const name = String(item?.name || "").toLowerCase();
        const group = String(getGroupName(item) || "").toLowerCase();
        const subGroup = String(getSubGroupName(item) || "").toLowerCase();
        return name.includes(q) || group.includes(q) || subGroup.includes(q);
      });
      setFilteredStocks(filtered);
      return;
    }

    // Masters
    const filteredM = (Array.isArray(masters) ? masters : []).filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const group = String(getGroupName(item) || "").toLowerCase();
      const subGroup = String(getSubGroupName(item) || "").toLowerCase();
      const code = String(item?.code || "").toLowerCase();
      return (
        name.includes(q) || code.includes(q) || group.includes(q) || subGroup.includes(q)
      );
    });
    setFilteredMasters(filteredM);
  };

  const handleFileChange = (files) => setSelectedFiles(files);

  const handleImportMasters = async () => {
    if (!selectedFiles.length) {
      setImportStatus("No files selected.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("file", file));

    try {
      const response = await ImportMasters(formData);
      if (response?.status === 200) {
        setImportStatus("Masters successfully imported!");
        closeModalImport();

        const resp = await getMasters();
        const list = normalizeList(resp?.data);
        setMastersState(list);
        setFilteredMasters(list);
      } else {
        setImportStatus("Failed to import masters.");
      }
    } catch (error) {
      console.error("Error importing masters:", error);
      setImportStatus("An error occurred during import.");
    }
  };

  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileName = "Stocks Data.xlsx";
    const ws = XLSX.utils.json_to_sheet(stocks);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const columnsmaster = useMemo(
    () => [
      {
        name: "Action",
        cell: (row) => (
          <div className="flex items-center gap-4">
            <Link to={`/admin/master-details/${row.id}`}>
              <BsEye size={15} />
            </Link>
            <Link to={`/admin/edit-masters/${row.id}`}>
              <BiEdit size={15} />
            </Link>
          </div>
        ),
      },
      { name: "Name", selector: (row) => pickText(row?.name), sortable: true },
      { name: "Code", selector: (row) => pickText(row?.code), sortable: true },
      {
        name: "Serial number",
        selector: (row) => pickText(row?.serial_number),
        sortable: true,
      },
      {
        name: "Type",
        selector: (row) => (row?.inventory_type == 1 ? "Spares" : "Consumable"),
        sortable: true,
      },

      // ✅ FIXED: Group/Sub Group resolved from multiple keys
      { name: "Group", selector: (row) => getGroupName(row), sortable: true },
      { name: "Sub Group", selector: (row) => getSubGroupName(row), sortable: true },

      { name: "Category", selector: (row) => pickText(row?.category), sortable: true },

      // (optional) Manufacturer key might be different, keep safe
      {
        name: "Manufacturer",
        selector: (row) => pickText(row?.Manufacturer, row?.manufacturer, row?.manufacturer_name),
        sortable: true,
      },

      {
        name: "Criticality",
        selector: (row) => (row?.criticality == 1 ? "Critical" : "Non-Critical"),
        sortable: true,
      },
      { name: "Unit", selector: (row) => pickText(row?.unit), sortable: true },
      { name: "Cost", selector: (row) => pickText(row?.cost), sortable: true },
      { name: "SAC/HSN Code", selector: (row) => pickText(row?.hsn_id), sortable: true },
      {
        name: "Min Stock Level",
        selector: (row) => pickText(row?.min_stock_level),
        sortable: true,
      },
      {
        name: "Min Order Level",
        selector: (row) => pickText(row?.min_order_level),
        sortable: true,
      },
      { name: "Quantity", selector: (row) => pickText(row?.quantity), sortable: true },
      { name: "Asset", selector: (row) => pickText(row?.asset_id), sortable: true },
      {
        name: "Status",
        selector: (row) => (row?.active === true ? "Active" : "Inactive"),
        sortable: true,
      },
      {
        name: "Expiry Date",
        selector: (row) => dateFormat(row?.expiry_date),
        sortable: true,
      },
    ],
    [masters]
  );

  const columns = useMemo(
    () => [
      {
        name: "Action",
        cell: (row) => (
          <div className="flex items-center gap-4">
            <Link to={`/admin/stock-details/${row.id}`}>
              <BsEye size={15} />
            </Link>
            <Link to={`/admin/edit-stock/${row.id}`}>
              <BiEdit size={15} />
            </Link>
          </div>
        ),
      },
      { name: "Name", selector: (row) => pickText(row?.name), sortable: true },
      {
        name: "Description",
        selector: (row) => pickText(row?.description),
        sortable: true,
      },
      {
        name: "Available Quantity",
        selector: (row) => pickText(row?.available_quantity),
        sortable: true,
      },
      { name: "Rate", selector: (row) => pickText(row?.rate), sortable: true },

      // ✅ FIXED: Group/Sub Group resolved from multiple keys
      { name: "Group", selector: (row) => getGroupName(row), sortable: true },
      { name: "Sub Group", selector: (row) => getSubGroupName(row), sortable: true },

      { name: "Min Order Level", selector: (row) => pickText(row?.min_stock), sortable: true },
      { name: "Max Order Level", selector: (row) => pickText(row?.max_stock), sortable: true },
      { name: "Added On", selector: (row) => dateFormat(row?.created_at), sortable: true },
    ],
    [stocks]
  );

  return (
    <section
      className="flex"
      style={{
        background: bgImage ? `url(${bgImage}) no-repeat center center / cover` : undefined,
      }}
    >
      <Navbar />
      <div className="p-4 w-full my-2 flex md:mx-2 overflow-hidden flex-col">
        <AssetNav />

        <div className="w-full my-2 flex overflow-hidden flex-col">
          <div className="flex w-full">
            <div className="flex gap-2 p-2 pb-0 border-b-2 border-gray-200 w-full">
              <h2
                className={`p-1 ${
                  page === "Masters" &&
                  "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
                onClick={() => {
                  setPage("Masters");
                  setSearchText("");
                  setFilteredMasters(masters);
                }}
              >
                Masters
              </h2>

              <h2
                className={`p-1 ${
                  page === "stocks" &&
                  "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                } rounded-t-md px-4 cursor-pointer text-center transition-all duration-300 ease-linear`}
                onClick={() => {
                  setPage("stocks");
                  setSearchText("");
                  setFilteredStocks(stocks);
                }}
              >
                Stocks
              </h2>

              <h2
                className={`p-1 ${
                  page === "grn" &&
                  "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
                onClick={() => setPage("grn")}
              >
                GRN
              </h2>

              <h2
                className={`p-1 ${
                  page === "gdn" &&
                  "bg-white font-medium text-blue-500 shadow-custom-all-sides"
                } rounded-t-md px-4 cursor-pointer transition-all duration-300 ease-linear`}
                onClick={() => setPage("gdn")}
              >
                GDN
              </h2>
            </div>
          </div>
        </div>

        {page === "Masters" && (
          <>
            <div className="flex md:flex-row flex-col justify-between items-center my-2 gap-2">
              <input
                type="text"
                placeholder="Search (name/code/group/subgroup)"
                className="border-2 p-2 md:w-96 border-gray-300 rounded-lg placeholder:text-sm"
                value={searchText}
                onChange={handleSearch}
              />

              <div className="md:flex grid grid-cols-2 sm:flex-row my-2 flex-col gap-2">
                <Link
                  style={{ background: themeColor }}
                  to={"/admin/add-masters"}
                  className="text-sm rounded-lg flex justify-center font-semibold items-center gap-2 text-white py-2 px-4 transition-all duration-300"
                >
                  <IoAddCircleOutline size={20} />
                  Add
                </Link>

                <button
                  className="text-white font-bold py-2 px-4 rounded"
                  style={{ background: themeColor }}
                  onClick={openModalImport}
                >
                  Import
                </button>

                {showImport && (
                  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex z-10 justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-1/2">
                      <h2 className="text-xl mb-4">Bulk Upload</h2>

                      <FileInputBox
                        handleChange={handleFileChange}
                        fieldName="masters"
                        isMulti={true}
                      />

                      <div className="mt-4 flex justify-end space-x-4">
                        <button
                          onClick={closeModalImport}
                          className="text-white px-4 py-2 rounded"
                          style={{ background: themeColor }}
                        >
                          Cancel
                        </button>

                        <button
                          className="text-white px-4 py-2 rounded"
                          style={{ background: themeColor }}
                          onClick={handleImportMasters}
                        >
                          Import
                        </button>
                      </div>

                      {importStatus && (
                        <p className="mt-4 text-center">{importStatus}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Table columns={columnsmaster} data={filteredMasters} />
          </>
        )}

        {page === "stocks" && (
          <>
            <div className="flex md:flex-row flex-col justify-between items-center my-2 gap-2">
              <input
                type="text"
                placeholder="Search (name/group/subgroup)"
                className="border-2 p-2 md:w-96 border-gray-300 rounded-lg placeholder:text-sm"
                value={searchText}
                onChange={handleSearch}
              />

              <div className="md:flex grid grid-cols-2 sm:flex-row my-2 flex-col gap-2">
                <Link
                  style={{ background: themeColor }}
                  to={"/admin/add-stock"}
                  className="text-sm rounded-lg flex justify-center font-semibold items-center gap-2 text-white py-2 px-4 transition-all duration-300"
                >
                  <IoAddCircleOutline size={20} />
                  Add
                </Link>
              </div>
            </div>

            <Table columns={columns} data={filteredStocks} />
          </>
        )}

        {page === "grn" && <GRN />}
        {page === "gdn" && <GDN />}
      </div>
    </section>
  );
};

export default Inventory;
