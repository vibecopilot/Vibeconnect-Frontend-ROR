import React, { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { getVendors, createOutbound } from "../../api"; // Ensure `createInbound` is imported
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Ensure `useNavigate` is imported
import { stateCityModal } from "../../utils/stateCityModal";

const CreateOutbound = () => {
  const navigate = useNavigate();
  const [modal, showModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  // const [outboundRecord, setOutboundRecord] = useState("");
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added `loading` state for better UI handling

  const [formData, setFormData] = useState({
    id: "",
    vendor_name: "",
    recipient_name: "",
    recipient_email_id: "",
    receipant_address_1: "",
    receipant_address_2: "",
    sender_id: "",
    awb_number: "",
    mobile_number: "",
    sending_date: "", // Added to `formData`
    receiving_date: "",
    state: "",
    city: "",
    pincode: "",
    entity: "",
    unit: "",
    department: "",
    collect_on: "",
    mark_as_collected: "",
    collect_by_id: "",
    created_by_id: "",
    mail_outbound_type: "",
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await getVendors();
        setVendors(res.data);
      } catch (err) {
        setError("Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const onSelect = (value) => {
    setFormData((prevData) => ({ ...prevData, vendor_id: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);

    if (name === "vendor_name") {
      const selectedVendor = vendors.find(
        (vendor) => vendor.vendor_name === value
      );
      setFormData((prevData) => ({
        ...prevData,
        vendor_name: value,
        id: selectedVendor ? selectedVendor.id : "", // Set vendor ID if found
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === "state" ? { city: "" } : {}),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with vendor_id:", formData.vendor_id);
    try {
      const response = await createOutbound(formData); // Pass formData.vendor_id to API
      console.log("API Response:", response);
      toast.success("Outbound Package created successfully");
      navigate("/mail-room/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleBack = () => {
    navigate("/mail-room/");
  };

  return (
    <section>
      <div className="m-2">
        <h2 className="text-center text-xl font-bold p-2 bg-black rounded-full text-white">
          Create New Outbound Package
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading ? (
          <p className="text-center">Loading vendors...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex justify-around my-10 mx-20 p-4 rounded-md border-2">
              <div className="flex gap-2 items-center ">
                <label htmlFor="vendorSelect" className="font-semibold text-lg">
                  Select Vendor:
                </label>
                <select
                  id="vendorSelect"
                  name="vendor_id"
                  onChange={(e) => {
                    const selectedVendor = vendors.find(
                      (vendor) => vendor.vendor_name === e.target.value
                    );
                    setFormData((prevData) => ({
                      ...prevData,
                      vendor_id: selectedVendor ? selectedVendor.id : "", // Store vendor_id
                    }));
                  }}
                  value={
                    formData.vendor_id
                      ? vendors.find(
                          (vendor) => vendor.id === formData.vendor_id
                        )?.vendor_name || ""
                      : ""
                  } // Display vendor_name based on vendor_id
                  className="border p-1 px-4 rounded-md border-gray-400"
                >
                  <option value="" disabled>
                    Select Vendor
                  </option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.vendor_name}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
                {/* <button
                  type="button"
                  className="border-2 px-2 p-1 rounded-md font-semibold flex items-center gap-2 border-black"
                >
                  <PiPlusCircle />
                  Add vendor
                </button> */}
              </div>
              <div className="flex gap-2 items-center">
                <label htmlFor="sending_date" className="font-semibold text-lg">
                  Sending Date:
                </label>
                <input
                  type="date"
                  name="sending_date"
                  id="sending_date"
                  value={formData.sending_date}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                />
              </div>
            </div>
            <div className="my-10">
              <h2 className="border-b text-center text-xl border-black m-5 font-bold">
                Package Details
              </h2>
              <div className="grid grid-cols-4 gap-5 mx-10">
                <div className="flex flex-col">
                  <label htmlFor="sender_id" className="font-semibold text-lg">
                    Sender Id :
                  </label>
                  <input
                    id="sender_id"
                    name="sender_id"
                    value={formData.sender_id}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="receipant_name"
                    className="font-semibold text-lg"
                  >
                    Recipient Name:
                  </label>
                  <input
                    id="recipient_name"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="receipant_name"
                    className="font-semibold text-lg"
                  >
                    Recipient Email:
                  </label>
                  <input
                    id="recipient_email_id"
                    name="recipient_email_id"
                    value={formData.recipient_email_id}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="awb_number" className="font-semibold text-lg">
                    Entity:
                  </label>
                  <input
                    type="text"
                    name="entity"
                    value={formData.entity}
                    id="entity"
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="awb_number" className="font-semibold text-lg">
                    Unit:
                  </label>
                  <input
                    type="number"
                    name="unit"
                    value={formData.unit}
                    id="entity"
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-lg">Mobile:</label>
                  <input
                    type="number"
                    name="mobile_number" // Ensure name matches formData key
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="awb_number" className="font-semibold text-lg">
                    AWB Number:
                  </label>
                  <input
                    type="text"
                    name="awb_number"
                    value={formData.awb_number}
                    id="awb_number"
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-lg">Company:</label>
                  <input
                    type="text"
                    name="company" // Ensure name matches formData key
                    value={formData.company}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-lg">
                    Address Line 1:
                  </label>
                  <input
                    type="text"
                    name="company_address_1" // Ensure name matches formData key
                    value={formData.company_address_1}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-lg">
                    Address Line 2:
                  </label>
                  <input
                    type="text"
                    name="company_address_2" // Ensure name matches formData key
                    value={formData.company_address_2}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-lg">State:</label>
                  <select
                    type="text"
                    name="state" // Ensure name matches formData key
                    value={formData.state}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  >
                    <option value="">Select State</option>
                    {Object.keys(stateCityModal).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-lg">City:</label>
                  <select
                    type="text"
                    name="city" // Ensure name matches formData key
                    value={formData.city}
                    disabled={!formData.state}
                    onChange={handleInputChange}
                    className="border p-1 px-4 rounded-md border-gray-400"
                  >
                    <option value="">Select City</option>
                    {formData.state &&
                      stateCityModal[formData.state]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-lg">Package Type:</label>
                  <input
                    id="typeSelect"
                    name="mail_outbound_type" // Matches the key in formData
                    value={formData.mail_outbound_type}
                    onChange={handleInputChange} // Updates formData
                    className="border p-1 px-4 rounded-md border-gray-400"
                  ></input>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10 my-5">
              <button
                onClick={handleBack}
                className="bg-black text-white p-2 mx-5 rounded-md hover:bg-white hover:text-black hover:border-2 border-black font-semibold"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:border-2 border-black font-semibold"
              >
                Create Package
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default CreateOutbound;
