import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsPass } from "react-icons/bs";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { getInboundDetail, editInbound } from "../../../api";

const InBoundDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [inboundRecords, setInboundRecords] = useState(null); // For fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch inbound details
  const fetchInboundDetails = async () => {
    try {
      // Fetch specific inbound record based on the `id`
      const res = await getInboundDetail(id); // Use the API for single record fetch
      const item = res.data;
      const transformedData = {
        id: item.id,
        vendor_name: item.vendor_name,
        vendor_id: item.vendor_id,
        recipient: item.receipant_name,
        mobile_number: item.mobile_number,
        unit: item.unit,
        department: item.department_id,
        sender: item.sender,
        company: item.company,
        receivedOn: new Date(item.receiving_date).toLocaleDateString(),
        ageing: item.aging,
        AWB: item.awb_number,
        company_address_1: item.company_address_1,
        company_address_2: item.company_address_2,
        collectedOn: item.collect_on
          ? new Date(item.collect_on).toLocaleDateString()
          : "N/A",
        collectedBy: item.collect_by,
        status: item.status,
        created_by_id: item.created_by_id,
        created_by: item.created_by_name
          ? `${item.created_by_name.firstname || "Unknown"} ${
              item.created_by_name.lastname || ""
            }`.trim()
          : "Unknown",
        collect_by_id: item.collect_by_id,
        entity: item.entity,
        mail_inbound_type: item.mail_inbound_type,
        mark_collected: item.mark_as_collected ?? null,
      };

      setInboundRecords([transformedData]); // Set the record as an array (to match existing render structure)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inbound record details:", err);
      setError("Failed to load inbound record details. Please try again.");
      setLoading(false);
    }
  };

  // Run fetch function on component mount
  useEffect(() => {
    fetchInboundDetails();
  }, []);

  console.log(inboundRecords);
  // const handleMarkedPackage = async (id, currentStatus, vendorId) => {
  //   try {
  //     if (!id || !vendorId) throw new Error("ID or Vendor ID is invalid");

  //     // Toggle the current status (invert it)
  //     const newStatus = !currentStatus === null ? true : !currentStatus; // true -> false, false -> true

  //     const payload = {
  //       mark_collected: newStatus, // Pass the updated status
  //       vendor_id: vendorId, // Pass vendor ID
  //     };

  //     // Send the request to the backend
  //     const response = await editInbound(id, payload);

  //     // Check if the response indicates success
  //     if (response?.data?.success) {
  //       console.log("Status updated successfully:", response.data);
  //       toast.success("Package status updated successfully");

  //       // Update local state with the new status
  //       setInboundRecords((prevRecords) =>
  //         prevRecords.map((record) =>
  //           record.id === id ? { ...record, mark_collected: newStatus } : record
  //         )
  //       );
  //     } else {
  //       toast.error("Failed to update package status");
  //     }
  //   } catch (err) {
  //     console.error("Error updating package status:", err);
  //     toast.error("An error occurred while updating the package status");
  //   }
  // };

  // const handleMarkedPackage = async (id, currentStatus, vendorId) => {
  //   try {
  //     if (!id || !vendorId) throw new Error("ID or Vendor ID is invalid");

  //     // Toggle the current status (true -> false, false -> true)
  //     const newStatus = !currentStatus;

  //     const payload = {
  //       mark_collected: newStatus, // Pass the updated status
  //       vendor_id: vendorId, // Pass vendor ID
  //     };

  //     // Send the request to the backend
  //     const response = await editInbound(id, payload);

  //     // Check if the response indicates success
  //     if (response?.data?.success) {
  //       console.log("Status updated successfully:", response.data);
  //       toast.success("Package status updated successfully");

  //       // Update local state with the new status
  //       setInboundRecords((prevRecords) =>
  //         prevRecords.map((record) =>
  //           record.id === id ? { ...record, mark_collected: newStatus } : record
  //         )
  //       );
  //     } else {
  //       toast.error("Failed to update package status");
  //     }
  //   } catch (err) {
  //     console.error("Error updating package status:", err);
  //     toast.error("An error occurred while updating the package status");
  //   }
  // };

  // const handleMarkedPackage = async (id, currentStatus, vendorId) => {
  //   try {
  //     if (!id || !vendorId) throw new Error("ID or Vendor ID is invalid");

  //     // Toggle the current status (true -> false, false -> true)
  //     const newStatus = !currentStatus;

  //     // Use the key that your backend expects.
  //     const payload = {
  //       mark_as_collected: newStatus, // Updated key here
  //       vendor_id: vendorId,
  //     };

  //     // Send the request to the backend
  //     const response = await editInbound(id, payload);

  //     // Check if the response indicates success
  //     if (response?.data?.success) {
  //       console.log("Status updated successfully:", response.data);
  //       toast.success("Package status updated successfully");

  //       // Update local state with the new status
  //       setInboundRecords((prevRecords) =>
  //         prevRecords.map((record) =>
  //           record.id === id ? { ...record, mark_collected: newStatus } : record
  //         )
  //       );
  //     } else {
  //       toast.error("Failed to update package status");
  //     }
  //   } catch (err) {
  //     console.error("Error updating package status:", err);
  //     toast.error("An error occurred while updating the package status");
  //   }
  // };

  const handleMarkedPackage = async (id, currentStatus, vendorId) => {
    try {
      if (!id || !vendorId) {
        throw new Error("ID or Vendor ID is invalid");
      }

      // Toggle the current status
      const newStatus = !currentStatus === null ? true : !currentStatus;

      // Prepare payload using the key expected by the backend (mark_as_collected)
      const payload = {
        mark_as_collected: newStatus,
        vendor_id: vendorId,
      };

      // Send the request to the backend
      const response = await editInbound(id, payload);
      console.log("editInbound response:", response);

      // Check if the API responded with status 200 or 201
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Package status updated successfully");

        // Option 1: Update local state to reflect the change immediately
        setInboundRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id ? { ...record, mark_collected: newStatus } : record
          )
        );

        // Option 2 (alternative): Re-fetch the details to update the UI in real-time
        // await fetchInboundDetails();
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
      <div className="m-2 mx-12 rounded-xl">
        <h2 className="text-center text-xl font-bold p-2 bg-black rounded-full text-white">
          Inbound Package Details
        </h2>
        <div className="border-2 flex flex-col my-5 p-4 gap-4 rounded-md border-gray-400">
          {loading ? (
            <p>Loading package details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : inboundRecords && inboundRecords.length > 0 ? (
            inboundRecords.map((record) => (
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
                        if (!record.vendor_id) {
                          console.error(
                            `Vendor ID is missing for record ID: ${record.id}`
                          );
                          toast.error("Vendor ID is missing");
                          return;
                        }
                        handleMarkedPackage(
                          record.id,
                          record.mark_collected,
                          record.vendor_id
                        );
                      }}
                    >
                      <TiTick />
                      {record.mark_collected
                        ? "Unmark Collected"
                        : "Mark As Collected"}
                    </button>
                  </div>
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
                    Package Details
                  </h2>
                  <div className="md:grid flex flex-col grid-cols-4 justify-center gap-6">
                    {/* <p className="text-lg font-medium"> */}
                    {/* Vendor Name: {record.vendorName} */}
                    {/* </p> */}
                    <p className="text-lg font-medium">
                      Department: {record.department}
                    </p>
                    <p className="text-lg font-medium">
                      Collected On: {record.collectedOn}
                    </p>
                    <p className="text-lg font-medium">
                      AWB Number: {record.AWB}
                    </p>
                    <p className="text-lg font-medium">
                      Recipient Name: {record.recipient}
                    </p>
                    <p className="text-lg font-medium">
                      Received On: {record.receivedOn}
                    </p>
                    <p className="text-lg font-medium">
                      Entity: {record.entity}
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="border-b text-center text-xl border-black m-5 font-bold">
                    Sender Details
                  </h2>
                  <div className="md:grid flex flex-col grid-cols-4 justify-center">
                    <p className="text-lg font-medium">
                      Sender Name: {record.sender}
                    </p>
                    <p className="text-lg font-medium">
                      Company: {record.company}
                    </p>
                    <p className="text-lg font-medium">
                      company_address1: {record.company_address_1}
                    </p>
                    <p className="text-lg font-medium">
                      company_address2: {record.company_address_2}
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
