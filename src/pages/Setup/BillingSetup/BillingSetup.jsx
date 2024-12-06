import React from "react";
import Navbar from "../../../components/Navbar";
import Table from "../../../components/table/Table";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { Switch } from "../../../Buttons";
import { Link } from "react-router-dom";

function BillingSetup() {
  const columns = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button>
            <BsEye size={15} />
          </button>
          <button>
            <BiEdit size={15} />
          </button>
        </div>
      ),
    },
    {
      name: "Id",
      selector: (row, index) => row.Id,
      sortable: true,
    },
    {
      name: "Bill Cycle Name",
      selector: (row) => row.bill_Cycle_Name,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_Date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.end_Date,
      sortable: true,
    },
    {
      name: "Frequency",
      selector: (row) => row.frequency,
      sortable: true,
    },
    {
        name: "Charges",
        selector: (row) => row.charges,
        sortable: true,
      },
      {
        name: "Payment Due In",
        selector: (row) => row.payment_Due_In,
        sortable: true,
      },
      {
        name: "Interest",
        selector: (row) => row.interest,
        sortable: true,
      },
      {
        name: "Fine",
        selector: (row) => row.fine,
        sortable: true,
      },
      {
        name: "Created on",
        selector: (row) => row.created_on,
        sortable: true,
      },
      {
        name: "Created by",
        selector: (row) => row.created_by,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => (
          <div>
            <Switch
            />
          </div>
        ),
      },
  ];

  const data = [
    {
      Id: 1,
      bill_Cycle_Name: "DG",
      start_Date: "01/12/2024",
      end_Date: "31/12/2024",
      frequency: "Half Yearly",
      charges: "Expense Based Charges",
      payment_Due_In: "5",
      interest: "500.0",
      fine: "40.0",
      created_on: "30/11/2024",
      created_by: "Vinay Singh"
    },
  ];
  return (
    <section className="flex">
      <Navbar />
      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <div className="flex justify-between my-3">
          <input
            type="text"
            placeholder="search"
            className="border-2 p-2 w-70 border-gray-300 rounded-lg"
          />
          <Link to={`/admin/add-cam-billing-setup`} className="font-semibold border-2 border-black px-4 p-1 flex gap-2 items-center rounded-md">
            Configure
          </Link>
        </div>
        <Table columns={columns} data={data} />
      </div>
    </section>
  );
}

export default BillingSetup;
