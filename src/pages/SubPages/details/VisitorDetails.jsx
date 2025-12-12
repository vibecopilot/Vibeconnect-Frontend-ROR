import React, { useEffect, useState } from "react";
import image from "/profile.png";
import { domainPrefix, getVisitorDetails } from "../../../api";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { BiEdit, BiQr } from "react-icons/bi";
import Navbar from "../../../components/Navbar";
import VisitorQRCode from "../../../containers/modals/VisitorQRCode";

const VisitorDetails = () => {
  const [details, setDetails] = useState({});
  const [deviceLogs, setDeviceLogs] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [qrModal, setQrmodal] = useState(false);

  const { id } = useParams();
  const themeColor = useSelector((state) => state.theme.color);

  // Pagination
  const [devicePage, setDevicePage] = useState(1);
  const [visitorPage, setVisitorPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchVisitorDetails = async () => {
      try {
        const res = await getVisitorDetails(id);
        const data = res.data;
        setDetails(data);

        setDeviceLogs(data.logs || []);

        let merged = [];
        data.logs?.forEach((log) => {
          log.visits_log?.forEach((entry) => {
            merged.push({
              ...entry,
              name: log.name,
              contact_no: log.contact_no,
              vehicle_number: log.vehicle_number,
            });
          });
        });

        setVisitorLogs(merged);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVisitorDetails();
  }, [id]);

  const dateFormat = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "-" : date.toDateString();
  };

  const dateTimeFormat = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date) ? "-" : date.toLocaleString();
  };

  const paginatedDeviceLogs = deviceLogs.slice(
    (devicePage - 1) * ITEMS_PER_PAGE,
    devicePage * ITEMS_PER_PAGE
  );

  const paginatedVisitorLogs = visitorLogs.slice(
    (visitorPage - 1) * ITEMS_PER_PAGE,
    visitorPage * ITEMS_PER_PAGE
  );

  const deviceTotalPages =
    Math.ceil(deviceLogs.length / ITEMS_PER_PAGE) || 1;
  const visitorTotalPages =
    Math.ceil(visitorLogs.length / ITEMS_PER_PAGE) || 1;

  const visitorDeviceLogColumn = [
    { name: "Sr. No.", selector: (row, index) => index + 1 },
    { name: "Name", selector: (row) => row.name },
    { name: "Check In", selector: (row) => dateTimeFormat(row.in_time || row.start_pass) },
    { name: "Check Out", selector: (row) => dateTimeFormat(row.out_time || row.end_pass) },
  ];

  const visitorLogColumn = [
    { name: "Sr. No.", selector: (row, index) => index + 1 },
    { name: "Visitor Name", selector: (row) => row.name },
    { name: "Check In", selector: (row) => dateTimeFormat(row.check_in) },
    { name: "Check Out", selector: (row) => dateTimeFormat(row.check_out) },
  ];

  const visitorExtraColumns = [
    { name: "Name", selector: (row) => row.name },
    { name: "Mobile No", selector: (row) => row.contact_no },
    { name: "Created On", selector: (row) => dateFormat(row.created_at) },
  ];

  return (
    <section className="flex">
      <Navbar />

      <div className="w-full flex mx-3 flex-col overflow-hidden">
        <h2
          style={{ background: themeColor }}
          className="text-center rounded-full text-white font-semibold text-lg p-2 mt-2"
        >
          Visitor Details
        </h2>

        <div className="flex justify-end gap-2 mx-2 mt-1">
          <button
            onClick={() => setQrmodal(true)}
            className="border-2 border-black rounded-full px-2 p-1 flex items-center gap-2"
          >
            <BiQr /> QR Code
          </button>

          <Link
            to={`/admin/passes/visitors/edit-visitor/${id}`}
            className="border-2 border-black rounded-full px-2 p-1 flex items-center gap-2"
          >
            <BiEdit /> Edit Details
          </Link>
        </div>

        <div className="flex justify-center mt-2">
          {details.profile_picture ? (
            <img
              src={domainPrefix + details.profile_picture.url}
              className="w-48 h-48 rounded-full cursor-pointer"
              onClick={() =>
                window.open(domainPrefix + details.profile_picture.url)
              }
            />
          ) : (
            <img src={image} className="w-48 h-48" />
          )}
        </div>

        {/* All Visitor Details */}
        <div className="grid md:grid-cols-3 px-4 gap-5 gap-x-4 mt-4">
          {details.visit_type && <Info label="Visitor Type" value={details.visit_type} />}
          {details?.visit_type === "Support Staff" && (
            <Info label="Staff Category" value={details?.visitor_staff_category?.name} />
          )}
          {details.name && <Info label="Visitor Name" value={details.name} />}
          {details.contact_no && <Info label="Mobile No." value={details.contact_no} />}
          {details.purpose && <Info label="Purpose" value={details.purpose} />}
          {details.coming_from && <Info label="Coming From" value={details.coming_from} />}
          {details.vehicle_number && <Info label="Vehicle No." value={details.vehicle_number} />}
          {details.expected_date && <Info label="Expected Date" value={details.expected_date} />}
          {details.expected_time && <Info label="Expected Time" value={details.expected_time} />}
          {details.goods_inwards !== null && (
            <Info label="Goods Inward" value={details.goods_inwards ? "Yes" : "No"} />
          )}
          {details.skip_host_approval !== null && (
            <Info label="Host Approval Needed" value={details.skip_host_approval ? "No" : "Yes"} />
          )}
          {details.start_pass && (
            <Info label="Pass Start Date" value={dateTimeFormat(details.start_pass)} />
          )}
          {details.end_pass && (
            <Info label="Pass End Date" value={dateTimeFormat(details.end_pass)} />
          )}
          {details.hosts && (
            <div className="grid grid-cols-2">
              <p className="font-semibold text-sm">Host :</p>
              <div>
                {details.hosts.map((host, i) => (
                  <p key={i}>{host.full_name}</p>
                ))}
              </div>
            </div>
          )}
          {details.created_by_name && (
            <Info
              label="Created By"
              value={`${details.created_by_name.firstname} ${details.created_by_name.lastname}`}
            />
          )}
          {details.created_at && (
            <Info label="Created On" value={dateFormat(details.created_at)} />
          )}
          {details.updated_at && (
            <Info label="Updated On" value={dateFormat(details.updated_at)} />
          )}
          {details.frequency === "Frequently" && (
            <Info label="Permitted Days" value={details.working_days?.join(", ")} />
          )}
        </div>

        {/* Additional Visitors */}
        <Section title="Additional Visitors Info">
          {details.extra_visitors?.length ? (
            <Table columns={visitorExtraColumns} data={details.extra_visitors} />
          ) : (
            <p className="text-center">No Additional Visitor Added</p>
          )}
        </Section>

        {/* Device Log
        <Section title="Visitor Device Log">
          <Table columns={visitorDeviceLogColumn} data={paginatedDeviceLogs} />
          <Pagination
            page={devicePage}
            totalPages={deviceTotalPages}
            setPage={setDevicePage}
          />
        </Section> */}

        {/* Visitor Log */}
        <Section title="Visitor Log">
          <Table columns={visitorLogColumn} data={paginatedVisitorLogs} />
          <Pagination
            page={visitorPage}
            totalPages={visitorTotalPages}
            setPage={setVisitorPage}
          />
        </Section>
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

// Small UI components
const Info = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-sm">{label} :</p>
    <p>{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="my-4">
    <h2 className="font-medium border-b text-lg border-gray-400 px-2">
      {title}
    </h2>
    <div className="m-4">{children}</div>
  </div>
);

const Pagination = ({ page, totalPages, setPage }) => (
  <div className="flex justify-center mt-3 gap-4">
  </div>
);

export default VisitorDetails;
