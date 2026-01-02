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

  // ✅ FIXED: Get documents from correct API fields
  const getLicenseDocuments = () => {
    // API returns visitor_license as an array of objects with document field
    return details.visitor_license || [];
  };

  const getConsignmentDocuments = () => {
    // API returns visitor_consignment as an array of objects with document field
    return details.visitor_consignment || [];
  };

  // ✅ FIXED: Check if license/consignment exists based on actual data
  const hasLicenseDocuments = () => {
    return getLicenseDocuments().length > 0;
  };

  const hasConsignmentDocuments = () => {
    return getConsignmentDocuments().length > 0;
  };

  const paginatedDeviceLogs = deviceLogs.slice(
    (devicePage - 1) * ITEMS_PER_PAGE,
    devicePage * ITEMS_PER_PAGE
  );

  const paginatedVisitorLogs = visitorLogs.slice(
    (visitorPage - 1) * ITEMS_PER_PAGE,
    visitorPage * ITEMS_PER_PAGE
  );

  const visitorDeviceLogColumn = [
    { name: "Sr. No.", selector: (_, index) => index + 1 },
    { name: "Name", selector: (row) => row.name },
    {
      name: "Check In",
      selector: (row) => dateTimeFormat(row.in_time || row.start_pass),
    },
    {
      name: "Check Out",
      selector: (row) => dateTimeFormat(row.out_time || row.end_pass),
    },
  ];

  const visitorLogColumn = [
    { name: "Sr. No.", selector: (_, index) => index + 1 },
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
              src={domainPrefix + details.profile_picture}
              alt="Visitor Profile"
              className="w-48 h-48 rounded-full cursor-pointer object-cover"
              onClick={() =>
                window.open(domainPrefix + details.profile_picture)
              }
            />
          ) : (
            <img src={image} alt="Default Profile" className="w-48 h-48 rounded-full object-cover" />
          )}
        </div>

        {/* VISITOR BASIC INFO */}
        <div className="grid md:grid-cols-3 px-4 gap-5 mt-4">
          {details.visit_type && (
            <Info label="Visitor Type" value={details.visit_type} />
          )}
          {details.visitor_staff_category?.name && (
            <Info
              label="Support Category"
              value={details.visitor_staff_category.name}
            />
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
          {details.parking_slot?.name && (
            <Info label="Parking Slot" value={details.parking_slot.name} />
          )}
          {/* ✅ FIXED: Handle different possible host name fields */}
          {(details.vhost?.name || details.hosts?.[0]?.name) && (
            <Info 
              label="Host Name" 
              value={details.vhost?.name || details.hosts?.[0]?.name || "-"} 
            />
          )}
          {/* ✅ FIXED: Handle pass dates */}
          {details.start_pass && (
            <Info label="Pass Start Date" value={dateTimeFormat(details.start_pass)} />
          )}
          {details.end_pass && (
            <Info label="Pass End Date" value={dateTimeFormat(details.end_pass)} />
          )}
          {/* ✅ FIXED: Handle working days array */}
          {details.working_days && Array.isArray(details.working_days) && details.working_days.length > 0 && (
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
          {/* ✅ FIXED: Show if license documents exist */}
          <BooleanInfo 
            label="License Document" 
            value={hasLicenseDocuments()} 
          />
          {/* ✅ FIXED: Show if consignment documents exist */}
          <BooleanInfo
            label="Consignment Document"
            value={hasConsignmentDocuments()}
          />
        </div>

        {/* ✅ FIXED: Only show documents section if either exists */}
        {(hasLicenseDocuments() || hasConsignmentDocuments()) && (
          <Section title="Visitor Documents">
            <div className="grid md:grid-cols-2 gap-6 px-4">
              
              {/* LICENSE DOCUMENTS */}
              <div className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-blue-900 flex items-center gap-2">
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
                    {getLicenseDocuments().slice(0, 2).map((file, index) => {
                      const isPdf = file.document?.toLowerCase().endsWith('.pdf');
                      return isPdf ? (
                        <a
                          key={file.id || index}
                          href={domainPrefix + file.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-48 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <span className="text-4xl">📄</span>
                            <p className="text-sm text-gray-600 mt-2 font-semibold">View PDF Document</p>
                            <p className="text-xs text-gray-400 mt-1">Click to open</p>
                          </div>
                        </a>
                      ) : (
                        <a
                          key={file.id || index}
                          href={domainPrefix + file.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-48 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                          <img
                            src={domainPrefix + file.document}
                            alt={`License ${index + 1}`}
                            className="w-full h-full object-contain p-4"
                          />
                        </a>
                      );
                    })}
                    {getLicenseDocuments().length > 2 && (
                      <div className="text-center p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                        <p className="text-blue-600 font-semibold">
                          +{getLicenseDocuments().length - 2} more file(s)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="text-gray-600 font-semibold text-center">Not Applicable</p>
                    <p className="text-sm text-gray-500 mt-1">No files uploaded</p>
                  </div>
                )}
              </div>

              {/* CONSIGNMENT DOCUMENTS */}
              <div className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-green-900 flex items-center gap-2">
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
                    {getConsignmentDocuments().slice(0, 2).map((file, index) => {
                      const isPdf = file.document?.toLowerCase().endsWith('.pdf');
                      return isPdf ? (
                        <a
                          key={file.id || index}
                          href={domainPrefix + file.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-48 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <span className="text-4xl">📄</span>
                            <p className="text-sm text-gray-600 mt-2 font-semibold">View PDF Document</p>
                            <p className="text-xs text-gray-400 mt-1">Click to open</p>
                          </div>
                        </a>
                      ) : (
                        <a
                          key={file.id || index}
                          href={domainPrefix + file.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-48 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                          <img
                            src={domainPrefix + file.document}
                            alt={`Consignment ${index + 1}`}
                            className="w-full h-full object-contain p-4"
                          />
                        </a>
                      );
                    })}
                    {getConsignmentDocuments().length > 2 && (
                      <div className="text-center p-4 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-colors">
                        <p className="text-green-600 font-semibold">
                          +{getConsignmentDocuments().length - 2} more file(s)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-gray-600 font-semibold text-center">Not Applicable</p>
                    <p className="text-sm text-gray-500 mt-1">No files uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* ✅ FIXED: Show goods inward section properly */}
        {details.goods_inwards && (
          <Section title="Goods Inward Details">
            <div className="grid md:grid-cols-3 px-4 gap-5">
              {/* ✅ FIXED: Check goods_in_out field from API */}
              {details.goods_in_out?.no_of_goods && (
                <Info
                  label="No. of Goods"
                  value={details.goods_in_out.no_of_goods}
                />
              )}
              {details.goods_in_out?.description && (
                <Info
                  label="Description"
                  value={details.goods_in_out.description}
                />
              )}
              {details.goods_in_out?.vehicle_no && (
                <Info
                  label="Vehicle Number"
                  value={details.goods_in_out.vehicle_no}
                />
              )}
              {details.goods_in_out?.person_name && (
                <Info
                  label="Person Name"
                  value={details.goods_in_out.person_name}
                />
              )}
              {details.goods_in_out?.ward_type && (
                <Info
                  label="Ward Type"
                  value={details.goods_in_out.ward_type}
                />
              )}
            </div>
          </Section>
        )}

        {/* ✅ FIXED: Filter empty extra visitors */}
        <Section title="Additional Visitors">
          {details.extra_visitors?.length > 0 && 
           details.extra_visitors.some(v => v.name || v.contact_no) ? (
            <Table 
              columns={visitorExtraColumns} 
              data={details.extra_visitors.filter(v => v.name || v.contact_no)} 
            />
          ) : (
            <p className="px-2 text-gray-500">No Additional Visitor Added</p>
          )}
        </Section>

        <Section title="Visitor Log">
          {paginatedVisitorLogs.length > 0 ? (
            <Table columns={visitorLogColumn} data={paginatedVisitorLogs} />
          ) : (
            <p className="px-2 text-gray-500">No visit logs available</p>
          )}
        </Section>

        {/* ✅ FIXED: Show device logs if available */}
        {deviceLogs.length > 0 && (
          <Section title="Device Logs">
            <Table columns={visitorDeviceLogColumn} data={paginatedDeviceLogs} />
            {deviceLogs.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center gap-2 mt-4"> 
              </div>
            )}
          </Section>
        )}
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
    <p className="text-gray-700">{value || "-"}</p>
  </div>
);

const BooleanInfo = ({ label, value }) => (
  <div className="grid grid-cols-2">
    <p className="font-semibold text-sm">{label} :</p>
    <p className="font-medium">
      {value ? (
        <span className="text-black-600"> Yes</span>
      ) : (
        <span className="text-gray-400"> No</span>
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