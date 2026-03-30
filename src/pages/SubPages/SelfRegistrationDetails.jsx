import React, { useEffect, useState } from "react";
import image from "/profile.png";
import { domainPrefix } from "../../api";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiQr } from "react-icons/bi";
import VisitorQRCode from "../../containers/modals/VisitorQRCode";
import { getVisitorById } from "../../api";

const SelfRegistrationDetails = () => {

  const [details, setDetails] = useState({});
  const [qrModal, setQrmodal] = useState(false);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const themeColor = useSelector((state) => state.theme.color);

 useEffect(() => {

  if (!id) return;

  const fetchVisitorDetails = async () => {
    try {

      const response = await getVisitorById(id);

      const data = response.data?.visitor || response.data;

      setDetails(data);

    } catch (error) {
      console.log(error);
    }
  };

  fetchVisitorDetails();

}, [id]);

  return (

    <section className="flex">

      <div className="w-full flex mx-3 flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center mt-2">

          <h2
            style={{ background: themeColor }}
            className="text-center rounded-full w-full text-white font-semibold text-lg p-2 px-4"
          >
            Visitor Details
          </h2>

          <div className="flex gap-2 absolute right-6">

            <button
              onClick={() => setQrmodal(true)}
              className="border border-gray-400 rounded-full px-3 py-1 flex items-center gap-2 hover:bg-gray-100"
            >
              <BiQr /> QR code
            </button>

            <button
              onClick={() => navigate(`/edit_visitor/${id}`)}
              className="border border-gray-400 rounded-full px-3 py-1 flex items-center gap-2 hover:bg-gray-100"
            >
              ✏️ Edit Details
            </button>

          </div>

        </div>

        {/* Profile */}
        <div className="flex justify-center mt-6">

          {details?.profile_picture ? (

            <img
              src={`${domainPrefix}${details.profile_picture}`}
              alt="visitor"
              className="w-48 h-48 rounded-full cursor-pointer"
              onClick={() =>
                window.open(
                  `${domainPrefix}${details.profile_picture}`,
                  "_blank"
                )
              }
            />

          ) : (

            <img src={image} alt="visitor" className="w-48 h-48" />

          )}

        </div>

        {/* Visitor Details */}
        <div className="grid grid-cols-3 px-6 mt-8 gap-y-5 gap-x-20 text-sm">

          <div className="grid grid-cols-2">
            <p className="font-semibold">Visitor Type :</p>
            <p>{details?.visit_type}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Visitor's Name :</p>
            <p>{details?.name}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Mobile No. :</p>
            <p>{details?.contact_no}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Purpose :</p>
            <p>{details?.purpose}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Coming From :</p>
            <p>{details?.coming_from}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Vehicle No. :</p>
            <p>{details?.vehicle_no || "-"}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Expected Date :</p>
            <p>{details?.expected_date || "-"}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Expected Time :</p>
            <p>{details?.expected_time || "-"}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Goods Inward :</p>
            <p>{details?.goods_inward ? "Yes" : "No"}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Host :</p>
            <p>
              {details?.hosts?.map((h) => h.full_name).join(", ") || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Host Approval Needed ? :</p>
            <p>{details?.host_approval_required ? "Yes" : "No"}</p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Approve Status :</p>
            <input
              value={details?.status || "Pending"}
              readOnly
              className="rounded-lg px-1 py-1 text-md text-yellow-600  "
            />
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Created On :</p>
            <p>
              {details?.created_at
                ? new Date(details.created_at).toDateString()
                : "-"}
            </p>
          </div>

          <div className="grid grid-cols-2">
            <p className="font-semibold">Updated On :</p>
            <p>
              {details?.updated_at
                ? new Date(details.updated_at).toDateString()
                : "-"}
            </p>
          </div>

        </div>
        {/* Additional Visitors */}
<div className="px-6 mt-8">
  <h3 className="text-md font-semibold border-b pb-2">
    Additional Visitors
  </h3>

  {Array.isArray(details?.extra_visitors) && details.extra_visitors.length > 0 ? (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-black text-white">
          <tr>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Mobile</th>
            <th className="border px-3 py-2 text-left">Created At</th>
          </tr>
        </thead>

        <tbody>
          {details.extra_visitors.map((v, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{v.name || "-"}</td>
              <td className="border px-3 py-2">{v.contact_no || "-"}</td>
              <td className="border px-3 py-2">
                {v.created_at
                  ? new Date(v.created_at).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center text-gray-500 mt-3">
      No Additional Visitors
    </p>
  )}
</div>

        {/* Visitor Log */}
       <div className="px-6 mt-8">
  <h3 className="text-md font-semibold border-b pb-2">
    Visitor Log
  </h3>

  {Array.isArray(details?.logs) && details.logs.length > 0 ? (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 text-sm mb-12">
        <thead className="bg-black text-white">
          <tr>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Purpose</th>
            <th className="border px-3 py-2 text-left">Coming From</th>
            <th className="border px-3 py-2 text-left">Vehicle No</th>
            <th className="border px-3 py-2 text-left">Check In</th>
            <th className="border px-3 py-2 text-left">Check Out</th>
          </tr>
        </thead>

        <tbody>
          {details.logs.map((log, idx) => {
            const visits = Array.isArray(log.visits_log) ? log.visits_log : [];

            // If no check-in/out, still show row
            if (visits.length === 0) {
              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{log.name || "-"}</td>
                  <td className="border px-3 py-2">{log.purpose || "-"}</td>
                  <td className="border px-3 py-2">{log.coming_from || "-"}</td>
                  <td className="border px-3 py-2">{log.vehicle_number || "-"}</td>
                  <td className="border px-3 py-2 text-gray-400">-</td>
                  <td className="border px-3 py-2 text-gray-400">-</td>
                </tr>
              );
            }

            // If multiple visits, show multiple rows
            return visits.map((v, i) => (
              <tr key={`${idx}-${i}`} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{log.name || "-"}</td>
                <td className="border px-3 py-2">{log.purpose || "-"}</td>
                <td className="border px-3 py-2">{log.coming_from || "-"}</td>
                <td className="border px-3 py-2">{log.vehicle_number || "-"}</td>
                <td className="border px-3 py-2">
                  {v.check_in
                    ? new Date(v.check_in).toLocaleString()
                    : "-"}
                </td>
                <td className="border px-3 py-2">
                  {v.check_out
                    ? new Date(v.check_out).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center text-gray-500 mt-3">
      No Log Yet
    </p>
  )}
</div>

      </div>

      {qrModal && (
        <VisitorQRCode
          QR={`${domainPrefix}${details.qr_code_image_url}`}
          onClose={() => setQrmodal(false)}
        />
      )}

    </section>

  );
};

export default SelfRegistrationDetails;