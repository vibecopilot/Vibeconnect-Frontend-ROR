// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import Table from "../../../components/table/Table";
// import { getItemInLocalStorage } from "../../../utils/localStorage";
// import { getAmenitiesBookingById } from "../../../api";

// const BookingDetails = () => {
//   const themeColor = useSelector((state) => state.theme.color);
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");
//   const formattedDate = `${year}-${month}-${day}`;
//   const [facility, setFacility] = useState("");
//   const siteId = getItemInLocalStorage("SITEID");
//   const [formData, setFormData] = useState({
//     amenity_id: "",
//     amenity_slot_id: "",
//     user_id: "",
//     booking_date: "",
//     site_id: siteId,
//     amount: "",
//     gst_no: 0,
//     member_adult: 0,
//     guest_adult: 0,
//     no_of_members: 0,
//     no_of_guests: 0,
//     payment_mode: "post",
//     min_people: 0,
//     max_people: 0,
//   });
//   return (
//     <section>
//       <div
//         style={{ background: themeColor }}
//         className="flex  justify-center bg-black m-2 p-2 rounded-md"
//       >
//         <h2 className="text-xl font-semibold text-center text-white ">
//           Booking Details
//         </h2>
//       </div>
//       <div className="flex flex-col  w-full p-2">
//         <div className="flex justify-between items-center w-full">
//           <h1 className="w-full font-medium text-lg">Test Meeting Room</h1>
//           <div className=" flex justify-end gap-2 w-full">
//             <p className="text-end bg-red-900 rounded-md text-white p-2">
//               Capture Payment
//             </p>
//             <p className="text-end bg-yellow-500 rounded-md text-white p-2">
//               Request Payment
//             </p>
//           </div>
//         </div>
//         <div className="grid grid-cols-4 w-full gap-5 my-2 bg-blue-50 border rounded-xl p-2">
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className=" font-medium">Booking ID : </p>
//             <p className=" ">5431 </p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Status : </p>
//             <p className="bg-green-400 text-white p-1 rounded-md text-center">
//               Confirmed
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Scheduled Date : </p>
//             <p className="">11/11/2024</p>
//           </div>

//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Selected Slot: </p>
//             <p className="">04:00 PM to 04:45 PM</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Booked on : </p>
//             <p className="">08/11/24</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Booked by : </p>
//             <p className="">Kunal sah</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">GST : </p>
//             <p className="">₹ 1.8</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Payable Amount : </p>
//             <p className="">₹ 11.8</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Transaction ID : </p>
//             <p className=""></p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Payment Status : </p>
//             <p className="bg-yellow-500 text-white text-center p-1 rounded-md">
//               Pending
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Payment Method : </p>
//             <p>Pay on facility</p>
//           </div>
//           <div className="grid grid-cols-2 gap-2 items-center">
//             <p className="font-medium">Amount Paid : </p>
//             <p>₹ 0.0</p>
//           </div>
//         </div>
//         <div>
//           <h2 className="border-b font-medium">Member details</h2>
//           <Table />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BookingDetails;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { getAmenitiesBookingById } from "../../../api";

