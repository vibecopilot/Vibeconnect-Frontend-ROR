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
  const themeColor = useSelector((state) => state.theme.color);

  useEffect(() => {
    const fetchGRN = async () => {
      try {
        const resp = await getGRN();

        // ✅ API gives: { grn_details: [...] }
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

  const data = useMemo(() => {
    return (Array.isArray(grns) ? grns : []).map((g) => ({
      ...g,
      vendor_name: g?.vendor_name || "Unknown Vendor", // ✅ already coming from API
    }));
  }, [grns]);

  const columns = [
    {
      name: "View",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/grn-detail/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    { name: "Id", selector: (row) => row.id, sortable: true },
    {
      name: "GRN ID",
      selector: (row) => row.grn_unique_id || "-",
      sortable: true,
    },
    {
      name: "Inventory",
      selector: (row) =>
        Array.isArray(row.inventory_details) && row.inventory_details.length > 0
          ? row.inventory_details
              .map((item) => item?.inventory_name)
              .filter((name) => typeof name === "string" && name.trim() !== "")
              .join(", ")
          : "No Inventory",
      sortable: true,
    },
    { name: "Supplier", selector: (row) => row.vendor_name, sortable: true },
    {
      name: "Invoice Number",
      selector: (row) => row.invoice_number || "-",
      sortable: true,
    },
    {
      name: "Invoice Amount",
      selector: (row) => row.invoice_amount ?? 0,
      sortable: true,
    },
    { name: "Invoice Date", selector: (row) => safeDate(row.invoice_date), sortable: true },
    { name: "Posting Date", selector: (row) => safeDate(row.posting_date), sortable: true },
    { name: "Payment Mode", selector: (row) => row.payment_mode || "-", sortable: true },
    { name: "Other Expense", selector: (row) => row.other_expenses ?? 0, sortable: true },
    { name: "Loading Expense", selector: (row) => row.loading_expenses ?? 0, sortable: true },
    { name: "Adjustment Amount", selector: (row) => row.adjustment_amount ?? 0, sortable: true },
    { name: "Created On", selector: (row) => safeDate(row.created_at), sortable: true },
  ];

  return (
    <section className="flex">
      <div className="w-full flex flex-col overflow-hidden">
        <div>
          {filter && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <div className="flex justify-center flex-wrap">
                <input
                  type="text"
                  placeholder="Search By PR Number"
                  className="border-2 p-2 w-70 border-gray-300 rounded-lg m-2"
                />
                <input
                  type="text"
                  placeholder="Search By PO Number"
                  className="border-2 p-2 w-70 border-gray-300 rounded-lg m-2"
                />
                <input
                  type="text"
                  placeholder="Supplier Name"
                  className="border-2 p-2 w-70 border-gray-300 rounded-lg m-2"
                />
                <button
                  className="p-1 px-5 py-2 text-white rounded-md m-2"
                  style={{ background: themeColor }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          <div className="flex md:flex-row gap-2 justify-between w-full my-2">
            <div>
              <input
                type="text"
                placeholder="search"
                className="border-2 p-2 border-gray-300 rounded-lg w-96"
              />
            </div>

            <div className="flex flex-col sm:flex-row md:justify-between gap-2">
              <Link
                to="/admin/add-grn"
                style={{ background: themeColor }}
                className="font-semibold text-white px-4 p-1 flex gap-2 items-center rounded-md"
              >
                <IoMdAdd /> Add
              </Link>

              <button
                className="font-semibold text-white px-4 p-1 flex gap-2 items-center rounded-md"
                onClick={() => setFilter(!filter)}
                style={{ background: themeColor }}
              >
                <BiFilterAlt />
                Filter
              </button>
            </div>
          </div>
        </div>

        <Table columns={columns} data={data} isPagination={true} />
      </div>
    </section>
  );
}

export default GRN;
