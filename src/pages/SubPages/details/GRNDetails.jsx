import React, { useEffect, useMemo, useState } from "react";
import { IoMdPrint } from "react-icons/io";
import { MdFeed } from "react-icons/md";
import Table from "../../../components/table/Table";
import { useParams } from "react-router-dom";
import { getGRNDetailById } from "../../../api";

const safeText = (v) => (v === null || v === undefined || v === "" ? "-" : v);

const safeDate = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const GrnDetails = () => {
  const { id } = useParams(); // ✅ /admin/grn-detail/:id
  const [grn, setGrn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setErr("");
      try {
        const resp = await getGRNDetailById(id);

        const data =
          resp?.data?.grn_detail ||
          resp?.data?.grn_details ||
          resp?.data ||
          null;

        const obj = Array.isArray(data) ? data[0] : data;
        setGrn(obj || null);
      } catch (e) {
        console.log("GRN detail error:", e);
        setErr("Failed to load GRN details");
        setGrn(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const inventoryRows = useMemo(() => {
    const arr = grn?.inventory_details;
    return Array.isArray(arr) ? arr : [];
  }, [grn]);

  const totals = useMemo(() => {
    const totalTaxes = inventoryRows.reduce((a, x) => a + num(x.tax_amt), 0);
    const totalAmount = inventoryRows.reduce(
      (a, x) => a + num(x.total_amount),
      0,
    );
    return { totalTaxes, totalAmount };
  }, [inventoryRows]);

  const columns = [
    {
      name: "Inventory",
      selector: (row) => safeText(row.inventory_name),
      sortable: true,
    },
    {
      name: "Expected Quantity",
      selector: (row) => safeText(row.expected_quantity),
      sortable: true,
    },
    {
      name: "Received Quantity",
      selector: (row) => safeText(row.received_quantity),
      sortable: true,
    },
    {
      name: "Approved Qty",
      selector: (row) => safeText(row.approved_quantity),
      sortable: true,
    },
    {
      name: "Rejected Qty",
      selector: (row) => safeText(row.rejected_quantity),
      sortable: true,
    },
    { name: "Rate", selector: (row) => safeText(row.rate), sortable: true },

    {
      name: "CGST Rate",
      selector: (row) => safeText(row.csgt_rate),
      sortable: true,
    },
    {
      name: "CGST Amount",
      selector: (row) => safeText(row.csgt_amt),
      sortable: true,
    },

    {
      name: "SGST Rate",
      selector: (row) => safeText(row.sgst_rate),
      sortable: true,
    },
    {
      name: "SGST Amount",
      selector: (row) => safeText(row.sgst_amt),
      sortable: true,
    },

    {
      name: "IGST Rate",
      selector: (row) => safeText(row.igst_rate),
      sortable: true,
    },
    {
      name: "IGST Amount",
      selector: (row) => safeText(row.igst_amt),
      sortable: true,
    },

    {
      name: "TCS Rate",
      selector: (row) => safeText(row.tcs_rate),
      sortable: true,
    },
    {
      name: "TCS Amount",
      selector: (row) => safeText(row.tcs_amt),
      sortable: true,
    },

    {
      name: "Total Taxes",
      selector: (row) => safeText(row.tax_amt),
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => safeText(row.total_amount),
      sortable: true,
    },
  ];

  if (loading) {
    return (
      <section className="p-5">
        <p className="font-semibold">Loading GRN details...</p>
      </section>
    );
  }

  if (err) {
    return (
      <section className="p-5">
        <p className="text-red-600 font-semibold">{err}</p>
      </section>
    );
  }

  if (!grn) {
    return (
      <section className="p-5">
        <p className="font-semibold">No GRN found.</p>
      </section>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between my-5 w-full">
        <h2 className="text-xl font-semibold mx-5">GRN DETAILS</h2>

        <div className="flex mr-5">
          <button className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md mx-3">
            <MdFeed />
            feeds
          </button>

          <button
            onClick={() => window.print()}
            className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md"
          >
            <IoMdPrint />
            Print
          </button>
        </div>
      </div>

      {/* Approvals (API me fields nahi mile to placeholders) */}
      <div className="flex gap-3 item-center my-3 mx-5 flex-wrap">
        <p className="text-sm font-bold">Site Incharge Approval:</p>
        <button className="bg-orange-400 px-2 py-1 rounded-md text-white text-sm">
          {safeText(grn?.site_incharge_approval_status) || "Pending"}
        </button>

        <p className="text-sm font-bold">FM Admin Head Approval:</p>
        <button className="bg-orange-400 px-2 py-1 rounded-md text-white text-sm">
          {safeText(grn?.fm_admin_head_approval_status) || "Pending"}
        </button>

        <p className="text-sm font-bold">FM HOD Approval:</p>
        <button className="bg-orange-400 px-2 py-1 rounded-md text-white text-sm">
          {safeText(grn?.fm_hod_approval_status) || "Pending"}
        </button>

        <p className="text-sm font-bold">Site Accounts Team Approval:</p>
        <button className="bg-orange-400 px-2 py-1 rounded-md text-white text-sm">
          {safeText(grn?.accounts_team_approval_status) || "Pending"}
        </button>
      </div>

      {/* Vendor/Site block (dynamic fields) */}
      <div className="border-2 flex flex-col my-5 mx-3 p-4 gap-4 rounded-md border-gray-400">
        <h2 className="text-lg border-black font-semibold text-center">
          {safeText(grn?.site_name || grn?.site || "—")}
        </h2>

        <h2 className="border-t text-lg py-5 border-black font-semibold text-center">
          GRN
        </h2>
        <div className="my-6 md:px-10 text-sm font-medium grid gap-5 md:grid-cols-3 mb-4">
          {/* Invoice Number */}
          <div className="flex">
            <p className="w-40">Invoice Number</p>
            <p className="font-normal">: {safeText(grn?.invoice_number)}</p>
          </div>

          {/* GRN ID */}
          <div className="flex">
            <p className="w-40">GRN ID</p>
            <p className="font-normal">: {safeText(grn?.grn_unique_id)}</p>
          </div>

          {/* Invoice Date */}
          <div className="flex">
            <p className="w-40">Invoice Date</p>
            <p className="font-normal">: {safeDate(grn?.invoice_date)}</p>
          </div>

          {/* Posting Date */}
          <div className="flex">
            <p className="w-40">Posting Date</p>
            <p className="font-normal">: {safeDate(grn?.posting_date)}</p>
          </div>

          {/* ID */}
          <div className="flex">
            <p className="w-40">ID</p>
            <p className="font-normal">: {safeText(grn?.id)}</p>
          </div>

          {/* Supplier Name */}
          <div className="flex">
            <p className="w-40">Supplier Name</p>
            <p className="font-normal">: {safeText(grn?.vendor_name)}</p>
          </div>

          {/* Related To */}
          <div className="flex">
            <p className="w-40">Related To</p>
            <p className="font-normal">: {safeText(grn?.related_to)}</p>
          </div>

          {/* Invoice Amount */}
          <div className="flex">
            <p className="w-40">Invoice Amount</p>
            <p className="font-normal">: {safeText(grn?.invoice_amount)}</p>
          </div>

          {/* Total Taxes */}
          <div className="flex">
            <p className="w-40">Total Taxes</p>
            <p className="font-normal">: {totals.totalTaxes.toFixed(2)}</p>
          </div>

          {/* Total GRN Amount */}
          <div className="flex">
            <p className="w-40">Total GRN Amount</p>
            <p className="font-normal">: {totals.totalAmount.toFixed(2)}</p>
          </div>

          {/* Notes */}
          <div className="flex md:col-span-2">
            <p className="w-40">Notes</p>
            <p className="font-normal">: {safeText(grn?.notes)}</p>
          </div>
        </div>

        <div className="border-black border-t mt-5" />

        {/* Inventory Table */}
        <Table columns={columns} data={inventoryRows} />

        {/* expenses summary */}
        <div className="my-5 md:px-2 text-sm items-center font-medium grid gap-1">
          <div className="flex justify-between items-center">
            <p>Other Expense:</p>
            <p className="text-sm font-bold">{safeText(grn?.other_expenses)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p>Loading Expense:</p>
            <p className="text-sm font-bold">
              {safeText(grn?.loading_expenses)}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p>Adjustment Amount:</p>
            <p className="text-sm font-bold">
              {safeText(grn?.adjustment_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <h2 className="text-md font-semibold my-3 mx-5">Attachments</h2>
      <div className="border-t py-5 mx-5 border-black">
        <p className="text-md font-semibold">Attachments</p>
        <p className="text-sm">
          {Array.isArray(grn?.attachments) && grn.attachments.length > 0
            ? `${grn.attachments.length} attachment(s)`
            : "No attachments"}
        </p>
      </div>

      {/* Optional sections (keep for future API) */}
      <div className="border-t py-2 mx-5 border-black">
        <h3 className="text-md font-semibold my-3">Debit Note Details</h3>
        <p className="text-sm">No records</p>
      </div>

      <div className="border-t py-2 mx-5 border-black">
        <h3 className="text-md font-semibold my-3">Payment Details</h3>
        <p className="text-sm">No records</p>
      </div>

      <div className="border-t py-2 mx-5 border-black">
        <h3 className="text-md font-semibold my-3">
          Retention Payment Details
        </h3>
        <p className="text-sm">No records</p>
      </div>

      <div className="border-t py-2 mx-5 border-black">
        <h3 className="text-md font-semibold my-3">QC Payment Details</h3>
        <p className="text-sm">No records</p>
      </div>
    </section>
  );
};

export default GrnDetails;