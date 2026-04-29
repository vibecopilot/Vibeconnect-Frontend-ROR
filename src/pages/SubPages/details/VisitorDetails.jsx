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

  const [devicePage, setDevicePage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchVisitorDetails = async () => {
      try {
        const res = await getVisitorDetails(id);
        const data = res.data;
        console.log("Visitor API Response:", JSON.stringify(data, null, 2));

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

  // ✅ Build full URL (handle both absolute & relative paths)
  const buildUrl = (path) => {
    if (!path) return "";
    return String(path).startsWith("http") ? path : domainPrefix + path;
  };

  // ✅ visitor_license[] and visitor_consignment[] are arrays of {id, document, ...}
  const getLicenseDocuments = () => details.visitor_license || [];
  const getConsignmentDocuments = () => details.visitor_consignment || [];
  const hasLicenseDocuments = () => getLicenseDocuments().length > 0;
  const hasConsignmentDocuments = () => getConsignmentDocuments().length > 0;

  // ✅ Host name: hosts[0].full_name
  const hostName =
    details.hosts?.[0]?.full_name ||
    details.vhost?.name ||
    null;

  // ✅ Created by name: firstname + lastname
  const createdByName = details.created_by_name
    ? `${details.created_by_name.firstname || ""} ${details.created_by_name.lastname || ""}`.trim()
    : null;

  // ✅ visitor_staff_category can be array or object
  const staffCategoryName = Array.isArray(details.visitor_staff_category)
    ? details.visitor_staff_category?.[0]?.name || null
    : details.visitor_staff_category?.name || null;

  // ✅ Goods: top-level fields first, fall back to goods_in_out object
  const noOfGoods =
    details.no_of_goods != null
      ? details.no_of_goods
      : details.goods_in_out?.no_of_goods ?? null;
  const goodsDescription =
    details.goods_description != null
      ? details.goods_description
      : details.goods_in_out?.description ?? null;
  const goodsVehicle = details.goods_in_out?.vehicle_no || null;
  const goodsPersonName = details.goods_in_out?.person_name || null;
  const goodsWardType = details.goods_in_out?.ward_type || null;
  const hasGoodsDetails = noOfGoods != null || goodsDescription || goodsVehicle || goodsPersonName;

  const paginatedDeviceLogs = deviceLogs.slice(
    (devicePage - 1) * ITEMS_PER_PAGE,
    devicePage * ITEMS_PER_PAGE
  );

  const visitorDeviceLogColumn = [
    { name: "Sr. No.", selector: (_, index) => index + 1 },
    { name: "Name", selector: (row) => row.name || "-" },
    { name: "Check In", selector: (row) => dateTimeFormat(row.in_time || row.start_pass) },
    { name: "Check Out", selector: (row) => dateTimeFormat(row.out_time || row.end_pass) },
  ];

  const visitorLogColumn = [
    { name: "Sr. No.", selector: (_, index) => index + 1 },
    { name: "Visitor Name", selector: (row) => row.name || "-" },
    { name: "Check In", selector: (row) => dateTimeFormat(row.check_in) },
    { name: "Check Out", selector: (row) => dateTimeFormat(row.check_out) },
  ];

  const visitorExtraColumns = [
    { name: "Name", selector: (row) => row.name || "-" },
    { name: "Mobile No", selector: (row) => row.contact_no || "-" },
    { name: "Created On", selector: (row) => dateFormat(row.created_at) },
  ];

  const hostsColumns = [
    { name: "Host Name", selector: (row) => row.full_name || "-" },
    {
      name: "Approved",
      selector: (row) =>
        row.is_approved === true
          ? "Yes"
          : row.is_approved === false
          ? "No"
          : "--",
    },
    { name: "Mode of Approval", selector: (row) => row.mode_of_approval || "--" },
  ];

  // ─── Document card renderer ─────────────────────────────────────────────────
  const DocCard = ({ file, index, kind }) => {
    const url = buildUrl(file.document);
    const isPdf = url.toLowerCase().endsWith(".pdf");
    return isPdf ? (
      <a
        key={file.id || index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full h-48 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="text-center">
          <span className="text-4xl">📄</span>
          <p className="text-sm text-gray-600 mt-2 font-semibold">View PDF</p>
          <p className="text-xs text-gray-400 mt-1">Click to open</p>
        </div>
      </a>
    ) : (
      <a
        key={file.id || index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-48 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        <img
          src={url}
          alt={`${kind} ${index + 1}`}
          className="w-full h-full object-contain p-4"
        />
      </a>
    );
  };

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

        {/* ACTION BUTTONS */}
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

        {/* PROFILE PICTURE */}
        <div className="flex justify-center mt-2">
          {details.profile_picture ? (
            <img
              src={buildUrl(details.profile_picture)}
              alt="Visitor Profile"
              className="w-48 h-48 rounded-full cursor-pointer object-cover"
              onClick={() => window.open(buildUrl(details.profile_picture))}
            />
          ) : (
            <img
              src={image}
              alt="Default Profile"
              className="w-48 h-48 rounded-full object-cover"
            />
          )}
        </div>

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-3 px-4 gap-5 mt-4">
          {details.visit_type && (
            <Info label="Visitor Type" value={details.visit_type} />
          )}
          {staffCategoryName && (
            <Info label="Support Category" value={staffCategoryName} />
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
          {details.parking_slot && (
            <Info
              label="Parking Slot"
              value={
                typeof details.parking_slot === "object"
                  ? details.parking_slot.name ||
                    details.parking_slot.slot_name ||
                    "-"
                  : details.parking_slot
              }
            />
          )}
          {/* ✅ Host from hosts[0].full_name */}
          {hostName && <Info label="Host Name" value={hostName} />}
          {/* ✅ Created by firstname + lastname */}
          {createdByName && <Info label="Created By" value={createdByName} />}
          {/* ✅ Pass dates */}
          {details.start_pass && (
            <Info
              label="Pass Start Date"
              value={dateTimeFormat(details.start_pass)}
            />
          )}
          {details.end_pass && (
            <Info
              label="Pass End Date"
              value={dateTimeFormat(details.end_pass)}
            />
          )}
          {/* ✅ Working days */}
          {Array.isArray(details.working_days) &&
            details.working_days.length > 0 && (
              <Info
                label="Working Days"
                value={details.working_days.join(", ")}
              />
            )}
          <BooleanInfo
            label="Skip Host Approval"
            value={details.skip_host_approval}
          />
          <BooleanInfo label="Goods Inward" value={details.goods_inwards} />
          <BooleanInfo
            label="License Document"
            value={hasLicenseDocuments()}
          />
          <BooleanInfo
            label="Consignment Document"
            value={hasConsignmentDocuments()}
          />
        </div>

        {/* HOSTS TABLE */}
        {Array.isArray(details.hosts) && details.hosts.length > 0 && (
          <Section title="Host(s)">
            <Table columns={hostsColumns} data={details.hosts} />
          </Section>
        )}

        {/* DOCUMENTS */}
        {(hasLicenseDocuments() || hasConsignmentDocuments()) && (
          <Section title="Visitor Documents">
            <div className="grid md:grid-cols-2 gap-6 px-4">
              {/* LICENSE */}
              <div className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-blue-900">
                    License Document
                  </h3>
                  {hasLicenseDocuments() && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {getLicenseDocuments().length} file(s)
                    </span>
                  )}
                </div>
                {hasLicenseDocuments() ? (
                  <div className="space-y-3">
                    {getLicenseDocuments().map((file, index) => (
                      <DocCard key={file.id || index} file={file} index={index} kind="License" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <span className="text-2xl">📄</span>
                    <p className="text-gray-600 font-semibold mt-2">Not Applicable</p>
                    <p className="text-sm text-gray-500 mt-1">No files uploaded</p>
                  </div>
                )}
              </div>

              {/* CONSIGNMENT */}
              <div className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-green-900">
                    Consignment Document
                  </h3>
                  {hasConsignmentDocuments() && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {getConsignmentDocuments().length} file(s)
                    </span>
                  )}
                </div>
                {hasConsignmentDocuments() ? (
                  <div className="space-y-3">
                    {getConsignmentDocuments().map((file, index) => (
                      <DocCard key={file.id || index} file={file} index={index} kind="Consignment" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <span className="text-2xl">📦</span>
                    <p className="text-gray-600 font-semibold mt-2">Not Applicable</p>
                    <p className="text-sm text-gray-500 mt-1">No files uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* GOODS INWARD */}
        {details.goods_inwards && (
          <Section title="Goods Inward Details">
            <div className="grid md:grid-cols-3 px-4 gap-5">
              {noOfGoods != null && (
                <Info label="No. of Goods" value={noOfGoods} />
              )}
              {goodsDescription && (
                <Info label="Description" value={goodsDescription} />
              )}
              {goodsVehicle && (
                <Info label="Vehicle Number" value={goodsVehicle} />
              )}
              {goodsPersonName && (
                <Info label="Person Name" value={goodsPersonName} />
              )}
              {goodsWardType && (
                <Info label="Ward Type" value={goodsWardType} />
              )}
              {!hasGoodsDetails && (
                <p className="text-gray-500 col-span-3">
                  No goods details available yet.
                </p>
              )}
            </div>
          </Section>
        )}

        {/* ADDITIONAL VISITORS */}
        <Section title="Additional Visitors">
          {details.extra_visitors?.length > 0 &&
          details.extra_visitors.some((v) => v.name || v.contact_no) ? (
            <Table
              columns={visitorExtraColumns}
              data={details.extra_visitors.filter(
                (v) => v.name || v.contact_no
              )}
            />
          ) : (
            <p className="px-2 text-gray-500">No Additional Visitor Added</p>
          )}
        </Section>

        {/* VISITOR LOG */}
        <Section title="Visitor Log">
          {visitorLogs.length > 0 ? (
            <Table columns={visitorLogColumn} data={visitorLogs} />
          ) : (
            <p className="px-2 text-gray-500">No visit logs available</p>
          )}
        </Section>

        {/* DEVICE LOGS */}
        {deviceLogs.length > 0 && (
          <Section title="Device Logs">
            <Table
              columns={visitorDeviceLogColumn}
              data={paginatedDeviceLogs}
            />
          </Section>
        )}
      </div>

      {qrModal && (
        <VisitorQRCode
          QR={buildUrl(details.qr_code_image_url)}
          onClose={() => setQrmodal(false)}
        />
      )}
    </section>
  );
};

const Info = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-sm">{label} :</p>
    <p className="text-gray-700">{value != null ? String(value) : "-"}</p>
  </div>
);

const BooleanInfo = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-sm">{label} :</p>
    <p className="font-medium">
      {value ? (
        <span className="text-green-600">Yes</span>
      ) : (
        <span className="text-gray-400">No</span>
      )}
    </p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="my-4">
    <h2 className="font-medium border-b text-lg border-gray-400 px-2 pb-1">
      {title}
    </h2>
    <div className="p-2">{children}</div>
  </div>
);

export default VisitorDetails;