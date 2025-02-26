import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsPass } from "react-icons/bs";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { getinbound, editOutbound, getOutboundDetail } from "../../../api";

const InBoundDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [outboundRecords, setOutboundRecords] = useState(null); // For fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch inbound details
  const fetchOutboundDetails = async () => {
    try {
      // Fetch specific inbound record based on the `id`
      const res = await getOutboundDetail(id); // Use the API for single record fetch
      const item = res.data;
      const transformedData = {
        id: item.id,
        vendorId: item.vendor_id,
        vendor_name: item.vendor_name,
        recipientName: item.recipient_name,
        recipient_email: item.recipient_email_id,
        unit: item.unit,
        department: item.department,
        sender: item.sender,
        sender_id: item.sender_id,
        mobile_number: item.mobile_number,
        company: item.company,
        receiving_date: new Date(item.receiving_date).toLocaleDateString(),
        collect_on: item.collect_on
          ? new Date(item.collect_on).toLocaleDateString()
          : "N/A",
        awb_number: item.awb_number,
        company_address1: item.company_address_1,
        company_address2: item.company_address_2,
        package_type: item.mail_outbound_type,
        collect_by: item.collect_by,
        created_by: item.created_by_name
          ? `${item.created_by_name.firstname || "Unknown"} ${
              item.created_by_name.lastname || ""
            }`.trim()
          : "Unknown",
        collect_by_id: item.collect_by_id,
        entity: item.entity,
      };

      console.log("transformedData:", transformedData);
      setOutboundRecords([transformedData]); // Set the record as an array (to match existing render structure)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inbound record details:", err);
      setError("Failed to load inbound record details. Please try again.");
      setLoading(false);
    }
  };

  // Run fetch function on component mount
  useEffect(() => {
    fetchOutboundDetails();
  }, []);

  console.log(outboundRecords);
  const handleMarkedPackage = async (id, currentStatus, vendorId) => {
    try {
      if (!id || !vendorId) throw new Error("ID or Vendor ID is invalid");

      // Toggle the current status (invert it)
      const newStatus = !currentStatus === null ? true : !currentStatus; // true -> false, false -> true

      const payload = {
        mark_collected: newStatus, // Pass the updated status
        vendor_id: vendorId, // Pass vendor ID
      };

      // Send the request to the backend
      const response = await editOutbound(id, payload);
      console.log("editInbound response:", response);

      // Check if the response indicates success
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Package status updated successfully");

        // Option 1: Update local state to reflect the change immediately
        setOutboundRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id ? { ...record, mark_collected: newStatus } : record
          )
        );
      } else {
        console.error("Unexpected response data:", response);
        toast.error("Failed to update package status");
      }
    } catch (err) {
      console.error("Error updating package status:", err);
      toast.error("An error occurred while updating the package status");
    }
  };

  return (
    <section>
      <div className="m-2">
        <h2 className="text-center text-xl font-bold p-2 bg-black rounded-full text-white">
          Outbound Package Details
        </h2>
        <div className="border-2 flex flex-col my-5 p-4 gap-4 rounded-md border-gray-400">
          {loading ? (
            <p>Loading package details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : outboundRecords && outboundRecords.length > 0 ? (
            outboundRecords.map((record) => (
              <div key={record.id} className="mb-6">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <button
                      className={`flex gap-2 items-center justify-end border-2 px-4 p-1 rounded-full ${
                        record.mark_collected
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        if (!record.vendorId) {
                          console.error(
                            `Vendor ID is missing for record ID: ${record.id}`
                          );
                          toast.error("Vendor ID is missing");
                          return;
                        }
                        handleMarkedPackage(
                          record.id,
                          record.mark_collected,
                          record.vendorId
                        );
                      }}
                    >
                      <TiTick />
                      {record.mark_collected
                        ? "Unmark Collected"
                        : "Mark As Collected"}
                    </button>
                  </div>
                  {/* <p className="border-2 px-4 p-1 rounded-full text-blue-500 border-blue-500">
                    Received
                  </p> */}
                  {/* c */}
                </div>
                <h2 className="text-center font-semibold text-xl mt-4">
                  Package ID: {record.id}
                </h2>
                <div>
                  <p className="text-lg font-medium">
                    No. of Package: {record.unit}
                  </p>
                </div>
                <div className="my-10">
                  <h2 className="border-b text-center text-xl border-black m-5 font-bold">
                    Outbound Details
                  </h2>
                  <div className="md:grid flex flex-col grid-cols-4 justify-center gap-6">
                    {/* <p className="text-lg font-medium"> */}
                    {/* Vendor Name: {record.vendorName} */}
                    {/* </p> */}
                    {/* <p className="text-lg font-medium">
                      Department: {record.department}
                    </p> */}
                    <p className="text-lg font-medium">
                      Collected On: {record.collect_on}
                    </p>
                    <p
                      placeholder="XXX-XXXXXXXX"
                      className="text-lg font-medium"
                    >
                      AWB Number: {record.awb_number}
                    </p>
                    <p className="text-lg font-medium">
                      Recipient Name: {record.recipientName}
                    </p>
                    <p className="text-lg font-medium">
                      Recipient Email: {record.recipient_email}
                    </p>
                    {/* <p className="text-lg font-medium">
                      Received On: {record.created_at}
                    </p>
                    <p className="text-lg font-medium">
                      Received By: {record.receivedBy}
                    </p> */}
                  </div>
                </div>
                <div>
                  <h2 className="border-b text-center text-xl border-black m-5 font-bold">
                    Sender Details
                  </h2>
                  <div className="md:grid flex flex-col grid-cols-4 justify-center">
                    <p className="text-lg font-medium">
                      Sender ID: {record.sender_id}
                    </p>
                    <p className="text-lg font-medium">
                      Entity: {record.entity}
                    </p>
                    <p className="text-lg font-medium">
                      Package Type: {record.package_type}
                    </p>
                    <p className="text-lg font-medium">
                      Contact Info: {record.mobile_number}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No records found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default InBoundDetails;
