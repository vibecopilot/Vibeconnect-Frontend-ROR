import React, { useEffect, useState } from "react";
import axios from "axios";
import { PiPlusCircle } from "react-icons/pi";
import { getinbound, getVendors, createInbound } from "../../api/index";
import { useNavigate } from "react-router-dom";
import { stateCityModal } from "../../utils/stateCityModal";
import toast from "react-hot-toast";
import { CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const CreateInbound = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // select vendor dropdown
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await getVendors();
        setVendors(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch vendors");
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  console.log(vendors);
  const onSelect = (value) => {
    console.log(`Selected vendor ID: ${value}`);
  };
  const [formData, setFormData] = useState({
    id: " ",
    vendor_name: "",
    vendor_id: "",
    receipant_name: "",
    sender: "",
    sender_id: "",
    mobile_number: "",
    awb_number: "",
    company: "",
    recipient_address_1: "",
    recipient_address_2: "",
    state: "",
    city: "",
    pincode: "",
    mail_inbound_type: "",
    receiving_date: "",
    unit: "",
    entity: "",
    status: "",
    department_id: "",
    collect_on: "",
    created_by_id: "",
    collect_by: "",
    mark_as_collected: "",
  });

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

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Submitting form with vendor_id:",
      formData.vendor_id
    );
    try {
      const response = await createInbound(formData); // Pass formData.vendor_id to API
      console.log("API Response:", response);
      toast.success("Inbound Package created successfully");
      navigate("/mail-room/");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleBack = async (event) => {
    navigate("/mail-room/");
  };

  return (
    <section>
      <div className="m-2">
        <h2 className="text-center text-xl font-bold p-2 bg-black rounded-full text-white">
          Create New Inbound Package
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-around my-10 mx-20 p-4 rounded-md border-2">
            <div className="flex gap-2 items-center">
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
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="" className="font-semibold text-lg">
                Receiving Date:
              </label>
              <input
                type="date"
                name="receiving_date"
                value={formData.receiving_date}
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
                <label
                  htmlFor="recipientSelect"
                  className="font-semibold text-lg"
                >
                  Select Recipient:
                </label>
                <input
                  id="receipant_name"
                  name="receipant_name"
                  value={formData.receipant_name}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                ></input>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-lg">Sender:</label>
                <input
                  type="text"
                  name="sender" // Ensure name matches formData key
                  value={formData.sender}
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
                <label className="font-semibold text-lg">AWB Number:</label>
                <input
                  type="char"
                  name="awb_number" // Ensure name matches formData key
                  value={formData.awb_number}
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
                <label className="font-semibold text-lg">Address Line 1:</label>
                <input
                  type="text"
                  name="company_address_1" // Ensure name matches formData key
                  value={formData.company_address_1}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-lg">Address Line 2:</label>
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
                <label className="font-semibold text-lg">Pin Code:</label>
                <input
                  type="number"
                  name="pincode" // Ensure name matches formData key
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-lg">Unit:</label>
                <input
                  type="text"
                  name="unit" // Ensure name matches formData key
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-lg">Department ID:</label>
                <input
                  type="number"
                  name="department_id" // Ensure name matches formData key
                  value={formData.department_id}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-lg">CollectedOn:</label>
                <input
                  type="date"
                  name="collect_on" // Ensure name matches formData key
                  value={formData.collect_on}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-lg">Entity:</label>
                <input
                  type="text"
                  name="entity" // Ensure name matches formData key
                  value={formData.entity}
                  onChange={handleInputChange}
                  className="border p-1 px-4 rounded-md border-gray-400"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-lg">Package Type:</label>
                <input
                  id="typeSelect"
                  name="mail_inbound_type" // Matches the key in formData
                  value={formData.mail_inbound_type}
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
              type="submit "
              className="bg-black text-white p-2 rounded-md hover:bg-white hover:text-black hover:border-2 border-black font-semibold"
            >
              Create Package
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateInbound;
