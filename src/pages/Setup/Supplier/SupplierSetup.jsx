import React, { useEffect, useMemo, useState } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import Table from "../../../components/table/Table";
import { PiPlusCircle } from "react-icons/pi";
import {
  deleteVendorCategory,
  deleteVendorType,
  getVendorCategory,
  getVendorsType,
} from "../../../api";
import { useSelector } from "react-redux";
import SupplierModal from "./SupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import toast from "react-hot-toast";
import SetupNavbar from "../../../components/navbars/SetupNavbar";
import { FaFilter } from "react-icons/fa";
import SiteHeader from "../../../components/SiteHeader";

const SupplierSetup = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [page, setPage] = useState("type");

  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filteredTypes, setFilteredTypes] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [added, setAdded] = useState(false);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [catId, setCatId] = useState("");
  const [typeId, setTypeId] = useState("");

  // ✅ Site State
  const [activeSiteId, setActiveSiteId] = useState("");

  // ================= FILTER STATES =================

  const [filterOpen, setFilterOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ================= FETCH =================

  const fetchType = async () => {
    try {
      const typeRes = await getVendorsType(activeSiteId);

      const data = typeRes?.data?.suppliers || [];

      setTypes(data);
      setFilteredTypes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategory = async () => {
    try {
      const catResp = await getVendorCategory(activeSiteId);

      const data = catResp?.data?.categories || [];

      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchType();
    fetchCategory();
  }, [added, activeSiteId]);

  // ================= SITE CHANGE =================

  const handleSiteChange = (siteId) => {
    setActiveSiteId(siteId);
  };

  // ================= SEARCH =================

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearchText(value);

    const searchWords = value.toLowerCase().split(" ").filter(Boolean);

    if (page === "type") {
      if (value.trim() === "") {
        setFilteredTypes(types);
      } else {
        const filtered = types.filter((item) => {
          const searchable = [item.name]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchWords.every((word) =>
            searchable.includes(word)
          );
        });

        setFilteredTypes(filtered);
      }
    } else {
      if (value.trim() === "") {
        setFilteredCategories(categories);
      } else {
        const filtered = categories.filter((item) => {
          const searchable = [item.name]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchWords.every((word) =>
            searchable.includes(word)
          );
        });

        setFilteredCategories(filtered);
      }
    }
  };

  // ================= DATE FILTER =================

  const dateFilteredTypes = useMemo(() => {
    let data = [...filteredTypes];

    if (!fromDate && !toDate) return data;

    return data.filter((item) => {
      if (!item.created_at) return true;

      const created = new Date(item.created_at);

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);

        if (created < from) return false;
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        if (created > to) return false;
      }

      return true;
    });
  }, [filteredTypes, fromDate, toDate]);

  const dateFilteredCategories = useMemo(() => {
    let data = [...filteredCategories];

    if (!fromDate && !toDate) return data;

    return data.filter((item) => {
      if (!item.created_at) return true;

      const created = new Date(item.created_at);

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);

        if (created < from) return false;
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        if (created > to) return false;
      }

      return true;
    });
  }, [filteredCategories, fromDate, toDate]);

  const clearDateFilter = () => {
    setFromDate("");
    setToDate("");
  };

  // ================= EDIT =================

  const handleEditTypeModal = (id) => {
    setTypeId(id);
    setEditModal(true);
  };

  const handleEditCategoryModal = (id) => {
    setCatId(id);
    setEditModal(true);
  };

  // ================= DELETE =================

  const handleDeleteType = async (id) => {
    try {
      await deleteVendorType(id);

      toast.success("Supplier Type Deleted Successfully ✅");

      setAdded(true);
    } catch (error) {
      console.log(error);

      toast.error("Failed To Delete Supplier Type ❌");
    } finally {
      setTimeout(() => {
        setAdded(false);
      }, 500);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteVendorCategory(id);

      toast.success("Supplier Category Deleted Successfully ✅");

      setAdded(true);
    } catch (error) {
      console.log(error);

      toast.error("Failed To Delete Supplier Category ❌");
    } finally {
      setTimeout(() => {
        setAdded(false);
      }, 500);
    }
  };

  // ================= COLUMNS =================

  const typeColumn = [
    {
      name: "Sr. no.",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Type",
      selector: (row) => row.name || "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Created At",
      selector: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString("en-GB")
          : "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">

          <button onClick={() => handleEditTypeModal(row.id)}>
            <BiEdit
              size={18}
              className="text-blue-500 hover:text-blue-700"
            />
          </button>

          <button onClick={() => handleDeleteType(row.id)}>
            <BiTrash
              size={18}
              className="text-red-500 hover:text-red-700"
            />
          </button>

        </div>
      ),
    },
  ];

  const catColumn = [
    {
      name: "Sr. no.",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Category",
      selector: (row) => row.name || "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Created At",
      selector: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString("en-GB")
          : "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">

          <button onClick={() => handleEditCategoryModal(row.id)}>
            <BiEdit
              size={18}
              className="text-blue-500 hover:text-blue-700"
            />
          </button>

          <button onClick={() => handleDeleteCategory(row.id)}>
            <BiTrash
              size={18}
              className="text-red-500 hover:text-red-700"
            />
          </button>

        </div>
      ),
    },
  ];

  // ================= DASHBOARD =================

  const totalTypes = types.length;
  const totalCategories = categories.length;

  const dashboardCards = [
    {
      title: "Total Supplier Types",
      value: totalTypes,
      bg: "bg-blue-400 text-white",
    },
    {
      title: "Total Supplier Categories",
      value: totalCategories,
      bg: "bg-green-400 text-white",
    },
  ];

  return (
    <section className="flex">
      <SetupNavbar />

      <div className="w-full flex mx-3 mb-5 flex-col overflow-hidden gap-4">

        {/* ✅ SITE HEADER */}

        <SiteHeader onSiteChange={handleSiteChange} />

        {/* ================= TABS ================= */}

        <div className="flex bg-gray-100 py-2 rounded-full shadow-inner justify-center mt-2">

          <button
            onClick={() => setPage("type")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${page === "type"
              ? "bg-blue-400 text-white shadow-md scale-105"
              : "text-gray-600 hover:text-blue-600"
              }`}
          >
            Supplier Type
          </button>

          <button
            onClick={() => setPage("category")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${page === "category"
              ? "bg-green-400 text-white shadow-md scale-105"
              : "text-gray-600 hover:text-green-600"
              }`}
          >
            Supplier Category
          </button>

        </div>

        {/* ================= SEARCH + ACTION ================= */}

        <div className="mt-2 flex md:flex-row flex-col justify-between md:items-center gap-4">

          <input
            type="text"
            placeholder={`Search ${page === "type"
              ? "Supplier Type"
              : "Supplier Category"
              }`}
            className="p-2 w-full border border-gray-300 rounded-md placeholder:text-sm outline-none"
            value={searchText}
            onChange={handleSearch}
          />

          <div className="flex gap-3">

            <button
              onClick={() => setFilterOpen(true)}
              style={{ background: themeColor }}
              className="text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaFilter />
              Filter
            </button>

            <button
              onClick={() => setAddModal(true)}
              style={{ background: themeColor }}
              className="font-semibold p-2 px-4 rounded-md text-white flex items-center gap-2 whitespace-nowrap"
            >
              <PiPlusCircle size={20} />

              {page === "type"
                ? "Add Type"
                : "Add Category"}
            </button>

          </div>
        </div>

        {/* ================= DASHBOARD ================= */}

        {/* <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">

          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.bg} rounded-xl p-4 shadow-lg hover:scale-95 transition duration-300`}
            >
              <div>
                <h3 className="text-sm font-medium opacity-90">
                  {card.title}
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {card.value}
                </p>
              </div>
            </div>
          ))}

        </div> */}

        {/* ================= TABLE ================= */}

        <div className="bg-white rounded-xl shadow-md p-4">

          {page === "type" && (
            <Table
              columns={typeColumn}
              data={dateFilteredTypes}
            />
          )}

          {page === "category" && (
            <Table
              columns={catColumn}
              data={dateFilteredCategories}
            />
          )}

        </div>
      </div>

      {/* ================= FILTER MODAL ================= */}

      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-lg font-semibold">
                Filter By Date
              </h2>

              <button
                onClick={() => setFilterOpen(false)}
                className="text-gray-500 text-xl"
              >
                ×
              </button>

            </div>

            <div className="space-y-4">

              <div>
                <label className="text-sm font-medium">
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  onClick={clearDateFilter}
                  className="px-4 py-2 rounded-lg border"
                >
                  Clear
                </button>

                <button
                  onClick={() => setFilterOpen(false)}
                  style={{ background: themeColor }}
                  className="px-5 py-2 text-white rounded-lg"
                >
                  Apply
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {addModal && (
        <SupplierModal
          page={page}
          onclose={() => setAddModal(false)}
          setAdded={setAdded}
          activeSiteId={activeSiteId}
        />
      )}

      {editModal && (
        <EditSupplierModal
          page={page}
          onclose={() => setEditModal(false)}
          setAdded={setAdded}
          catId={catId}
          typeId={typeId}
          activeSiteId={activeSiteId}
        />
      )}
    </section>
  );
};

export default SupplierSetup;