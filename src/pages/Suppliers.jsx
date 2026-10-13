import React, { useEffect, useMemo, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

import Navbar from "../components/Navbar";
import Table from "../components/table/Table";
import SiteHeader from "../components/SiteHeader";

import { getVendors } from "../api";
import { useSelector } from "react-redux";

const Suppliers = () => {
  const themeColor = useSelector((state) => state.theme.color);

  const [suppliers, setSuppliers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

  // ✅ Site State
  const [activeSiteId, setActiveSiteId] = useState("");

  // ================= FETCH =================

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchVendor = async (siteId = activeSiteId) => {
    try {
      setLoading(true);

      const vendorResponse = await getVendors(siteId);

      const vendorData = Array.isArray(vendorResponse?.data)
        ? vendorResponse.data
        : [];

      const sortedVendor = vendorData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setSuppliers(sortedVendor);
      setFilteredData(sortedVendor);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= SITE CHANGE =================

  const handleSiteChange = async (siteId) => {
    setActiveSiteId(siteId);
    fetchVendor(siteId);
  };

  // ================= SEARCH =================

  const handleSearch = (event) => {
    const searchValue = event.target.value;

    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(suppliers);
    } else {
      const searchWords = searchValue
        .toLowerCase()
        .split(" ")
        .filter(Boolean);

      const filteredResults = suppliers.filter((item) => {
        const searchable = [
          item.vendor_name,
          item.company_name,
          item.email,
          item.mobile,
          item.gstin_number,
          item.pan_number,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchWords.every((word) =>
          searchable.includes(word)
        );
      });

      setFilteredData(filteredResults);
    }
  };

  // ================= EXPORT =================

  const exportToExcel = () => {
    const mappedData = filteredData.map((supplier) => ({
      "Company Name": supplier.company_name || "-",
      "Vendor Name": supplier.vendor_name || "-",
      "Primary Phone": supplier.mobile || "-",
      "Secondary Phone": supplier.secondary_mobile || "-",
      "Primary Email": supplier.email || "-",
      "Secondary Email": supplier.secondary_email || "-",

      PAN: supplier.pan_number || "-",

      Website: supplier.website_url || "-",

      "GST Number": supplier.gstin_number || "-",

      Status: supplier.active ? "Active" : "Inactive",

      Address: `${supplier.address || ""} ${supplier.address2 || ""
        }`,

      District: supplier.district || "-",

      City: supplier.city || "-",

      State: supplier.state || "-",

      "Pin code": supplier.pincode || "-",

      Country: supplier.country || "-",

      "Bank Account Name": supplier.account_name || "-",

      "Bank Account Number": supplier.account_number || "-",

      "Bank & Branch": supplier.bank_branch_name || "-",

      IFSC: supplier.ifsc_code || "-",
    }));

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    const fileName = "supplier_data.xlsx";

    const ws = XLSX.utils.json_to_sheet(mappedData);

    const wb = {
      Sheets: { data: ws },
      SheetNames: ["data"],
    };

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: fileType,
    });

    const url = URL.createObjectURL(data);

    const link = document.createElement("a");

    link.href = url;

    link.download = fileName;

    link.click();
  };

  // ================= TABLE COLUMN =================

  const column = useMemo(
    () => [
      {
        name: "Action",
        cell: (row) => (
          <div className="flex items-center gap-4">
            <Link to={`/suppliers/supplier-details/${row.id}`}>
              <BsEye
                size={18}
                className="text-blue-500 hover:text-blue-700"
              />
            </Link>

            <Link to={`/suppliers/edit-supplier/${row.id}`}>
              <BiEdit
                size={18}
                className="text-green-500 hover:text-green-700"
              />
            </Link>
          </div>
        ),
      },

      {
        name: "Vendor Name",
        selector: (row) => row.vendor_name || "-",
        sortable: true,
        wrap: true,
      },

      {
        name: "Company Name",
        selector: (row) => row.company_name || "-",
        sortable: true,
        wrap: true,
      },

      {
        name: "Mobile Number",
        selector: (row) => row.mobile || "-",
        sortable: true,
      },

      {
        name: "Email",
        selector: (row) => row.email || "-",
        sortable: true,
        wrap: true,
      },

      {
        name: "GSTIN Number",
        selector: (row) => row.gstin_number || "-",
        sortable: true,
      },

      {
        name: "PAN Number",
        selector: (row) => row.pan_number || "-",
        sortable: true,
      },

      {
        name: "Created On",
        selector: (row) =>
          row.created_at
            ? new Date(row.created_at).toLocaleDateString("en-GB")
            : "-",
        sortable: true,
      },

      {
        name: "Status",
        cell: (row) =>
          row.active ? (
            <p className="bg-green-500 px-4 py-1 text-white rounded-full text-xs font-semibold">
              Active
            </p>
          ) : (
            <p className="bg-red-500 px-4 py-1 text-white rounded-full text-xs font-semibold">
              Inactive
            </p>
          ),
        sortable: true,
      },
    ],
    []
  );

  document.title = `Supplier - Vibe Connect`;

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full mx-3 mb-5 flex flex-col gap-4 overflow-hidden">

        {/* ✅ SITE HEADER */}

        <SiteHeader onSiteChange={handleSiteChange} />

        {/* ✅ TITLE */}

        <div className="mt-2">
          <h1 className="text-2xl font-bold">
            Suppliers Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage supplier details and records
          </p>
        </div>

        {/* ✅ SEARCH + ACTIONS */}

        <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">

          <input
            type="text"
            placeholder="Search by vendor, company, mobile, email, GSTIN, PAN"
            className="p-2 w-full border border-gray-300 rounded-md placeholder:text-sm outline-none"
            value={searchText}
            onChange={handleSearch}
          />

          <div className="flex gap-3">

            <Link
              to={"/suppliers/add-supplier"}
              style={{ background: themeColor }}
              className="rounded-lg flex font-semibold items-center gap-2 text-white p-2 px-4 whitespace-nowrap"
            >
              <IoAddCircleOutline size={20} />
              Add Supplier
            </Link>

            <button
              onClick={exportToExcel}
              style={{ background: themeColor }}
              className="text-white font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
            >
              Export
            </button>
          </div>
        </div>

        {/* ✅ DASHBOARD */}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">

          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-medium opacity-90">
              Total Suppliers
            </h3>

            <p className="text-3xl font-bold mt-2">
              {suppliers.length}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-medium opacity-90">
              Active Suppliers
            </h3>

            <p className="text-3xl font-bold mt-2">
              {suppliers.filter((i) => i.active).length}
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-medium opacity-90">
              Inactive Suppliers
            </h3>

            <p className="text-3xl font-bold mt-2">
              {suppliers.filter((i) => !i.active).length}
            </p>
          </div>
        </div>

        {/* ✅ TABLE */}

        <div className="bg-white rounded-xl shadow-md p-4">

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <p className="text-gray-500">
                Loading suppliers...
              </p>
            </div>
          ) : (
            <Table
              columns={column}
              data={filteredData}
              isPagination={true}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Suppliers;