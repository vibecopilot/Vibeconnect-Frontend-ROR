import React from "react";
import { IoMdPrint } from "react-icons/io";
import { MdFeed } from "react-icons/md";
import Table from "../../../components/table/Table";
import { useSelector } from "react-redux";
import FileInputBox from "../../../containers/Inputs/FileInputBox";

const PermitListDetails = () => {
  const column = [
    { name: "Inventory", selector: (row) => row.Inventory, sortable: true },
    {
      name: "Expected Quantity",
      selector: (row) => row.ExpectedQuantity,
      sortable: true,
    },
    {
      name: "Received Quantity	",
      selector: (row) => row.ReceivedQuantity,
      sortable: true,
    },
    { name: "Unit", selector: (row) => row.Unit, sortable: true },
    { name: "Rate", selector: (row) => row.Rate, sortable: true },
    {
      name: "Approved Qty",
      selector: (row) => row.ApprovedQty,
      sortable: true,
    },
    {
      name: "Rejected Qty",
      selector: (row) => row.RejectedQty,
      sortable: true,
    },
    { name: "CGST Rate", selector: (row) => row.CGSTRate, sortable: true },
    { name: "CGST Amount", selector: (row) => row.CGSTAmount, sortable: true },
    { name: "SGST Rate", selector: (row) => row.SGSTRate, sortable: true },
    { name: "SGST Amount", selector: (row) => row.SGSTAmount, sortable: true },
    { name: "IGST Rate", selector: (row) => row.IGSTRate, sortable: true },
    { name: "IGST Amount", selector: (row) => row.IGSTAmount, sortable: true },
    { name: "TCS Rate", selector: (row) => row.TCSRate, sortable: true },
    { name: "TCS Amount", selector: (row) => row.TCSAmount, sortable: true },
    { name: "Total Taxes", selector: (row) => row.TotalTaxes, sortable: true },
    {
      name: "Total Amount",
      selector: (row) => row.TotalAmount,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      Inventory: "EXHAUST FANS",
      ExpectedQuantity: "2.0",
      ReceivedQuantity: "2",
      Unit: "31/05/24",
      Rate: "4344.29	",
      ApprovedQty: "2.0",
      RejectedQty: "0.0",
      CGSTRate: "9.0",
      CGSTAmount: "781.97",
      SGSTRate: "9.0",
      SGSTAmount: "781.97",
      IGSTRate: "NA",
      IGSTAmount: "0.0",
      TCSRate: "0.0",
      TCSAmount: "0.0",
      TotalTaxes: "1563.94",
      TotalAmount: "8688.58",
    },
  ];
  const columnDebitNote = [
    { name: "ID", selector: (row) => row.ID, sortable: true },
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    { name: "Description", selector: (row) => row.Description, sortable: true },
    { name: "Approved", selector: (row) => row.Approved, sortable: true },
    { name: "Approved On", selector: (row) => row.ApprovedOn, sortable: true },
    { name: "Approved By", selector: (row) => row.ApprovedBy, sortable: true },
    { name: "Created On", selector: (row) => row.CreatedOn, sortable: true },
    { name: "Created By", selector: (row) => row.CreatedBy, sortable: true },
    { name: "Attachment", selector: (row) => row.QCAmount, sortable: true },
  ];
  const dataDebitNote = [
    {
      id: 1,
      ID: "",
      Amount: "",
      Description: "",
      Approved: "",
      ApprovedOn: "",
      ApprovedBy: "",
      CreatedOn: "",
      CreatedBy: "",
      Attachment: "",
    },
  ];
  const columnPayment = [
    { name: "Action", selector: (row) => row.Action, sortable: true },
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    {
      name: "Payment Mode",
      selector: (row) => row.PaymentMode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.TransactionNumber,
      sortable: true,
    },
    { name: "Status	", selector: (row) => row.Status, sortable: true },
    {
      name: "Payment Date",
      selector: (row) => row.PaymentDate,
      sortable: true,
    },
    { name: "Note", selector: (row) => row.Note, sortable: true },
    {
      name: "Date of Entry",
      selector: (row) => row.DateofEntry,
      sortable: true,
    },
    { name: "Actions", selector: (row) => row.Actions, sortable: true },
  ];
  const dataPayment = [
    {
      id: 1,
      Action: "",
      Amount: "",
      PaymentMode: "",
      TransactionNumber: "",
      Status: "",
      PaymentDate: "",
      Note: "",
      DateofEntry: "",
      Actions: "",
    },
  ];
  const columnRetentionPayment = [
    { name: "Action", selector: (row) => row.Action, sortable: true },
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    {
      name: "Payment Mode",
      selector: (row) => row.PaymentMode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.TransactionNumber,
      sortable: true,
    },
    { name: "Status	", selector: (row) => row.Status, sortable: true },
    {
      name: "Payment Date",
      selector: (row) => row.PaymentDate,
      sortable: true,
    },
    { name: "Note", selector: (row) => row.Note, sortable: true },
    {
      name: "Date of Entry",
      selector: (row) => row.DateofEntry,
      sortable: true,
    },
    { name: "Actions", selector: (row) => row.Actions, sortable: true },
  ];
  const dataRetentionPayment = [
    {
      id: 1,
      Action: "",
      Amount: "",
      PaymentMode: "",
      TransactionNumber: "",
      Status: "",
      PaymentDate: "",
      Note: "",
      DateofEntry: "",
      Actions: "",
    },
  ];
  const columnQCPayment = [
    { name: "Amount", selector: (row) => row.Amount, sortable: true },
    {
      name: "Payment Mode",
      selector: (row) => row.PaymentMode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.TransactionNumber,
      sortable: true,
    },
    { name: "Status	", selector: (row) => row.Status, sortable: true },
    {
      name: "Payment Date",
      selector: (row) => row.PaymentDate,
      sortable: true,
    },
    { name: "Note", selector: (row) => row.Note, sortable: true },
    {
      name: "Date of Entry",
      selector: (row) => row.DateofEntry,
      sortable: true,
    },
    { name: "Actions", selector: (row) => row.Actions, sortable: true },
  ];
  const dataQCPayment = [
    {
      id: 1,
      Amount: "",
      PaymentMode: "",
      TransactionNumber: "",
      Status: "",
      PaymentDate: "",
      Note: "",
      DateofEntry: "",
      Actions: "",
    },
  ];
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section className="mb-20">
      <div
        className="flex flex-col md:flex-row md:justify-center  w-full p-2 text-white "
        style={{ background: themeColor }}
      >
        <h2 className="text-xl font-semibold mx-5 text-center">
          PermitList DETAILS
        </h2>
      </div>
      <div className="flex gap-3 item-center my-2 mx-5 flex-wrap">
        <p className="text-sm font-bold">Safety Officer Approval:</p>
        <button className="bg-orange-400 px-2 py-1 rounded-md text-white text-sm">
          Pending
        </button>
        <p className="text-sm font-bold">Site Technical-in-Charge Approval:</p>
        <button className="bg-green-400 px-2 py-1 rounded-md text-white text-sm">
          Approved
        </button>
      </div>
      <div className="border flex flex-col my-5 mx-3 p-2 gap-4 rounded-md border-gray-300">
        <h2 className=" text-lg border-black font-semibold border-b">
          Permit Details
        </h2>
        <div className="my-5 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
          <div className="grid grid-cols-2 items-center">
            <p>Permit ID</p>
            <p className="text-sm font-normal ">: 309</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Permit Type</p>
            <p className="text-sm font-normal ">: Cold Work</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Requested Date & Time</p>
            <p className="text-sm font-normal ">: 03/06/2024 10:36 AM</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Issued Date & Time</p>
            <p className="text-sm font-normal ">: 03/06/2024</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Vendor</p>
            <p className="text-sm font-normal ">
              : Soledify Systems Private Limited
            </p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Extension Status</p>
            <p className="text-sm font-normal ">: No</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Permit Expiry Date</p>
            <p className="text-sm font-normal ">: 03/06/2024 6:00 PM</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Permit Status</p>
            <p className="text-sm font-normal ">: Draft</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Permit For</p>
            <p className="text-sm font-normal ">
              : cable laying work & Earthing work
            </p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Location</p>
            <p className="text-sm font-normal ">
              : Site - PBP Viman Nagar / Building - COMMON / Wing - NA / Floor -
              NA / Area - NA / Room - NA
            </p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Comment</p>
            <p className="text-sm font-normal ">
              : use proper PPE during the work
            </p>
          </div>
        </div>
        <h2 className="border-b text-lg border-black font-semibold">
          REQUESTOR’S INFORMATION
        </h2>
        <div className="my-5 md:px-10 text-sm items-center font-medium grid gap-4 md:grid-cols-2">
          <div className="grid grid-cols-2 items-center">
            <p>Created By</p>
            <p className="text-sm font-normal ">: Awishkar Borkar</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Department</p>
            <p className="text-sm font-normal ">: TECHNICAL</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Contact Number</p>
            <p className="text-sm font-normal ">: 7620619199</p>
          </div>
        </div>

        <h2 className="border-b text-lg  border-black font-semibold ">
          ACTIVITY DETAILS
        </h2>
        <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-2 md:grid-cols-3 bg-red-50 rounded-md p-2">
          <div className="grid grid-cols-2 items-center">
            <p>Activity</p>
            <p className="text-sm font-normal ">: Cable Laying Work</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Sub Activity</p>
            <p className="text-sm font-normal ">
              : Carrying All materials such as Ladder & tools etc.
            </p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Category of Hazard</p>
            <p className="text-sm font-normal ">
              : Slips & Trips (while carrying material)
            </p>
          </div>
        </div>
        <h2 className="border-b text-lg  border-black font-semibold ">
          MANPOWER DETAILS
        </h2>
        <div className="my-2 md:px-10 text-sm items-center font-medium grid gap-2 md:grid-cols-3 bg-red-50 rounded-md p-2">
          <div className="grid grid-cols-2 items-center">
            <p>Name</p>
            <p className="text-sm font-normal ">: Ravindar Sahani</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Designation</p>
            <p className="text-sm font-normal ">: SUPERVISOR</p>
          </div>
          <div className="grid grid-cols-2 items-center">
            <p>Contact No.</p>
            <p className="text-sm font-normal ">: 7709079207</p>
          </div>
        </div>
        <div className="border p-2 rounded-md">
          <h2 className="border-b text-lg  border-black font-semibold ">
            PERMIT EXTENSION
          </h2>
          <div className="my-2  text-sm items-center font-medium grid gap-2 md:grid-cols-3  rounded-md p-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Reason for Extension <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name=""
                id=""
                className="border rounded-md p-2 border-gray-300"
                placeholder="Enter Reason"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Assignees <span className="text-red-400">*</span>
              </label>
              <select
                name=""
                id=""
                className="border rounded-md p-2 border-gray-300"
              >
                <option value="">Select</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Extension Date&Time* <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name=""
                id=""
                className="border rounded-md p-2 border-gray-300"
              />
            </div>
          </div>

          <FileInputBox />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="" id="policy" />
            <label htmlFor="" className="text-sm">
              I have understood all the hazard and risk associated in the
              activity I pledge to implement on the control measure identified
              in the activity through risk analyses JSA and SOP. I Hereby
              declare that the details given above are correct and also I have
              been trained by our company for the above mentioned work & I am
              mentally and physically fit, Alcohol/drugs free to perform it,
              will be performed with appropriate safety and supervision as per
              Vibecopilot & Norms.
            </label>
          </div>
          <div className="flex justify-center">
            <button className="bg-green-500 text-white p-2 rounded-md">
              Extend Permit
            </button>
          </div>
        </div>
      </div>
      <div className=" ">
        <h2 className="text-md font-semibold my-3 mx-5 border-b border-black">
          Attachments
        </h2>
        <p className="text-sm text-center">No attachments</p>
      </div>
      <div className=" ">
        <h2 className="text-md font-semibold my-3 mx-5 border-b border-black">
          Vendor Attachments
        </h2>
        <p className="text-sm text-center">No attachments</p>
      </div>
      <div className="border-b flex items-center justify-between mx-5">
        <h2 className="text-md font-semibold   ">Comment log</h2>
        <button className="bg-green-600 p-2 rounded-md text-white">
          Comment
        </button>
      </div>
    </section>
  );
};

export default PermitListDetails;
