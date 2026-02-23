// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Navbar from "../../../components/Navbar";
// import { getAmenitiesBookingById } from "../../../api";
// import toast from "react-hot-toast";

// const BookingDetails = () => {
//   const { id } = useParams();
//   const themeColor = useSelector((state) => state.theme.color);

//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showCaptureModal, setShowCaptureModal] = useState(false);
//   const [paidAmount, setPaidAmount] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [transactionId, setTransactionId] = useState("");
//   const [paymentDate, setPaymentDate] = useState(
//     new Date().toISOString().substring(0, 10)
//   );
//   const [remarks, setRemarks] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     loadBooking();
//   }, [id]);

//   const loadBooking = async () => {
//     try {
//       const response = await getAmenitiesBookingById(id);
//       console.log("API RESPONSE:", response.data);
//       setBooking(response.data);
//     } catch (err) {
//       console.error("Error loading booking:", err);
//       toast.error("Failed to load booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCapturePaymentSubmit = async () => {
//     if (!paidAmount || !paymentMethod || !transactionId || !paymentDate) {
//       return toast.error("Please fill all required fields");
//     }

//     if (Number(paidAmount) <= 0) {
//       return toast.error("Paid amount must be greater than 0");
//     }

//     try {
//       setSubmitting(true);

//       const formData = new FormData();
//       formData.append("payment[resource_id]", booking.id);
//       formData.append("payment[resource_type]", "AmenityBooking");
//       formData.append("payment[total_amount]", booking.amount);
//       formData.append("payment[paid_amount]", paidAmount);
//       formData.append("payment[payment_method]", paymentMethod.toLowerCase());
//       formData.append("payment[transaction_id]", transactionId);
//       formData.append("payment[paymen_date]", paymentDate);
//       formData.append("payment[notes]", remarks || "");

//       const response = await fetch(
//         "https://admin.vibecopilot.ai/payments.json?token=efe990d24b0379af8b5ba3d0a986ac802796bc2e0db15552",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Payment API error:", errorText);
//         throw new Error("Payment API failed");
//       }

//       toast.success("Payment captured successfully");
//       setShowCaptureModal(false);

//       setPaidAmount("");
//       setPaymentMethod("");
//       setTransactionId("");
//       setRemarks("");

//       loadBooking();
//     } catch (error) {
//       console.error("Capture payment error:", error);
//       toast.error("Failed to capture payment");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p className="p-5 text-center">Loading…</p>;
//   if (!booking) return <p className="p-5 text-center">Booking Not Found</p>;

//   const amenity = booking.amenity;
//   const slot = booking.slot;
//   const payment = booking.payment;

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
//   };

//   return (
//     <section className="flex">
//       <Navbar />

//       <div className="w-full p-4 overflow-y-auto">
//         <div
//           style={{ background: themeColor }}
//           className="p-3 rounded-md text-white text-center font-semibold"
//         >
//           Booking Details
//         </div>

//         <div className="flex justify-between items-center mt-3">
//           <h2 className="text-lg font-semibold">{amenity?.fac_name}</h2>

//           <div className="flex gap-3">
//             <button
//               onClick={() => {
//                 setPaidAmount(booking.amount);
//                 setShowCaptureModal(true);
//               }}
//               disabled={!!payment}
//               className={`px-4 py-2 rounded text-white ${
//                 payment ? "bg-gray-400 cursor-not-allowed" : "bg-red-600"
//               }`}
//             >
//               Capture Payment
//             </button>

