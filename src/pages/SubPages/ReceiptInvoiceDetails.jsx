import React from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { FaDownload } from "react-icons/fa";
import { IoPrintOutline } from "react-icons/io5";

function ReceiptInvoiceDetails() {
  const themeColor = useSelector((state) => state.theme.color);

  const columnsPaymentDetails = [
    {
      name: "Date",
      selector: (row, index) => row.date,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Payment Mode",
      selector: (row) => row.paymentMode,
      sortable: true,
    },
    {
      name: "Transaction Number",
      selector: (row) => row.transactionNumber,
      sortable: true,
    },
  ];

  const dataPaymentDetails = [
    {
      Id: 1,
      date: "02/12/2024",
      amount: "100.00",
      paymentMode: "Cash",
      transactionNumber: "#weklwekewlkwe",
    },
  ];

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
          Invoice Receipt Details
        </h2>
        <div>
        <div className="flex justify-end mx-10 mb-2">
          <div className="md:flex grid grid-cols-2 sm:flex-row flex-col gap-2">
            <button
              className="font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
            >
              <FaDownload />
              Download Receipt
            </button>
            <button
              className=" font-semibold text-white px-4 p-1 flex gap-2 items-center justify-center rounded-md"
              style={{ background: themeColor }}
            >
              <IoPrintOutline />
            </button>
          </div>
        </div>
        <div className="mx-10 border border-black rounded-md">
          <div className="md:px-5 text-sm font-medium grid gap-4 md:grid-cols-3 md:divide-x divide-black border-b border-black">
            <div className="space-y-2 px-5 col-span-2 my-5">
              <div className="grid grid-cols-1">
                <p className="text-lg font-medium mb-1">
                  Received With Thanks From :{" "}
                </p>
                <p className="text-sm font-normal">
                  Rohit Jain, Demo Quikgate, Agora Secure, Test User, Devesh
                  Test 30868, Test User
                </p>
              </div>
            </div>
            <div className="space-y-2 px-5 col-span-1 py-3">
              <div className="grid grid-cols-2">
                <p>Receipt : </p>
                <p className="text-sm font-normal">#REC6969999</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Date : </p>
                <p className="text-sm font-normal">06.12.2024</p>
              </div>
              <div className="grid grid-cols-2">
                <p>Rs : </p>
                <p className="text-sm font-normal">100.00</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 px-5 col-span-3 border-b border-black py-3">
            <h2 className="font-medium font-base">
              The sum of rupees{" "}
              <span className="text-gray-500 mx-1">
                One Hundred Rupees Only
              </span>
            </h2>
          </div>
          <div className="md:px-5 text-sm font-medium grid gap-4 md:grid-cols-3 md:divide-x divide-black border-b border-black">
            <div className="space-y-2 px-5 py-3">
              <div className="grid grid-cols-1">
                <div className="grid grid-cols-2">
                  <p>By: </p>
                  <p className="text-sm font-normal">Cash</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Bank & Branch : </p>
                  <p className="text-sm font-normal">sldskd lsdls</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 px-5 py-3">
              <div className="grid grid-cols-2">
                <p>No : </p>
                <p className="text-sm font-normal">weklwekewlkwe</p>
              </div>
            </div>
            <div className="space-y-2 px-5 py-3">
              <div className="grid grid-cols-2">
                <p>Date : </p>
                <p className="text-sm font-normal">02/12/2024</p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 md:divide-x divide-black">
            <div className="col-span-3 pb-5">
              <div className="border-b border-black px-5 py-3">
                <p>In Respect of:</p>
                <p className="font-medium">Lockated Demo B-1505</p>
                <p>
                  2nd Floor, Jyothi Tower, Opposite Versova Police Station,
                  Mumbai Maharashtra 400053
                </p>
              </div>
              <div className="border-b border-black px-5 py-3">
                <h2 className="text-gray-950">
                  Towards: <span className="text-gray-600"></span>
                </h2>
              </div>
              <div className="px-5 py-3">
                <h2 className="text-gray-950">
                  : Rs. <span className="text-gray-600"> 100.00</span>
                </h2>
              </div>
            </div>
            <div className="px-5 col-span-1">
              <div className="py-5 space-y-2">
                <div className="flex justify-center">
                  <img
                    src="/building.jpg"
                    className="w-32 h-20 rounded-md"
                  ></img>
                </div>
                <p className="font-medium">
                  294, CST Road, Santacruz (E), Mumbai 400098
                </p>
                <p>For ABC (Pvt) Limited.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="my-5 mx-10">
          <h2 className="mb-2 text-lg text-gray-950">Payment details</h2>
          <Table columns={columnsPaymentDetails} data={dataPaymentDetails} />
        </div>
        </div>
      </div>
    </section>
  );
}

export default ReceiptInvoiceDetails;
