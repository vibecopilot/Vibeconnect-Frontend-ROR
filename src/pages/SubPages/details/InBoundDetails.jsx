import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsPass } from "react-icons/bs";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { getinbound, editInbound } from "../../../api";

const InBoundDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [inboundRecords, setInboundRecords] = useState(null); // For fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch inbound details
  const fetchInboundDetails = async () => {
    try {
      // Fetch specific inbound record based on the `id`
      const res = await getinbound(id); // Use the API for single record fetch
      const item = res.data;
      const transformedData = res.data.map((item) =>({
        id: item.id,
        vendorId: item.vendor_id,
        // vendor_name: item.vendor_name,
        recipientName: item.recipient_name,
        unit: item.unit,
        department: item.department_name,
        sender: item.sender,
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
      }));

      setInboundRecords(transformedData); // Set the record as an array (to match existing render structure)
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
  const handleDelegatePackage = async (id, newStatus, name) => {
    try {
      if (!id || !name) throw new Error("ID or Name is invalid");

      const payload = {
        mark_collected: newStatus,
        name: name,
      };

      const response = await editInbound(id, payload);

      console.log("Status updated successfully:", response.data);
      toast.success("Package marked as collected");

      // Update the status locally in inboundRecords
      setInboundRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === id ? { ...record, mark_collected: newStatus } : record
        )
      );

      // fetchInboundDetails();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark package as collected");
    }
  };

  return (
    <section>
      <div className="m-2">
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
                  {/* <p className="border-2 px-4 p-1 rounded-full text-blue-500 border-blue-500">
                    Received
                  </p> */}
                  <div className="flex gap-2">
                    <button
                      className={`flex gap-2 items-center justify-end border-2 px-4 p-1 rounded-full ${
                        record.mark_collected
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() =>
                        handleDelegatePackage(
                          record.id,
                          !item.mark_collected,
                          record.vendor_id
                        )
                      } // Toggle the status
                    >
                      <TiTick />
                      Mark As Collected
                    </button>
                    {/* <button className="flex gap-2 items-center border-2 border-black px-4 p-1 rounded-full hover:bg-black hover:text-white">
                      <BsPass />
                      Delegate Package
                    </button> */}
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
                      Department: {record.department_name}
                    </p>
                    <p className="text-lg font-medium">
                      Collected On: {record.collect_on}
                    </p>
                    <p className="text-lg font-medium">
                      AWB Number: {record.awb_number}
                    </p>
                    <p className="text-lg font-medium">
                      Recipient Name: {record.receipant_name}
                    </p>
                    <p className="text-lg font-medium">
                      Received On: {record.receiving_date}
                    </p>
                    <p className="text-lg font-medium">
                      Received By: {record.receivedBy}
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
