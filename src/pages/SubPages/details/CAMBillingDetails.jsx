import React, { useEffect, useState } from "react";
import { IoPrintOutline } from "react-icons/io5";
import Navbar from "../../../components/Navbar";
import { useSelector } from "react-redux";
import { FaDownload, FaRegFileAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Table from "../../../components/table/Table";
import RecallInvoiceModal from "../../../containers/modals/RecallInvoiceModal";
import CAMBillInvoiceReceivePaymentModal from "../../../containers/modals/CAMBillInvoiceReceivePaymentModal";
import CAMBillingPaymentStatusModal from "../../../containers/modals/CAMBillingPaymentStatusModal";
import {
  domainPrefix,
  getAddressSetupDetails,
  getCamBillingDataDetails,
  getInvoiceReceipt,
  getReceiptPayment,
} from "../../../api";
import { toWords } from 'number-to-words';
function CAMBillingDetails() {
  const themeColor = useSelector((state) => state.theme.color);
  const [recallModal, setRecallModal] = useState(false);
  const [receivePayment, setReceivePayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [camBilling, setComBilling] = useState([]); // Initialize as an array or object if expected
  const [camBillingAllData, setCamBillingAllData] = useState({});
  const [invoiceReceipt, setInvoiceReceipt] = useState([]);
  const [addressInvoice, setAddressInvoice] = useState({});
  const [amountCharges, setAmountCharges] = useState([]);
  const { id } = useParams();
  
  const fetchAddressSetupDetails = async (addressId) => {
    try {
      const addressSetupCamBilling = await getAddressSetupDetails(addressId);
      setAddressInvoice(addressSetupCamBilling.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(addressInvoice);
  useEffect(() => {
    const fetchCamBilling = async () => {
      try {
        const response = await getCamBillingDataDetails(id);
        console.log(response.data);
        setCamBillingAllData(response.data);
        setComBilling(response.data); // Ensure response.data is structured as expected
        fetchAddressSetupDetails(response.data.invoice_address_id);
        const transformedData = [response.data];
        setAmountCharges(transformedData);
      } catch (err) {
        console.error("Failed to fetch Address Setup data:", err);
      }
    };
    console.log(camBillingAllData);
    const fetchInvoiceReceipt = async () => {
      try {
        const response = await getInvoiceReceipt();
        setInvoiceReceipt(response.data); // Ensure response.data is structured as expected
      } catch (err) {
        console.error("Failed to fetch Address Setup data:", err);
      }
    };

    fetchCamBilling(); // Call the API
    fetchInvoiceReceipt();
    fetchReceiptPayment();
  }, [id]);
  const columns = [
    { name: "S.N.", key: "sn" },
    { name: "Description Of Service/Goods", key: "description" },
    { name: "SAC/HSN Code", key: "SACHSNCode" },
    { name: "Qty", key: "qty" },
    { name: "Unit", key: "unit" },
    { name: "Rate", key: "rate" },
    { name: "Total Value", key: "total_value" },
    { name: "Discount/Rebate", key: "percentage" },
    { name: "Taxable Value", key: "taxable_value" },
    { name: "CGST Rate", key: "cgst_rate" },
    { name: "CGST Amount", key: "cgst_amount" },
    { name: "SGST Rate", key: "sgst_rate" },
    { name: "SGST Amount", key: "sgst_amount" },
    { name: "IGST Rate", key: "igst_rate" },
    { name: "IGST Amount", key: "igst_amount" },
  ];

  // Safely access camBilling.charges
  const filteredData =
    camBilling?.charges?.map((charge, index) => ({
      sn: index + 1,
      description: charge.description || "N/A",
      SACHSNCode: charge.hsn_id || "N/A",
      qty: charge.quantity || "0",
      unit: charge.unit || "N/A",
      rate: charge.rate || "0.00",
      total_value: charge.total_value || "0.00",
      percentage: `${charge.discount_percent || "0"}%`,
      taxable_value: charge.taxable_value || "0.00",
      cgst_rate: `${charge.cgst_rate || "0"}%`,
      cgst_amount: charge.cgst_amount || "0.00",
      sgst_rate: `${charge.sgst_rate || "0"}%`,
      sgst_amount: charge.sgst_amount || "0.00",
      igst_rate: `${charge.igst_rate || "0"}%`,
      igst_amount: charge.igst_amount || "0.00",
    })) || []; // Default to an empty array if charges is undefined
  console.log(filteredData);
  // const data = [
  //   {
  //     sn: "1",
  //     description: "Good",
  //     SACHSNCode: "Jsjhsd",
  //     qty: "6.0",
  //     unit: "2.0",
  //     rate: "3.0",
  //     total_value: "2376.0",
  //     percentage: "38768.0",
  //     taxable_value: "8787.00",
  //     cgst_rate: "8.0%",
  //     cgst_amount: "98.00",
  //     sgst_rate: "8.0%",
  //     sgst_amount: "88.00",
  //     igst_rate: "0.0%",
  //     igst_amount: "0.00",
  //   },
  //   {
  //     sn: "2",
  //     description: "Ravindra",
  //     SACHSNCode: "Duygis",
  //     qty: "5.0",
  //     unit: "7.0",
  //     rate: "79.0",
  //     total_value: "98.00",
  //     percentage: "65.0",
  //     taxable_value: "2474.00",
  //     cgst_rate: "6.0%",
  //     cgst_amount: "78.00",
  //     sgst_rate: "6.0%",
  //     sgst_amount: "7.00",
  //     igst_rate: "0.0%",
  //     igst_amount: "0.00",
  //   },
  // ];

  const columnsPaymentDetails = [
    {
      name: "Previous Amount Due",
      selector: (row, index) => row.due_amount,
      sortable: true,
    },
    {
      name: "Current Charges",
      selector: (row) => row.total_charge,
      sortable: true,
    },
    {
      name: "Interest Amt on previous dues",
      selector: (row) => row.due_amount_interst,
      sortable: true,
    },
    {
      name: "Total Amount Due",
      selector: (row) => row.total_amount,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.due_date,
      sortable: true,
    },
  ];

  const dataPaymentDetails = [
    {
      Id: 1,
      previous_amount_due: "1000.00	",
      current_charges: "460.00",
      interest: "200.00",
      total_amount_due: "1660.00",
      due_date: "07.10.2023",
    },
  ];

  const columnsReceipts = [
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
  const dataReceipts = [
    {
      Id: 1,
      receipt_no: "1235",
      invoice_no: "#IN92893283",
      flat: "A1-101",
      customer_name: "Ramesh Pal",
      amount_received: "₹ 1000.0",
      payment_mode: "cash",
      transaction_number: "CHK07001",
      payment_date: "11/10/2024",
      receipt_date: "12/10/2024",
      mail_sent: "10/10/2024 12:18 PM",
    },
  ];

  const [receivePaymentDetails, setReceivePaymentDetails] = useState([]);
  const fetchReceiptPayment = async () => {
    try {
      const resp = await getReceiptPayment();
      setReceivePaymentDetails(resp.data);
    } catch (error) {
      console.error("Failed to fetch Receipt Payment data:", error);
    }
  };
  const columnsTransaction = [
    {
      name: "Date",
      selector: (row, index) => row.created_at,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.total_amount,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row) => row.payment_method,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.transaction_id,
      sortable: true,
    },
    {
      name: "Payment Date",
      selector: (row) => row.paymen_date,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.image_url,
      sortable: true,
    },
  ];

  const dataTransaction = [
    {
      Id: 1,
      date: "20/04/2024",
      amount: "460.00",
      payment_mode: "Online",
      transaction_number: "7444196469",
      image: "",
    },
  ];
  const amount = camBilling.total_amount;
  const amountInWords = Number.isFinite(amount) ? toWords(amount) : "Invalid Amount";
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
          CAM Billing Details
        </h2>
        <div className="flex justify-end mx-5">
          <div className="md:flex grid grid-cols-2 sm:flex-row flex-col gap-2">
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
              onClick={() => setRecallModal(true)}
            >
              Recall
            </button>
            <Link
              to={`/admin/create-invoice-receipt/${id}`}
              style={{ background: themeColor }}
              className="px-4 py-2  font-medium text-white rounded-md flex gap-2 items-center justify-center"
            >
              Create Invoice Receipt
            </Link>
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
              onClick={() => setReceivePayment(true)}
            >
              Receive Payment
            </button>
            {/* <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
              onClick={() => setPaymentStatus(true)}
            >
              Paid
            </button> */}
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
            >
              <FaDownload />
              Download Invoice
            </button>
            {/* <button
              className=" font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
            >
              <IoPrintOutline />
            </button> */}
          </div>
        </div>
        <div className="grid md:grid-cols-2 mx-5 my-5">
          <div className="space-y-2">
            <h2 className="bg-black text-white p-2 px-5 w-fit rounded-md">
              Unpaid
            </h2>
            <div className="">
              <img src="/building.jpg" className="w-60 h-40 rounded-md"></img>
            </div>
          </div>
          <div className="my-5">
            <h2 className="font-bold text-lg">{addressInvoice.title}</h2>
            <p className="font-normal">{addressInvoice.address}</p>
            <p className="font-normal">Tel :{addressInvoice.phone_number}</p>
            <p className="font-normal">Fax:{addressInvoice.fax_number}</p>
            <p className="font-normal">E-mail:{addressInvoice.email_address}</p>
          </div>
        </div>
        <div className="mx-5">
          <h2 className="border-b  text-xl border-black font-semibold">
            Tax invoice
          </h2>
          <div className="my-5 md:px-5 text-sm font-medium grid gap-4 md:grid-cols-2 md:divide-x-2 divide-black">
            <div className="space-y-2 px-5">
              <div className="grid grid-cols-2">
                <p>GSTIN : </p>
                <p className="text-sm font-normal">
                  {addressInvoice.gst_number}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>PAN : </p>
                <p className="text-sm font-normal">
                  {addressInvoice.pan_number}
                </p>
              </div>
              <div className="grid grid-cols-2">
                {/* <p>Consecutive Serial No : </p> */}
                <p>Invoice No : </p>
                <p className="text-sm font-normal">
                  {camBillingAllData.invoice_number}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>Customer Code : </p>
                <p className="text-sm font-normal"></p>
              </div>
            </div>
            <div className="space-y-2 px-5">
              <div className="grid grid-cols-2">
                <p>Date of Supply : </p>
                <p className="text-sm font-normal">
                  {camBillingAllData.supply_date}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>Billing Period: : </p>
                <p className="text-sm font-normal">
                  {camBillingAllData.bill_period_start_date} to{" "}
                  {camBillingAllData.bill_period_end_date}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>Place of Supply/Delivery : </p>
                <p className="text-sm font-normal">{addressInvoice.state}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5">
          <h2 className="border-b  text-xl border-black font-semibold">
            Details of Receiver of supply:
          </h2>
          <div className="my-5 md:px-5 text-sm font-medium grid gap-4 md:grid-cols-2 md:divide-x-2 divide-black">
            <div className="space-y-2 px-5">
              <div className="grid grid-cols-2">
                <p>Name : </p>
                <p className="text-sm font-normal">Karan Gupta </p>
              </div>
              <div className="grid grid-cols-2">
                <p>Address : </p>
                <p className="text-sm font-normal">
                  A-1 Lockated Demo, 2nd Floor, Jyothi Tower, Opposite Versova
                  Police Station,
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>PAN : </p>
                <p className="text-sm font-normal"></p>
              </div>
              <div className="grid grid-cols-2">
                <p>State : </p>
                <p className="text-sm font-normal">MAHARASHTRA</p>
              </div>
              <div className="grid grid-cols-2">
                <p>State Code : </p>
                <p className="text-sm font-normal">27</p>
              </div>
              <div className="grid grid-cols-2">
                <p>GSTIN/ Unique ID : </p>
                <p className="text-sm font-normal">sdf22134532</p>
              </div>
            </div>
            <div className="space-y-2 px-5">
              {/* <div className="grid grid-cols-2">
                <p>Basis : </p>
                <p className="text-sm font-normal">Adhoc Billing</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Date of Possession : </p>
                <p className="text-sm font-normal">15/11/2020</p>
              </div> */}
            </div>
          </div>
        </div>
        <div className="my-5 mx-5">
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr style={{ background: themeColor }}>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-4 py-2 text-left text-sm text-white"
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-300 px-4 py-2 text-sm text-black"
                      >
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-2 text-sm font-bold text-right text-gray-800"
                  >
                    Total Invoice Value (In Figure): {camBilling.total_charge}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-2 text-sm font-bold text-right text-gray-800"
                  >
                    Total Amount Due (In Figure): {camBilling.total_amount}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-2 text-sm font-bold text-right text-gray-800"
                  >
                   Total Amount (In Words): {amountInWords}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="mx-5 border-b  text-xl border-black font-semibold">
          <h2 className="border-b  text-xl border-black font-semibold"></h2>
          <div className="my-5 md:px-5 text-sm font-medium grid gap-4 md:grid-cols-2 md:divide-x-2 divide-black">
            <div className="space-y-2 px-5">
              <div className="grid grid-cols-2">
                <p>
                  Certified that the Particulars given above are true and
                  correct and the amount indicated. :{" "}
                </p>
                <p className="text-sm font-normal"></p>
              </div>
              <div className="grid grid-cols-2">
                <p className="text-lg">Bank Details : </p>
                <p className="text-sm font-normal"></p>
              </div>
              <div className="grid grid-cols-2">
                <p>A/C Name : </p>
                <p className="text-sm font-normal">
                  {addressInvoice.account_name}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>A/C No : </p>
                <p className="text-sm font-normal">
                  {addressInvoice.account_number}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>Account Type : </p>
                <p className="text-sm font-normal">
                  {addressInvoice.account_type}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>Bank & Branch : </p>
                <p className="text-sm font-normal">
                  {addressInvoice.bank_branch_name}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p>IFSC : </p>
                <p className="text-sm font-normal">
                  {addressInvoice.ifsc_code}
                </p>
              </div>
            </div>
            <div className="space-y-2 px-5">
              <div className="grid grid-cols-2">
                <p>Authorized Signatory : </p>
                <p className="text-sm font-normal"></p>
                <div className="my-5">
                  {addressInvoice?.attachments?.[0]?.image_url ? (
                    <img
                      src={domainPrefix + addressInvoice.attachments[0].image_url} // Prepend base URL if needed
                      className="w-60 h-40 rounded-md"
                      alt="Invoice"
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 border-b  text-xl border-black font-semibold">
          <h2 className="border-b  text-xl border-black font-semibold"></h2>
          <div className="grid grid-cols-1 my-5">
            <p>Note : </p>
            <p className="text-sm font-normal">{camBilling.note}</p>
          </div>
        </div>
        <div className="my-5 mx-5">
          <Table columns={columnsPaymentDetails} data={amountCharges} />
        </div>
        <div className="my-5 mx-5">
          <h2 className="">Transaction details for this invoice</h2>
          <Table columns={columnsTransaction} data={receivePaymentDetails} />
        </div>
        <div className="my-5 mx-5">
          <h2 className="">Imported Receipts</h2>
          <Table columns={columnsReceipts} data={invoiceReceipt} />
        </div>
      </div>
      {recallModal && (
        <RecallInvoiceModal onclose={() => setRecallModal(false)} />
      )}
      {receivePayment && (
        <CAMBillInvoiceReceivePaymentModal
          onclose={() => setReceivePayment(false)}
          fetchReceiptPayment={fetchReceiptPayment}
        />
      )}
      {paymentStatus && (
        <CAMBillingPaymentStatusModal onclose={() => setPaymentStatus(false)} />
      )}
    </section>
  );
}

export default CAMBillingDetails;
