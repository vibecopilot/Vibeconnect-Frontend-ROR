import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/table/Table";
import { BsEye } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://admin.vibecopilot.ai/vendors.json?token=e6fbf77f4fbb5a72c4150e495c961972f0f14059d8a6670f"
      );
      const data = await response.json();
      setVendors(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/vendor-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
          <Link to={`/admin/edit-vendor/${row.id}`}>
            <BiEdit size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_name,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row) => row.company_name || "-",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.active
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
  ];

  const filteredData = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        vendor.vendor_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        vendor.mobile?.includes(searchText) ||
        vendor.company_name?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && vendor.active) ||
        (statusFilter === "inactive" && !vendor.active);

      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchText, statusFilter]);

  const handleExport = () => {
    const csv = [
      [
        "ID",
        "Vendor Name",
        "Company",
        "Email",
        "Mobile",
        "Address",
        "Active",
        "Created Date",
      ],
      ...filteredData.map((vendor) => [
        vendor.id,
        vendor.vendor_name,
        vendor.company_name || "-",
        vendor.email,
        vendor.mobile,
        vendor.address || "-",
        vendor.active ? "Yes" : "No",
        new Date(vendor.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendors.csv";
    a.click();
  };

  return (
    <section className="flex">
      <Navbar />
      <div className="p-2 w-full flex overflow-hidden flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Vendors</h1>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Loading vendors...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-96">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-2">
            <div className="flex md:flex-row md:justify-between flex-col gap-10 my-2">
              <div className="sm:flex grid grid-cols-2 items-center justify-center gap-4 border border-gray-300 rounded-md px-3 p-2 w-auto">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="all"
                    name="status"
                    checked={statusFilter === "all"}
                    onChange={() => setStatusFilter("all")}
                  />
                  <label htmlFor="all" className="text-sm">
                    All
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    checked={statusFilter === "active"}
                    onChange={() => setStatusFilter("active")}
                  />
                  <label htmlFor="active" className="text-sm">
                    Active
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="inactive"
                    name="status"
                    checked={statusFilter === "inactive"}
                    onChange={() => setStatusFilter("inactive")}
                  />
                  <label htmlFor="inactive" className="text-sm">
                    Inactive
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={"/admin/add-vendor"}
                  className="border-2 font-semibold hover:bg-black hover:text-white duration-300 transition-all border-black p-2 rounded-md text-black cursor-pointer text-center flex items-center gap-2 justify-center"
                >
                  <PiPlusCircle size={20} />
                  Add
                </Link>
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-400 w-96 placeholder:text-xs rounded-lg p-2"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                  onClick={handleExport}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Export
                </button>
              </div>
            </div>
            <Table columns={columns} data={filteredData} isPagination={true} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Vendors;
