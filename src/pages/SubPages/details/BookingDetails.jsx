import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import {
  domainPrefix,
  getAmenitiesBookingById,
  postPaymentBookings,
  updateAmenityBook
} from "../../../api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const themeColor = useSelector((state) => state.theme.color);
  const [userName, setUserName] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [facilityDetails, setFacilityDetails] = useState(null);
  const [formData, setFormData] = useState({
    resource_id: id,
    resource_type: "AmenityBooking",
    // total_amount: "",
    paid_amount: "",
    user_id: "",
    payment_method: "",
    transaction_id: "",
    paymen_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  console.log("bookingDetails", bookingDetails)

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    try {
      const bookingResponse = await getAmenitiesBookingById(id);

      console.log("FULL RESPONSE:", bookingResponse);

      const bookingD = bookingResponse?.data || bookingResponse;

      if (!bookingD || !bookingD.id) {
        setError("Booking Data not available for the given ID.");
        return;
      }

      setBookingDetails(bookingD);
      setBooking(bookingD);

      // ✅ Use direct amenity
      setFacilityDetails(bookingD.amenity);

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);



  const postPaymentBooking = async () => {
    if (
      !formData.payment_method ||
      !formData.paid_amount
    ) {
      toast.error("Payment Type and amount are mandatory!");
      return;
    }

    // Validate that the payable amount matches the paid amount
    if (
      parseFloat(formData.paid_amount) !== parseFloat(bookingDetails.amount)
    ) {
      toast.error("Paid amount must equal the payable amount!");
      return;
    }

    try {
      const postData = new FormData();

      // Append all form data fields
      Object.keys(formData).forEach((key) =>
        postData.append(`payment[${key}]`, formData[key])
      );

      // Append the total amount (payable amount) to the request
      postData.append("payment[total_amount]", bookingDetails.amount);

      // Post payment data
      const response = await postPaymentBookings(postData);

      if (response?.status === 201) {
        const updatedBookingData = {
          status: "paid",
        };

        console.log("Booking ID to update:", id); // Log the id to check
        const updateResponse = await updateAmenityBook(id, updatedBookingData); // Pass the id and updated data
        console.log("update response", updateResponse);

        setShowModal(false);
        toast.success("Payment Captured successfully!");

        // Refetch the booking details to show the latest payment information
        await fetchData();
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in booking:", error);
      toast.error("Error in booking. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePaymentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      payment_method: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!bookingDetails || !facilityDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No booking or facility details available.</p>
      </div>
    );
  }


  const handleCancelClick = () => {
    setShowConfirmPopup(true); // Show confirmation popup when cancel is clicked
  };


  const handleConfirmCancel = async () => {
    console.log("id", id);
    try {
      const updatedBookingData = {
        status: "cancelled", // Update status to "cancelled"
      };

      console.log("Booking ID to update:", id); // Log the id to check

      const response = await updateAmenityBook(id, updatedBookingData); // Pass the id and updated data
      console.log("response", response);

      if (response?.status === 200) {

        toast.success("Status Cancelled!");
        navigate("/bookings");
      } else {
        alert("Failed to cancel the booking. Please try again.");
      }
    } catch (error) {
      console.error("Error updating the booking:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRefund = async () => {
    try {
      const updatedBookingData = {
        status: "refunded", // or "cancelled" based on backend
      };

      const response = await updateAmenityBook(id, updatedBookingData);

      if (response?.status === 200) {
        toast.success("Refund processed successfully!");

        setBookingDetails((prev) => ({
          ...prev,
          status: "refunded",
        }));

      } else {
        toast.error("Refund failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing refund!");
    }
  };

  const handleClosePopup = () => {
    setShowConfirmPopup(false); // Close the popup if canceled
  };

  const created = () => {
    const date = new Date(facilityDetails.created_at);
    const yy = date.getFullYear().toString();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  // Find the relevant slot time based on the slot ID in the booking
  const amenitySlotId = bookingDetails?.amenity_slot_id;

  let selectedSlot = null;

  if (amenitySlotId) {
    selectedSlot = facilityDetails?.amenity_slots?.find(
      (slot) => slot.id === amenitySlotId
    );
  } else if (facilityDetails?.amenity_slots?.length > 0) {
    // fallback: take first slot
    selectedSlot = facilityDetails.amenity_slots[0];
  }
  const slotTime = selectedSlot
    ? `${String(selectedSlot.start_hr || 0).padStart(2, "0")}:${String(
      selectedSlot.start_min || 0
    ).padStart(2, "0")} - ${String(selectedSlot.end_hr || 0).padStart(
      2,
      "0"
    )}:${String(selectedSlot.end_min || 0).padStart(2, "0")}`
    : "N/A";
  // console.log("slot time", slotTime);

  // console.log("fac anem", bookingDetails.amount);


  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!booking) return <p className="p-6 text-center">Booking Not Found</p>;

  const amenity = booking.amenity;
  const selectedSlotId = bookingDetails.amenity_slot_id;

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full p-6 overflow-y-auto">
        {/* HEADER */}
        <div className=" text-white p-2 rounded text-center text-lg font-semibold"
          style={{ background: themeColor }}>
          Amenity Booking Details
        </div>

        <div className="flex justify-end p-2 items-center w-full">
          <div>
            <div className="flex justify-end gap-2 w-full">
              {bookingDetails.status !== "cancelled" &&
                bookingDetails.status !== "paid" && (
                  <button
                    className="rounded-md text-white p-2 w-[150px] cursor-pointer"
                    style={{ background: themeColor }}
                    onClick={() => setShowModal(true)}
                  >
                    Capture Payment
                  </button>
                )}
              {bookingDetails.status === "paid" && (
                <button
                  className="bg-orange-500 rounded-md text-white p-2 w-[150px] cursor-pointer"
                  onClick={() => handleRefund()}
                >
                  Refund
                </button>
              )}

              <div>
                {bookingDetails.status !== "paid" && (
                  <button
                    className="bg-red-500 rounded-md text-white p-2 w-[100px] cursor-pointer"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                )}

                {/* Confirmation Popup */}
                {showConfirmPopup && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                      <h3 className="text-xl font-semibold mb-4">
                        Are you sure?
                      </h3>
                      <p className="mb-4">
                        Do you want to cancel and go back to the bookings page?
                      </p>
                      <div className="flex justify-end gap-4">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                          onClick={handleConfirmCancel}
                        >
                          Yes, Cancel
                        </button>
                        <button
                          className="bg-gray-500 text-white px-4 py-2 rounded-md"
                          onClick={handleClosePopup}
                        >
                          No, Stay
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-md w-96">
                  <h2 className="text-xl font-bold mb-4">Capture Payment</h2>
                  <div className="flex flex-col gap-4">
                    {/* <input
                      type="text"
                      disabled
                      name="resource_id"
                      placeholder="Resource ID"
                      value={formData.resource_id}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full"
                    /> */}
                    <label>
                      Total Amount
                      <input
                        type="text"
                        name="total_amount"
                        placeholder="Total Amount"
                        value={formData.total_amount || bookingDetails.amount} // Use formData.total_amount, fallback to bookingDetails.amount
                        onChange={handleInputChange}
                        className="border p-2 bg-gray-100 rounded-md w-full"
                        disabled // This will disable the input field
                      />
                    </label>

                    <label>
                      Paid Amount{" "}
                      <label className="text-red-500 font-semibold">*</label>
                      <input
                        type="text"
                        name="paid_amount"
                        placeholder="Paid Amount"
                        value={formData.paid_amount}
                        onChange={handleInputChange}
                        className="border p-2 rounded-md w-full"
                      />
                    </label>

                    {/* <input
                      type="text"
                      name="user_id"
                      disabled
                      placeholder="User ID"
                      value={user_id}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full"
                    /> */}

                    {/* <input
                      type="text"
                      name="payment_method"
                      placeholder="Payment Method"
                      value={payment_mode === "pre" ? "Prepaid" : "post" ? "Postpaid" : ""}
                      onChange={handleInputChange}
                      className="border p-2 rounded-md w-full"
                    /> */}
                    <label>
                      Payment Method{" "}
                      <label className="text-red-500 font-semibold">*</label>
                      <select
                        className="border p-2 rounded w-full"
                        value={formData.payment_method}
                        onChange={(e) => handlePaymentChange(e.target.value)}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="UPI">UPI</option>
                        <option value="NEFT">NEFT</option>
                        <option value="CASH">Cash</option>
                      </select>
                    </label>
                    <label>
                      {" "}
                      Transaction ID{" "}
                      <label className="text-red-500 font-semibold"></label>
                      <input
                        type="text"
                        name="transaction_id"
                        placeholder="Transaction ID"
                        value={formData.transaction_id}
                        onChange={handleInputChange}
                        className="border p-2 rounded-md w-full"
                      />
                    </label>
                    <label>
                      {" "}
                      Date
                      <input
                        type="date"
                        name="paymen_date"
                        placeholder="Payment Date"
                        value={formData.paymen_date}
                        onChange={handleInputChange}
                        className="border p-2 rounded-md w-full"
                      />
                    </label>
                    <label>
                      Remarks
                      <input
                        type="textarea"
                        name="notes"
                        placeholder="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="border p-2 rounded-md w-full"
                      />
                    </label>
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-md"
                        onClick={postPaymentBooking}
                      >
                        Submit
                      </button>
                      <button
                        className="bg-gray-500 text-white p-2 rounded-md"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* BOOKING DETAILS */}
        <div className="bg-gray-100 p-5 rounded mt-6 grid grid-cols-4 gap-5">
          <Field label="Booking ID" value={booking.id} />
          <Field
            label="Status"
            value={
              <span
                className={`${booking.status === "booked"
                  ? "bg-yellow-500"
                  : booking.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-green-500"
                  } text-white px-2 py-1 rounded-md text-sm`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            }
          />
          <Field label="Booked By" value={booking.book_by_user} />
          <Field label="Scheduled Date" value={booking.booking_date} />
          <Field label="Booked Date" value={booking.created_at?.split("T")[0]} />
          <Field
            label="Slot"
            value={
              selectedSlot?.twelve_hr_slot
                ? selectedSlot.twelve_hr_slot
                : "No Slot Available"
            }
          />
          <Field label="Payment Mode" value={booking.payment_mode} />
          <Field label="Amount" value={`₹ ${booking.amount}`} />
        </div>

        {/* FACILITY INFORMATION */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Facility Information</h2>

          <div className="grid grid-cols-3 gap-5 bg-gray-100 p-5 rounded">
            <Field label="Facility Name" value={amenity?.fac_name} />
            <Field label="Type" value={amenity?.fac_type} />
            <Field label="Active" value={amenity?.active ? "Yes" : "No"} />
            <Field label="Min People" value={amenity?.min_people} />
            <Field label="Max People" value={amenity?.max_people} />
            <Field label="GST (%)" value={amenity?.gst_no} />
          </div>
        </div>

        {/* FEE DETAILS */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Fee Details</h2>

          {amenity?.is_fixed ? (
            <div className="bg-gray-100 p-5 rounded">
              <p className="font-semibold">Fixed Price</p>
              <p>₹ {amenity?.fixed_amount ?? "-"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">

              {/* MEMBER */}
              {(amenity?.member_price_adult || amenity?.member_price_child) && (
                <div className="bg-gray-100 p-4 rounded">
                  <p className="font-semibold mb-2">Member</p>
                  {amenity?.member_price_adult && (
                    <p>Adult: ₹ {amenity.member_price_adult}</p>
                  )}
                  {amenity?.member_price_child && (
                    <p>Child: ₹ {amenity.member_price_child}</p>
                  )}
                </div>
              )}

              {/* GUEST */}
              {(amenity?.guest_price_adult || amenity?.guest_price_child) && (
                <div className="bg-gray-100 p-4 rounded">
                  <p className="font-semibold mb-2">Guest</p>
                  {amenity?.guest_price_adult && (
                    <p>Adult: ₹ {amenity.guest_price_adult}</p>
                  )}
                  {amenity?.guest_price_child && (
                    <p>Child: ₹ {amenity.guest_price_child}</p>
                  )}
                </div>
              )}

              {/* TENANT */}
              {(amenity?.tenant_price_adult || amenity?.tenant_price_child) && (
                <div className="bg-gray-100 p-4 rounded">
                  <p className="font-semibold mb-2">Tenant</p>
                  {amenity?.tenant_price_adult && (
                    <p>Adult: ₹ {amenity.tenant_price_adult}</p>
                  )}
                  {amenity?.tenant_price_child && (
                    <p>Child: ₹ {amenity.tenant_price_child}</p>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        {/* PAYMENT DETAILS */}
        {bookingDetails.payment && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Payment Details</h2>

            <div className="bg-green-50 p-5 rounded border-2 border-green-200">
              <div className="grid grid-cols-2 gap-5">
                <Field label="Transaction ID" value={bookingDetails.payment.transaction_id} />
                <Field label="Payment Method" value={bookingDetails.payment.payment_method} />
                <Field label="Total Amount" value={`₹ ${bookingDetails.payment.total_amount}`} />
                <Field label="Paid Amount" value={`₹ ${bookingDetails.payment.paid_amount}`} />
                <Field label="Payment Date" value={bookingDetails.payment.paymen_date} />
                <Field label="Status" value={
                  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                    Paid
                  </span>
                } />
              </div>
              {bookingDetails.payment.notes && bookingDetails.payment.notes !== "N/A" && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="font-semibold mb-2">Remarks</p>
                  <p>{bookingDetails.payment.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKING RULES */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Booking Rules</h2>

          <div className="grid grid-cols-3 gap-5 bg-gray-100 p-5 rounded">
            <Field
              label="Booking Allowed Before"
              value={amenity?.book_before?.[0]}
            />
            <Field
              label="Advance Booking"
              value={amenity?.advance_booking?.[0]}
            />
            <Field label="Cancel Before" value={amenity?.cancel_before?.[0]} />
          </div>
        </div> */}

        {/* SLOT LIST */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Amenity Slot Timings</h2>

          <div className="grid grid-cols-4 gap-3">
            {amenity?.amenity_slots?.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded text-center border ${s.id === selectedSlotId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                  }`}
              >
                {s.twelve_hr_slot}
              </div>
            ))}
          </div>
        </div> */}

        {/* DESCRIPTION */}
        <div className="mt-8 bg-gray-100 p-5 rounded">
          <p className="font-semibold mb-2">Description</p>
          <p>{amenity?.description || "No description available"}</p>

          <p className="font-semibold mt-4 mb-2">Terms & Conditions</p>
          <p className="whitespace-pre-line">{amenity?.terms}</p>
        </div>

        {/* IMAGES
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Images</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* COVER IMAGES 
            <div>
              <p className="font-semibold mb-3">Cover Images</p>
              <hr className="border border-1 border-gray-900" />
              <div className="flex flex-wrap gap-3 mt-2">
                {amenity?.covers?.length > 0 ? (
                  amenity.covers.map((img) => (
                    <img
                      key={img.id}
                      src={`${domainPrefix}${img.image_url}`}
                      alt="cover"
                      className="w-[400px] h-52 object-cover rounded shadow cursor-pointer hover:opacity-80"
                      onClick={() =>
                        setPreviewImage(`${domainPrefix}${img.image_url}`)
                      }
                    />
                  ))
                ) : (
                  <p>No cover images</p>
                )}
              </div>
            </div>

            {/* ATTACHMENTS 
            <div>
              <p className="font-semibold mb-3">Attachments</p>
              <hr className="border border-1 border-gray-900" />
              <div className="flex flex-wrap gap-3 mt-2">
                {amenity?.attachments?.length > 0 ? (
                  amenity.attachments.map((file) => (
                    <img
                      key={file.id}
                      src={`${domainPrefix}${file.image_url}`}
                      alt="attachment"
                      className="w-[400px] h-52 object-cover rounded shadow cursor-pointer hover:opacity-80"
                      onClick={() =>
                        setPreviewImage(`${domainPrefix}${file.image_url}`)
                      }
                    />
                  ))
                ) : (
                  <p>No attachments</p>
                )}
              </div>
            </div>
          </div>
        </div>

        
      </div>
   {previewImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setPreviewImage(null)}
  >
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={previewImage}
        alt="preview"
        className="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-lg"
      />

      <button
        className="absolute top-2 right-2 bg-white px-3 py-1 rounded shadow"
        onClick={() => setPreviewImage(null)}
      >
        ✕
      </button>
    </div>
  </div>
)} */}
      </div>
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