//             <button className="bg-yellow-500 text-white px-4 py-2 rounded">
//               Cancel
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 rounded mt-4">
//           <Field label="Booking ID" value={booking.id} />
//           <Field label="Status" value={booking.status} />
//           <Field label="Scheduled Date" value={formatDate(booking.booking_date)} />
//           <Field label="Slot" value={slot?.slot_str} />
//           <Field label="Booked On" value={formatDate(booking.created_at)} />
//           <Field label="Booked By" value={booking.book_by_user} />
//           <Field label="Amount" value={`₹ ${booking.amount}`} />
//           <Field label="GST (%)" value={amenity?.gst_no} />
//           <Field label="Payment Status" value={payment ? "Paid" : "Pending"} />
//           <Field label="Payment Mode" value={booking.payment_mode} />
//           <Field label="Transaction ID" value={payment?.transaction_id} />
//           <Field label="Amount Paid" value={`₹ ${payment?.paid_amount ?? 0}`} />
//         </div>

//         {showCaptureModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg w-[420px] relative">
//               <h2 className="text-xl font-semibold mb-4">Capture Payment</h2>

//               <label className="font-semibold">Total Amount</label>
//               <input
//                 value={booking.amount}
//                 disabled
//                 className="w-full border p-2 rounded bg-gray-100 mt-1"
//               />

//               <label className="font-semibold mt-3 block">Paid Amount *</label>
//               <input
//                 type="number"
//                 value={paidAmount}
//                 onChange={(e) => setPaidAmount(e.target.value)}
//                 className="w-full border p-2 rounded mt-1"
//               />

//               <label className="font-semibold mt-3 block">Payment Method *</label>
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-full border p-2 rounded mt-1"
//               >
//                 <option value="">Select Payment Method</option>
//                 <option value="CASH">Cash</option>
//                 <option value="ONLINE">Online</option>
//                 <option value="UPI">UPI</option>
//                 <option value="CARD">Card</option>
//               </select>

//               <label className="font-semibold mt-3 block">Transaction ID *</label>
//               <input
//                 type="text"
//                 value={transactionId}
//                 onChange={(e) => setTransactionId(e.target.value)}
//                 className="w-full border p-2 rounded mt-1"
//               />

//               <label className="font-semibold mt-3 block">Date *</label>
//               <input
//                 type="date"
//                 value={paymentDate}
//                 onChange={(e) => setPaymentDate(e.target.value)}
//                 className="w-full border p-2 rounded mt-1"
//               />

//               <label className="font-semibold mt-3 block">Remarks</label>
//               <textarea
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 className="w-full border p-2 rounded mt-1"
//                 rows={2}
//               />

//               <div className="flex justify-end gap-3 mt-5">
//                 <button
//                   onClick={() => setShowCaptureModal(false)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleCapturePaymentSubmit}
//                   disabled={submitting}
//                   className="px-4 py-2 bg-blue-600 text-white rounded"
//                 >
//                   {submitting ? "Submitting..." : "Submit"}
//                 </button>
//               </div>

//               <button
//                 className="absolute top-3 right-3 text-gray-600"
//                 onClick={() => setShowCaptureModal(false)}
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// const Field = ({ label, value }) => (
//   <div>
//     <p className="font-semibold">{label}</p>
//     <p>{value || "-"}</p>
//   </div>
// );

// export default BookingDetails;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { getAmenitiesBookingById } from "../../../api";

