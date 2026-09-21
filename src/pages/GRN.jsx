import React, { useEffect, useMemo, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../components/table/Table";
import { getGRN } from "../api";

function GRN() {
  const [filter, setFilter] = useState(false);
  const [grns, setGrns] = useState([]);

  const [search, setSearch] = useState("");

  // textbox values
  const [filters, setFilters] = useState({
    prNumber: "",
    poNumber: "",
    supplier: "",
  });

  // applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    prNumber: "",
    poNumber: "",
    supplier: "",
  });

  const themeColor = useSelector((state) => state.theme.color);

  useEffect(() => {
    const fetchGRN = async () => {
      try {
        const resp = await getGRN();

        const list = Array.isArray(resp?.data?.grn_details)
          ? resp.data.grn_details
          : [];

        setGrns(list);
      } catch (error) {
        console.log(error);
        setGrns([]);
      }
    };

    fetchGRN();
  }, []);

  const safeDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  /** APPLY FILTER */
  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  /** RESET FILTER */
  const resetFilters = () => {
    const empty = { prNumber: "", poNumber: "", supplier: "" };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  /** TABLE FILTER LOGIC */
  const filteredData = useMemo(() => {
    let data = [...grns];

    // global search
    if (search) {
      data = data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // supplier
    if (appliedFilters.supplier) {
      data = data.filter((item) =>
        item.vendor_name
          ?.toLowerCase()
          .includes(appliedFilters.supplier.toLowerCase())
      );
    }

    // GRN ID
    if (appliedFilters.prNumber) {
      data = data.filter((item) =>
        item.grn_unique_id
          ?.toLowerCase()
          .includes(appliedFilters.prNumber.toLowerCase())
      );
    }

    // invoice number
    if (appliedFilters.poNumber) {
      data = data.filter((item) =>
        item.invoice_number
          ?.toLowerCase()
          .includes(appliedFilters.poNumber.toLowerCase())
      );
    }

    return data;
  }, [grns, search, appliedFilters]);

  const columns = [
    {
      name: "View",
      cell: (row) => (
        <Link to={`/admin/grn-detail/${row.id}`}>
          <BsEye size={15} />
        </Link>
      ),
    },
    { name: "Id", selector: (row) => row.id, sortable: true },
    { name: "GRN ID", selector: (row) => row.grn_unique_id || "-", sortable: true },
    { name: "Supplier", selector: (row) => row.vendor_name, sortable: true },
    { name: "Invoice Number", selector: (row) => row.invoice_number || "-" },
    { name: "Invoice Amount", selector: (row) => row.invoice_amount ?? 0 },
    { name: "Invoice Date", selector: (row) => safeDate(row.invoice_date) },
    { name: "Posting Date", selector: (row) => safeDate(row.posting_date) },
    { name: "Payment Mode", selector: (row) => row.payment_mode || "-" },
    { name: "Created On", selector: (row) => safeDate(row.created_at) },
  ];

  return (
    <section className="flex">
      <div className="w-full flex flex-col overflow-hidden">

        {/* FILTER POPUP */}
        {filter && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-3">
            <div className="flex flex-wrap justify-center">

              <input
                type="text"
                placeholder="Search By GRN ID"
                className="border-2 p-2 w-70 border-gray-300 rounded-lg m-2"
                value={filters.prNumber}
                onChange={(e) =>
                  setFilters({ ...filters, prNumber: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Search By Invoice Number"
                className="border-2 p-2 w-70 border-gray-300 rounded-lg m-2"
                value={filters.poNumber}
                onChange={(e) =>
                  setFilters({ ...filters, poNumber: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Supplier Name"
                className="border-2 p-2 w-70 border-gray-300 rounded-lg m-2"
                value={filters.supplier}
                onChange={(e) =>
                  setFilters({ ...filters, supplier: e.target.value })
                }
              />

              <button
                onClick={applyFilters}
                className="p-2 px-6 text-white rounded-md m-2"
                style={{ background: themeColor }}
              >
                Apply
              </button>

              <button
                onClick={resetFilters}
                className="p-2 px-6 text-white bg-red-500 rounded-md m-2"
              >
                Reset
              </button>

            </div>
          </div>
        )}

        {/* TOP BAR */}
        <div className="flex md:flex-row gap-2 justify-between w-full my-2">

          <input
            type="text"
            placeholder="Search By GRN Id,Supplier Name,Invoice Number,Payment Mode....."
            className="border-2 p-2 border-gray-300 rounded-lg w-[600px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2">

            <Link
              to="/admin/add-grn"
              style={{ background: themeColor }}
              className="font-semibold text-white px-4 p-2 flex gap-2 items-center rounded-md"
            >
              <IoMdAdd /> Add
            </Link>

            <button
              className="font-semibold text-white px-4 p-2 flex gap-2 items-center rounded-md"
              onClick={() => setFilter(!filter)}
              style={{ background: themeColor }}
            >
              <BiFilterAlt />
              Filter
            </button>

          </div>
        </div>

        <Table columns={columns} data={filteredData} isPagination={true} />

      </div>
    </section>
  );
}

export default GRN;