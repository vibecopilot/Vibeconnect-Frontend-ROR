import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/Navbar";
import { domainPrefix, getStaffDetails } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";
import image from "/profile.png";
import {
  dateFormat,
  FormattedDateToShowProperly,
} from "../../../utils/dateUtils";
import { FaRegFileAlt } from "react-icons/fa";
import Table from "../../../components/table/Table";
import { BiEdit, BiQr } from "react-icons/bi";
import VisitorQRCode from "../../../containers/modals/VisitorQRCode";

const StaffDetails = () => {
  const themeColor = useSelector((state) => state.theme.color);
  const [details, setDetails] = useState({});
  const [qrModal, setQrmodal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getStaffDetails(id);

        setDetails(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, [id]);

  /* ================= WORKING SCHEDULE ================= */
  const scheduleArray = details.working_schedule
    ? Object.keys(details.working_schedule).map((day) => ({
        day,
        start_time: details.working_schedule[day].start_time,
        end_time: details.working_schedule[day].end_time,
      }))
    : [];

  const scheduleColumns = [
    { name: "Sr. no.", selector: (row, index) => index + 1 },
    { name: "Days", selector: (row) => row.day },
    { name: "Start Time", selector: (row) => row.start_time },
    { name: "End Time", selector: (row) => row.end_time },
  ];

  /* ================= STAFF LOGS ================= */
  const staffLogs = details.attendances || [];

  const staffLogColumns = [
    {
      name: "Sr. No.",
      cell: (row, index) => index + 1,
    },
    {
      name: "Staff Name",
      selector: (row) => row.staff_name || "--",
    },
    {
      name: "Mobile",
      selector: (row) => row.staff_number || "--",
    },
    {
      name: "Check In",
      selector: (row) =>
        row.punched_in_at
          ? FormattedDateToShowProperly(row.punched_in_at)
          : "--",
    },
    {
      name: "Check Out",
      selector: (row) =>
        row.punched_out_at
          ? FormattedDateToShowProperly(row.punched_out_at)
          : "Still Working",
    },
  ];

  /* ================= FILE HELPERS ================= */
  const isImage = (filePath) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const extension = filePath.split(".").pop().split("?")[0].toLowerCase();
    return imageExtensions.includes(extension);
  };

  const getFileName = (filePath) => filePath.split("/").pop().split("?")[0];

  return (
    <section className="flex">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="w-full flex mx-3 flex-col overflow-hidden mb-10">
        <div className="flex flex-col gap-2 my-2">
          <h2
            style={{ background: themeColor }}
            className="text-center text-white font-semibold rounded-md text-lg p-2"
          >
            Staff Details
          </h2>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setQrmodal(true)}
              className="border-2 border-black rounded-full px-3 py-1 flex items-center gap-2"
            >
              <BiQr /> QR Code
            </button>
            <button
              onClick={() => navigate(`/admin/edit-staff/${id}`)}
              className="border-2 border-black rounded-full px-3 py-1 flex items-center gap-2"
            >
              <BiEdit /> Edit Details
            </button>
          </div>

          {/* PROFILE IMAGE */}
          <div className="flex justify-center">
            {details.profile_picture ? (
              <img
                src={domainPrefix + details.profile_picture.url}
                className="w-48 h-48 rounded-full cursor-pointer"
                onClick={() =>
                  window.open(
                    domainPrefix + details.profile_picture.url,
                    "_blank",
                  )
                }
              />
            ) : (
              <img src={image} className="w-48 h-48" />
            )}
          </div>

          {/* STAFF INFO */}
          <div className="md:grid grid-cols-3 gap-5 border rounded-xl p-4 bg-gray-50">
            <Info
              label="Name"
              value={`${details.firstname} ${details.lastname}`}
            />
            <Info label="Unit" value={details.unit_name} />
            <Info label="Mobile" value={details.mobile_no} />
            <Info label="Email" value={details.email} />
            <Info label="Staff ID" value={details.staff_id} />
            <Info label="Work Type" value={details.work_type} />
            <Info label="Vendor" value={details.vendor_name} />
            <Info label="Valid From" value={dateFormat(details.valid_from)} />
            <Info label="Valid Till" value={dateFormat(details.valid_till)} />
            <Info
              label="Status"
              value={
                details.status ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )
              }
            />
            <Info
              label="Created On"
              value={FormattedDateToShowProperly(details.created_at)}
            />
            <Info
              label="Updated On"
              value={FormattedDateToShowProperly(details.updated_at)}
            />
          </div>

          {/* WORKING SCHEDULE */}
          <div>
            <h2 className="font-medium border-b mb-2">Working Schedule</h2>
            <Table columns={scheduleColumns} data={scheduleArray} />
          </div>

          {/* STAFF LOGS */}
          <div>
            <h2 className="font-medium border-b mb-2">Staff Logs</h2>
            <Table columns={staffLogColumns} data={staffLogs} />
          </div>

          {/* ATTACHMENTS */}
          <div>
            <h2 className="font-medium border-b">Attachments</h2>
            <div className="p-2 flex flex-wrap gap-4 justify-center">
              {details.staff_documents?.length ? (
                details.staff_documents.map((staff) => (
                  <div key={staff.id}>
                    {isImage(domainPrefix + staff.document) ? (
                      <img
                        src={domainPrefix + staff.document}
                        className="w-40 h-28 object-cover rounded-md"
                        onClick={() =>
                          window.open(domainPrefix + staff.document, "_blank")
                        }
                      />
                    ) : (
                      <a
                        href={domainPrefix + staff.document}
                        target="_blank"
                        className="flex flex-col items-center"
                      >
                        <FaRegFileAlt size={50} />
                        {getFileName(staff.document)}
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p>No Attachments</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {qrModal && (
        <VisitorQRCode
          QR={domainPrefix + details.qr_code_image_url}
          onClose={() => setQrmodal(false)}
        />
      )}
    </section>
  );
};

const Info = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-sm">{label} :</p>
    <p className="text-sm">{value}</p>
  </div>
);

export default StaffDetails;
