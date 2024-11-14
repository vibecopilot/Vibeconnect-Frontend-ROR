import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { BiFilterAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import Table from "../components/table/Table";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";
import { useSelector } from "react-redux";
import { getGRN } from "../api";

function GRN() {
  const [filter, setFilter] = useState(false);
  const [grns, setGrns] = useState([]);

  useEffect(() => {
    const fetchGRN = async () => {
      try {
        const resp = await getGRN();
        console.log("GRN",resp)
        setGrns(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGRN();
  }, []);
  const column = [
    {
      name: "view",

      cell: (row) => (
        <div className="flex items-center gap-4">
          <Link to={`/admin/grn-detail/${row.id}`}>
            <BsEye size={15} />
          </Link>
        </div>
      ),
    },

    { name: "Id", selector: (row) => row.id, sortable: true },
    { name: "Inventory", selector: (row) => row.Inventory, sortable: true },
    { name: "Supplier ID", selector: (row) => row.vendor_id, sortable: true },
    {
      name: "Invoice Number",
      selector: (row) => row.invoice_number,
      sortable: true,
    },
    {
      name: "Reference No",
      selector: (row) => row.ReferenceNo,
      sortable: true,
    },
    { name: "P.O. Number", selector: (row) => row.PONumber, sortable: true },
    {
      name: "P.O Reference Number",
      selector: (row) => row.POReferenceNumber,
      sortable: true,
    },
    {
      name: "Approved Status",
      selector: (row) => row.ApprovedStatus,
      sortable: true,
    },
    {
      name: "Last Approved By",
      selector: (row) => row.LastApprovedBy,
      sortable: true,
    },
    { name: "PO Amount", selector: (row) => row.POAmount, sortable: true },
    {
      name: "Total GRN Amount",
      selector: (row) =>
        row.inventory_details?.reduce(
          (acc, item) => acc + (item.total_amount || 0),
          0
        ),
      sortable: true,
    },
    
    {
      name: "Payable Amount",
      selector: (row) => row.PayableAmount,
      sortable: true,
    },
    {
      name: "Retention Amount",
      selector: (row) => row.RetentionAmount,
      sortable: true,
    },
    { name: "TDS Amount", selector: (row) => row.TDSAmount, sortable: true },
    { name: "QC Amount", selector: (row) => row.QCAmount, sortable: true },
    {
      name: "Invoice Date	",
      selector: (row) => row.invoice_date,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      sortable: true,
    },
    {
      name: "Other Expense",
      selector: (row) => row.other_expenses,
      sortable: true,
    },
    {
      name: "Loading Expense	",
      selector: (row) => row.loading_expenses,
      sortable: true,
    },
    {
      name: "Adjustment Amount",
      selector: (row) => row.adjustment_amount,
      sortable: true,
    },
    {
      name: "Physical Invoice Sent to Accounts",
      selector: (row) => row.PhysicalInvoiceSenttoAccounts,
      sortable: true,
    },
    {
      name: "Physical Invoice Received by Accounts",
      selector: (row) => row.PhysicalInvoiceReceivedbyAccounts,
      sortable: true,
    },
    { name: "Days Passed", selector: (row) => row.DaysPassed, sortable: true },
    { name: "Amount Paid", selector: (row) => row.AmountPaid, sortable: true },
    {
      name: "Balance Amount",
      selector: (row) => row.BalanceAmount,
      sortable: true,
    },
    {
      name: "Payment Status",
      selector: (row) => row.PaymentStatus,
      sortable: true,
    },
    { name: "Aging", selector: (row) => row.Aging, sortable: true },
    { name: "Created On", selector: (row) => row.created_at, sortable: true },
    { name: "Created By", selector: (row) => row.CreatedBy, sortable: true },
  ];

 
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section className="flex">
      {/* <Navbar /> */}
      <div className="w-full  flex flex-col overflow-hidden">
        <div>
          {filter && (
            <div className='className="flex flex-col md:flex-row  items-center justify-center gap-2'>
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Search By PR Number"
                  className="border-2 p-2 w-70 border-gray-300 rounded-lg mx-2 "
                />

                <input
                  type="text"
                  placeholder="Search By PO Number"
                  className="border-2 p-2 w-70 border-gray-300 rounded-lg mx-2"
                />
                <input
                  type="text"
                  placeholder="Supplier Name"
                  className="border-2 p-2 w-70 border-gray-300 rounded-lg mx-2"
                />

                <button
                  className="bg-black p-1 px-5 py-2 text-white rounded-md"
                  style={{ background: themeColor }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
          <div className="flex  md:flex-row gap-2 justify-between w-full my-2">
            <div>
              <input
                type="text"
                placeholder="search"
                className="border-2 p-2  border-gray-300 rounded-lg  w-96"
              />
            </div>
            <div className="flex flex-col sm:flex-row md:justify-between  gap-2 ">
              <Link
                to="/admin/add-grn"
                style={{ background: themeColor }}
                className=" font-semibold text-white px-4 p-1 flex gap-2 items-center rounded-md"
              >
                <IoMdAdd /> Add
              </Link>

              <button
                className=" font-semibold text-white px-4 p-1 flex gap-2 items-center rounded-md"
                onClick={() => setFilter(!filter)}
                style={{ background: themeColor }}
              >
                <BiFilterAlt />
                Filter
              </button>
            </div>
          </div>
        </div>
        <Table columns={column} data={grns} isPagination={true} />
      </div>
    </section>
  );
}

export default GRN;
