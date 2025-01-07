import React, { useEffect, useState } from "react";
import Table from "../components/table/Table";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaDownload, FaRegFileAlt, FaUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getInvoiceReceipt } from "../api";
function ReceiptInvoiceCam() {
  const [invoiceReceipt, setInvoiceReceipt] = useState([]);
  const themeColor = useSelector((state) => state.theme.color);
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/receipt-invoice-details/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },
    {
      name: "Receipt No.",
      selector: (row, index) => row.receipt_number,
      sortable: true,
    },
    {
      name: "Invoice No.",
      selector: (row) => row.invoice_number,
      sortable: true,
    },
    {
      name: "Block",
      selector: (row) => row.building_id,
      sortable: true,
    },
    {
      name: "Flat",
      selector: (row) => row.unit_id,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
    },
    {
      name: "Amount Received",
      selector: (row) => row.amount_received,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.transaction_or_cheque_number,
      sortable: true,
    },
    {
      name: "Payment Date",
      selector: (row) => row.payment_date,
      sortable: true,
    },
    {
      name: "Receipt Date",
      selector: (row) => row.receipt_date,
      sortable: true,
    },
    {
      name: "Mail sent",
      selector: (row) => row.mail_sent,
      sortable: true,
    },
    {
      name: "Attachments",
      selector: (row) => (
        <div>
          <button>
            <FaRegFileAlt />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];

  useEffect(() => {
    const fetchInvoiceReceipt = async () => {
      try {
        const response = await getInvoiceReceipt();
        setInvoiceReceipt(response.data); // Ensure response.data is structured as expected
      } catch (err) {
        console.error("Failed to fetch Address Setup data:", err);
      }
    };
    fetchInvoiceReceipt();
  }, []);
  return (
    <div className="my-10">
      <div className="flex md:flex-row flex-col justify-between md:items-center my-2 gap-2  ">
        <input
          type="text"
          placeholder="Search By Invoice No, Payment Status"
          className=" p-2 md:w-96 border-gray-300 rounded-md placeholder:text-sm outline-none border "
        />
        <div className="md:flex grid grid-cols-2 sm:flex-row my-2 flex-col gap-2">
          <Link
            to={`/admin/add-receipt-invoice-cam-billing`}
            style={{ background: themeColor }}
            className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center"
          >
            <IoAddCircleOutline />
            Add
          </Link>
          <button
            className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
            style={{ background: themeColor }}
            onClick={() => setImportModal(true)}
          >
            <FaUpload />
            Import
          </button>
          <button
            className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
            style={{ background: themeColor }}
          >
            <FaDownload />
            Export
          </button>
        </div>
      </div>
      <Table columns={columns} data={invoiceReceipt} selectableRow={true} />
    </div>
  );
}

export default ReceiptInvoiceCam;