const BookingDetails = () => {
  const { id } = useParams();
  const themeColor = useSelector((state) => state.theme.color);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // ADD MODAL STATE
  const [showCaptureModal, setShowCaptureModal] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const response = await getAmenitiesBookingById(id);
      console.log("API RESPONSE:", response.data);
      setBooking(response.data); // API returns a single object
    } catch (err) {
      console.error("Error loading booking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-5 text-center">Loading…</p>;
  if (!booking) return <p className="p-5 text-center">Booking Not Found</p>;

  const amenity = booking.amenity;
  const slot = booking.slot;
  const payment = booking.payment;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full p-4 overflow-y-auto">
        <div
          style={{ background: themeColor }}
          className="p-3 rounded-md text-white text-center font-semibold"
        >
          Booking Details
        </div>

        <div className="flex justify-between items-center mt-3">
          <h2 className="text-lg font-semibold">{amenity?.fac_name}</h2>

          <div className="flex gap-3">
            {/* OPEN MODAL */}
            <button
              onClick={() => setShowCaptureModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Capture Payment
            </button>

            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>

        {/* BOOKING GRID */}
        <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 rounded mt-4">
          <Field label="Booking ID" value={booking.id} />
          <Field label="Status" value={booking.status} />
          <Field label="Scheduled Date" value={formatDate(booking.booking_date)} />
          <Field label="Slot" value={slot?.slot_str} />
          <Field label="Booked On" value={formatDate(booking.created_at)} />
          <Field label="Booked By" value={booking.book_by_user} />
          <Field label="Amount" value={`₹ ${booking.amount}`} />
          <Field label="GST (%)" value={amenity?.gst_no} />
          <Field label="Payment Status" value={payment ? "Paid" : "Pending"} />
          <Field label="Payment Mode" value={booking.payment_mode} />
          <Field label="Transaction ID" value={payment?.transaction_id} />
          <Field label="Amount Paid" value={`₹ ${payment?.paid_amount ?? 0}`} />
        </div>

        {/* PAYMENT */}
        {payment && (
          <div className="mt-6">
            <h3 className="font-semibold border-b pb-1">Payment Details</h3>
            <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50 rounded mt-2">
              <Field label="Method" value={payment.payment_method} />
              <Field label="Paid" value={`₹ ${payment.paid_amount}`} />
              <Field label="Transaction" value={payment.transaction_id} />
              <Field label="Payment Date" value={formatDate(payment.paymen_date)} />
            </div>
          </div>
        )}

        {/* AMENITY */}
        <div className="mt-6">
          <h3 className="font-semibold border-b pb-1">Amenity Details</h3>
          <div className="grid grid-cols-4 gap-4 p-4 bg-green-50 rounded mt-2">
            <Field label="Name" value={amenity?.fac_name} />
            <Field label="Min People" value={amenity?.min_people} />
            <Field label="Max People" value={amenity?.max_people} />
            <Field label="Facility Type" value={amenity?.fac_type} />
          </div>
        </div>
      </div>

      {/* ================================================================================= */}
      {/* CAPTURE PAYMENT MODAL */}
      {/* ================================================================================= */}
      {showCaptureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[420px] relative">
            <h2 className="text-xl font-semibold mb-4">Capture Payment</h2>

            {/* TOTAL AMOUNT */}
            <label className="font-semibold">Total Amount</label>
            <input
              value={booking.amount}
              disabled
              className="w-full border p-2 rounded bg-gray-100 mt-1"
            />

            {/* PAID AMOUNT */}
            <label className="font-semibold mt-3 block">Paid Amount *</label>
            <input
              type="number"
              defaultValue={booking.amount}
              className="w-full border p-2 rounded mt-1"
            />

            {/* PAYMENT METHOD */}
            <label className="font-semibold mt-3 block">Payment Method *</label>
            <select className="w-full border p-2 rounded mt-1">
              <option value="">Select Payment Method</option>
              <option value="CASH">Cash</option>
              <option value="ONLINE">Online</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>

            {/* TRANSACTION ID */}
            <label className="font-semibold mt-3 block">Transaction ID *</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter Transaction ID"
            />

            {/* DATE */}
            <label className="font-semibold mt-3 block">Date *</label>
            <input
              type="date"
              className="w-full border p-2 rounded mt-1"
              defaultValue={new Date().toISOString().substring(0, 10)}
            />

            {/* REMARKS */}
            <label className="font-semibold mt-3 block">Remarks</label>
            <textarea
              className="w-full border p-2 rounded mt-1"
              placeholder="Notes"
              rows={2}
            ></textarea>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowCaptureModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Submit
              </button>
            </div>

            {/* CLOSE ICON */}
            <button
              className="absolute top-3 right-3 text-gray-600"
              onClick={() => setShowCaptureModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="font-semibold">{label}</p>
    <p>{value || "-"}</p>
  </div>
);

export default BookingDetails;
