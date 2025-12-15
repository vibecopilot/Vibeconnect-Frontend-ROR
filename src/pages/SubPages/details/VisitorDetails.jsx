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

        <div className="grid md:grid-cols-3 px-4 gap-5 gap-x-4 mt-4">
          {details.visit_type && (
            <Info label="Visitor Type" value={details.visit_type} />
          )}
          {details.visitor_staff_category && details.visitor_staff_category.name && (
            <Info label="Support Category" value={details.visitor_staff_category.name} />
          )}
          {details.name && <Info label="Visitor Name" value={details.name} />}
          {details.contact_no && (
            <Info label="Contact No." value={details.contact_no} />
          )}
          {details.purpose && <Info label="Purpose" value={details.purpose} />}
          {details.coming_from && (
            <Info label="Coming From" value={details.coming_from} />
          )}
          {details.vehicle_number && (
            <Info label="Vehicle Number" value={details.vehicle_number} />
          )}
          {details.expected_date && (
            <Info
              label="Expected Date"
              value={dateFormat(details.expected_date)}
            />
          )}
          {details.expected_time && (
            <Info label="Expected Time" value={details.expected_time} />
          )}
          {details.frequency && (
            <Info label="Visiting Frequency" value={details.frequency} />
          )}
          {details.pass_number && (
            <Info label="Pass Number" value={details.pass_number} />
          )}
          {details.parking_slot && details.parking_slot.name && (
            <Info label="Parking Slot" value={details.parking_slot.name} />
          )}
          
          {details.vhost && details.vhost.name && (
            <Info label="Host Name" value={details.vhost.name} />
          )}
          
          {details.frequency === "Frequently" && details.start_pass && (
            <Info
              label="Pass Start Date/Time"
              value={dateTimeFormat(details.start_pass)}
            />
          )}
          {details.frequency === "Frequently" && details.end_pass && (
            <Info
              label="Pass End Date/Time"
              value={dateTimeFormat(details.end_pass)}
            />
          )}
          <BooleanInfo
            label="Skip Host Approval"
            value={details.skip_host_approval}
          />
          <BooleanInfo label="Goods Inward" value={details.goods_inwards} />
          <BooleanInfo
            label="License Document"
            value={details.license_doc}
          />
          <BooleanInfo
            label="Consignment Document"
            value={details.consignment_doc}
          />
          {details.working_days && details.working_days.length > 0 && (
            <Info
              label="Permitted Days"
              value={details.working_days.join(", ")}
            />
          )}
          
        </div>

        {details.goods_inwards && (
            <Section title="Goods Inward Details">
                <div className="grid md:grid-cols-3 px-4 gap-5 gap-x-4">
                    {details.goods_inward_info?.no_of_goods && (
                        <Info label="No. of Goods" value={details.goods_inward_info.no_of_goods} />
                    )}
                    {details.goods_inward_info?.description && (
                        <Info label="Description" value={details.goods_inward_info.description} />
                    )}
                    {details.goods_inward_info?.goods_files && details.goods_inward_info.goods_files.length > 0 && (
                        <Info label="Attachments" value={<a href={domainPrefix + details.goods_inward_info.goods_files[0].url} target="_blank" className="text-blue-500 underline">View Files ({details.goods_inward_info.goods_files.length})</a>} />
                    )}
                </div>
            </Section>
        )}

        {(details.license_doc || details.consignment_doc) && (
            <Section title="Visitor Documents">
                <div className="grid md:grid-cols-3 px-4 gap-5 gap-x-4">
                    {details.license_doc && details.visitor_files?.filter(f => f.category_type === 'license').length > 0 && (
                        <Info label="License Files" value={<a href={domainPrefix + details.visitor_files.filter(f => f.category_type === 'license')[0].url} target="_blank" className="text-blue-500 underline">View Files ({details.visitor_files.filter(f => f.category_type === 'license').length})</a>} />
                    )}
                    {details.consignment_doc && details.visitor_files?.filter(f => f.category_type === 'consignment').length > 0 && (
                        <Info label="Consignment Files" value={<a href={domainPrefix + details.visitor_files.filter(f => f.category_type === 'consignment')[0].url} target="_blank" className="text-blue-500 underline">View Files ({details.visitor_files.filter(f => f.category_type === 'consignment').length})</a>} />
                    )}
                </div>
            </Section>
        )}

        <Section title="Additional Visitors">
          {details.extra_visitors && details.extra_visitors.length > 0 ? (
            <Table columns={visitorExtraColumns} data={details.extra_visitors} />
          ) : (
            <p className="px-2 text-gray-500">No Additional Visitor Added</p>
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

const Info = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-sm">{label} :</p>
    <p>{value}</p>
  </div>
);

const BooleanInfo = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-sm">{label} :</p>
    <p>{value ? "Yes" : "No"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="my-4">
    <h2 className="font-medium border-b text-lg border-gray-400 px-2">
      {title}
    </h2>
    <div className="p-2">{children}</div>
  </div>
);

export default VisitorDetails;