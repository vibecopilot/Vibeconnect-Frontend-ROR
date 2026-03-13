import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { domainPrefix, getAmenitiesBookingById } from "../../../api";

const BookingDetails = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const res = await getAmenitiesBookingById(id);
      setBooking(res.data);
    } catch (err) {
      console.error("Error loading booking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!booking) return <p className="p-6 text-center">Booking Not Found</p>;

  const amenity = booking.amenity;
  const slot = booking.slot;

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="bg-blue-900 text-white p-3 rounded text-center text-lg font-semibold">
          Amenity Booking Details
        </div>

        {/* BOOKING DETAILS */}
        <div className="bg-gray-100 p-5 rounded mt-6 grid grid-cols-4 gap-5">
          <Field label="Booking ID" value={booking.id} />
          <Field label="Status" value={booking.status} />
          <Field label="Booked By" value={booking.book_by_user} />
          <Field label="Booking Date" value={booking.booking_date} />
          <Field label="Booked On" value={booking.created_at?.split("T")[0]} />
          <Field label="Slot" value={slot?.twelve_hr_slot} />
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

          <div className="grid grid-cols-3 gap-5">
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold mb-2">Member</p>
              <p>Adult: ₹ {amenity?.member_price_adult || "-"}</p>
              <p>Child: ₹ {amenity?.member_price_child || "-"}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold mb-2">Guest</p>
              <p>Adult: ₹ {amenity?.guest_price_adult || "-"}</p>
              <p>Child: ₹ {amenity?.guest_price_child || "-"}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <p className="font-semibold mb-2">Tenant</p>
              <p>Adult: ₹ {amenity?.tenant_price_adult || "-"}</p>
              <p>Child: ₹ {amenity?.tenant_price_child || "-"}</p>
            </div>
          </div>
        </div>

        {/* BOOKING RULES */}
        <div className="mt-8">
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
        </div>

        {/* SLOT LIST */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">All Slot Timings</h2>

          <div className="grid grid-cols-4 gap-3">
            {amenity?.amenity_slots?.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded text-center border ${
                  s.id === slot?.id ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {s.twelve_hr_slot}
              </div>
            ))}
          </div>
        </div>

        {/* IMAGES */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Images</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* COVER IMAGES */}
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

            {/* ATTACHMENTS */}
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

        {/* DESCRIPTION */}
        <div className="mt-8 bg-gray-100 p-5 rounded">
          <p className="font-semibold mb-2">Description</p>
          <p>{amenity?.description || "No description available"}</p>

          <p className="font-semibold mt-4 mb-2">Terms & Conditions</p>
          <p className="whitespace-pre-line">{amenity?.terms}</p>
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