const BookingDetails = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const response = await getAmenitiesBookingById(id);
      setBooking(response.data);
    } catch (err) {
      console.error("Error loading booking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-5 text-center">Loading...</p>;
  if (!booking) return <p className="p-5 text-center">No Data Found</p>;

  const amenity = booking.amenity;
  const slots = amenity?.amenity_slots || [];

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="bg-blue-900 text-white p-3 rounded text-center font-semibold text-lg">
          Facility Details
        </div>

        {/* FACILITY INFORMATION */}
        <div className="mt-5 border-b pb-4">
          <h2 className="font-semibold text-lg mb-3">Facility Information</h2>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Facility Name" value={amenity?.fac_name} />
            <Field label="Type" value={amenity?.fac_type} />
            <Field label="Active" value={amenity?.active ? "Yes" : "No"} />
          </div>
        </div>

        {/* FEE DETAILS */}
        <div className="mt-5">
          <h2 className="font-semibold text-lg mb-3">Fee Details</h2>

          <div className="bg-gray-100 p-4 rounded grid grid-cols-2 gap-6">

            {/* MEMBER */}
            <div>
              <p className="font-semibold">Member:</p>
              <p>Adult Fee: {amenity?.member_adult_fee || "N/A"}</p>
              <p>Child Fee: {amenity?.member_child_fee || "N/A"}</p>
            </div>

            {/* GUEST */}
            <div>
              <p className="font-semibold">Guest:</p>
              <p>Adult Fee: {amenity?.guest_adult_fee || "N/A"}</p>
              <p>Child Fee: {amenity?.guest_child_fee || "N/A"}</p>
            </div>

            {/* TENANT */}
            <div>
              <p className="font-semibold">Tenant:</p>
              <p>Adult Fee: {amenity?.tenant_adult_fee || "N/A"}</p>
              <p>Child Fee: {amenity?.tenant_child_fee || "N/A"}</p>
            </div>

            <div className="col-span-2 mt-3">
              <p className="font-semibold">
                Fixed Price: {amenity?.fixed_price || "NA"}
              </p>
            </div>
          </div>
        </div>

        {/* PERSON LIMIT + GST */}
        <div className="grid grid-cols-3 gap-6 mt-5">
          <Field label="Min Person Allowed" value={amenity?.min_person_allowed} />
          <Field label="Max Person Allowed" value={amenity?.max_person_allowed} />
          <Field label="GST" value={amenity?.gst_no} />
        </div>

        {/* BOOKING RULES */}
        <div className="bg-gray-100 p-4 rounded grid grid-cols-3 gap-6 mt-5">
          <Field
            label="Booking Allowed Before"
            value={`${amenity?.booking_allowed_days || 0} days`}
          />
          <Field
            label="Advance Booking"
            value={`${amenity?.advance_booking_days || 0} days`}
          />
          <Field
            label="Can Cancel Before Schedule"
            value={`${amenity?.cancel_before_days || 0} days`}
          />
        </div>

        {/* SLOT CONFIGURATION */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-3">Slot Configuration</h2>

          {slots.length > 0 ? (
            slots.map((slot, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded mb-3">
                <p className="font-semibold">Slot {index + 1}:</p>
                <p>
                  Start Time: {slot.start_hr}:{slot.start_min}
                </p>
                <p>
                  End Time: {slot.end_hr}:{slot.end_min}
                </p>
                <p>
                  From {slot.start_hr}:{slot.start_min} to {slot.end_hr}:{slot.end_min}
                </p>
              </div>
            ))
          ) : (
            <p>No slots configured</p>
          )}
        </div>

        {/* IMAGES */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-3">Images</h2>

          <div className="grid grid-cols-2 gap-6">

            {/* COVER IMAGES */}
            <div>
              <p className="font-semibold mb-2">Cover Images</p>
              {amenity?.cover_images?.length > 0 ? (
                amenity.cover_images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt="cover"
                    className="w-60 h-40 object-cover rounded shadow"
                  />
                ))
              ) : (
                <p>No cover images</p>
              )}
            </div>

            {/* ATTACHMENTS */}
            <div>
              <p className="font-semibold mb-2">Attachments</p>
              {amenity?.attachments?.length > 0 ? (
                amenity.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-blue-600 underline"
                  >
                    Attachment {index + 1}
                  </a>
                ))
              ) : (
                <p>No attachments available.</p>
              )}
            </div>

          </div>
        </div>

        {/* DESCRIPTION + TERMS */}
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <p className="font-semibold">Description:</p>
          <p>{amenity?.description || "-"}</p>

          <p className="font-semibold mt-4">Terms and Conditions:</p>
          <p>{amenity?.terms || "-"}</p>
        </div>

      </div>
    </section>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="font-semibold">{label}:</p>
    <p>{value || "N/A"}</p>
  </div>
);

export default BookingDetails;