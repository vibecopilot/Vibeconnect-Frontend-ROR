import React from "react";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";

function CreateInvoiceReceipt() {
  const themeColor = useSelector((state) => state.theme.color);
  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="w-full flex  flex-col overflow-hidden">
        <h2
          style={{ background: themeColor }}
          className="text-center text-xl font-bold my-5 p-2 bg-black rounded-full text-white mx-10"
        >
          Create Invoice Receipt
        </h2>
        <div className="flex justify-center">
          <div className="sm:border border-gray-400 p-1 md:px-10 rounded-lg w-4/5 mb-14">
            <div className="md:grid grid-cols-3 gap-5 my-3">
              <div className="flex flex-col ">
                <label htmlFor="receiptNumber" className="font-semibold my-2">
                  Receipt Number
                </label>
                <input
                  type="text"
                  name="receipt_number"
                  id="receiptNumber"
                  placeholder="Enter Receipt Number"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="InvoiceNumber" className="font-semibold my-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  name="invoice_number"
                  id="InvoiceNumber"
                  placeholder="Enter Invoice Number"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="Block" className="font-semibold my-2">
                  Block
                </label>
                <select
                  name="block"
                  id=" Block"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="" disabled selected>
                    Select Tower
                  </option>
                  <option value="imperia">Imperia</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="Flat" className="font-semibold my-2">
                  Flat
                </label>
                <select
                  name="flat"
                  id=" Flat"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="" disabled selected>
                    Select Flat
                  </option>
                  <option value="1001">1001</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="Address" className="font-semibold my-2">
                  Address
                </label>
                <select
                  name="address"
                  id=" Address"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select address</option>
                  <option value="jyoti tower">Jyoti Tower</option>
                  <option value="abc">ABC</option>
                  <option value="head office">Head Office</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="Payment" className="font-semibold my-2">
                  Payment Mode
                </label>
                <select
                  name="payment_mode"
                  id=" Payment"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                >
                  <option value="">Select Mode</option>
                  <option value="online">online</option>
                  <option value="cash">cash</option>
                  <option value="cheque">cheque</option>
                  <option value="credit_card">credit_card</option>
                  <option value="Online Payment">Online Payment</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bulk Upload">Bulk Upload</option>
                  <option value="Online">Online</option>
                  <option value="neft">neft</option>
                  <option value="rtgs">rtgs</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div className="flex flex-col ">
                <label htmlFor="amountReceived" className="font-semibold my-2">
                  Amount Received
                </label>
                <input
                  type="text"
                  name=""
                  id="amountReceived"
                  placeholder="Enter Amount"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label
                  htmlFor="TransactionChequeNumber"
                  className="font-semibold my-2"
                >
                  Transaction / Cheque Number
                </label>
                <input
                  type="text"
                  name=""
                  id="TransactionChequeNumber"
                  placeholder="Enter Transaction/Cheque Number"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="BankName" className="font-semibold my-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name=""
                  id="BankName"
                  placeholder="Enter Bank Name"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="BranchName" className="font-semibold my-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  name=""
                  id="BranchName"
                  placeholder="Enter Branch Name"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="PaymentDate" className="font-semibold my-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  name=""
                  id="PaymentDate"
                  placeholder="Enter Payment Date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="Receipt Date" className="font-semibold my-2">
                  Receipt Date
                </label>
                <input
                  type="date"
                  name=""
                  id="ReceiptDate"
                  placeholder="Enter Receipt Date"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
              <div className="flex flex-col col-span-3">
                <label htmlFor="Receipt Date" className="font-semibold my-2">
                  Notes
                </label>
                <textarea
                  name=""
                  id=""
                  cols="5"
                  rows="3"
                  placeholder="Enter Notes"
                  className="border p-1 px-4 border-gray-500 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-center my-5">
              <button
                className="p-1 px-4 border-2 rounded-md text-white font-medium"
                style={{ background: themeColor }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateInvoiceReceipt;
